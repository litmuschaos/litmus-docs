---
id: ebs-loss
title: EBS Loss Experiment Details
sidebar_label: EBS Loss
original_id: ebs-loss
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
    <td> Kube AWS </td>
    <td> EBS volume loss against specified application </td>
    <td> EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that Kubernetes Version > 1.13
- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `ebs-loss` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/kube-aws/ebs-loss/experiment.yaml)
- Ensure that you have sufficient AWS access to attach or detach an ebs volume from the instance.
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

- Application pods are healthy before chaos injection also ebs volume is attached to the instance.

## Exit-Criteria

- Application pods are healthy post chaos injection and ebs volume is attached to the instance.

## Details

- Causes chaos to disrupt state of infra resources ebs volume loss from node or ec2 instance for a certain chaos duration.
- Causes Pod to get Evicted if the Pod exceeds it Ephemeral Storage Limit.
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflows of the application pod

## Integrations

- EBS Loss can be effected using the chaos library: `litmus`, which makes use of aws sdk to attach/detach an ebs volume from the target instance.
  specified capacity on the node.
- The desired chaoslib can be selected by setting the above options as value for the env variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/kube-aws/ebs-loss/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ebs-loss-sa
  namespace: default
  labels:
    name: ebs-loss-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ebs-loss-sa
  labels:
    name: ebs-loss-sa
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
        "pods/exec",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: ebs-loss-sa
  labels:
    name: ebs-loss-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: ebs-loss-sa
subjects:
  - kind: ServiceAccount
    name: ebs-loss-sa
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
     <td> EBS_VOL_ID </td>
    <td> The EBS volume id attached to the given instance </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr> 
     <td> DEVICE_NAME </td>
    <td> The device name which you wanted to mount</td>
    <td> Mandatory </td>
    <td> Defaults to '/dev/sdb'</td>
  </tr>
  <tr> 
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (sec) </td>
    <td> Optional </td>
    <td> Defaults to 60s </td>
  </tr>
  <tr>
    <td> REGION </td>
    <td> The region name of the target instance</td>
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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/kube-aws/ebs-loss/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  annotationCheck: "false"
  engineState: "active"
  chaosServiceAccount: ebs-loss-sa
  monitoring: false
  # It can be retain/delete
  jobCleanUpPolicy: "delete"
  experiments:
    - name: ebs-loss
      spec:
        components:
          env:
            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "60"

            # Instance ID of the target ec2 instance
            - name: EC2_INSTANCE_ID
              value: ""

            # provide EBS volume id attached to the given instance
            - name: EBS_VOL_ID
              value: ""

            # Enter the device name which you wanted to mount only for AWS.
            - name: DEVICE_NAME
              value: "/dev/sdb"

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

- View the status of the pods as they are subjected to ebs loss.

  `watch -n 1 kubectl get pods -n <application-namespace>`

- Monitor the attachment status for ebs volume from AWS CLI.

  `aws ec2 describe-volumes --volume-ids <vol-id>`

- You can also use aws console to keep a watch over ebs attachment status.

### Check Chaos Experiment Result

- Check whether the application is resilient to the ebs loss, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-ebs-loss -n <application-namespace>`

### EBS Loss Experiment Demo

- A sample recording of this experiment execution will be added soon.
