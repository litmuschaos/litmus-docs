---
id: cpu-hog
title: CPU Hog Experiment Details
sidebar_label: CPU Hog
original_id: cpu-hog
---
------

## Experiment Metadata

| Type      | Description                                  | Tested K8s Platform                                               |
| ----------| -------------------------------------------- | ------------------------------------------------------------------|
| Generic   | Exhaust CPU resources on the Kubernetes Node | GKE                              |

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `cpu-hog` experiment resource is available in the cluster  by executing                         `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/cpu-hog)
- There should be administrative access to the platform on which the Kubernetes cluster is hosted, as the recovery of the affected node could be manual. For example, gcloud access to the GKE project
## Entry Criteria

- Application pods are healthy on the respective Nodes before chaos injection

## Exit Criteria

- Application pods may or may not be healthy post chaos injection

## Details

- This experiment causes CPU resource exhaustion on the Kubernetes node. The experiment aims to verify resiliency of applications whose replicas may be evicted on account on nodes turning unschedulable (Not Ready) due to lack of CPU resources.
- The CPU chaos is injected using a daemonset running the linux stress tool (a workload generator). The chaos is effected for a period equalling the TOTAL_CHAOS_DURATION
- Application implies services. Can be reframed as:
Tests application resiliency upon replica evictions caused due to lack of CPU resources


## Integrations

- CPU Hog can be effected using the chaos library: `litmus`
- The desired chaos library can be selected by setting `litmus` as value for the env variable `LIB` 

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
kind: ClusterRole
metadata:
  name: nginx-sa
  labels:
    name: nginx-sa
rules:
- apiGroups: ["","litmuschaos.io","batch","apps"]
  resources: ["pods","daemonsets","jobs","pods/exec","chaosengines","chaosexperiments","chaosresults"]
  verbs: ["create","list","get","patch","update","delete"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs : ["get","list"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: nginx-sa
  labels:
    name: nginx-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: nginx-sa
subjects:
- kind: ServiceAccount
  name: nginx-sa
  namespace: default

```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the auxiliary applications info (ns & labels) in `spec.auxiliaryAppInfo`
- Override the experiment tunables if desired 

#### Supported Experiment Tunables

| Variables             | Description                                                  | Type      | Notes                                                                             |
| ----------------------| ------------------------------------------------------------ |-----------|------------------------------------------------------------|
| TOTAL_CHAOS_DURATION  | The time duration for chaos insertion (seconds)              | Optional  | Defaults to 60s                                                                   |
| PLATFORM              | The platform on which the chaos experiment will run          | Mandatory | Defaults to GKE                                                                   |
| LIB                   | The chaos lib used to inject the chaos                       | Optional  | Defaults to `litmus`. Supported: `litmus`                       |

#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  chaosType: 'infra'  # It can be app/infra
  auxiliaryAppInfo: "ns1:name=percona,ns2:run=nginx"
  appinfo:
    appns: default
    applabel: 'app=nginx'
    appkind: deployment
  # It can be app/infra
  chaosType: 'infra'
  #ex. values: ns1:name=percona,ns2:run=nginx 
  auxiliaryAppInfo: ""
  chaosServiceAccount: nginx-sa
  monitoring: false
  components:
    runner:
      image: "litmuschaos/chaos-executor:1.0.0"
      type: "go"
  # It can be delete/retain
  jobCleanUpPolicy: delete
  experiments:
    - name: cpu-hog
      spec:
        components:
           # set chaos duration (in sec) as desired
          - name: TOTAL_CHAOS_DURATION
            value: '60'
          # set chaos platform as desired
          - name: PLATFORM
            value: 'GKE'
          # chaos lib used to inject the chaos
          - name: LIB
            value: 'litmus'
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- Setting up a watch of the CPU consumed by nodes in the Kubernetes Cluster

  `watch kubectl top nodes`

### Check Chaos Experiment Result

- Check whether the application is resilient to the CPU hog, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-cpu-hog -n <application-namespace>`

## Application Pod Failure Demo

- A sample recording of this experiment execution is provided here.   
