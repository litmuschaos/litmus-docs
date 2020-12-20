---
id: cStor-pool-chaos
title: cStor Pool Chaos Experiment Details
sidebar_label: cStor Pool Chaos
original_id: cStor-pool-chaos
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
    <td> Fail the cStor pool pod </td>
    <td> GKE, Konvoy(AWS), Packet(Kubeadm), Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`).If not, install from [here](https://litmuschaos.github.io/litmus/litmus-operator-latest.yaml)
- Ensure that the `openebs-pool-pod-failure` experiment resource is available in the cluster by executing `kubectl get chaosexperiments -n openebs` in the openebs namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.9.0?file=charts/openebs/openebs-pool-pod-failure/experiment.yaml)

## Entry Criteria

- cStor pool pods are healthy before chaos injection

## Exit Criteria

- cStor pool pods are healthy post chaos injection

## Details

- Causes (forced/graceful) pod failure of OpenEBS pool deployments
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the pool deployments

## Integrations

- Pod failures can be effected using `litmus` chaos library
- The desired chaos library can be selected by setting one of the above options as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cStor-pool-chaos-sa
  namespace: openebs
  labels:
    name: cStor-pool-chaos-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: cStor-pool-chaos-sa
  namespace: openebs
  labels:
    name: cStor-pool-chaos-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "deployments",
        "jobs",
        "configmaps",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: cStor-pool-chaos-sa
  namespace: openebs
  labels:
    name: cStor-pool-chaos-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: cStor-pool-chaos-sa
subjects:
  - kind: ServiceAccount
    name: cStor-pool-chaos-sa
    namespace: openebs
```

### Prepare ChaosEngine

- Provide the cStor pool deployment info in `spec.appinfo`
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
    <td> APP_PVC </td>
    <td> Name of the application PVC </td>
    <td> Mandatory </td>
    <td> Please leave it blank, for this experiment</td>
  </tr>
  <tr>
    <td> OPENEBS_NS </td>
    <td> The namespace where OpenEBS has been installed </td>
    <td> Optional </td>
    <td> Defaults to openebs </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: cStor-pool-chaos
  namespace: openebs
spec:
  appinfo:
    appns: "openebs"
    applabel: "app=cstor-pool"
    appkind: "deployment"
  # It can be true/false
  annotationCheck: "false"
  chaosServiceAccount: cStor-pool-chaos-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-pool-pod-failure
      spec:
        components:
          env:
            # Namespace where openebs has been installed
            - name: OPENEBS_NS
              value: "openebs"
            # please leave it blank, for this experiment
            - name: APP_PVC
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step in OpenEBS Namespace to trigger the Chaos.

  `kubectl apply -f chaosengine.yml -n openebs`

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the openebs namespace

  `watch -n 1 kubectl get pods -n openebs`

### Check Chaos Experiment Result

- Check whether the cStor pool pod is resilient to the pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult cStor-pool-chaos-openebs-pool-pod-failure -n openebs`

## Recovery

- If the verdict of the ChaosResult is `Fail`, and/or the OpenEBS components do not return to healthy state post the chaos experiment, then please refer the [OpenEBS troubleshooting guide](https://docs.openebs.io/docs/next/troubleshooting.html#ndm-related) for more info on how to recover the same.

## cStor Pool Pod Chaos Demo

- A sample recording of this experiment will be available soon.
