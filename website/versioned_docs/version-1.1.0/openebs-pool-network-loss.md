---
id: openebs-pool-network-loss
title: OpenEBS Pool Network Loss Experiment Details
sidebar_label: Pool Network Loss
original_id: openebs-pool-network-loss
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
    <td> OpenEBS </td>
    <td> Induce network loss into the cStor pool pod </td>
    <td> GKE </td>
  </tr>
</table>

<b>Note:</b> In this example, we are using nginx as stateful application that stores static pages on a Kubernetes volume.

## Prerequisites

- Ensure that the Kubernetes Cluster uses Docker runtime

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)

- Ensure that the `openebs-pool-network-loss` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the specificed namespace. If not, install from [here](https://hub.litmuschaos.io/charts/openebs/experiments/openebs-pool-network-loss)

- The DATA_PERSISTENCE can be enabled by provide the application's info in a configmap volume so that the experiment can perform necessary checks. Currently, LitmusChaos supports data consistency checks only for `MySQL` and `Busybox`.

- For MYSQL data persistence check create a configmap as shown below in the application namespace (replace with actual credentials):

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: openebs-pool-network-loss
data:
  parameters.yml: |
    dbuser: root
    dbpassword: k8sDem0
    dbname: test
```

- For Busybox data persistence check create a configmap as shown below in the application namespace (replace with actual credentials):

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: openebs-pool-network-loss
data:
  parameters.yml: |
    blocksize: 4k
    blockcount: 1024
    testfile: exampleFile
```

- Ensure that the chaosServiceAccount used for the experiment has cluster-scope permissions as the experiment may involve carrying out the chaos in the `openebs` namespace while performing application health checks in its respective namespace.

## Entry Criteria

- Application pods are healthy before chaos injection
- Application writes are successful on OpenEBS PVs

## Exit Criteria

- Application pods are healthy post chaos injection
- OpenEBS Storage pool pods are healthy

If the experiment tunable DATA_PERSISTENCE is set to 'mysql' or 'busybox':

- Application data written prior to chaos is successfully retrieved/read
- Database consistency is maintained as per db integrity check utils

## Details

- This scenario validates the behaviour of stateful applications and OpenEBS data plane upon high latencies/network loss in accessing the storage replicas pod
- Injects network loss on the specified container in the controller pod by starting a traffic control `tc` process with `netem` rules to add packet loss
- Network loss is injected via pumba library with command `pumba netem loss` by passing the relevant network interface, network loss, chaos duration and regex filter for container name
- Can test the stateful application's resilience to loss/slow iSCSI connections

## Integrations

- Network loss is achieved using the `pumba` chaos library in case of docker runtime. Support for other other runtimes via tc direct invocation of `tc` will be added soon.
- The desired lib image can be configured in the env variable `LIB_IMAGE`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app)namespace. This example consists of the minimum necessary cluster role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-pool-network-loss/rbac.yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pool-network-loss-sa
  namespace: default
  labels:
    name: pool-network-loss-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: pool-network-loss-sa
  labels:
    name: pool-network-loss-sa
rules:
  - apiGroups:
      - ""
      - "apps"
      - "litmuschaos.io"
      - "batch"
      - "extensions"
      - "storage.k8s.io"
      - "openebs.io"
    resources:
      - "pods"
      - "pods/exec"
      - "jobs"
      - "configmaps"
      - "services"
      - "persistentvolumeclaims"
      - "storageclasses"
      - "persistentvolumeclaims"
      - "persistentvolumes"
      - "chaosengines"
      - "chaosexperiments"
      - "chaosresults"
      - "cstorpools"
      - "cstorvolumereplicas"
      - "replicasets"
    verbs:
      - "create"
      - "get"
      - "delete"
      - "list"
      - "patch"
      - "update"
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: pool-network-loss-sa
  labels:
    name: pool-network-loss-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: pool-network-loss-sa
subjects:
  - kind: ServiceAccount
    name: pool-network-loss-sa
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
    <td> APP_PVC </td>
    <td> The PersistentVolumeClaim used by the stateful application </td>
    <td> Mandatory </td>
    <td> PVC may use either OpenEBS cStor storage class </td>
  </tr>
  <tr>
    <td> LIB_IMAGE </td>
    <td> chaos library image used to inject the network loss </td>
    <td> Optional  </td>
    <td> Defaults to `gaiaadm/pumba:0.6.5`. Supported: `docker : gaiaadm/pumba:0.6.5` </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> Total duration for which network loss is injected </td>
    <td> Optional </td>
    <td> Defaults to 120 seconds </td>
  </tr>
  <tr>
    <td> NETWORK_PACKET_LOSS_PERCENTAGE </td>
    <td> Total percentage for which network loss is injected </td>
    <td> Optional  </td>
    <td>  Defaults to 100 (percent) </td>
  </tr>
  <tr>
    <td> DATA_PERSISTENCE </td>
    <td> Flag to perform data consistency checks on the application </td>
    <td> Optional  </td>
    <td> Default value is disabled (empty/unset). It supports only `mysql` and `busybox`. Ensure configmap with app details are created </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-pool-network-loss/engine.yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: pool-chaos
  namespace: default
spec:
  auxiliaryAppInfo: ""
  annotationCheck: "false"
  # It can be active/stop
  engineState: "active"
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: pool-network-loss-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-pool-network-loss
      spec:
        components:
          env:
            - name: FORCE
              value: "true"

            - name: APP_PVC
              value: "demo-nginx-claim"

            - name: OPENEBS_NAMESPACE
              value: "openebs"

            - name: NETWORK_PACKET_LOSS_PERCENTAGE
              value: "100"

            - name: TOTAL_CHAOS_DURATION
              value: "120" # in seconds
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View network loss in action by setting up a ping to the storage controller in the OpenEBS namespace
- Watch the behaviour of the application pod and the OpenEBS data replica/pool pods by setting up in a watch on the respective namespaces

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pool network loss, once the experiment (job) is completed. The ChaosResult resource naming convention is: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult pool-chaos-openebs-pool-network-loss -n <application-namespace>`

## OpenEBS Pool Network Loss Demo [TODO]

- A sample recording of this experiment execution is provided here.
