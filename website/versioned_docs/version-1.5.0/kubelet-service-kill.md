---
id: kubelet-service-kill
title: Kubelet Service Kill Experiment Details
sidebar_label: Kubelet Service Kill
original_id: kubelet-service-kill
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
    <td> Kills the kubelet service on the application node to check the resiliency. </td>
    <td> GKE, EKS, Packet(Kubeadm), Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `kubelet-service-kill` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.5.0?file=charts/generic/kubelet-service-kill/experiment.yaml)

## Entry Criteria

- Application pods should be healthy before chaos injection.

## Exit Criteria

- Application pods and the node should be healthy post chaos injection.

## Details

- This experiment Causes the application to become unreachable on account of node turning unschedulable (NotReady) due to kubelet service kill.
- The kubelet service has been stopped/killed on a node to make it unschedulable for a certain duration i.e `TOTAL_CHAOS_DURATION`. The application node should be healthy after the chaos injection and the services should be reaccessable.
- The application implies services. Can be reframed as:
  Test application resiliency upon replica getting unreachable caused due to kubelet service down.

## Integrations

- Kubelet Service Kill can be effected using the chaos library: `litmus`
- The desired chaos library can be selected by setting `litmus` as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/kubelet-service-kill/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kubelet-service-kill
  namespace: default
  labels:
    name: kubelet-service-kill
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: kubelet-service-kill
  labels:
    name: kubelet-service-kill
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "jobs",
        "pods/log",
        "events",
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
  name: kubelet-service-kill
  labels:
    name: kubelet-service-kill
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubelet-service-kill
subjects:
  - kind: ServiceAccount
    name: kubelet-service-kill
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
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
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Defaults to 90 </td>
  </tr>
   <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional </td>
    <td> Defaults to `litmus` </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before & after injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/kubelet-service-kill/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  # It can be true/false
  annotationCheck: "false"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: kubelet-service-kill-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: kubelet-service-kill
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "90" # in seconds
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- Setting up a watch over the nodes getting not schedulable in the Kubernetes Cluster
  `watch kubectl nodes`

### Check Chaos Experiment Result

- Check whether the application is resilient after the kubelet service kill, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-kubelet-service-kill -n <application-namespace>`

## Kubelet Service Kill Demo [TODO]

- A sample recording of this experiment execution is provided here.
