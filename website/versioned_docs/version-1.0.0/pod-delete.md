---
id: pod-delete
title: Pod Delete Experiment Details
sidebar_label: Pod Delete
original_id: pod-delete
---

---

## Experiment Metadata

| Type    | Description              | Tested K8s Platform                         |
| ------- | ------------------------ | ------------------------------------------- |
| Generic | Fail the application pod | GKE, Konvoy(AWS), Packet(Kubeadm), Minikube |

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`).If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `pod-delete` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/pod-delete)

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- Causes (forced/graceful) pod failure of specific/random replicas of an application resources
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the application
- The pod delete by `Powerfulseal` is only supporting single pod failure (kill_count = 1)

## Integrations

- Pod failures can be effected using one of these chaos libraries: `litmus`, `powerfulseal`
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

| Variables            | Description                                         | Type     | Notes                                                                                    |
| -------------------- | --------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| TOTAL_CHAOS_DURATION | The time duration for chaos insertion (seconds)     | Optional | Defaults to 15s                                                                          |
| CHAOS_INTERVAL       | Time interval b/w two successive pod failures (sec) | Optional | Defaults to 5s                                                                           |
| LIB                  | The chaos lib used to inject the chaos              | Optional | Defaults to `litmus`. Supported: `litmus`, `powerfulseal`                                |
| FORCE                | Application Pod failures type                       | Optional | Default to `true`, With `terminationGracePeriodSeconds=0`                                |
| KILL_COUNT           | No. of application pods to be deleted               | Optional | Default to `1`, kill_count > 1 is only supported by litmus lib , not by the powerfulseal |

#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-chaos
  namespace: default
spec:
  appinfo:
    appns: default
    applabel: "app=nginx"
    appkind: deployment
  # It can be app/infra
  chaosType: "app"
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
    - name: pod-delete
      spec:
        components:
          # set chaos duration (in sec) as desired
          - name: TOTAL_CHAOS_DURATION
            value: "30"
          # set chaos interval (in sec) as desired
          - name: CHAOS_INTERVAL
            value: "10"
          # pod failures without '--force' & default terminationGracePeriodSeconds
          - name: FORCE
            value: "false"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the application namespace

  `watch -n 1 kubectl get pods -n <application-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult nginx-chaos-pod-delete -n <application-namespace>`

## Application Pod Failure Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/X3JvY_58V9A)
