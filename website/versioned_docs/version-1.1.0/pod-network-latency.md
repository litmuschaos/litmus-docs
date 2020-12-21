---
id: pod-network-latency
title: Pod Network Latency Experiment Details
sidebar_label: Pod Network Latency
original_id: pod-network-latency
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
    <td> Inject Network Latency Into Application Pod </td>
    <td> GKE, Packet(Kubeadm), Minikube > v1.6.0 </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `pod-network-latency` experiment resource is available in the cluster by executing kubectl `get chaosexperiments` in the desired namespace. . If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/pod-network-latency)

<div class="danger">
    <strong>NOTE</strong>: 
        Experiment is supported only on Docker Runtime. Support for containerd/CRIO runtimes will be added in subsequent releases.
</div>

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- The application pod should be healthy once chaos is stopped. Service-requests should be served despite chaos.
- Causes flaky access to application replica by injecting network delay using pumba.
- Injects latency on the specified container by starting a traffic control (tc) process with netem rules to add egress delays
- Latency is injected via pumba library with command pumba netem delay by passing the relevant network interface, latency, chaos duration and regex filter for container name
- Can test the application's resilience to lossy/flaky network

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-network-latency/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-network-latency-sa
  namespace: default
  labels:
    name: pod-network-latency-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: pod-network-latency-sa
  namespace: default
  labels:
    name: pod-network-latency-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      ["pods", "jobs", "chaosengines", "chaosexperiments", "chaosresults"]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: pod-network-latency-sa
  namespace: default
  labels:
    name: pod-network-latency-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-network-latency-sa
subjects:
  - kind: ServiceAccount
    name: pod-network-latency-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
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
    <td> NETWORK_INTERFACE </td>
    <td> Name of ethernet interface considered for shaping traffic  </td>
    <td> Mandatory </td>
    <td> </td>
  </tr>
  <tr>
    <td> TARGET_CONTAINER  </td>
    <td> Name of container which is subjected to network latency </td>
    <td> Mandatory </td>
    <td> </td>
  </tr>
  <tr>
    <td> NETWORK_LATENCY </td>
    <td> The latency/delay in milliseconds </td>
    <td> Optional </td>
    <td> Default (60000ms) </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Default (60000ms) </td>
  </tr>
  <tr>
    <td> LIB </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> only `pumba` supported currently </td>
  </tr>
  <tr>
    <td> LIB_IMAGE  </td>
    <td> The pumba image used to run the kill command </td>
    <td> Optional  </td>
    <td> Defaults to `gaiaadm/pumba:0.6.5` </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-network-latency/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-network-chaos
  namespace: default
spec:
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  # It can be true/false
  annotationCheck: "true"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  monitoring: false
  appinfo:
    appns: "default"
    # FYI, To see app label, apply kubectl get pods --show-labels
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: pod-network-latency-sa
  experiments:
    - name: pod-network-latency
      spec:
        components:
          env:
            #Container name where chaos has to be injected
            - name: TARGET_CONTAINER
              value: "nginx"

            #Network interface inside target container
            - name: NETWORK_INTERFACE
              value: "eth0"

            - name: LIB_IMAGE
              value: "gaiaadm/pumba:0.6.5"

            - name: NETWORK_LATENCY
              value: "60000"

            - name: TOTAL_CHAOS_DURATION
              value: "60" # in seconds
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View network latency by setting up a ping on the affected pod from the cluster nodes

  `ping <pod_ip_address>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the Pod Network Latency, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult <ChaosEngine-Name>-<ChaosExperiment-Name> -n <application-namespace>`

## Application Pod Network Latency Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/QsQZyXVCcCw).
