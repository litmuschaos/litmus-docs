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
    <td> GKE, Packet(Kubeadm), Minikube, EKS, AKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `container-kill` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/generic/container-kill/experiment.yaml)

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- litmus lib in docker runtime details
  - It can kill the container of multiple pods in parellel (can be tuned by `PODS_AFFECTED_PERC` env). It kill the container by sending SIGKILL termination signal to its docker socket (hence docker runtime is required)
  - Containers are killed using the `kill` command provided by [pumba](https://github.com/alexei-led/pumba)
  - Pumba is run as a pod on the application node. It have ability to kill the application containers multiple times. Which can be varied by `TOTAL_CHAOS_DURATION` and `CHAOS_INTERVAL`.
- litmus chaoslib in containerd and crio runtime codetails
  - It can kill the container of multiple pods in parellel (can be tuned by `PODS_AFFECTED_PERC` env).
  - Containers are killed using the `crictl stop` command.
  - container-kill is run as a pod on the application node. It have ability to kill the application containers multiple times. Which can be varied by `TOTAL_CHAOS_DURATION` and `CHAOS_INTERVAL`.
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the application
- Good for testing recovery of pods having side-car containers

## Integrations

- Container kill is achieved using the `litmus` chaos library
- The container runtime can be choose via setting `CONTAINER_RUNTIME` env. supported values: `docker`, `containerd`, `crio`
- The desired pumba and litmus image can be configured in the env variable `LIB_IMAGE`.

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
        "pods/exec",
        "pods/log",
        "events",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs:
      ["create", "list", "get", "patch", "update", "delete", "deletecollection"]
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
- Override the experiment tunables if desired in `experiments.spec.components.env`
- To understand the values to provided in a ChaosEngine specification, refer [ChaosEngine Concepts](chaosengine-concepts.md)

#### Supported Experiment Tunables

<table>
  <tr>
    <th> Variables </th>
    <th> Description  </th>
    <th> Specify In ChaosEngine </th>
    <th> Notes </th>
  </tr>
  <tr>
    <td> TARGET_CONTAINER  </td>
    <td> The container to be killed inside the pod </td>
    <td> Mandatory </td>
    <td> If the TARGET_CONTAINER is not provided it will delete the first container </td>
  </tr>
  <tr>
    <td> CHAOS_INTERVAL  </td>
    <td> Time interval b/w two successive container kill (in sec) </td>
    <td> Optional </td>
    <td> If the CHAOS_INTERVAL is not provided it will take the default value of 10s </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION  </td>
    <td> The time duration for chaos injection (seconds) </td>
    <td> Optional </td>
    <td> Defaults to 20s </td>
  </tr>
    <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Defaults to 0% (corresponds to 1 replica) </td>
  </tr>
    <tr>
    <td> TARGET_POD </td>
    <td> Name of the application pod subjected to container kill chaos</td>
    <td> Optional </td>
    <td> If not provided it will select from the app label provided</td>
  </tr>  
  <tr>
    <td> LIB_IMAGE  </td>
    <td> LIB Image used to kill the container </td>
    <td> Optional </td>
    <td> Defaults to `litmuschaos/go-runner:latest`</td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The category of lib use to inject chaos </td>
    <td> Optional  </td>
    <td> Default value: litmus, only litmus supported </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> SOCKET_PATH </td>
    <td> Path of the containerd/crio socket file </td>
    <td> Optional  </td>
    <td> Defaults to `/run/containerd/containerd.sock` </td>
  </tr>
  <tr>
    <td> CONTAINER_RUNTIME  </td>
    <td> container runtime interface for the cluster</td>
    <td> Optional </td>
    <td>  Defaults to docker, supported values: docker, containerd, crio </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
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

            # provide the chaos interval
            - name: CHAOS_INTERVAL
              value: "10"

            # provide the total chaos duration
            - name: TOTAL_CHAOS_DURATION
              value: "20"

            # provide the name of container runtime
            # it supports docker, containerd, crio
            # default to docker
            - name: CONTAINER_RUNTIME
              value: "docker"

            # provide the socket file path
            # applicable only for containerd runtime
            - name: SOCKET_PATH
              value: "/run/containerd/containerd.sock"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View pod restart count by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Abort/Restart the Chaos Experiment

- To stop the pod-delete experiment immediately, either delete the ChaosEngine resource or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'`

- To restart the experiment, either re-apply the ChaosEngine YAML or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}}'`

### Check Chaos Experiment Result

- Check whether the application is resilient to the container kill, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-container-kill -n <application-namespace>`

## Application Container Kill Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/XKyMNdVsKMo).
