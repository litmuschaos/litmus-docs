---
id: disk-loss
title: Disk Loss Experiment Details
sidebar_label: Disk Loss
original_id: disk-loss
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
    <td> External disk loss from the node </td>
    <td> GKE, AWS (KOPS) </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `disk-loss` experiment resource is available in the cluster by `kubectl get chaosexperiments` in the desired namespace. If not, install from <a href="https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/generic/disk-loss/experiment.yaml" target="_blank">here</a>
- Ensure to create a Kubernetes secret having the gcloud/aws access configuration(key) in the namespace of `CHAOS_NAMESPACE`.
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

## Entry-Criteria

- The disk is healthy before chaos injection

## Exit-Criteria

- The disk is healthy post chaos injection
- If `APP_CHECK` is true, the application pod health is checked post chaos injection

## Details

- In this experiment, the external disk is detached from the node for a period equal to the `TOTAL_CHAOS_DURATION`.
- This chaos experiment is supported on GKE and AWS platforms.
- If the disk is created as part of dynamic persistent volume, it is expected to re-attach automatically. The experiment re-attaches the disk if it is not already attached.

<b>Note:</b> Especially with mounted disk. The remount of disk is a manual step that the user has to perform.

## Integrations

- Disk loss is effected using the litmus chaoslib that internally makes use of the aws/gcloud commands

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/disk-loss/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: disk-loss-sa
  namespace: default
  labels:
    name: disk-loss-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: disk-loss-sa
  labels:
    name: disk-loss-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      [
        "pods",
        "jobs",
        "secrets",
        "events",
        "pods/log",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: disk-loss-sa
  labels:
    name: disk-loss-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: disk-loss-sa
subjects:
  - kind: ServiceAccount
    name: disk-loss-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Override the experiment tunables if desired in `experiments.spec.components.env`
- To understand the values to provided in a ChaosEngine specification, refer [ChaosEngine Concepts](chaosengine-concepts.md)

### Supported Experiment Tunables for application

<table>
  <tr>
    <th> Parameter </th>
    <th> Description  </th>
    <th> Specify In ChaosEngine </th>
    <th> Notes </th>
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
    <td> Disk Name of the node, it must be an external disk. </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> DEVICE_NAME </td>
    <td> Enter the device name which you wanted to mount only for AWS. </td>
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
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (sec) </td>
    <td> Optional </td>
    <td> Defaults to 15s </td>
  </tr>
  <tr>
    <td> APP_CHECK </td>
    <td> If it checks to true, the experiment will check the status of the application. </td>
    <td> Optional </td>
    <td>  </td>
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
    <td> Optional </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

## Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/disk-loss/engine.yaml yaml"

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
  chaosServiceAccount: disk-loss-sa
  monitoring: false
  # It can be retain/delete
  jobCleanUpPolicy: "delete"
  experiments:
    - name: disk-loss
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "60"

            # set cloud platform name
            - name: CLOUD_PLATFORM
              value: "GKE"

            # set app_check to check application state
            - name: APP_CHECK
              value: "true"

            # GCP project ID
            - name: PROJECT_ID
              value: "litmus-demo-123"

            # Node name of the cluster
            - name: NODE_NAME
              value: "demo-node-123"

            # Disk Name of the node, it must be an external disk.
            - name: DISK_NAME
              value: "demo-disk-123"

            # Enter the device name which you wanted to mount only for AWS.
            - name: DEVICE_NAME
              value: "/dev/sdb"

            # Name of Zone in which node is present (GCP)
            # Use Region Name when running with AWS (ex: us-central1)
            - name: ZONE_NAME
              value: "us-central1-a"
```

## Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

`kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

## Watch Chaos progress

- Setting up a watch of the app which is using the disk in the Kubernetes Cluster

`watch -n 1 kubectl get pods`

## Check Chaos Experiment Result

- Check whether the application is resilient to the disk loss, once the experiment (job) is completed. The ChaosResult resource name is derived like this: &lt;ChaosEngine-Name&gt;-&lt;ChaosExperiment-Name&gt;.

`kubectl describe chaosresult nginx-chaos-disk-loss -n <CHAOS_NAMESPACE>`

## Disk Loss Experiment Demo [TODO]

- A sample recording of this experiment execution is provided here.
