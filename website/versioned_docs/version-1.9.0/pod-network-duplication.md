---
id: pod-network-duplication
title: Pod Network Duplication Experiment Details
sidebar_label: Pod Network Duplication
original_id: pod-network-duplication
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
    <td> Inject Packet Duplication Into Application Pod </td>
    <td> GKE, Packet(Kubeadm), EKS, Minikube > v1.6.0, AKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `pod-network-duplication` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.9.0?file=charts/generic/pod-network-duplication/experiment.yaml)
  <div class="danger">
    <strong>NOTE</strong>: 
        Experiment is supported only on Docker Runtime. Support for containerd/CRIO runtimes will be added in subsequent releases.
</div>

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- pod-network-duplication injects chaos to disrupt network connectivity to kubernetes pods.
- The application pod should be healthy once chaos is stopped. Service-requests should be served despite chaos.
- Causes Injection of network duplication on the specified container by starting a traffic control (tc) process with netem rules to add egress delays. It Can test the application's resilience to duplicate network.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-network-duplication/rbac.yaml yaml"

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-network-duplication-sa
  namespace: default
  labels:
    name: pod-network-duplication-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-network-duplication-sa
  namespace: default
  labels:
    name: pod-network-duplication-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      [
        "pods",
        "jobs",
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
kind: RoleBinding
metadata:
  name: pod-network-duplication-sa
  namespace: default
  labels:
    name: pod-network-duplication-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-network-duplication-sa
subjects:
  - kind: ServiceAccount
    name: pod-network-duplication-sa
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
    <td> NETWORK_INTERFACE </td>
    <td> Name of ethernet interface considered for shaping traffic  </td>
    <td> Mandatory </td>
    <td> </td>
  </tr>
  <tr>
    <td> TARGET_CONTAINER  </td>
    <td> Name of container which is subjected to network latency </td>
    <td> Optional </td>
     <td> By default it will take the first container of the target application pod </td>
  </tr>
  <tr>
    <td> NETWORK_PACKET_DUPLICATION_PERCENTAGE </td>
    <td> The packet duplication in percentage </td>
    <td> Optional </td>
    <td> Default to 100 percentage </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Default (60s) </td>
  </tr>
  <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Defaults to 0% (corresponds to 1 replica) </td>
  </tr>
  <tr>
    <td> CONTAINER_RUNTIME  </td>
    <td> container runtime interface for the cluster</td>
    <td> Optional </td>
    <td>  Defaults to docker, supported values: docker, containerd, crio </td>
  </tr>
  <tr>
    <td> SOCKET_PATH </td>
    <td> Path of the containerd/crio socket file </td>
    <td> Optional  </td>
    <td> Defaults to `/run/containerd/containerd.sock` </td>
  </tr> 
  <tr>
    <td> TARGET_POD </td>
    <td> Name of the application pod subjected to pod network duplication chaos</td>
    <td> Optional </td>
    <td> If not provided it will select from the appLabel provided</td>
  </tr>   
  <tr> 
    <td> If not provided it will select from the app label provided</td>
  </tr> 
  <tr>
    <td> TARGET_IPs </td>
    <td> Destination ips for network chaos </td>
    <td> Optional </td>
    <td> if not provided, it will induce network chaos for all ips/destinations</td>
  </tr>  
  <tr>
    <td> TARGET_HOSTS </td>
    <td> Destination hosts for network chaos </td>
    <td> Optional </td>
    <td> if not provided, it will induce network chaos for all ips/destinations or TARGET_IPs if already defined</td>
  </tr>     
  <tr>
    <td> LIB </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> Defaults to litmus, only litmus supported </td>
  </tr>
  <tr>
    <td> TC_IMAGE </td>
    <td> Image used for traffic control in linux </td>
    <td> Optional  </td>
    <td> default value is `gaiadocker/iproute2` </td>
  </tr>
  <tr>
    <td> LIB_IMAGE  </td>
    <td> Image used to run the netem command </td>
    <td> Optional  </td>
    <td> Defaults to `litmuschaos/go-runner:latest` </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before and after injection of chaos in sec </td>
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
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/generic/pod-network-duplication/engine.yaml yaml"

```yaml
# chaosengine.yaml
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
  chaosServiceAccount: pod-network-duplication-sa
  experiments:
    - name: pod-network-duplication
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "60" # in seconds

            - name: LIB_IMAGE
              value: "litmuschaos/go-runner:latest"

            #Network interface inside target container
            - name: NETWORK_INTERFACE
              value: "eth0"

            - name: NETWORK_PACKET_DUPLICATION_PERCENTAGE
              value: "100"

            #If not provided it will take the first container of the target pod
            - name: TARGET_CONTAINER
              value: ""

            # provide the name of container runtime
            # it supports docker, containerd, crio
            # default to docker
            - name: CONTAINER_RUNTIME
              value: "docker"

            # provide the socket file path
            # applicable only for containerd and crio runtime
            - name: SOCKET_PATH
              value: "/run/containerd/containerd.sock"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View network latency by setting up a ping on the affected pod from the cluster nodes

  `ping <pod_ip_address>`

### Abort/Restart the Chaos Experiment

- To stop the pod-network-duplication experiment immediately, either delete the ChaosEngine resource or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'`

- To restart the experiment, either re-apply the ChaosEngine YAML or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}'`

### Check Chaos Experiment Result

- Check whether the application is resilient to the Pod Network Duplication, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult <ChaosEngine-Name>-<ChaosExperiment-Name> -n <application-namespace>`

## Application Pod Network Duplication Demo

- A sample recording of this experiment execution will be provided very soon.
