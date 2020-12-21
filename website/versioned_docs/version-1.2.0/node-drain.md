---
id: node-drain
title: Node Drain Experiment Details
sidebar_label: Node Drain
original_id: node-drain
---

---

## Experiment Metadata

<table>
  <tr>
    <th> Type </th>
    <th> Description  </th>
    <th> Tested K8s Platform </th>
  </tr>
  <tr>
    <td> Generic </td>
    <td> Drain the node where application pod is scheduled. </td>
    <td> GKE, AWS, Packet(Kubeadm), Konvoy(AWS), EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `node-drain` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/node-drain)
- Ensure that the node specified in the experiment ENV variable `APP_NODE` (the node which will be drained) should be cordoned before execution of the chaos experiment (before applying the chaosengine manifest) to ensure that the litmus experiment runner pods are not scheduled on it / subjected to eviction. This can be achieved with the following steps:

  - Get node names against the applications pods: `kubectl get pods -o wide`
  - Cordon the node `kubectl cordon <nodename>`

## Entry Criteria

- Application pods are healthy on the respective Nodes before chaos injection

## Exit Criteria

- Target nodes are in Ready state post chaos injection

## Details

- This experiment drains the node where application pod is running and verifies if it is scheduled on another available node.
- In the end of experiment it uncordons the specified node so that it can be utilised in future.

## Integrations

- Drain node can be effected using the chaos library: `litmus`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/node-drain/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: node-drain-sa
  namespace: default
  labels:
    name: node-drain-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: node-drain-sa
  labels:
    name: node-drain-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "extensions"]
    resources:
      [
        "pods",
        "jobs",
        "events",
        "chaosengines",
        "pods/log",
        "daemonsets",
        "pods/eviction",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["patch", "get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: node-drain-sa
  labels:
    name: node-drain-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-drain-sa
subjects:
  - kind: ServiceAccount
    name: node-drain-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Override the experiment tunables if desired

#### Supported Experiment Tunables

<table>
  <tr>
    <th>  Variables </th>
    <th>  Description </th>
    <th> Type  </th>
    <th> Notes </th>
  </tr>
  <tr>
    <td> APP_NODE </td>
    <td> Name of the node to drain  </td>
    <td> Mandatory  </td>
    <td> </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds)  </td>
    <td> Optional </td>
    <td> Defaults to 60s </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
</table>
                      
#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/node-drain/engine.yaml yaml"

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
  chaosServiceAccount: node-drain-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: node-drain
      spec:
        components:
          env:
            # set node name
            - name: APP_NODE
              value: "node-1"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- Set up a watch on the applications originally scheduled on the affected node and verify whether they are rescheduled on the other nodes in the Kubernetes Cluster.

  `watch kubectl get pods,nodes --all-namespaces `

### Check Chaos Experiment Result

- Check whether the application is resilient to the node drain, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult nginx-chaos-node-drain -n <application-namespace>`

## Node Drain Experiment Demo [TODO]

- A sample recording of this experiment execution is provided here.
