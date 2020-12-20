---
id: node-cpu-hog
title: Node CPU Hog Experiment Details
sidebar_label: Node CPU Hog
original_id: node-cpu-hog
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
    <td> Exhaust CPU resources on the Kubernetes Node </td>
    <td> GKE </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `node-cpu-hog` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/node-cpu-hog)
- There should be administrative access to the platform on which the Kubernetes cluster is hosted, as the recovery of the affected node could be manual. For example, gcloud access to the GKE project

## Entry Criteria

- Application pods are healthy on the respective Nodes before chaos injection

## Exit Criteria

- Application pods may or may not be healthy post chaos injection

## Details

- This experiment causes CPU resource exhaustion on the Kubernetes node. The experiment aims to verify resiliency of applications whose replicas may be evicted on account on nodes turning unschedulable (Not Ready) due to lack of CPU resources.
- The CPU chaos is injected using a daemonset running the linux stress tool (a workload generator). The chaos is effected for a period equalling the TOTAL_CHAOS_DURATION
- Application implies services. Can be reframed as:
  Tests application resiliency upon replica evictions caused due to lack of CPU resources

## Integrations

- CPU Hog can be effected using the chaos library: `litmus`
- The desired chaos library can be selected by setting `litmus` as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/node-cpu-hog/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: node-cpu-hog-sa
  namespace: default
  labels:
    name: node-cpu-hog-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: node-cpu-hog-sa
  labels:
    name: node-cpu-hog-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "daemonsets",
        "jobs",
        "pods/exec",
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
  name: node-cpu-hog-sa
  labels:
    name: node-cpu-hog-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-cpu-hog-sa
subjects:
  - kind: ServiceAccount
    name: node-cpu-hog-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
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
    <td> PLATFORM </td>
    <td> The platform on which the chaos experiment will run </td>
    <td> Mandatory </td>
    <td> Defaults to GKE </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Defaults to 60 </td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> Defaults to `litmus` </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/node-cpu-hog/engine.yaml yaml"

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
  chaosServiceAccount: node-cpu-hog-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: node-cpu-hog
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "60"
            # set chaos platform as desired
            - name: PLATFORM
              value: "GKE"
            # chaos lib used to inject the chaos
            - name: LIB
              value: "litmus"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- Setting up a watch of the CPU consumed by nodes in the Kubernetes Cluster

  `watch kubectl top nodes`

### Check Chaos Experiment Result

- Check whether the application is resilient to the CPU hog, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult nginx-chaos-node-cpu-hog -n <application-namespace>`

## Node Cpu Hog Demo [TODO]

- A sample recording of this experiment execution is provided here.
