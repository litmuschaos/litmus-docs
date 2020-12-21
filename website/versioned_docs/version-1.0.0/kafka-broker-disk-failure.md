---
id: kafka-broker-disk-failure
title: Kafka Broker Disk Failure Experiment Details
sidebar_label: Broker Disk Failure
original_id: kafka-broker-disk-failure
---

## Experiment Metadata

| Type  | Description                    | Kafka Distribution    | Tested K8s Platform |
| ----- | ------------------------------ | --------------------- | ------------------- |
| Kafka | Fail kafka broker disk/storage | Confluent, Kudo-Kafka | GKE                 |

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://raw.githubusercontent.com/litmuschaos/pages/master/docs/litmus-operator-latest.yaml)
- Ensure that Kafka & Zookeeper are deployed as Statefulsets
- If Confluent/Kudo Operators have been used to deploy Kafka, note the instance name, which will be
  used as the value of `KAFKA_INSTANCE_NAME` experiment environment variable

  - In case of Confluent, specified by the `--name` flag
  - In case of Kudo, specified by the `--instance` flag

  Zookeeper uses this to construct a path in which kafka cluster data is stored.

- Ensure that the kafka-broker-disk failure experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/charts/kafka/experiments/kafka-broker-disk-failure)

- Create a secret with the gcloud serviceaccount key (placed in a file `cloud_config.yml`) named `kafka-broker-disk-failure` in the namespace where the experiment CRs are created. This is necessary to perform the disk-detach steps from the litmus experiment container.

  `kubectl create secret generic kafka-broker-disk-failure --from-file=cloud_config.yml -n <kafka-namespace>`

## Entry Criteria

- Kafka Cluster (comprising the Kafka-broker & Zookeeper Statefulsets) is healthy

## Exit Criteria

- Kafka Cluster (comprising the Kafka-broker & Zookeeper Statefulsets) is healthy
- Kafka Message stream (if enabled) is unbroken

## Details

- Causes forced detach of specified disk serving as storage for the Kafka broker pod
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflows of the Kafka cluster
- Tests unbroken message stream when `KAFKA_LIVENESS_STREAM` experiment environment variable is set to `enabled`

## Integrations

- Currently, the disk detach is supported only on GKE using LitmusLib, which internally uses the gcloud tools.

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster.
  To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kafka-sa
  namespace: default
  labels:
    name: kafka-sa
---
# Source: openebs/templates/clusterrole.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: kafka-sa
  labels:
    name: kafka-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "jobs",
        "pod/exec",
        "statefulsets",
        "secrets",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kafka-sa
  labels:
    name: kafka-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kafka-role
subjects:
  - kind: ServiceAccount
    name: kafka-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the experiment tunables. While many tunables have default values specified in the ChaosExperiment CR, some need to be explicitly supplied.

#### Supported Experiment Tunables

| Variables                | Description                                                                  | Type      | Notes                                                    |
| ------------------------ | ---------------------------------------------------------------------------- | --------- | -------------------------------------------------------- |
| KAFKA_NAMESPACE          | Namespace of Kafka Brokers                                                   | Mandatory | May be same as value for `spec.appinfo.appns`            |
| KAFKA_LABEL              | Unique label of Kafka Brokers                                                | Mandatory | May be same as value for `spec.appinfo.applabel`         |
| KAFKA_SERVICE            | Headless service of the Kafka Statefulset                                    | Mandatory |                                                          |
| KAFKA_PORT               | Port of the Kafka ClusterIP service                                          | Mandatory |                                                          |
| ZOOKEEPER_NAMESPACE      | Namespace of Zookeeper Cluster                                               | Mandatory | May be same as value for KAFKA_NAMESPACE or other        |
| ZOOKEEPER_LABEL          | Unique label of Zokeeper statefulset                                         | Mandatory |                                                          |
| ZOOKEEPER_SERVICE        | Headless service of the Zookeeper Statefulset                                | Mandatory |                                                          |
| ZOOKEEPER_PORT           | Port of the Zookeeper ClusterIP service                                      | Mandatory |                                                          |
| CLOUD_PLATFORM           | Cloud platform type on which to inject disk loss                             | Mandatory | Supported platforms: GCP                                 |
| PROJECT_ID               | GCP Project ID in which the Cluster is created                               | Mandatory |                                                          |
| DISK_NAME                | GCloud Disk attached to the Cluster Node where specified broker is scheduled | Mandatory |                                                          |
| ZONE_NAME                | Zone in which the Disks/Cluster are created                                  | Mandatory |                                                          |
| KAFKA_BROKER             | Kafka broker pod which is using the specified disk                           | Mandatory | Experiment verifies this by mapping node details         |
| KAFKA_KIND               | Kafka deployment type                                                        | Optional  | Same as `spec.appinfo.appkind`. Supported: `statefulset` |
| KAFKA_LIVENESS_STREAM    | Kafka liveness message stream                                                | Optional  | Supported: `enabled`, `disabled`                         |
| KAFKA_LIVENESS_IMAGE     | Image used for liveness message stream                                       | Optional  | Image as `<registry_url>/<repository>/<image>:<tag>`     |
| KAFKA_REPLICATION_FACTOR | Number of partition replicas for liveness topic partition                    | Optional  | Necessary if KAFKA_LIVENESS_STREAM is `enabled`          |
| KAFKA_INSTANCE_NAME      | Name of the Kafka chroot path on zookeeper                                   | Optional  | Necessary if installation involves use of such path      |
| KAFKA_CONSUMER_TIMEOUT   | Kafka consumer message timeout, post which it terminates                     | Optional  | Defaults to 30000ms                                      |
| TOTAL_CHAOS_DURATION     | The time duration for chaos insertion (seconds)                              | Optional  | Defaults to 15s                                          |

#### Sample ChaosEngine Manifest

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: kafka-chaos
  namespace: default
spec:
  # It can be app/infra
  chaosType: "app"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  appinfo:
    appns: default
    applabel: "app=cp-kafka"
    appkind: statefulset
  chaosServiceAccount: kafka-sa
  monitoring: false
  components:
    runner:
      image: "litmuschaos/chaos-executor:1.0.0"
      type: "go"
  # It can be delete/retain
  jobCleanUpPolicy: delete
  experiments:
    - name: kafka-broker-disk-failure
      spec:
        components:
          # choose based on available kafka broker replicas
          - name: KAFKA_REPLICATION_FACTOR
            value: "3"

          # get via "kubectl get pods --show-labels -n <kafka-namespace>"
          - name: KAFKA_LABEL
            value: "app=cp-kafka"

          - name: KAFKA_NAMESPACE
            value: "default"

          # get via "kubectl get svc -n <kafka-namespace>"
          - name: KAFKA_SERVICE
            value: "kafka-cp-kafka-headless"

          # get via "kubectl get svc -n <kafka-namespace>
          - name: KAFKA_PORT
            value: "9092"

          # in milliseconds
          - name: KAFKA_CONSUMER_TIMEOUT
            value: "70000"

          # ensure to set the instance name if using KUDO operator
          - name: KAFKA_INSTANCE_NAME
            value: ""

          - name: ZOOKEEPER_NAMESPACE
            value: "default"

          # get via "kubectl get pods --show-labels -n <zk-namespace>"
          - name: ZOOKEEPER_LABEL
            value: "app=cp-zookeeper"

          # get via "kubectl get svc -n <zk-namespace>
          - name: ZOOKEEPER_SERVICE
            value: "kafka-cp-zookeeper-headless"

          # get via "kubectl get svc -n <zk-namespace>
          - name: ZOOKEEPER_PORT
            value: "2181"

          # get from google cloud console or "gcloud projects list"
          - name: PROJECT_ID
            value: "argon-tractor-237811"

          # attached to (in use by) node where 'kafka-0' is scheduled
          - name: DISK_NAME
            value: "disk-1"

          - name: ZONE_NAME
            value: "us-central1-a"

          # Uses "disk-1" attached to the node on which it is scheduled
          - name: KAFKA_BROKER
            value: "kafka-0"

          # set chaos duration (in sec) as desired
          - name: TOTAL_CHAOS_DURATION
            value: "60"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View broker pod termination upon disk loss by setting up a watch on the pods in the Kafka namespace

  `watch -n 1 kubectl get pods -n <kafka-namespace>`

### Check Chaos Experiment Result

- Check whether the kafka deployment is resilient to the broker disk failure, once the experiment (job) is completed.
  The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult kafka-chaos-kafka-broker-disk-failure -n <kafka-namespace>`

### Kafka Broker Recovery Post Experiment Execution

- The experiment re-attaches the detached disk to the same node as part of recovery steps. However, if the disk is not provisioned
  as a Persistent Volume & instead provides the backing store to a PV carved out of it, the brokers may continue to stay in `CrashLoopBackOff`
  state (example: as hostPath directory for a Kubernetes Local PV)

- The complete recovery steps involve:

  - Remounting the disk into the desired mount point
  - Deleting the affected broker pod to force reschedule

## Kafka Broker Disk Failure Demo

- TODO: A sample recording of this experiment execution is provided here.

---
