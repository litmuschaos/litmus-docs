---
id: openebs-target-container-failure
title: OpenEBS Target Container Failure Experiment Details
sidebar_label: Target Container Failure
original_id: openebs-target-container-failure
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
    <td> Kill the cStor target/Jiva controller container </td>
    <td> GKE, EKS, Konvoy(AWS), Packet(Kubeadm), Minikube, OpenShift(Baremetal) </td>
  </tr>
</table>

<b>Note:</b> In this example, we are using nginx as stateful application that stores static pages on a Kubernetes volume.

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `openebs-target-container-failure` experiment resource is available in the cluster. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.9.0?file=charts/openebs/openebs-target-container-failure/experiment.yaml)
- The DATA_PERSISTENCE can be enabled by provide the application's info in a configmap volume so that the experiment can perform necessary checks. Currently, LitmusChaos supports data consistency checks only for MySQL and Busybox.

  - For MYSQL data persistence check create a configmap as shown below in the application namespace (replace with actual credentials):

  ```
  ---
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: openebs-target-container-failure
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
    name: openebs-target-container-failure
  data:
    parameters.yml: |
      blocksize: 4k
      blockcount: 1024
      testfile: exampleFile
  ```

- Ensure that the chaosServiceAccount used for the experiment has cluster-scope permissions as the experiment may involve carrying out the chaos in the `openebs` namespace
  while performing application health checks in its respective namespace.

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

- This scenario validates the behaviour of stateful applications and OpenEBS data plane upon forced termination of the controller container
- Kills the specified container in the controller pod by sending SIGKILL termination signal to its docker socket (hence docker runtime is required)
- Containers are killed using the `kill` command provided by [pumba](https://github.com/alexei-led/pumba)
- Pumba is run as a daemonset on all nodes in dry-run mode to begin with; the `kill` command is issued during experiment execution via `kubectl exec`
- Can test the stateful application's resilience to momentary iSCSI connection loss

## Integrations

- Container kill is achieved using the `pumba` chaos library in case of docker runtime, & `litmuslib` using `crictl` tool in case of containerd runtime.
- The desired lib image can be configured in the env variable `LIB_IMAGE`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to be provided in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-target-container-failure/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: target-container-failure-sa
  namespace: default
  labels:
    name: target-container-failure-sa
    app.kubernetes.io/part-of: litmus
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: target-container-failure-sa
  labels:
    name: target-container-failure-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps", "storage.k8s.io"]
    resources:
      [
        "pods",
        "jobs",
        "pods/log",
        "pods/exec",
        "events",
        "configmaps",
        "secrets",
        "persistentvolumeclaims",
        "storageclasses",
        "persistentvolumes",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: target-container-failure-sa
  labels:
    name: target-container-failure-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: target-container-failure-sa
subjects:
  - kind: ServiceAccount
    name: target-container-failure-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Override the experiment tunables if desired in `experiments.spec.components.env`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Provide the configMaps and secrets in `experiments.spec.components.configMaps/secrets`, For more info refer [Sample ChaosEngine](https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/sample_openebs_engine_with_data_persistency_enabled.yaml)
- To understand the values to provided in a ChaosEngine specification, refer [ChaosEngine Concepts](chaosengine-concepts.md)

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
    <td> PVC may use either OpenEBS Jiva/cStor storage class </td>
  </tr>
  <tr>
    <td> LIB_IMAGE </td>
    <td> The chaos library image used to run the kill command </td>
    <td> Optional  </td>
    <td> Defaults to `gaiaadm/pumba:0.6.5`. Supported: `{'{'}docker : gaiaadm/pumba:0.6.5, containerd: gprasath/crictl:ci{'}'}` </td>
  </tr>
  <tr>
    <td> CONTAINER_RUNTIME </td>
    <td> The container runtime used in the Kubernetes Cluster </td>
    <td> Optional  </td>
    <td> Defaults to `docker`. Supported: `docker`, `containerd` </td>
  </tr>
  <tr>
    <td> TARGET_CONTAINER </td>
    <td> The container to be killed in the storage controller pod  </td>
    <td> Optional  </td>
    <td> Defaults to `cstor-volume-mgmt` </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> Amount of soak time for I/O post container kill </td>
    <td> Optional </td>
    <td> Defaults to 60 seconds </td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/openebs/openebs-target-container-failure/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: target-chaos
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
  chaosServiceAccount: target-container-failure-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-target-container-failure
      spec:
        components:
          env:
            - name: TARGET_CONTAINER
              value: "cstor-istgt"

            - name: APP_PVC
              value: "demo-nginx-claim"

            - name: DEPLOY_TYPE
              value: "deployment"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View pod restart count by setting up a watch on the pods in the OpenEBS namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the target container kill, once the experiment (job) is completed. The ChaosResult resource naming convention
  is: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult target-chaos-openebs-target-container-failure -n <application-namespace>`

## Recovery

- If the verdict of the ChaosResult is `Fail`, and/or the OpenEBS components do not return to healthy state post the chaos experiment, then please refer the [OpenEBS troubleshooting guide](https://docs.openebs.io/docs/next/troubleshooting.html#volume-provisioning) for more info on how to recover the same.

## OpenEBS Target Container Failure Demo [TODO]

- A sample recording of this experiment execution is provided here.
