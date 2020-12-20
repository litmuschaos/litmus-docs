---
id: container-kill
title: Container Kill Experiment Details
sidebar_label: Container Kill
original_id: container-kill
---

---

## Experiment Metadata

<table>
  <tr>
    <th> Type </th>
    <th> Description </th>
    <th> Tested K8s Platform </th>
  </tr>
  <tr>
    <td> Generic </td>
    <td> Kill one container in the application pod </td>
    <td> GKE, Packet(Kubeadm), Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `container-kill` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/container-kill)
- Cluster should have docker runtime, if the chaos_lib is `pumba`. It should have containerd runtime in cluster, if the chaos_lib is `containerd`.

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- Pumba chaoslib details
  - Kills one container in the specified application pod by sending SIGKILL termination signal to its docker socket (hence docker runtime is required)
  - Containers are killed using the `kill` command provided by [pumba](https://github.com/alexei-led/pumba)
  - Pumba is run as a daemonset on all nodes in dry-run mode to begin with the `kill` command is issued during experiment execution via `kubectl exec`
- Containerd chaoslib details
  - Kills one container in the specified application pod by `crictl-chaos` Lib.
  - Containers are killed using the `crictl stop` command.
  - containerd-chaos is run as a daemonset on all nodes in dry-run mode to begin with the `stop` command is issued during experiment execution via `kubectl exec`
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the application
- Good for testing recovery of pods having side-car containers

## Integrations

- Container kill is achieved using the `pumba` or `containerd_chaos` chaos library
- The desired pumba and containerd image can be configured in the env variable `LIB_IMAGE`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/container-kill/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: container-kill-sa
  namespace: default
  labels:
    name: container-kill-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: container-kill-sa
  namespace: default
  labels:
    name: container-kill-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "jobs",
        "daemonsets",
        "pods/exec",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: container-kill-sa
  namespace: default
  labels:
    name: container-kill-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: container-kill-sa
subjects:
  - kind: ServiceAccount
    name: container-kill-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Override the experiment tunables if desired

#### Supported Experiment Tunables

<table>
  <tr>
    <th> Variables </th>
    <th> Description  </th>
    <th> Type </th>
    <th> Notes </th>
  </tr>
  <tr>
    <td> TARGET_CONTAINER  </td>
    <td> The container to be killed inside the pod </td>
    <td> Mandatory </td>
    <td> If the TARGET_CONTAINER is not provided it will delete the first container </td>
  </tr>
  <tr>
    <td> LIB_IMAGE  </td>
    <td> The pumba/containerd image used to run the kill command </td>
    <td> Optional </td>
    <td> Defaults to `gaiaadm/pumba:0.4.8`,For containerd runtime use `gprasath/crictl:ci`. Note: pumba images >=0.6 do not work with this experiment. </td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The category of lib use to inject chaos </td>
    <td> Optional  </td>
    <td> It can be pumba or containerd </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/container-kill/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  # It can be true/false
  annotationCheck: "true"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: container-kill-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: container-kill
      spec:
        components:
          env:
            # specify the name of the container to be killed
            - name: TARGET_CONTAINER
              value: "nginx"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod restart count by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the container kill, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult nginx-chaos-container-kill -n <application-namespace>`

## Application Container Kill Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/XKyMNdVsKMo).
