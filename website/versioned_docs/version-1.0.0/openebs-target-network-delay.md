---
id: openebs-target-network-delay
title: OpenEBS Target Network Latency Experiment Details
sidebar_label: Target Network Latency
original_id: openebs-target-network-delay
---

---

## Experiment Metadata

| Type    | Description                                                    | Tested K8s Platform                                     |
| ------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| OpenEBS | Induce latency into the cStor target/Jiva controller container | GKE, Konvoy(AWS), Packet(Kubeadm), OpenShift(Baremetal) |

## Prerequisites

- Ensure that the Kubernetes Cluster uses Docker runtime
- Ensure that the Litmus Chaos Operator is running
- Ensure that the `openebs-target-network-delay` experiment resource is available in the cluster. If not, install from [here](https://hub.litmuschaos.io/charts/openebs/experiments/openebs-target-network-delay)
- If DATA_PERSISTENCE is 'enabled', provide the application info in a configmap volume so that the experiment can perform necessary checks. Currently, LitmusChaos supports
  data consistency checks only on MySQL databases. Create a configmap as shown below in the application namespace (replace with actual credentials):

  ```
  ---
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: openebs-target-network-delay
  data:
    parameters.yml: |
      dbuser: root
      dbpassword: k8sDem0
      dbname: test
  ```

- Ensure that the chaosServiceAccount used for the experiment has cluster-scope permissions as the experiment may involve carrying out the chaos in the `openebs` namespace
  while performing application health checks in its respective namespace.

## Entry Criteria

- Application pods are healthy before chaos injection
- Application writes are successful on OpenEBS PVs

## Exit Criteria

- Stateful application pods are healthy post chaos injection
- OpenEBS Storage target pods are healthy

If the experiment tunable DATA_PERSISTENCE is set to 'enabled':

- Application data written prior to chaos is successfully retrieved/read
- Database consistency is maintained as per db integrity check utils

## Details

- This scenario validates the behaviour of stateful applications and OpenEBS data plane upon high latencies/network delays in accessing the storage controller pod
- Injects latency on the specified container in the controller pod by staring a traffic control `tc` process with `netem` rules to add egress delays
- Latency is injected via pumba library with command `pumba netem delay` by passing the relevant network interface, latency, chaos duration and regex filter for container name
- Can test the stateful application's resilience to loss/slow iSCSI connections

## Integrations

- Network delay is achieved using the `pumba` chaos library in case of docker runtime. Support for other other runtimes via tc direct invocation of `tc` will be added soon.
- The desired lib image can be configured in the env variable `LIB_IMAGE`.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to prepare the ChaosEngine & execute the experiment.

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Override the experiment tunables if desired

#### Supported Experiment Tunables

| Variables            | Description                                                                | Type      | Notes                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| APP_PVC              | The PersistentVolumeClaim used by the stateful application                 | Mandatory | PVC may use either OpenEBS Jiva/cStor storage class                                                                             |
| DEPLOY_TYPE          | Type of Kubernetes resource used by the stateful application               | Optional  | Defaults to `deployment`. Supported: `deployment`, `statefulset`                                                                |
| CONTAINER_RUNTIME    | The container runtime used in the Kubernetes Cluster                       | Optional  | Defaults to `docker`. Supported: `docker`                                                                                       |
| LIB_IMAGE            | The chaos library image used to inject the latency                         | Optional  | Defaults to `gaiaadm/pumba:0.4.8`. Supported: `gaiaadm/pumba:0.4.8`                                                             |
| TARGET_CONTAINER     | The container into which delays are injected in the storage controller pod | Optional  | Defaults to `cstor-istgt`                                                                                                       |
| NETWORK_DELAY        | Egress delay injected into the target container                            | Optional  | Defaults to 60000 milliseconds (60s)                                                                                            |
| TOTAL_CHAOS_DURATION | Total duration for which latency is injected                               | Optional  | Defaults to 60000 milliseconds (60s)                                                                                            |
| DATA_PERSISTENCE     | Flag to perform data consistency checks on the application                 | Optional  | Default value is disabled (empty/unset). Set to `enabled` to perform data checks. Ensure configmap with app details are created |

#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: target-chaos
  namespace: default
spec:
  appinfo:
    appns: default
    applabel: "app=percona"
    appkind: deployment
  chaosServiceAccount: percona-sa
  monitoring: false
  jobCleanUpPolicy: delete
  experiments:
    - name: openebs-target-network-delay
      spec:
        components:
          - name: TARGET_CONTAINER
            value: "cstor-istgt"
          - name: APP_PVC
            value: "pvc-c466262a-a5f2-4f0f-b594-5daddfc2e29d"
          - name: DEPLOY_TYPE
            value: deployment
          - name: NETWORK_DELAY
            value: "30000"
          - name: TOTAL_CHAOS_DURATION
            value: "60000"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View network delay in action by setting up a ping to the storage controller in the OpenEBS namespace
- Watch the behaviour of the application pod and the OpenEBS data replica/pool pods by setting up in a watch on the respective namespaces

  `watch -n 1 kubectl get pods -n <app/openebs-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the target network delays, once the experiment (job) is completed. The ChaosResult resource naming
  convention is: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult target-chaos-openebs-target-network-delay -n <application-namespace>`

## OpenEBS Target Network Delay Demo [TODO]

- A sample recording of this experiment execution is provided here.
