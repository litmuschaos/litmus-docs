---
id: container-kill
title: Container Kill Experiment Details
sidebar_label: Container Kill
original_id: container-kill
---
------

## Experiment Metadata

| Type      | Description              | Tested K8s Platform                                               |
| ----------| ------------------------ | ------------------------------------------------------------------|
| Generic   | Kill one container in the application pod | GKE, Packet(Kubeadm), Minikube|

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `container-kill` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/container-kill)
- Cluster must run docker container runtime

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- Kills one container in the specified application pod by sending SIGKILL termination signal to its docker socket (hence docker runtime is required)
- Containers are killed using the `kill` command provided by [pumba](https://github.com/alexei-led/pumba)
- Pumba is run as a daemonset on all nodes in dry-run mode to begin with; the `kill` command is issued during experiment execution via `kubectl exec`
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the application
- Good for testing recovery of pods having side-car containers

## Integrations

- Container kill is achieved using the `pumba` chaos library
- The desired pumba image can be configured in the env variable `LIB_IMAGE`. 
<!--- For the furute, other chaoslibs might be added which do not depend on docker runtime. The LIB env varable must be added then.-->

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
  name: nginx-sa
  namespace: default
  labels:
    name: nginx-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: nginx-sa
  labels:
    name: nginx-sa
rules:
- apiGroups: ["","litmuschaos.io","batch","apps"]
  resources: ["pods","jobs","daemonsets","pods/exec","chaosengines","chaosexperiments","chaosresults"]
  verbs: ["create","list","get","patch","update","delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: nginx-sa
  labels:
    name: nginx-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: nginx-sa
subjects:
- kind: ServiceAccount
  name: nginx-sa
  namespace: default

```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
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
<td> TARGET_CONTAINER  </td>
<td> The container to be killed inside the pod </td>
<td> Mandatory </td>
<td> If the TARGET_CONTAINER is not provided it will delete the first container </td>
</tr>
<tr>
<td> LIB_IMAGE  </td>
<td> The pumba image used to run the kill command </td>
<td> Optional </td>
<td> Defaults to `gaiaadm/pumba:0.4.8`. Note: pumba images >=0.6 do not work with this experiment. </td>
</tr>
<tr>
<td> LIB  </td>
<td> The category of lib use to inject chaos </td>
<td> Optional  </td>
<td> Only `pumba` supported currently </td>
</tr>
</table>


#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  # It can be app/infra
  chaosType: 'app'
  #ex. values: ns1:name=percona,ns2:run=nginx 
  auxiliaryAppInfo: ""
  appinfo:
    appns: default
    applabel: 'app=nginx'
    appkind: deployment
  chaosServiceAccount: nginx-sa
  monitoring: false
  components:
    runner:
      image: "litmuschaos/chaos-executor:1.0.0"
      type: "go"
  # It can be delete/retain
  jobCleanUpPolicy: delete 
  experiments:
    - name: container-kill
      spec:
        components:
           # specify the name of the container to be killed
          - name: TARGET_CONTAINER
            value: 'nginx'
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod restart count by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the container kill, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-container-kill -n <application-namespace>`

## Application Container Kill Demo 

- A sample recording of this experiment execution is provided [here](https://youtu.be/XKyMNdVsKMo).

