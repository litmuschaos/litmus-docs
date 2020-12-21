---
id: coredns-pod-delete
title: CoreDNS Pod Delete Experiment Details
sidebar_label: CoreDNS Pod Delete
original_id: coredns-pod-delete
---
------

## Experiment Metadata

| Type      | Description                   | Tested K8s Platform    |
| ----------| ------------------------------| ---------------------- |
| CoreDNS   | CoreDNS pod delete experiment | Kubeadm, Minikube      |

## Prerequisites
- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that the `coredns-pod-delete` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos?file=charts/coredns/coredns-pod-delete/experiment.yaml)

## Entry Criteria

- CoreDNS replicas are healthy before chaos injection
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application

## Exit Criteria

- CoreDNS replicas are healthy after chaos injection
- Service resolution works successfully as determined by deploying a sample nginx application and a custom liveness app querying the nginx application

## Details

- Causes graceful pod failure of an coreDNS replicas
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflow of the service
- Service resolution will failed if coredns replicas are not present.

## Integrations

- Pod failures can be effected using one of these chaos libraries: `litmus`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

## Prepare chaosServiceAccount
- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

### Sample Rbac Manifest
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: coredns-sa
  namespace: kube-system
  labels:
    name: coredns-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: coredns-sa
  labels:
    name: coredns-sa
rules:
- apiGroups: ["","litmuschaos.io","batch"]
  resources: ["services", "pods","jobs","chaosengines","chaosexperiments","chaosresults"]
  verbs: ["create","list","get","patch","update","delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: coredns-sa
  labels:
    name: coredns-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: coredns-sa
subjects:
- kind: ServiceAccount
  name: coredns-sa
  namespace: kube-system
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
  - It will be default as
    ```
      appinfo:
        appns: kube-system
        applabel: 'k8s-app=kube-dns'
        appkind: deployment
    ```

- Override the experiment tunables if desired

#### Supported Experiment Tunables

| Variables             | Description                                         | Type      | Notes           |
| ----------------------|-----------------------------------------------------|-----------|-----------------|
| TOTAL_CHAOS_DURATION  | The time duration for chaos insertion (seconds)     | Mandatory | Defaults to 15s |
| CHAOS_INTERVAL        | Time interval b/w two successive pod failures (sec) | Mandatory | Defaults to 5s  | 
| APP_NAMESPACE         | Namespace in which application pods are deployed	  | Mandatory | Defaults to `kube-system` |
| APP_LABEL             | Unique Labels in `key=value` format of application deployment	 | Mandatory | Defaults to `k8s-app=kube-dns` |
| APP_KIND              | This describe the application Kind | Mandatory | Mandatory | Defaults to `Deployment` | 
| CHAOS_NAMESPACE       | This ischaos namespace which will create all infra chaos resources in that namespace	| Mandatory | Default to `kube-system` |
| LIB                   | The chaos lib used to inject the chaos              | Optional  | Defaults to `litmus`, Supported: `litmus`  |

#### Sample ChaosEngine Manifest
```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: engine-coredns
  namespace: kube-system
spec:
  appinfo:
    appns: kube-system
    applabel: 'k8s-app=kube-dns'
    appkind: deployment
  # It can be infra only
  chaosType: 'infra'
  #ex. values: ns1:name=percona,ns2:run=nginx 
  auxiliaryAppInfo: ""
  components:
    runner:
       image: "litmuschaos/chaos-executor:1.0.0"
       type: "go"
  chaosServiceAccount: coredns-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: delete
  experiments:
    - name: coredns-pod-delete
      spec:
        components:
           # set chaos duration (in sec) as desired
          - name: TOTAL_CHAOS_DURATION
            value: '30'
      
          # set chaos interval (in sec) as desired
          - name: CHAOS_INTERVAL
            value: '10'
            
          - name: APP_NAMESPACE
            value: 'kube-system'

          # provide application labels
          - name: APP_LABEL
            value: 'k8s-app=kube-dns'

           # provide application kind
          - name: APP_KIND
            value: 'deployment'
            
          - name: CHAOS_NAMESPACE
            value: 'kube-system'
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View coredns pod terminations & recovery by setting up a watch on the coredns pods in the application namespace

  `watch kubectl get pod coredns-xxxx -n kube-system` 

### Check Chaos Experiment Result

- Check whether the application is resilient to the coredns pod failure, once the experiment (job) is completed. The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult engine-coredns-coredns-pod-delete -n <chaos-namespace>`
