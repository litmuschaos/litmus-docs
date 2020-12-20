---
id: pod-cpu-hog
title: Pod CPU Hog Details
sidebar_label: Pod CPU Hog
original_id: pod-cpu-hog
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
    <td> Consume CPU resources on the application container</td>
    <td> GKE, Packet(Kubeadm), Minikube, EKS, AKS  </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `pod-cpu-hog` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.7.0?file=charts/generic/pod-cpu-hog/experiment.yaml)
- Cluster must run docker container runtime

## Entry Criteria

- Application pods are healthy on the respective nodes before chaos injection

## Exit Criteria

- Application pods are healthy on the respective nodes post chaos injection

## Details

- This experiment consumes the CPU resources on the application container (upward of 80%) on specified number of cores
- It simulates conditions where app pods experience CPU spikes either due to expected/undesired processes thereby testing how the
  overall application stack behaves when this occurs.

## Integrations

- Pod CPU can be effected using the chaos library: `litmus`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-cpu-hog/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-cpu-hog-sa
  namespace: default
  labels:
    name: pod-cpu-hog-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: pod-cpu-hog-sa
  namespace: default
  labels:
    name: pod-cpu-hog-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      [
        "pods",
        "jobs",
        "events",
        "pods/log",
        "pods/exec",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: pod-cpu-hog-sa
  namespace: default
  labels:
    name: pod-cpu-hog-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-cpu-hog-sa
subjects:
  - kind: ServiceAccount
    name: pod-cpu-hog-sa
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
    <th>  Variables </th>
    <th>  Description </th>
    <th> Type  </th>
    <th> Notes </th>
  </tr>
  <tr>
    <td> TARGET_CONTAINER </td>
    <td> Name of the container subjected to CPU stress  </td>
    <td> Mandatory  </td>
    <td> </td>
  </tr>
  <tr>
    <td> CPU_CORES </td>
    <td> Number of the cpu cores subjected to CPU stress  </td>
    <td> Optional  </td>
    <td> Defaults to 1 </td>
    <td> </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds)  </td>
    <td> Optional </td>
    <td> Defaults to 60s </td>
  </tr>
    <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Defaults to 0% (corresponds to 1 replica) </td>
  </tr> 
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before and after injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name. </td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-cpu-hog/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  # It can be true/false
  annotationCheck: "true"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: pod-cpu-hog-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: pod-cpu-hog
      spec:
        components:
          env:
            # Provide name of target container
            # where chaos has to be injected
            - name: TARGET_CONTAINER
              value: "nginx"

            #number of cpu cores to be consumed
            #verify the resources the app has been launched with
            - name: CPU_CORES
              value: "1"

            - name: TOTAL_CHAOS_DURATION
              value: "60" # in seconds
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- Set up a watch on the applications interacting/dependent on the affected pods and verify whether they are running

  `watch kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application stack is resilient to CPU spikes on the app replica, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-pod-cpu-hog -n <application-namespace>`

## Pod CPU Hog Experiment Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/MBGSPmZKb2I).
