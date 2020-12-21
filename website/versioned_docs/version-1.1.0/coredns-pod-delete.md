---
id: coredns-pod-delete
title: CoreDNS Pod Delete Experiment Details
sidebar_label: CoreDNS Pod Delete
original_id: coredns-pod-delete
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
    <td> CoreDNS </td>
    <td> CoreDNS pod delete experiment </td>
    <td> Kubeadm, Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `coredns-pod-delete` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos?file=charts/coredns/coredns-pod-delete/experiment.yaml)

## Entry Criteria

- CoreDNS replicas are healthy before chaos injection
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application

## Exit Criteria

- CoreDNS replicas are healthy after chaos injection
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application

## Details

- Causes graceful pod failure of an coreDNS replicas
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the service
- Service resolution will failed if coredns replicas are not present.

## Integrations

- Pod failures can be effected using one of these chaos libraries: `litmus`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

## Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/coredns/coredns-pod-delete/rbac.yaml yaml"

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: coredns-pod-delete-sa
  namespace: kube-system
  labels:
    name: coredns-pod-delete-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: coredns-pod-delete-sa
  labels:
    name: coredns-pod-delete-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      [
        "services",
        "pods",
        "jobs",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: coredns-pod-delete-sa
  labels:
    name: coredns-pod-delete-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: coredns-pod-delete-sa
subjects:
  - kind: ServiceAccount
    name: coredns-pod-delete-sa
    namespace: kube-system
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`

  - It will be default as
    ```
      appinfo:
        appns: kube-system
        applabel: 'k8s-app=kube-dns'
        appkind: deployment
    ```

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
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (sec) </td>
    <td> Optional </td>
    <td> Defaults to 15s </td>
  </tr>
  <tr>
    <td> CHAOS_INTERVAL </td>
    <td> Time interval b/w two successive pod failures (sec) </td>
    <td> Optional </td>
    <td> Defaults to 5s </td>
  </tr> 
  <tr>
    <td> CHAOS_NAMESPACE </td>
    <td> This ischaos namespace which will create all infra chaos resources in that namespace </td>
    <td> Mandatory </td>
    <td> Default to `kube-system` </td>
  </tr>
  <tr>
    <td> LIB  </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional  </td>
    <td> Defaults to `litmus`, Supported: `litmus` </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/coredns/coredns-pod-delete/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: engine-coredns
  namespace: kube-system
spec:
  appinfo:
    appns: "kube-system"
    applabel: "k8s-app=kube-dns"
    appkind: "deployment"
  # It can be true/false
  annotationCheck: "false"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  chaosServiceAccount: coredns-pod-delete-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: coredns-pod-delete
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "30"

            # set chaos interval (in sec) as desired
            - name: CHAOS_INTERVAL
              value: "10"

            - name: CHAOS_NAMESPACE
              value: "kube-system"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View coredns pod terminations & recovery by setting up a watch on the coredns pods in the application namespace

  `watch kubectl get pods -n kube-system`

### Check Chaos Experiment Result

- Check whether the application is resilient to the coredns pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `{"<ChaosEngine-Name>-<ChaosExperiment-Name>"}`.

  `kubectl describe chaosresult engine-coredns-coredns-pod-delete -n <chaos-namespace>`
