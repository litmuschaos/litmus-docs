---
id: Kubernetes-Chaostoolkit-Cluster-alb-ingress-controller
title: ChaosToolKit Cluster Level Pod Delete Experiment Details in kube-system
sidebar_label: Cluster Pod - alb-ingress-controller
original_id: Kubernetes-Chaostoolkit-Cluster-alb-ingress-controller
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
    <td> ChaosToolKit </td>
    <td> ChaosToolKit Cluster Level Pod delete experiment </td>
    <td> Kubeadm, Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus ChaosOperator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `k8-pod-delete` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/kube-components/k8-alb-ingress-controller/experiment.yaml)
- Ensure you have nginx default application setup on default namespace ( if you are using specific namespace please execute below on that namespace)

## Entry Criteria

- Application replicas are healthy before chaos injection
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application health end point
- This application we are executing against kube-system type namespace

## Exit Criteria

- Application replicas are healthy after chaos injection
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application health end point

## Details

- Causes graceful pod failure of an ChaosToolKit replicas bases on provided namespace and Label with endpoint
- Tests deployment sanity check with Steady state hypothesis pre and post pod failures
- Service resolution will failed if Application replicas are not present.

### Use Cases for executing the experiment

<table>
  <tr>
    <th> Type </th>
    <th> Experiment </th>
    <th> Details </th>
    <th> json </th>
  </tr>
  <tr>
    <td> ChaosToolKit </td>
    <td> ChaosToolKit single, random pod delete experiment with count </td>
    <td> Executing via label name k8s-app=&lt;&gt; </td>
    <td> pod-custom-kill-health.json</td>
  </tr>
  <tr>
    <td> TEST_NAMESPACE </td>
    <td> Place holder from where the chaos experiment is executed</td>
    <td> Optional  </td>
    <td> Defaults to is `default` </td>
  </tr>
</table>

## Integrations

- Pod failures can be effected using one of these chaos libraries: `litmus`

## Steps to Execute the ChaosExperiment

- This ChaosExperiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

## Prepare chaosServiceAccount

- Based on your use case pick one of the choice from here `https://hub.litmuschaos.io/kube-components/k8-alb-ingress-controller`
  - Service owner use case
    - Install the rbac for cluster in namespace from where you are executing the experiments `kubectl apply rbac-admin.yaml`

### Sample Rbac Manifest for Cluster Owner use case

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/kube-components/k8-alb-ingress-controller/rbac-admin.yaml yaml"

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: chaos-admin
  labels:
    name: chaos-admin
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: chaos-admin
  labels:
    name: chaos-admin
rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["jobs", "deployments", "daemonsets"]
    verbs: ["create", "list", "get", "patch", "delete"]
  - apiGroups: ["", "litmuschaos.io"]
    resources:
      [
        "pods",
        "configmaps",
        "events",
        "services",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
        "deployments",
        "jobs",
      ]
    verbs: ["get", "create", "update", "patch", "delete", "list"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: chaos-admin
  labels:
    name: chaos-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: chaos-admin
subjects:
  - kind: ServiceAccount
    name: chaos-admin
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`

  - It will be default as
    ```
      appinfo:
        appns: default
        applabel: 'app=alb-ingress-controller'
        appkind: deployment
    ```

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
    <td> NAME_SPACE </td>
    <td> This is chaos namespace which will create all infra chaos resources in that namespace </td>
    <td> Mandatory </td>
    <td> Default to kube-system </td>
  </tr>
  <tr>
    <td> LABEL_NAME </td>
    <td> The default name of the label </td>
    <td> Mandatory </td>
    <td> Defaults to `app=alb-ingress-controller`</td>
  </tr>
  <tr>
    <td> APP_ENDPOINT </td>
    <td> Endpoint where ChaosToolKit will make a call and ensure the application endpoint is healthy </td>
    <td> Mandatory </td>
    <td> Defaults to localhost </td>
  </tr>
  <tr>
    <td> FILE </td>
    <td> Type of chaos experiments we want to execute </td>
    <td> Mandatory  </td>
    <td> Default to `pod-custom-kill-health.json` </td>
  </tr>
  <tr>
    <td> REPORT  </td>
    <td> The Report of execution coming in json format </td>
    <td> Optional  </td>
    <td> Defaults to is `false` </td>
  </tr>
  <tr>
    <td> REPORT_ENDPOINT </td>
    <td> Report endpoint which can take the json format and submit it</td>
    <td> Optional  </td>
    <td> Default to setup for Kafka topic for chaos, but can support any reporting database </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/kube-components/k8-alb-ingress-controller/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: k8-alb-ingress-controller
  namespace: default
spec:
  appinfo:
    appns: "default"
    applabel: "app=alb-ingress-controller"
    appkind: deployment
  annotationCheck: "false"
  engineState: "active"
  chaosServiceAccount: chaos-admin
  monitoring: false
  jobCleanUpPolicy: "retain"
  experiments:
    - name: k8-pod-delete
      spec:
        components:
          env:
            # set chaos namespace
            - name: NAME_SPACE
              value: addon-alb-ingress-controller-ns
            # set chaos label name
            - name: LABEL_NAME
              value: app=alb-ingress-controller
            # pod endpoint
            - name: APP_ENDPOINT
              value: "localhost"
            - name: FILE
              value: "pod-custom-kill-health.json"
            - name: REPORT
              value: "true"
            - name: REPORT_ENDPOINT
              value: "none"
            - name: TEST_NAMESPACE
              value: "default"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View ChaosToolKit pod terminations & recovery by setting up a watch on the ChaosToolKit pods in the application namespace

  `watch kubectl get pods -n kube-system`

### Check ChaosExperiment Result

- Check whether the application is resilient to the ChaosToolKit pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult k8-pod-delete -n <chaos-namespace>`

### Check ChaosExperiment logs

- Check the log and result for existing experiment

  `kubectl log -f k8-pod-delete-<> -n <chaos-namespace>`
