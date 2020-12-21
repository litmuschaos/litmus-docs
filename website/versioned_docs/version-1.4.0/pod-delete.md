---
id: pod-delete
title: Pod Delete Experiment Details
sidebar_label: Pod Delete
original_id: pod-delete
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
    <td> Fail the application pod </td>
    <td> GKE, Konvoy(AWS), Packet(Kubeadm), Minikube, EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`).If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `pod-delete` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.4.1?file=charts/generic/pod-delete/experiment.yaml)

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- Causes (forced/graceful) pod failure of specific/random replicas of an application resources
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the application
- The pod delete by `Powerfulseal` is only supporting single pod failure (kill_count = 1)

## Integrations

- Pod failures can be effected using one of these chaos libraries: `litmus`, `powerfulseal`
- The desired chaos library can be selected by setting one of the above options as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.
- The RBAC sample manifest is different for both LIB (litmus, powerseal). Use the respective rbac sample manifest on the basis of LIB ENV.

#### Sample Rbac Manifest for litmus LIB

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-delete/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-delete-sa
  namespace: default
  labels:
    name: pod-delete-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: pod-delete-sa
  namespace: default
  labels:
    name: pod-delete-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "deployments",
        "pods/log",
        "events",
        "jobs",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: pod-delete-sa
  namespace: default
  labels:
    name: pod-delete-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-delete-sa
subjects:
  - kind: ServiceAccount
    name: pod-delete-sa
    namespace: default
```

#### Sample Rbac Manifest for powerfulseal LIB

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-delete/powerfulseal_rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-delete-sa
  namespace: default
  labels:
    name: pod-delete-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: pod-delete-sa
  labels:
    name: pod-delete-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "deployments",
        "pods/log",
        "events",
        "jobs",
        "configmaps",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: pod-delete-sa
  labels:
    name: pod-delete-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: pod-delete-sa
subjects:
  - kind: ServiceAccount
    name: pod-delete-sa
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
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (in sec) </td>
    <td> Optional </td>
    <td> Defaults to 15s, <b>NOTE:</b> Overall run duration of the experiment may exceed the TOTAL_CHAOS_DURATION by a few min </td>
  </tr>
  <tr>
    <td> CHAOS_INTERVAL </td>
    <td> Time interval b/w two successive pod failures (in sec) </td>
    <td> Optional </td>
    <td> Defaults to 5s </td>
  </tr>
  <tr>
    <td> LIB </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> Defaults to `litmus`. Supported: `litmus`, `powerfulseal` </td>
  </tr>
  <tr>
    <td> FORCE  </td>
    <td> Application Pod failures type </td>
    <td> Optional  </td>
    <td> Default to `true`, With `terminationGracePeriodSeconds=0`  </td>
  </tr>
  <tr>
    <td> LIB_IMAGE </td>
    <td> Image of the helper pod </td>
    <td> Optional  </td>
    <td> Default to `litmuschaos/pod-deleter:latest` </td>
  </tr>
  <tr>
    <td> KILL_COUNT </td>
    <td> No. of application pods to be deleted </td>
    <td> Optional  </td>
    <td> Default to `1`, kill_count > 1 is only supported by litmus lib , not by the powerfulseal </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-delete/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  # It can be true/false
  annotationCheck: "true"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  chaosServiceAccount: pod-delete-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "30"

            # set chaos interval (in sec) as desired
            - name: CHAOS_INTERVAL
              value: "10"

            # pod failures without '--force' & default terminationGracePeriodSeconds
            - name: FORCE
              value: "false"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-pod-delete -n <application-namespace>`

## Application Pod Failure Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/X3JvY_58V9A)
