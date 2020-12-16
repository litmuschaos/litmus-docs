---
id: node-memory-hog
title: Node Memory Hog Experiment Details
sidebar_label: Node Memory Hog
original_id: node-memory-hog
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
    <td> Exhaust Memory resources on the Kubernetes Node </td>
    <td> GKE, EKS, AKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `node-memory-hog` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/generic/node-memory-hog/experiment.yaml)
- There should be administrative access to the platform on which the Kubernetes cluster is hosted, as the recovery of the affected node could be manual. For example, gcloud access to the GKE project

## Entry Criteria

- Application pods are healthy on the respective Nodes before chaos injection

## Exit Criteria

- Application pods may or may not be healthy post chaos injection

## Details

- This experiment causes Memory resource exhaustion on the Kubernetes node. The experiment aims to verify resiliency of applications whose replicas may be evicted on account on nodes turning unschedulable (Not Ready) due to lack of Memory resources.
- The Memory chaos is injected using a job running the linux stress-ng tool (a workload generator). The chaos is effected for a period equalling the TOTAL_CHAOS_DURATION and upto MEMORY_PERCENTAGE(out of 100).
- Application implies services. Can be reframed as:
  Tests application resiliency upon replica evictions caused due to lack of Memory resources

## Integrations

- Node Memory Hog can be effected using the chaos library: `litmus`
- The desired chaos library can be selected by setting `litmus` as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/node-memory-hog/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: node-memory-hog-sa
  namespace: default
  labels:
    name: node-memory-hog-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-memory-hog-sa
  labels:
    name: node-memory-hog-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "jobs",
        "pods/log",
        "pods/exec",
        "events",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs:
      ["create", "list", "get", "patch", "update", "delete", "deletecollection"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-memory-hog-sa
  labels:
    name: node-memory-hog-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-memory-hog-sa
subjects:
  - kind: ServiceAccount
    name: node-memory-hog-sa
    namespace: default
```

**_Note:_** In case of restricted systems/setup, create a PodSecurityPolicy(psp) with the required permissions. The `chaosServiceAccount` can subscribe to work around the respective limitations. An example of a standard psp that can be used for litmus chaos experiments can be found [here](https://docs.litmuschaos.io/docs/next/litmus-psp/).

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
    <td> TARGET_NODES </td>
    <td> Comma separated list of nodes, subjected to node memory hog</td>
    <td> Mandatory  </td>
    <td> </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (in seconds) </td>
    <td> Optional </td>
    <td> Defaults to 120 </td>
  </tr>
   <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional </td>
    <td> Defaults to `litmus` </td>
  </tr>
   <tr>
    <td> LIB_IMAGE  </td>
    <td> Image used to run the stress command </td>
    <td> Optional  </td>
    <td> Defaults to <code>litmuschaos/go-runner:1.11.0</code> </td>
  </tr>
    <tr>
    <td> MEMORY_PERCENTAGE </td>
    <td> The size as percent of total available memory </td>
    <td> Optional </td>
    <td> Defaults to 90 </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before and after injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
   <tr>
    <td> NODES_AFFECTED_PERC </td>
    <td> The Percentage of total nodes to target  </td>
    <td> Optional </td>
    <td> Defaults to 0 (corresponds to 1 node), provide numeric value only </td>
  </tr> 
   <tr>
    <td> SEQUENCE </td>
    <td> It defines sequence of chaos execution for multiple target nodes </td>
    <td> Optional </td>
    <td> Default value: parallel. Supported: serial, parallel </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/node-memory-hog/engine.yaml yaml"

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
  chaosServiceAccount: node-memory-hog-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: node-memory-hog
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "120"

            ## specify the size as percent of total available memory (in percentage)
            ## default value 90
            - name: MEMORY_PERCENTAGE
              value: "90"

            # ENTER THE COMMA SEPARATED TARGET NODES NAME
            - name: TARGET_NODES
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- Setting up a watch of the Memory consumed by nodes in the Kubernetes Cluster

  `watch kubectl top nodes`

### Abort/Restart the Chaos Experiment

- To stop the pod-delete experiment immediately, either delete the ChaosEngine resource or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'`

- To restart the experiment, either re-apply the ChaosEngine YAML or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}}'`

### Check Chaos Experiment Result

- Check whether the application is resilient to the memory hog, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-node-memory-hog -n <application-namespace>`

## Node Memory Hog Experiment Demo

- A sample recording of this experiment execution is provided [here](https://www.youtube.com/watch?v=ECxlWgQ8F5w).
