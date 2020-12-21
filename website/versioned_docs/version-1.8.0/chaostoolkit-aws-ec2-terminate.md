---
id: Kubernetes-Chaostoolkit-AWS
title: ChaosToolKit AWS EC2 Experiment Details
sidebar_label: EC2 Terminate
original_id: Kubernetes-Chaostoolkit-AWS
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
    <td> ChaosToolKit AWS EC2 terminate experiment </td>
    <td> Kubeadm, Minikube </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `aws-ec2-terminate` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/master?file=charts/kube-aws/k8-aws-ec2-terminate/experiment.yaml)
- Ensure you have nginx default application setup on default namespac ( if you are using specific namespace please execute beloe on that namespace)

## Entry Criteria

- Application replicas are healthy before chaos injection
- EC2 Intsaces are running on this namespace
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application health end point

## Exit Criteria

- Application replicas are healthy after chaos injection
- EC2 Intsaces are running on this namespace
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application health end point

## Details

- Causes EC2 Terminate instance failure of application replicas using chaostoolkit based on provided namespace and Label while doing health checks against the endpoint
- Tests deployment sanity with steady state hypothesis executed pre and post pod failures, which is running on AWS EC2 instance
- Service resolution will fail if application is not able to lauch on new EC2 instance.

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
    <td> ChaosToolKit single, random EC2 terminate experiment with Application uptime </td>
    <td> Executing via label name app=&lt;&gt; </td>
    <td> ec2-delete.json</td>
  </tr>
</table>

## Integrations

- AWS EC2 failures can be effected using one of these chaos libraries: `litmus`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

## Prepare chaosServiceAccount

- Based on your use case pick one of the choice from here `https://github.com/litmuschaos/chaos-charts/tree/master/charts/generic/k8-aws-ec2-terminate`

### Sample Rbac Manifest for Service Owner use case

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/kube-aws/k8-aws-ec2-terminate/rbac.yaml yaml"

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: k8-aws-ec2-terminate-sa
  labels:
    name: k8-aws-ec2-terminate-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: k8-aws-ec2-terminate-sa
  labels:
    name: k8-aws-ec2-terminate-sa
rules:
  - apiGroups:
      [
        "",
        "apps",
        "batch",
        "extensions",
        "litmuschaos.io",
        "openebs.io",
        "storage.k8s.io",
      ]
    resources:
      [
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
        "configmaps",
        "cstorpools",
        "cstorvolumereplicas",
        "events",
        "jobs",
        "persistentvolumeclaims",
        "persistentvolumes",
        "pods",
        "pods/exec",
        "pods/log",
        "secrets",
        "storageclasses",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
        "configmaps",
        "cstorpools",
        "cstorvolumereplicas",
        "daemonsets",
        "deployments",
        "events",
        "jobs",
        "persistentvolumeclaims",
        "persistentvolumes",
        "pods",
        "pods/eviction",
        "pods/exec",
        "pods/log",
        "replicasets",
        "secrets",
        "services",
        "statefulsets",
        "storageclasses",
      ]
    verbs: ["create", "delete", "get", "list", "patch", "update"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: k8-aws-ec2-terminate-sa
  labels:
    name: k8-aws-ec2-terminate-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: k8-aws-ec2-terminate-sa
subjects:
  - kind: ServiceAccount
    name: k8-aws-ec2-terminate-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`

  - It will be default as
    ```
      appinfo:
        appns: default
        applabel: 'app=nginx'
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
    <td> Default to default </td>
  </tr>
  <tr>
    <td> LABEL_NAME </td>
    <td> The default name of the label </td>
    <td> Mandatory </td>
    <td> Defaults to nginx </td>
  </tr>
  <tr>
    <td> APP_ENDPOINT </td>
    <td> Endpoint where chaostoolkit will make a call and ensure the application is healthy </td>
    <td> Mandatory </td>
    <td> Defaults to localhost </td>
  </tr>
  <tr>
    <td> FILE </td>
    <td> Type of pod-delete chaos (in terms of steady state checks performed) we want to execute, represented by the chaostoolkit json file</td>
    <td> Mandatory  </td>
    <td> Default to `ec2-delete.json` </td>
  </tr>
  <tr>
    <td> AWS_ROLE </td>
    <td> AWS role which will be use from this namespace</td>
    <td> Mandatory  </td>
    <td> Default to `chaosec2access` </td>
  </tr>
  <tr>
    <td> AWS_ACCOUNT </td>
    <td> Which AWS account the AWS role will be used</td>
    <td> Mandatory  </td>
    <td> Default to `000000000000` </td>
  </tr>
  <tr>
    <td> AWS_REGION </td>
    <td> AWS region where we want to terminate the ec2</td>
    <td> Mandatory  </td>
    <td> Default to `us-west-2` </td>
  </tr>
  <tr>
    <td> AWS_AZ </td>
    <td> AWS Availiblity Zone  where we want to terminate the ec2</td>
    <td> Mandatory  </td>
    <td> Default to `us-west-2c` </td>
  </tr>
  <tr>
    <td> AWS_RESOURCE </td>
    <td> AWS Resource we want to terminate, this time used for aws kubernetes cluster</td>
    <td> Mandatory  </td>
    <td> Default to `ec2-iks` </td>
  </tr>
  <tr>
    <td> AWS_SSL </td>
     <td> AWS end point for making call, has SSL enbaledor not</td>
    <td> Mandatory  </td>
    <td> Default to `false` </td>
  </tr>
  <tr>
    <td> REPORT  </td>
    <td> The Report of execution coming in json format </td>
    <td> Optional  </td>
    <td> Defaults to is `true` </td>
  </tr>
  <tr>
    <td> REPORT_ENDPOINT </td>
    <td> Report endpoint which can take the json format and submit it</td>
    <td> Optional  </td>
    <td> Default to setup for Kafka topic for chaos, but can support any reporting database </td>
  </tr>
  <tr>
    <td> TEST_NAMESPACE </td>
    <td> Place holder from where the chaos experiment is executed</td>
    <td> Optional  </td>
    <td> Defaults to is `default` </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/kube-aws/k8-aws-ec2-terminate/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: k8-aws-ec2-terminate
  namespace: default
spec:
  appinfo:
    appns: "default"
    applabel: "app=nginx"
    appkind: "deployment"
  annotationCheck: "false"
  engineState: "active"
  monitoring: false
  jobCleanUpPolicy: "retain"
  chaosServiceAccount: chaos-admin
  components:
    runner:
      runnerannotation:
        iam.amazonaws.com/role: "k8s-chaosec2access"
  experiments:
    - name: k8-aws-ec2-terminate
      spec:
        components:
          experimentannotation:
            iam.amazonaws.com/role: "k8s-chaosec2access"
          env:
            - name: NAME_SPACE
              value: default
            - name: LABEL_NAME
              value: app=nginx
            - name: APP_ENDPOINT
              value: localhost
            - name: FILE
              value: "ec2-delete.json"
            - name: AWS_ROLE
              value: "chaosec2access"
            - name: AWS_ACCOUNT
              value: "0000000000"
            - name: AWS_REGION
              value: "us-west-2"
            - name: AWS_AZ
              value: "us-west-2c"
            - name: AWS_RESOURCE
              value: "ec2-iks"
            - name: AWS_SSL
              value: "false"
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

- View application pod termination & recovery by setting up a watch on the pods in the application namespace

  `watch kubectl get pods`

### Check Chaos Experiment Result

- Check whether the application is resilient to the chaostoolkit pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult k8-pod-delete -n <chaos-namespace>`

### Check Chaos Experiment logs

- Check the log and result for existing experiment

  `kubectl log -f k8-pod-delete-<> -n <chaos-namespace>`
