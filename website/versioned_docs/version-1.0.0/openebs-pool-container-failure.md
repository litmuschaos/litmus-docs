---
id: openebs-pool-container-failure
title: OpenEBS Pool Container Failure Experiment Details
sidebar_label: Pool Container Failure
original_id: openebs-pool-container-failure
---

---

## Experiment Metadata

| Type    | Description                                                       | Tested K8s Platform                                               |
| ------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| OpenEBS | Kill the cstor pool pod container and check if gets created again | GKE, Konvoy(AWS), Packet(Kubeadm), Minikube, OpenShift(Baremetal) |

## Prerequisites

- Ensure that the Litmus Chaos Operator is running in the cluster. If not, install from [here](https://github.com/litmuschaos/chaos-operator/blob/master/deploy/operator.yaml)
- Ensure that the `openebs-pool-container-failure` experiment resource is available in the cluster. If not, install from [here](https://hub.litmuschaos.io/charts/openebs/experiments/openebs-pool-container-failure)
- If DATA_PERSISTENCE is 'enabled', provide the application info in a configmap volume so that the experiment can perform necessary checks. Currently, LitmusChaos supports
  data consistency checks only on MySQL databases. Create a configmap as shown below in the application namespace (replace with actual credentials):

  ```
  ---
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: openebs-pool-container-failure
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

- This scenario validates the behaviour of stateful applications and OpenEBS data plane upon forced termination of the targeted pool pod container
- Containers are killed using the kill command provided by pumba
- Pumba is run as a daemonset on all nodes in dry-run mode to begin with; the kill command is issued during experiment execution via kubectl exec
- Can test the stateful application's resilience to momentary iSCSI connection loss

## Integrations

- Container kill is achieved using the pumba chaos library for docker runtime.
- The desired lib image can be configured in the env variable LIB_IMAGE.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster. To understand the values to be provided in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to prepare the ChaosEngine & execute the experiment.

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Override the experiment tunables if desired

#### Supported Experiment Tunables

| Variables            | Description                                                  | Type      | Notes                                                                                                                           |
| -------------------- | ------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------- | --- |
| APP_PVC              | The PersistentVolumeClaim used by the stateful application   | Mandatory | PVC must use OpenEBS cStor storage class                                                                                        |
| DEPLOY_TYPE          | Type of Kubernetes resource used by the stateful application | Optional  | Defaults to `deployment`. Supported: `deployment`, `statefulset`                                                                |     |
| LIB_IMAGE            | The chaos library image used to inject the latency           | Optional  | Defaults to `gaiaadm/pumba:0.4.8`. Supported: `gaiaadm/pumba:0.4.8`                                                             |
| TOTAL_CHAOS_DURATION | Amount of soak time for I/O post pod kill                    | Optional  | Defaults to 600 seconds                                                                                                         |
| DATA_PERSISTENCE     | Flag to perform data consistency checks on the application   | Optional  | Default value is disabled (empty/unset). Set to `enabled` to perform data checks. Ensure configmap with app details are created |

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
    - name: openebs-pool-container-failure
      spec:
        components:
          - name: APP_PVC
            value: "pvc-c466262a-a5f2-4f0f-b594-5daddfc2e29d"
          - name: DEPLOY_TYPE
            value: deployment
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod restart count by setting up a watch on the pods in the OpenEBS namespace

  `watch -n 1 kubectl get pods -n <openebs-namespace>`

### Check Chaos Experiment Result

- Check whether the application is resilient to the pool pod container failure, once the experiment (job) is completed. The ChaosResult resource naming convention
  is: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult target-chaos-openebs-pool-container-failure -n <application-namespace>`

## OpenEBS Pool Container Failure Demo [TODO]

- A sample recording of this experiment execution is provided here.
