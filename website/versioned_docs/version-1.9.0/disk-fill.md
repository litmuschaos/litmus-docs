---
id: disk-fill
title: Disk Fill Experiment Details
sidebar_label: Disk Fill
original_id: disk-fill
---

---

## Experiment Metadata

<table>
  <tr>
    <th> Type </th>
    <th>  Description  </th>
    <th> Tested K8s Platform </th>
  </tr>
  <tr>
    <td> Chaos </td>
    <td> Fill up Ephemeral Storage of a Pod </td>
    <td> GKE, EKS, AKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that Kubernetes Version > 1.13
- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `disk-fill` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.9.0?file=charts/generic/disk-fill/experiment.yaml)
- Cluster must run docker container runtime
- Appropriate Ephemeral Storage Requests and Limits should be set for the application before running the experiment.
  An example specification is shown below:

```
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "password"
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
  - name: wp
    image: wordpress
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
```

## Entry-Criteria

- Application pods are healthy before chaos injection.

## Exit-Criteria

- Application pods are healthy post chaos injection.

## Details

- Causes Disk Stress by filling up the ephemeral storage of the pod on any given node.
- Causes the application pod to get evicted if the capacity filled exceeds the pod's ephemeral storage limit.
- Tests the Ephemeral Storage Limits, to ensure those parameters are sufficient.
- Tests the application's resiliency to disk stress/replica evictions.

## Integrations

- Disk Fill can be effected using the chaos library: `litmus`, which makes use of `dd` to create a file of
  specified capacity on the node.
- The desired chaoslib can be selected by setting the above options as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/disk-fill/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: disk-fill-sa
  namespace: default
  labels:
    name: disk-fill-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: disk-fill-sa
  labels:
    name: disk-fill-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "apps", "litmuschaos.io", "batch"]
    resources:
      [
        "pods",
        "jobs",
        "pods/exec",
        "events",
        "pods/log",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs:
      ["create", "list", "get", "patch", "update", "delete", "deletecollection"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: disk-fill-sa
  labels:
    name: disk-fill-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: disk-fill-sa
subjects:
  - kind: ServiceAccount
    name: disk-fill-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Override the experiment tunables if desired in `experiments.spec.components.env`
- To understand the values to provided in a ChaosEngine specification, refer [ChaosEngine Concepts](chaosengine-concepts.md)

#### Supported Experiment Tunables

<table>
  <tr>
    <th> Variables </th>
    <th> Description </th>
    <th> Specify In ChaosEngine </th>
    <th> Notes </th>
  </tr>
  <tr> 
    <td> FILL_PERCENTAGE </td>
    <td> Percentage to fill the Ephemeral storage limit </td>
    <td> Mandatory </td>
    <td> Can be set to more than 100 also, to force evict the pod </td>
  </tr>
  <tr> 
     <td> TARGET_CONTAINER </td>
    <td> Name of container which is subjected to disk-fill </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr> 
     <td> CONTAINER_PATH </td>
    <td> Storage Location of containers</td>
    <td> Optional </td>
    <td> Defaults to '/var/lib/docker/containers' </td>
  </tr>
  <tr> 
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (sec) </td>
    <td> Optional </td>
    <td> Defaults to 60s </td>
  </tr>
  <tr>
    <td> TARGET_POD </td>
    <td> Name of the application pod subjected to disk fill chaos</td>
    <td> Optional </td>
    <td> If not provided it will select from the appLabel provided</td>
  </tr> 
  <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Defaults to 0% (corresponds to 1 replica) </td>
  </tr> 
  <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional </td>
    <td> Defaults to `litmus` supported litmus only </td>
  </tr>
  <tr>
    <td> LIB_IMAGE  </td>
    <td> The image used to fill the disk </td>
    <td> Optional </td>
    <td> Defaults to `litmuschaos/go-runner:latest` </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> SEQUENCE </td>
    <td> It defines sequence of chaos execution for multiple target pods </td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/disk-fill/engine.yaml yaml"

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
  chaosServiceAccount: disk-fill-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: disk-fill
      spec:
        components:
          env:
            # specify the fill percentage according to the disk pressure required
            - name: FILL_PERCENTAGE
              value: "80"

            - name: TARGET_CONTAINER
              value: "nginx"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View the status of the pods as they are subjected to disk stress.

  `watch -n 1 kubectl get pods -n <application-namespace>`

- Monitor the capacity filled up on the host filesystem

  `watch -n 1 du -kh /var/lib/docker/containers/<container-id>`

### Abort/Restart the Chaos Experiment

- To stop the pod-delete experiment immediately, either delete the ChaosEngine resource or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'`

- To restart the experiment, either re-apply the ChaosEngine YAML or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}}'`

**Notes:**

- The abort will stop further fill of the local disk, but doesn't reclaim the used capacity. This is a manual operation
  as of today. The auto-rollback, i.e., in this case reclaim of currently filled disk-space will be implemented in a future
  release

- However, upon graceful completion of the experiment (i.e.,un-aborted), the space is automatically reclaimed as the chaos
  impact is reverted.

### Check Chaos Experiment Result

- Check whether the application is resilient to the container kill, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-disk-fill -n <application-namespace>`

### Disk Fill Experiment Demo

- A sample recording of this experiment execution is provided [here](https://www.youtube.com/watch?v=pbok737rUPQ).
