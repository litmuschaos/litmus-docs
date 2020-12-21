---
id: cassandra-pod-delete
title: Cassandra Pod Delete Experiment Details
sidebar_label: Cassandra Pod Delete
original_id: cassandra-pod-delete
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
    <td> Cassandra </td>
    <td> Fail the Cassandra statefulset pod</td>
    <td> GKE, Konvoy(AWS), Packet(Kubeadm), Minikube, EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`).If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `cassandra-pod-delete` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/cassandra/cassandra-pod-delete/experiment.yaml)

## Entry Criteria

- Cassandra pods are healthy before chaos injection

- The load should be distributed on the each replicas.

## Exit Criteria

- Cassandra pods are healthy post chaos injection

- The load should be distributed on the each replicas.

## Details

- Causes (forced/graceful) pod failure of specific/random replicas of an cassandra statefulset
- Tests cassandra sanity (replica availability & uninterrupted service) and recovery workflow of the cassandra statefulset.

## Integrations

- Pod failures can be effected by setting `LIB` env as `litmus`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/cassandra/cassandra-pod-delete/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cassandra-pod-delete-sa
  namespace: default
  labels:
    name: cassandra-pod-delete-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: cassandra-pod-delete-sa
  namespace: default
  labels:
    name: cassandra-pod-delete-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "deployments",
        "statefulsets",
        "services",
        "pods/log",
        "pods/exec",
        "events",
        "jobs",
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
  name: cassandra-pod-delete-sa
  namespace: default
  labels:
    name: cassandra-pod-delete-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: cassandra-pod-delete-sa
subjects:
  - kind: ServiceAccount
    name: cassandra-pod-delete-sa
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
    <td> CASSANDRA_SVC_NAME </td>
    <td> Cassandra Service Name </td>
    <td> Mandatory </td>
    <td> Defaults value: cassandra </td>
  </tr>
  <tr>
    <td> KEYSPACE_REPLICATION_FACTOR </td>
    <td> Value of the Replication factor for the cassandra liveness deploy</td>
    <td> Mandatory </td>
    <td> It needs to create keyspace while checking the livenss of cassandra</td>
  </tr>
  <tr>
    <td> CASSANDRA_PORT </td>
    <td> Port of the cassandra statefulset </td>
    <td> Mandatory </td>
    <td> Defaults value: 9042 </td>
  </tr>
  <tr>
    <td> CASSANDRA_LIVENESS_CHECK </td>
    <td> It allows to check the liveness of the cassandra statefulset </td>
    <td> Optional </td>
    <td> It can be`enabled` or `disabled` </td>
  </tr>
  <tr>
    <td> CASSANDRA_LIVENESS_IMAGE </td>
    <td> Image of the cassandra liveness deployment </td>
    <td> Optional </td>
    <td> Default value: litmuschaos/cassandra-client:latest </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Defaults to 15s </td>
  </tr>
  <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Defaults to 0% (corresponds to 1 replica) </td>
  </tr> 
  <tr>
    <td> CHAOS_INTERVAL </td>
    <td> Time interval b/w two successive pod failures (sec) </td>
    <td> Optional </td>
    <td> Defaults to 5s </td>
  </tr>
  <tr>
    <td> LIB </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> Defaults to <code>litmus</code>. Supported <code>litmus</code> only </td>
  </tr>
  <tr>
    <td> FORCE  </td>
    <td> Application Pod deletion mode. `False` indicates graceful deletion with default termination period of 30s. 'True' indicates an immediate forceful deletion with 0s grace period </td>
    <td> Optional  </td>
    <td> Default to `true`, With `terminationGracePeriodSeconds=0`  </td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/cassandra/cassandra-pod-delete/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: cassandra-chaos
  namespace: default
spec:
  appinfo:
    appns: "default"
    applabel: "app=cassandra"
    appkind: "statefulset"
  # It can be true/false
  annotationCheck: "true"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  chaosServiceAccount: cassandra-pod-delete-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: cassandra-pod-delete
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "15"

            # set chaos interval (in sec) as desired
            - name: CHAOS_INTERVAL
              value: "15"

            # pod failures without '--force' & default terminationGracePeriodSeconds
            - name: FORCE
              value: "false"

            # provide cassandra service name
            # default service: cassandra
            - name: CASSANDRA_SVC_NAME
              value: "cassandra"

            # provide the keyspace replication factor
            - name: KEYSPACE_REPLICATION_FACTOR
              value: "3"

            # provide cassandra port
            # default port: 9042
            - name: CASSANDRA_PORT
              value: "9042"

            # SET THE CASSANDRA_LIVENESS_CHECK
            # IT CAN BE `enabled` OR `disabled`
            - name: CASSANDRA_LIVENESS_CHECK
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Abort/Restart the Chaos Experiment

- To stop the pod-delete experiment immediately, either delete the ChaosEngine resource or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'`

- To restart the experiment, either re-apply the ChaosEngine YAML or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}}'`

### Check Chaos Experiment Result

- Check whether the cassandra statefulset is resilient to the pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult cassandra-chaos-cassandra-pod-delete -n <cassandra-namespace>`

## Cassandra Pod Failure Demo

- It will be added soon.
