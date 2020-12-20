---
id: pod-network-loss
title: Pod Network Loss Experiment Details
sidebar_label: Pod Network Loss
original_id: pod-network-loss
---

---

## Experiment Metadata

| Type    | Description                             | Tested K8s Platform                     |
| ------- | --------------------------------------- | --------------------------------------- |
| Generic | Inject Packet Loss Into Application Pod | GKE, Packet(Kubeadm), Minikube > v1.6.0 |

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `pod-network-loss` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/generic/experiments/pod-network-loss)
  <div class="danger">
    <strong>NOTE</strong>: 
        Experiment is supported only on Docker Runtime. Support for containerd/CRIO runtimes will be added in subsequent releases.
</div>

## Entry Criteria

- Application pods are healthy before chaos injection

## Exit Criteria

- Application pods are healthy post chaos injection

## Details

- Pod-network-loss injects chaos to disrupt network connectivity to kubernetes pods.
- The application pod should be healthy once chaos is stopped. Service-requests should be served despite chaos.
- Causes loss of access to application replica by injecting packet loss using pumba

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
  - apiGroups: ["", "litmuschaos.io", "batch"]
    resources:
      ["pods", "jobs", "chaosengines", "chaosexperiments", "chaosresults"]
    verbs: ["create", "list", "get", "patch", "update", "delete"]
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

| Variables                      | Description                                                 | Type      | Notes                          |
| ------------------------------ | ----------------------------------------------------------- | --------- | ------------------------------ |
| NETWORK_INTERFACE              | Name of ethernet interface considered for shaping traffic   | Mandatory |                                |
| TARGET_CONTAINER               | Name of container which is subjected to network latency     | Mandatory |                                |
| NETWORK_PACKET_LOSS_PERCENTAGE | The packet loss in percentage                               | Mandatory |                                |
| TOTAL_CHAOS_DURATION           | The time duration for chaos insertion in milliseconds       | Optional  | Default (60000ms)              |
| LIB                            | The chaos lib used to inject the chaos eg. Pumba            | Optional  |                                |
| LIB_IMAGE                      | The image used by the chaoslib to inject the chaos          | Optional  | Default: `gaiaadm/pumba:0.6.5` |
| CHAOSENGINE                    | ChaosEngine CR name associated with the experiment instance | Optional  |                                |
| CHAOS_SERVICE_ACCOUNT          | Service account used by the pumba daemonset Optional        | Optional  |                                |

#### Sample ChaosEngine Manifest

```yaml
# chaosengine.yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: nginx-network-chaos
  namespace: default
spec:
  # It can be delete/retain
  jobCleanUpPolicy: delete
  # It can be app/infra
  chaosType: "app"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  monitoring: false
  components:
    runner:
      image: "litmuschaos/chaos-executor:1.0.0"
      type: "go"
  appinfo:
    appns: default
    # FYI, To see app label, apply kubectl get pods --show-labels
    applabel: "app=nginx"
    appkind: deployment
  chaosServiceAccount: nginx-sa
  experiments:
    - name: pod-network-loss
      spec:
        components:
          - name: ANSIBLE_STDOUT_CALLBACK
            value: default
          - name: TARGET_CONTAINER
            #Container name where chaos has to be injected
            value: "nginx"
          - name: LIB_IMAGE
            value: gaiaadm/pumba:0.6.5
          - name: NETWORK_INTERFACE
            #Network interface inside target container
            value: eth0
          - name: NETWORK_PACKET_LOSS_PERCENTAGE
            value: "100"
          - name: TOTAL_CHAOS_DURATION
            value: "60000"
          - name: LIB
            value: pumba
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View network latency by setting up a ping on the affected pod from the cluster nodes

  `ping <pod_ip_address>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the Pod Network Loss, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult <ChaosEngine-Name>-<ChaosExperiment-Name> -n <application-namespace>`

## Application Pod Network Loss Demo

- A sample recording of this experiment execution is provided [here](https://youtu.be/jqvYy-nWc_I).
