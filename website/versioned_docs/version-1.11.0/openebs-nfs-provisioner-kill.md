---
id: openebs-nfs-provisioner-kill
title: OpenEBS NFS Provisioner Kill Chaos Experiment Details
sidebar_label: NFS Provisioner Kill
original_id: openebs-nfs-provisioner-kill
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
    <td> Kill the OpenEBS NFS provisioner container and check if pods consuming the NFS PVs continue to be available and volumes are writable (RWM mode). </td>
    <td> GKE </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)

- Ensure that the `openebs-nfs-provisioner-kill` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the `openebs` namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/openebs/openebs-nfs-provisioner-kill/experiment.yaml)

- The "DATA_PERSISTENCE" env variable takes effect only if the "EXTERNAL_APP_CHECK" is enabled. A stateful busybox deployment is used to create and validate data persistence on the RMW NFS persistent volumes.

The data persistence also needs the users to create a minimal configmap upfront (like described below) in the namespace where the experiment resources are created.

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: openebs-nfs-provisioner-kill
data:
  parameters.yml: |
    blocksize: 4k
    blockcount: 1024
    testfile: exampleFile
```

## Entry Criteria

- OpenEBS NFS provisioner pod(s) are healthy before chaos injection
- Pods using NFS PVs in RWM mode are healthy before chaos injection

## Exit Criteria

- OpenEBS NFS provisioner pod(s) are healthy after chaos injection
- Pods using NFS PVs in RWM mode are healthy after chaos injection

## Details

- This scenario verifies application behaviour upon crash/failure of OpenEBS NFS provisioner container, when the NFS provisioner is backed by OpenEBS PVs

## Integrations

- Container kill is achieved using the `pumba` or `containerd_chaos` chaos library
- The desired pumba and containerd image can be configured in the env variable `LIB_IMAGE`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to be provided in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/openebs/openebs-nfs-provisioner-kill/rbac.yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nfs-chaos-sa
  namespace: default
  labels:
    name: nfs-chaos-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: nfs-chaos-sa
  labels:
    name: nfs-chaos-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups:
      ["", "apps", "litmuschaos.io", "batch", "extensions", "storage.k8s.io"]
    resources:
      [
        "pods",
        "pods/exec",
        "pods/log",
        "deployments",
        "events",
        "jobs",
        "configmaps",
        "services",
        "persistentvolumeclaims",
        "storageclasses",
        "persistentvolumes",
        "chaosexperiments",
        "chaosresults",
        "chaosengines",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: nfs-chaos-sa
  labels:
    name: nfs-chaos-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: nfs-chaos-sa
subjects:
  - kind: ServiceAccount
    name: nfs-chaos-sa
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
    <td> TARGET_CONTAINER  </td>
    <td> The container to be killed inside the pod </td>
    <td> Mandatory </td>
    <td> If the TARGET_CONTAINER is not provided it will delete the first container specified/listed in the deployment spec </td>
  </tr>
  <tr>
    <td> LIB_IMAGE  </td>
    <td> The pumba/containerd image used to run the kill command </td>
    <td> Optional </td>
    <td> Defaults to `gaiaadm/pumba:0.6.5`, for containerd runtime use `gprasath/crictl:ci`</td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The category of lib use to inject chaos </td>
    <td> Optional  </td>
    <td> It can be pumba or containerd </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before and after injection of chaos in sec </td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/openebs/openebs-nfs-provisioner-kill/engine.yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nfs-chaos
  namespace: default
spec:
  # It can be true/false
  annotationCheck: "false"
  # It can be active/stop
  engineState: "active"
  appinfo:
    appns: "minio"
    applabel: "app=minio"
    appkind: "deployment"
  chaosServiceAccount: nfs-chaos-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-nfs-provisioner-kill
      spec:
        components:
          env:
            - name: NFS_PROVISIONER_NAMESPACE
              value: "app-nfs-ns"

            ## Period to wait before injection of chaos
            - name: RAMP_TIME
              value: "10"

            - name: NFS_PROVISIONER_LABEL
              value: "app=nfs"

            - name: NFS_PVC
              value: "nfs-pvc-claim"

            - name: NFS_SVC
              value: "nfs-provisioner"

            - name: TARGET_CONTAINER
              value: "nfs-provisioner"

            # EXTERNAL_APP_CHECK can be true/false
            - name: EXTERNAL_APP_CHECK
              value: "true"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml -n <application-namespace>`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View pod terminations by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the OpenEBS NFS pod is resilient to the container kill, once the experiment (job) is completed. The ChaosResult resource naming convention is: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nfs-chaos-openebs-nfs-provisioner-kill -n <application-namespace>`

## Recovery

- If the verdict of the ChaosResult is `Fail`, and/or the OpenEBS components do not return to healthy state post the chaos experiment, then please refer the [OpenEBS troubleshooting guide](https://docs.openebs.io/docs/next/troubleshooting.html#installation) for more info on how to recover the same.

## OpenEBS NFS KILL Chaos Demo [TODO]

- A sample recording of this experiment execution is provided here.
