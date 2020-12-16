---
id: pod-network-corruption
title: Pod Network Corruption Experiment Details
sidebar_label: Pod Network Corruption
original_id: pod-network-corruption
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
    <td> Inject Network Packet Corruption Into Application Pod </td>
    <td> GKE, Packet(Kubeadm), EKS, Minikube > v1.6.0, AKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `pod-network-corruption` experiment resource is available in the cluster by `kubectl get chaosexperiments` command. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/generic/pod-network-corruption/experiment.yaml)
- Cluster must run docker container runtime

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- The application pod should be healthy once chaos is stopped. Service-requests should be served despite chaos.
- Injects packet corruption on the specified container by starting a traffic control (tc) process with netem rules to add egress packet corruption
- Corruption is injected via pumba library with command pumba netem corruption by passing the relevant network interface, packet-corruption-percentage, chaos duration and regex filter for container name
- Can test the application's resilience to lossy/flaky network

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/pod-network-corruption/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-network-corruption-sa
  namespace: default
  labels:
    name: pod-network-corruption-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-network-corruption-sa
  namespace: default
  labels:
    name: pod-network-corruption-sa
    app.kubernetes.io/part-of: litmus
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
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-network-corruption-sa
  namespace: default
  labels:
    name: pod-network-corruption-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-network-corruption-sa
subjects:
  - kind: ServiceAccount
    name: pod-network-corruption-sa
    namespace: default
```

**_Note:_** In case of restricted systems/setup, create a PodSecurityPolicy(psp) with the required permissions. The `chaosServiceAccount` can subscribe to work around the respective limitations. An example of a standard psp that can be used for litmus chaos experiments can be found [here](https://docs.litmuschaos.io/docs/next/litmus-psp/).

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Override the experiment tunables if desired in `experiments.spec.components.env`
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
    <td> NETWORK_INTERFACE </td>
    <td> Name of ethernet interface considered for shaping traffic  </td>
    <td> Mandatory </td>
    <td> </td>
  </tr>
  <tr>
    <td> TARGET_CONTAINER  </td>
    <td> Name of container which is subjected to network corruption </td>
    <td> Mandatory </td>
    <td> </td>
  </tr>
  <tr>
    <td> NETWORK_PACKET_CORRUPTION_PERCENTAGE  </td>
    <td> Packet corruption in percentage </td>
    <td> Optional </td>
    <td> Default (100) </td>
  </tr>
  <tr>
    <td> CONTAINER_RUNTIME  </td>
    <td> container runtime interface for the cluster</td>
    <td> Optional </td>
    <td> Defaults to docker, supported values: docker, containerd and crio for litmus and only docker for pumba LIB </td>
  </tr>
  <tr>
    <td> SOCKET_PATH </td>
    <td> Path of the containerd/crio/docker socket file </td>
    <td> Optional  </td>
    <td> Defaults to `/var/run/docker.sock` </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Default (60s) </td>
  </tr>
  <tr>
    <td> TARGET_PODS </td>
    <td> Comma separated list of application pod name subjected to pod network corruption chaos</td>
    <td> Optional </td>
    <td> If not provided, it will select target pods randomly based on provided appLabels</td>
  </tr> 
  <tr>
    <td> DESTINATION_IPS </td>
    <td> IP addresses of the services or pods, the accessibility to which, is impacted </td>
    <td> Optional </td>
    <td> if not provided, it will induce network chaos for all ips/destinations</td>
  </tr>  
  <tr>
    <td> DESTINATION_HOSTS </td>
    <td> DNS Names/FQDN names of the services, the accessibility to which, is impacted </td>
    <td> Optional </td>
    <td> if not provided, it will induce network chaos for all ips/destinations or DESTINATION_IPS if already defined</td>
  </tr>      
  <tr>
    <td> PODS_AFFECTED_PERC </td>
    <td> The Percentage of total pods to target  </td>
    <td> Optional </td>
    <td> Defaults to 0 (corresponds to 1 replica), provide numeric value only </td>
  </tr> 
 <tr>
    <td> LIB </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> Default value: litmus, supported values: pumba and litmus </td>
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
    <td> Defaults to `litmuschaos/go-runner:1.11.0` </td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/pod-network-corruption/engine.yaml yaml"

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
  monitoring: false
  appinfo:
    appns: "default"
    # FYI, To see app label, apply kubectl get pods --show-labels
    applabel: "app=nginx"
    appkind: "deployment"
  chaosServiceAccount: pod-network-corruption-sa
  experiments:
    - name: pod-network-corruption
      spec:
        components:
          env:
            #Network interface inside target container
            - name: NETWORK_INTERFACE
              value: "eth0"

            - name: TOTAL_CHAOS_DURATION
              value: "60" # in seconds

            # provide the name of container runtime
            # for litmus LIB, it supports docker, containerd, crio
            # for pumba LIB, it supports docker only
            - name: CONTAINER_RUNTIME
              value: "docker"

            # provide the socket file path
            - name: SOCKET_PATH
              value: "/var/run/docker.sock"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View impact of network packet corruption on the affected pod from the cluster nodes (alternate is to setup ping to a remote IP from inside the target pod)

  `ping <pod_ip_address>`

### Abort/Restart the Chaos Experiment

- To stop the pod-network-corruption experiment immediately, either delete the ChaosEngine resource or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"stop"}}'`

- To restart the experiment, either re-apply the ChaosEngine YAML or execute the following command:

  `kubectl patch chaosengine <chaosengine-name> -n <namespace> --type merge --patch '{"spec":{"engineState":"active"}'`

### Check Chaos Experiment Result

- Check whether the application is resilient to the Pod Network Packet Corruption, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult <ChaosEngine-Name>-<ChaosExperiment-Name> -n <application-namespace>`

## Application Pod Network Packet Corruption Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/kSiLrIaILvs).
