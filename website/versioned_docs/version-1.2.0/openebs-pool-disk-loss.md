---
id: openebs-pool-disk-loss
title: OpenEBS Pool Disk Loss Experiment Details
sidebar_label: Pool Disk Loss
original_id: openebs-pool-disk-loss
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
    <td> OpenEBS Pool Disk Loss contains chaos to disrupt state of infra resources. Experiments can inject disk loss against OpenEBS pool. </td>
    <td> GKE, AWS (KOPS) </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)

- Ensure that the `openebs-pool-disk-loss` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the specificed namespace. If not, install from [here](https://hub.litmuschaos.io/charts/openebs/experiments/openebs-pool-disk-loss)

- The DATA_PERSISTENCE can be enabled by provide the application's info in a configmap volume so that the experiment can perform necessary checks. Currently, LitmusChaos supports data consistency checks only for `MySQL` and `Busybox`.

- For MYSQL data persistence check create a configmap as shown below in the application namespace (replace with actual credentials):

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: openebs-pool-disk-loss
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
  name: openebs-pool-disk-loss
data:
  parameters.yml: |
    blocksize: 4k
    blockcount: 1024
    testfile: exampleFile
```

- There should be administrative access to the platform on which the cluster is hosted, as the recovery of the affected node could be manual. Example gcloud access to the project

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloud-secret
type: Opaque
stringData:
  cloud_config.yml: |-
  # Add the cloud AWS credentials or GCP service account respectively
```

- Ensure that the chaosServiceAccount used for the experiment has cluster-scope permissions as the experiment may involve carrying out the chaos in the `openebs` namespace while performing application health checks in its respective namespace.

## Entry Criteria

- Application pods are healthy before chaos injection
- Application writes are successful on OpenEBS PVs
- The pool disk is healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection
- OpenEBS Storage pool pods are healthy
- The disk is healthy after chaos injection

If the experiment tunable DATA_PERSISTENCE is set to 'mysql' or 'busybox':

- Application data written prior to chaos is successfully retrieved/read
- Database consistency is maintained as per db integrity check utils

## Details

- This scenario validates the behaviour of stateful applications and OpenEBS disk pool upon disk loss.
- Injects disk loss on the specified OpenEBS disk pool and node pool
- Can test the stateful application's resilience to disk loss

## Integrations

- Disk loss is achieved using the `litmus` chaos library

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app)namespace. This example consists of the minimum necessary cluster role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-pool-disk-loss/rbac.yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pool-disk-loss-sa
  namespace: default
  labels:
    name: pool-disk-loss-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: pool-disk-loss-sa
  labels:
    name: pool-disk-loss-sa
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
        "pods/log",
        "jobs",
        "events",
        "pods/exec",
        "cstorpools",
        "configmaps",
        "secrets",
        "storageclasses",
        "persistentvolumes",
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
  name: pool-disk-loss-sa
  labels:
    name: pool-disk-loss-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: pool-disk-loss-sa
subjects:
  - kind: ServiceAccount
    name: pool-disk-loss-sa
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
    <td> TOTAL_CHAOS_DURATION </td>
    <td> Total duration for which disk loss is injected </td>
    <td> Optional </td>
    <td> Defaults to 60 seconds </td>
  </tr>
  <tr>
    <td> DATA_PERSISTENCE </td>
    <td> Flag to perform data consistency checks on the application </td>
    <td> Optional  </td>
    <td> Default value is disabled (empty/unset). It supports only `mysql` and `busybox`. Ensure configmap with app details are created </td>
  </tr>
  <tr>
    <td> CHAOS_NAMESPACE </td>
    <td> This is a chaos namespace in which the infra chaos resources are created </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> CLOUD_PLATFORM </td>
    <td> Cloud Platform name </td>
    <td> Mandatory </td>
    <td> Supported platforms: GKE, AWS </td>
  </tr>
  <tr>
    <td> PROJECT_ID </td>
    <td> GCP project ID, leave blank if it's AWS </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> NODE_NAME </td>
    <td> Node name of the cluster </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> DISK_NAME </td>
    <td> Name of external/cloud disk attached of the node </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> DEVICE_NAME </td>
    <td> Enter the device name which you wanted to mount. Applies only to AWS. </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> ZONE_NAME </td>
    <td> Zone Name for GCP and region name for AWS </td>
    <td> Mandatory </td>
    <td> Note: Use REGION_NAME for AWS </td>
  </tr>
  <tr>
    <td> APP_CHECK </td>
    <td> If it checks to true, the experiment will check the status of the application. </td>
    <td> Optional </td>
    <td>  </td>
  </tr>
  <tr>
    <td> APP_PVC </td>
    <td> The PersistentVolumeClaim used by the stateful application </td>
    <td> Mandatory </td>
    <td> Corresponds to the PVC using OpenEBS cStor storage class </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before and after injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> OPENEBS_NAMESPACE </td>
    <td> Namespace in which OpenEBS pods are deployed </td>
    <td> Mandatory  </td>
    <td> </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-pool-disk-loss/engine.yaml"

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
  #ex. values: ns1:name=percona,ns2:run=busybox
  auxiliaryAppInfo: ""
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: pool-disk-loss-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-pool-disk-loss
      spec:
        components:
          env:
            - name: APP_PVC
              value: "demo-nginx-claim"

            # This is a chaos namespace which will create all infra chaos resources in that namespace
            - name: CHAOS_NAMESPACE
              value: ""

            # GKE and AWS supported
            - name: CLOUD_PLATFORM
              value: "GKE"

            # Enter the time duration in sec after the disk is dettached
            - name: TOTAL_CHAOS_DURATION
              value: "60"

            # Period to wait before injection of chaos in sec
            - name: RAMP_TIME
              value: ""

            # Enter the project id for gcp only
            - name: PROJECT_ID
              value: "litmus-demo-123"

            # Enter the node name
            - name: NODE_NAME
              value: "demo-node-123"

            # Enter the disk name
            - name: DISK_NAME
              value: "demo-disk-123 "

            # Enter the device name
            - name: DEVICE_NAME
              value: "/dev/sdb"

            # Enter the zone name
            - name: ZONE_NAME
              value: "us-central1-a"

            - name: OPENEBS_NAMESPACE
              value: "openebs"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- Watch the behaviour of the application pod and the OpenEBS data replica/pool pods by setting up a watch on the respective namespaces

  `watch -n 1 kubectl get pods -n <application-namespace>`
  `watch -n 1 kubectl get pods -n <openebs-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pool disk loss, once the experiment (job) is completed. The ChaosResult resource naming convention is: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult pool-chaos-openebs-pool-disk-loss -n <application-namespace>`

## OpenEBS Pool Disk Loss Demo [TODO]

- A sample recording of this experiment execution is provided here.
