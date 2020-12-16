---
id: openebs-control-plane-chaos
title: OpenEBS Control Plane Chaos Experiment Details
sidebar_label: Control Plane Chaos
original_id: openebs-control-plane-chaos
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
    <td> Kill the OpenEBS control plane pods and check if they are rescheduled and healthy </td>
    <td> GKE, EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)

- Ensure that the `openebs-control-plane-chaos` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the `openebs` namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/openebs/openebs-control-plane-chaos/experiment.yaml)

## Entry Criteria

- OpenEBS control plane pods are healthy before chaos injection

## Exit Criteria

- OpenEBS control plane pods are healthy after chaos injection

## Details

- This scenario validates graceful & forced terminations of OpenEBS control plane pods
- List of control plane components killed in this experiment:
  - maya-apiserver
  - openebs-admission-server
  - openebs-localpv-provisioner
  - openebs-ndm-operator
  - openebs-provisioner
  - openebs-snapshot-operator
  - openebs-ndm

## Integrations

- Pod kill is achieved using either the litmus or powerfulseal chaos libraries.
- The desired lib can be configured using the env variable `LIB` using `litmus` or `powerfulseal`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to be provided in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

Use this sample RBAC manifest to create a chaosServiceAccount in the desired (openebs) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/openebs/openebs-control-plane-chaos/rbac.yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: control-plane-sa
  namespace: openebs
  labels:
    name: control-plane-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: control-plane-sa
  namespace: openebs
  labels:
    name: control-plane-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "deployments",
        "pods/log",
        "events",
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
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: control-plane-sa
  namespace: openebs
  labels:
    name: control-plane-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: control-plane-sa
subjects:
  - kind: ServiceAccount
    name: control-plane-sa
    namespace: openebs
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
    <td> LIB </td>
    <td> The chaos library used to inject the chaos </td>
    <td> Optional  </td>
    <td> Defaults to `litmus`. Supported: `litmus, powerfulseal` </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/openebs/openebs-control-plane-chaos/engine.yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: control-plane-chaos
  namespace: openebs
spec:
  # It can be true/false
  annotationCheck: "false"
  # It can be active/stop
  engineState: "active"
  appinfo:
    appns: "openebs"
    applabel: "name=maya-apiserver"
    appkind: "deployment"
  chaosServiceAccount: control-plane-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: openebs-control-plane-chaos
      spec:
        components:
          env:
            - name: OPENEBS_NAMESPACE
              value: "openebs"

            ## Period to wait before injection of chaos
            - name: RAMP_TIME
              value: "10"

            - name: FORCE
              value: ""

            - name: LIB
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml -n openebs`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- View pod terminations by setting up a watch on the pods in the OpenEBS namespace

  `watch -n 1 kubectl get pods -n openebs`

### Check Chaos Experiment Result

- Check whether the OpenEBS control plane is resilient to the pod failure, once the experiment (job) is completed. The ChaosResult resource naming convention is: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult control-plane-chaos-openebs-control-plane-chaos -n openebs`

## Recovery

- If the verdict of the ChaosResult is `Fail`, and/or the OpenEBS components do not return to healthy state post the chaos experiment, then please refer the [OpenEBS troubleshooting guide](https://docs.openebs.io/docs/next/troubleshooting.html#installation) for more info on how to recover the same.

## OpenEBS Control Plane Chaos Demo [TODO]

- A sample recording of this experiment execution is provided here.
