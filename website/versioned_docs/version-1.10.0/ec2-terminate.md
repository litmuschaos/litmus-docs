---
id: ec2-terminate
title: EC2 Terminate Experiment Details
sidebar_label: EC2 Terminate
original_id: ec2-terminate
---

---

## Experiment Metadata

<table>
  <tr>
    <th> Type </th>
    <th> Description  </th>
    <th> Tested K8s Platform </th>
  </tr>
  <tr>
    <td> Kube AWS </td>
    <td> Termination of an EC2 instance for a certain chaos duration</td>
    <td> EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that Kubernetes Version > 1.13
- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `ec2-terminate` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.10.0?file=charts/kube-aws/ec2-terminate/experiment.yaml)
- Ensure that you have sufficient AWS access to stop and start an ec2 instance.
- Ensure to create a Kubernetes secret having the AWS access configuration(key) in the `CHAOS_NAMESPACE`. A sample secret file looks like:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloud-secret
type: Opaque
stringData:
  cloud_config.yml: |-
    # Add the cloud AWS credentials respectively
    [default]
    aws_access_key_id = XXXXXXXXXXXXXXXXXXX
    aws_secret_access_key = XXXXXXXXXXXXXXX
```

## Entry-Criteria

- EC2 instance is healthy before chaos injection.

## Exit-Criteria

- EC2 instance is healthy post chaos injection.

## Details

- Causes termination of an EC2 instance before bringing it back to running state after the specified chaos duration.
- It helps to check the performance of the application/process running on the ec2 instance.

## Integrations

- EC2 Terminate can be effected using the chaos library: `litmus`, which makes use of aws sdk to start/stop an EC2 instance.
- The desired chaoslib can be selected by setting the above options as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.10.x/charts/kube-aws/ec2-terminate/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ec2-terminate-sa
  namespace: default
  labels:
    name: ec2-terminate-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ec2-terminate-sa
  labels:
    name: ec2-terminate-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      [
        "pods",
        "jobs",
        "secrets",
        "events",
        "pods/log",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: ec2-terminate-sa
  labels:
    name: ec2-terminate-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: ec2-terminate-sa
subjects:
  - kind: ServiceAccount
    name: ec2-terminate-sa
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
    <th> Specify In ChaosEngine </th>
    <th> Notes </th>
  </tr>
  <tr> 
    <td> EC2_INSTANCE_ID </td>
    <td> Instance Id of the target ec2 instance.</td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr> 
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (sec) </td>
    <td> Optional </td>
    <td> Defaults to 60s </td>
  </tr>
  <tr>
    <td> REGION </td>
    <td> The region name of the target instace</td>
    <td> Optional </td>
    <td> </td>
  </tr> 
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.10.x/charts/kube-aws/ec2-terminate/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  annotationCheck: "false"
  engineState: "active"
  chaosServiceAccount: ec2-terminate-sa
  monitoring: false
  # It can be retain/delete
  jobCleanUpPolicy: "delete"
  experiments:
    - name: ec2-terminate
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "60"

            # Instance ID of the target ec2 instance
            - name: EC2_INSTANCE_ID
              value: ""

            # provide the region name of the instace
            - name: REGION
              value: ""
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

### Watch Chaos progress

- Monitor the ec2 state from AWS CLI.

  `aws ec2 describe-instance-status --instance-ids <instance-id>`

- You can also use aws console to keep a watch over the instance state.

### Check Chaos Experiment Result

- Check whether the application is resilient to the ec2-terminate, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-ec2-terminate -n <application-namespace>`

### EC2 Terminate Experiment Demo

- A sample recording of this experiment execution will be added soon.
