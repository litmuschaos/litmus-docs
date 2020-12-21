---
id: pod-cpu-hog
title: Pod CPU Hog Details
sidebar_label: Pod CPU Hog
original_id: pod-cpu-hog
---

---

## Experiment Metadata

| Type    | Description                                        | Tested K8s Platform            |
| ------- | -------------------------------------------------- | ------------------------------ |
| Generic | Consume CPU resources on the application container | GKE, Packet(Kubeadm), Minikube |

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `pod-cpu-hog` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/pod-cpu-hog)
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

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nginx-sa
  namespace: default
  labels:
    name: nginx-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: nginx-sa
  labels:
    name: nginx-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      ["pods", "jobs", "chaosengines", "chaosexperiments", "chaosresults"]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: nginx-sa
  labels:
    name: nginx-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: nginx-sa
subjects:
  - kind: ServiceAccount
    name: nginx-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Override the experiment tunables if desired

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
<td> Name of the container subjected to CPU stress  </td>
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
<td> LIB_IMAGE </td>
<td> The image used by the litmus (only supported) lib </td>
<td> Optional </td>
<td> Defaults to `litmuschaos/app-cpu-stress:latest`  </td>
</tr>
</table>
                      
#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  # It can be app/infra
  chaosType: "app"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  appinfo:
    appns: default
    applabel: "app=nginx"
    appkind: deployment
  chaosServiceAccount: nginx-sa
  monitoring: false
  components:
    runner:
      image: "litmuschaos/chaos-executor:1.0.0"
      type: "go"
  # It can be delete/retain
  jobCleanUpPolicy: delete
  experiments:
    - name: pod-cpu-hog
      spec:
        components:
          - name: TARGET_CONTAINER
            value: "nginx"
            #number of cpu cores to be consumed
            #verify the resources the app has been launched with
          - name: CPU_CORES
            value: "1"
            # in ms
          - name: TOTAL_CHAOS_DURATION
            value: "60000"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- Set up a watch on the applications interacting/dependent on the affected pods and verify whether they are running

  `watch kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application stack is resilient to CPU spikes on the app replica, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-pod-cpu-hog -n <application-namespace>`

## Pod CPU Hog Experiment Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/MBGSPmZKb2I).
