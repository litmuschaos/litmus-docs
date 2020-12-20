---
id: pod-io-stress
title: Pod IO Stress Details
sidebar_label: Pod IO Stress
original_id: pod-io-stress
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
    <td> Inject IO stress on the application container</td>
    <td> GKE, Packet(Kubeadm), Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `pod-io-stress` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.8.2?file=charts/generic/pod-io-stress/experiment.yaml)
- Cluster must run docker container runtime

## Entry Criteria

- Application pods are healthy on the respective nodes before chaos injection

## Exit Criteria

- Application pods are healthy on the respective nodes post chaos injection

## Details

- This experiment causes disk stress on the application pod. The experiment aims to verify the resiliency of applications that share this disk resource for ephemeral or persistent storage purposes

## Integrations

- Pod IO Stress can be effected using the chaos library: `pumba`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the <code>chaosServiceAccount</code>, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a <code>chaosServiceAccount</code> in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-io-stress/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-io-stress-sa
  namespace: default
  labels:
    name: pod-io-stress-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: pod-io-stress-sa
  namespace: default
  labels:
    name: pod-io-stress-sa
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
    verbs:
      ["create", "list", "get", "patch", "update", "delete", "deletecollection"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: pod-io-stress-sa
  namespace: default
  labels:
    name: pod-io-stress-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-io-stress-sa
subjects:
  - kind: ServiceAccount
    name: pod-io-stress-sa
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
    <th> Type  </th>
    <th> Notes </th>
  </tr>
  <tr>
    <td> FILESYSTEM_UTILIZATION_PERCENTAGE </td>
    <td> Specify the size as percentage of free space on the file system  </td>
    <td> Optional  </td>
    <td> Default to 10%</td>
  </tr>
  <tr>
    <td> FILESYSTEM_UTILIZATION_BYTES </td>
    <td> Specify the size in GigaBytes(GB).  <code>FILESYSTEM_UTILIZATION_PERCENTAGE</code> & <code>FILESYSTEM_UTILIZATION_BYTES</code> are mutually exclusive. If both are provided, <code>FILESYSTEM_UTILIZATION_PERCENTAGE</code> is prioritized. </td>
    <td> Optional  </td>
    <td>  </td>
  </tr>
  <tr>
    <td> NUMBER_OF_WORKERS </td>
    <td> It is the number of IO workers involved in IO disk stress </td>
    <td> Optional  </td>
    <td> Default to 4 </td>
  </tr> 
  <tr>
    <td> TARGET_POD </td>
    <td> Name of the application pod subjected to IO stress chaos</td>
    <td> Optional </td>
    <td> If not provided it will select from the app label provided</td>
  </tr>   
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos (seconds)  </td>
    <td> Optional </td>
    <td> Default to 120s </td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional </td>
    <td> Default to <code>pumba</code> </td>
  </tr>
   <tr>
    <td> LIB_IMAGE  </td>
    <td> Image used to run the stress command </td>
    <td> Optional  </td>
    <td> Default to <code>gaiaadm/pumba</code> </td>
  </tr> 
  <tr>
    <td> TARGET_POD </td>
    <td> Name of the application pod subjected to pod io stress chaos</td>
    <td> Optional </td>
    <td> If not provided it will select from the app label provided</td>
  </tr>    
  <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Default to 0% (corresponds to 1 replica) </td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-io-stress/engine.yaml yaml"

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
  chaosServiceAccount: pod-io-stress-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: pod-io-stress
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "120"

            ## specify the size as percentage of free space on the file system
            - name: FILESYSTEM_UTILIZATION_PERCENTAGE
              value: "10"

            - name: TARGET_POD
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View the status of the pods as they are subjected to IO disk stress.

  `watch -n 1 kubectl get pods -n <application-namespace>`

- Monitor the capacity filled up on the host filesystem

  `watch du -h`

### Check Chaos Experiment Result

- Check whether the application stack is resilient to IO stress on the app replica, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-pod-io-stress -n <application-namespace>`

## Pod IO Stress Experiment Demo

- The Demo Video will be Added soon.
