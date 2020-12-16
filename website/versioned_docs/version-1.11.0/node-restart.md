---
id: node-restart
title: Node Restart Experiment Details
sidebar_label: Node Restart
original_id: node-restart
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
    <td> Generic </td>
    <td> Restart the target node </td>
    <td> Kubevirt VMs </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `node-restart` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/generic/node-restart/experiment.yaml)
- Create a Kubernetes secret having the private SSH key for `SSH_USER` used to connect to `TARGET_NODE`. The name of secret should be `id-rsa` along with private SSH key data, named `ssh-privatekey`. A sample secret example is given below:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: id-rsa
type: Opaque
stringData:
  ssh-privatekey: |-
    # Add the private key for ssh here
```

## Entry-Criteria

- Application pods should be healthy before chaos injection.
- Target Nodes should be in Ready state before chaos injection.

## Exit-Criteria

- Application pods should be healthy after chaos injection.
- Target Nodes should be in Ready state after chaos injection.

## Details

- Causes chaos to disrupt state of node by restarting it.
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflows of the application pod

## Integrations

- Node Restart can be effected using the chaos library: `litmus`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/node-restart/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: node-restart-sa
  namespace: default
  labels:
    name: node-restart-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-restart-sa
  labels:
    name: node-restart-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "jobs",
        "secrets",
        "events",
        "chaosengines",
        "pods/log",
        "pods/exec",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs:
      ["create", "list", "get", "patch", "update", "delete", "deletecollection"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-restart-sa
  labels:
    name: node-restart-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: node-restart-sa
subjects:
  - kind: ServiceAccount
    name: node-restart-sa
    namespace: default
```

**_Note:_** In case of restricted systems/setup, create a PodSecurityPolicy(psp) with the required permissions. The `chaosServiceAccount` can subscribe to work around the respective limitations. An example of a standard psp that can be used for litmus chaos experiments can be found [here](https://docs.litmuschaos.io/docs/next/litmus-psp/).

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
    <td> LIB_IMAGE  </td>
    <td> The image used to restart the node </td>
    <td> Optional </td>
    <td> Defaults to `litmuschaos/go-runner:1.11.0` </td>
  </tr>
  <tr>
    <td> SSH_USER  </td>
    <td> name of ssh user </td>
    <td> Mandatory </td>
    <td> Defaults to `root` </td>
  </tr>
  <tr>
    <td> TARGET_NODE </td>
    <td> name of target node, subjected to chaos </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> TARGET_NODE_IP </td>
    <td> ip of the target node, subjected to chaos </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> REBOOT_COMMAND  </td>
    <td> Command used for reboot </td>
    <td> Mandatory </td>
    <td> Defaults to `sudo systemctl reboot` </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (sec) </td>
    <td> Optional </td>
    <td> Defaults to 30s </td>
  </tr>
  <tr>
    <td> RAMP_TIME </td>
    <td> Period to wait before injection of chaos in sec </td>
    <td> Optional  </td>
    <td> </td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional </td>
    <td> Defaults to `litmus` supported litmus only </td>
  </tr>
  <tr>
    <td> LIB_IMAGE  </td>
    <td> The image used to restart the node </td>
    <td> Optional </td>
    <td> Defaults to `litmuschaos/go-runner:1.11.0` </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/generic/node-restart/engine.yaml yaml"

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
  chaosServiceAccount: node-restart-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: node-restart
      spec:
        components:
          nodeSelector:
            # provide the node labels
            kubernetes.io/hostname: "node02"
          env:
            # ENTER THE TARGET NODE NAME
            - name: TARGET_NODE
              value: "node01"

            # ENTER THE TARGET NODE IP
            - name: TARGET_NODE_IP
              value: ""

              # ENTER THE USER TO BE USED FOR SSH AUTH
            - name: SSH_USER
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View the status of the nodes as they are subjected to node restart.

  `watch -n 1 kubectl get nodes`

### Check Chaos Experiment Result

- Check whether the application is resilient to the node restart, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-node-restart -n <application-namespace>`

### Node Restart Experiment Demo

- A sample recording of this experiment execution will be added soon.
