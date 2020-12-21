---
id: openebs-pool-container-failure
title: OpenEBS Pool Container Failure Experiment Details
sidebar_label: Pool Container Failure
original_id: openebs-pool-container-failure
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
    <td> Kill the cstor pool pod container and check if gets created again </td>
    <td> GKE, EKS, Konvoy(AWS), Packet(Kubeadm), Minikube, OpenShift(Baremetal) </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

<b>Note:</b> In this example, we are using nginx as stateful application that stores static pages on a Kubernetes volume.

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `openebs-pool-container-failure` experiment resource is available in the cluster. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.4.1?file=charts/openebs/openebs-pool-container-failure/experiment.yaml)
- The DATA_PERSISTENCE can be enabled by provide the application's info in a configmap volume so that the experiment can perform necessary checks. Currently, LitmusChaos supports data consistency checks only for MySQL and Busybox.

  - For MYSQL data persistence check create a configmap as shown below in the application namespace (replace with actual credentials):

  ```
  ---
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: openebs-pool-container-failure
  data:
    parameters.yml: |
      dbuser: root
      dbpassword: k8sDem0
      dbname: test
  ```

  - For Busybox data persistence check create a configmap as shown below in the application namespace (replace with actual credentials):

  ```
  ---
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: openebs-pool-container-failure
  data:
    parameters.yml: |
      blocksize: 4k
      blockcount: 1024
      testfile: exampleFile
  ```

- Ensure that the chaosServiceAccount used for the experiment has cluster-scope permissions as the experiment may involve carrying out the chaos in the `openebs` namespace while performing application health checks in its respective namespace.

- Ensure that you have adequate amount of `CPU` and `Memory` resources available in your cluster to run the experiment.

## Entry Criteria

- Application pods are healthy before chaos injection
- Application writes are successful on OpenEBS PVs

## Exit Criteria

- Stateful application pods are healthy post chaos injection
- OpenEBS Storage target pods are healthy

If the experiment tunable DATA_PERSISTENCE is set to 'enabled':

- Application data written prior to chaos is successfully retrieved/read
- Database consistency is maintained as per db integrity check utils

## Details

- This scenario validates the behaviour of stateful applications and OpenEBS data plane upon forced termination of the targeted pool pod container
- Containers are killed using the kill command provided by pumba
- Pumba is run as a daemonset on all nodes in dry-run mode to begin with; the kill command is issued during experiment execution via kubectl exec
- Can test the stateful application's resilience to momentary iSCSI connection loss

## Integrations

- Container kill is achieved using the pumba chaos library for docker runtime.
- The desired lib image can be configured in the env variable LIB_IMAGE.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to be provided in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary cluster role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-pool-container-failure/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pool-container-failure-sa
  namespace: default
  labels:
    name: pool-container-failure-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: pool-container-failure-sa
  labels:
    name: pool-container-failure-sa
rules:
  - apiGroups:
      [
        "",
        "apps",
        "litmuschaos.io",
        "batch",
        "extensions",
        "storage.k8s.io",
        "openebs.io",
      ]
    resources:
      [
        "pods",
        "jobs",
        "events",
        "pods/log",
        "replicasets",
        "pods/exec",
        "configmaps",
        "secrets",
        "persistentvolumeclaims",
        "cstorvolumereplicas",
        "chaosexperiments",
        "chaosresults",
        "chaosengines",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: pool-container-failure-sa
  labels:
    name: pool-container-failure-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: pool-container-failure-sa
subjects:
  - kind: ServiceAccount
    name: pool-container-failure-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Override the experiment tunables if desired in `experiments.spec.components.env`
- Provide the configMaps and secrets in `experiments.spec.components.configMaps/secrets`, For more info refer [Sample ChaosEngine](https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/sample_openebs_engine_with_data_persistency_enabled.yaml)
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
    <td> APP_PVC </td>
    <td> The PersistentVolumeClaim used by the stateful application </td>
    <td> Mandatory </td>
    <td> PVC must use OpenEBS cStor storage class </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> Amount of soak time for I/O post container kill </td>
    <td> Optional </td>
    <td> Defaults to 600 seconds </td>
  </tr>
  <tr>
    <td> LIB_IMAGE </td>
    <td> The chaos library image used to inject the latency </td>
    <td> Optional  </td>
    <td> Defaults to `gaiaadm/pumba:0.6.5`. Supported: `gaiaadm/pumba:0.6.5` </td>
  </tr>
  <tr>
    <td> DEPLOY_TYPE </td>
    <td> Type of Kubernetes resource used by the stateful application </td>
    <td> Optional  </td>
    <td> Defaults to `deployment`. Supported: `deployment`, `statefulset` </td>
  </tr>
  <tr>
    <td> DATA_PERSISTENCE </td>
    <td> Flag to perform data consistency checks on the application </td>
    <td> Optional  </td>
    <td> Default value is disabled (empty/unset). It supports only `mysql` and `busybox`. Ensure configmap with app details are created </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-pool-container-failure/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: pool-chaos
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
  chaosServiceAccount: pool-container-failure-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-pool-container-failure
      spec:
        components:
          env:
            - name: APP_PVC
              value: "demo-nginx-claim"

            - name: DEPLOY_TYPE
              value: "deployment"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod restart count by setting up a watch on the pods in the OpenEBS namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pool pod container failure, once the experiment (job) is completed. The ChaosResult resource naming convention
  is: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult target-chaos-openebs-pool-container-failure -n <application-namespace>`

## OpenEBS Pool Container Failure Demo [TODO]

- A sample recording of this experiment execution is provided here.
