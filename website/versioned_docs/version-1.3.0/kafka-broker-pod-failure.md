---
id: kafka-broker-pod-failure
title: Kafka Broker Pod Failure Experiment Details
sidebar_label: Broker Pod Failure
original_id: kafka-broker-pod-failure
---

## Experiment Metadata

<table>
  <tr>
    <th> Type </th>
    <th> Description  </th>
    <th> Kafka Distribution </th>
    <th> Tested K8s Platform </th>
  </tr>
  <tr>
    <td> Kafka </td>
    <td> Fail kafka leader-broker pods </td>
    <td> Confluent, Kudo-Kafka </td>
    <td> AWS Konvoy, GKE, EKS </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that the `kafka-broker-pod-failure` experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.3.0?file=charts/kafka/kafka-broker-pod-failure/experiment.yaml)
- Ensure that Kafka & Zookeeper are deployed as Statefulsets
- If Confluent/Kudo Operators have been used to deploy Kafka, note the instance name, which will be
  used as the value of `KAFKA_INSTANCE_NAME` experiment environment variable

  - In case of Confluent, specified by the `--name` flag
  - In case of Kudo, specified by the `--instance` flag

  Zookeeper uses this to construct a path in which kafka cluster data is stored.

- Ensure that the kafka-broker-disk failure experiment resource is available in the cluster. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.3.0?file=charts/kafka/kafka-broker-pod-failure/experiment.yaml)

## Entry Criteria

- Kafka Cluster (comprising the Kafka-broker & Zookeeper Statefulsets) is healthy

## Exit Criteria

- Kafka Cluster (comprising the Kafka-broker & Zookeeper Statefulsets) is healthy
- Kafka Message stream (if enabled) is unbroken

## Details

- Causes (forced/graceful) pod failure of specific/random Kafka broker pods
- Tests deployment sanity (replica availability & uninterrupted service) and recovery workflows of the Kafka cluster
- Tests unbroken message stream when `KAFKA_LIVENESS_STREAM` experiment environment variable is set to `enabled`

## Integrations

- Pod failures can be effected using one of these chaos libraries: `litmus`, `powerfulseal`
- The desired chaos library can be selected by setting one of the above options as value for the environment variable `LIB`

## Steps to Execute the Chaos Experiment

- This Chaos Experiment can be triggered by creating a ChaosEngine resource on the cluster.
  To understand the values to provide in a ChaosEngine specification, refer [Getting Started](getstarted.md/#prepare-chaosengine)

- Follow the steps in the sections below to create the chaosServiceAccount, prepare the ChaosEngine & execute the experiment.

### Prepare chaosServiceAccount

- Use this sample RBAC manifest to create a chaosServiceAccount in the desired (app) namespace. This example consists of the minimum necessary role permissions to execute the experiment.

#### Sample Rbac Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/kafka/kafka-broker-pod-failure/rbac.yaml yaml"

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kafka-broker-pod-failure-sa
  namespace: default
  labels:
    name: kafka-broker-pod-failure-sa
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: kafka-broker-pod-failure-sa
  labels:
    name: kafka-broker-pod-failure-sa
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "deployments",
        "pods/log",
        "events",
        "jobs",
        "pods/exec",
        "statefulsets",
        "configmaps",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "delete"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kafka-broker-pod-failure-sa
  labels:
    name: kafka-broker-pod-failure-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kafka-broker-pod-failure-sa
subjects:
  - kind: ServiceAccount
    name: kafka-broker-pod-failure-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the experiment tunables. While many tunables have default values specified in the ChaosExperiment CR, some need to be explicitly supplied in `experiments.spec.components.env`.
- To understand the values to provided in a ChaosEngine specification, refer [ChaosEngine Concepts](chaosengine-concepts.md)

#### Supported Experiment Tunables

<table>
  <tr>
    <th> Parameter </th>
    <th> Description  </th>
    <th> Specify In ChaosEngine </th>
    <th> Notes </th>
  </tr>
  <tr>
    <td> KAFKA_NAMESPACE </td>
    <td> Namespace of Kafka Brokers </td>
    <td> Mandatory </td>
    <td> May be same as value for `spec.appinfo.appns` </td>
  </tr>
  <tr>
    <td> KAFKA_LABEL </td>
    <td> Unique label of Kafka Brokers </td>
    <td> Mandatory </td>
    <td> May be same as value for `spec.appinfo.applabel` </td>
  </tr>
  <tr>
    <td> KAFKA_SERVICE </td>
    <td> Headless service of the Kafka Statefulset </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> KAFKA_PORT </td>
    <td> Port of the Kafka ClusterIP service </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> ZOOKEEPER_NAMESPACE </td>
    <td> Namespace of Zookeeper Cluster </td>
    <td> Mandatory </td>
    <td> May be same as value for KAFKA_NAMESPACE or other </td>
  </tr>
  <tr>
    <td> ZOOKEEPER_LABEL </td>
    <td> Unique label of Zokeeper statefulset </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> ZOOKEEPER_SERVICE </td>
    <td> Headless service of the Zookeeper Statefulset </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> ZOOKEEPER_PORT </td>
    <td> Port of the Zookeeper ClusterIP service </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> KAFKA_BROKER </td>
    <td> Kafka broker pod (name) to be deleted </td>
    <td> Optional </td>
    <td> A target selection mode (random/liveness-based/specific) </td>
  </tr>
  <tr>
    <td> KAFKA_KIND </td>
    <td> Kafka deployment type </td>
    <td> Optional </td>
    <td> Same as `spec.appinfo.appkind`. Supported: `statefulset` </td>
  </tr>
  <tr>
    <td> KAFKA_LIVENESS_STREAM </td>
    <td> Kafka liveness message stream </td>
    <td> Optional </td>
    <td> Supported: `enabled`, `disabled` </td>
  </tr>
  <tr>
    <td> KAFKA_LIVENESS_IMAGE </td>
    <td> Image used for liveness message stream </td>
    <td> Optional </td>
    <td> Image as `&lt;registry_url&gt;/&lt;repository&gt;/&lt;image&gt;:&lt;tag&gt;` </td>
  </tr>
  <tr>
    <td> KAFKA_REPLICATION_FACTOR </td>
    <td> Number of partition replicas for liveness topic partition </td>
    <td> Optional </td>
    <td> Necessary if KAFKA_LIVENESS_STREAM is `enabled` </td>
  </tr>
  <tr>
    <td> KAFKA_INSTANCE_NAME </td>
    <td> Name of the Kafka chroot path on zookeeper </td>
    <td> Optional </td>
    <td> Necessary if installation involves use of such path </td>
  </tr>
  <tr>
    <td> KAFKA_CONSUMER_TIMEOUT </td>
    <td> Kafka consumer message timeout, post which it terminates </td>
    <td> Optional </td>
    <td> Defaults to 30000ms, Recommended timeout for EKS platform: 60000 ms </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Defaults to 15s </td>
  </tr>
  <tr>
    <td> CHAOS_INTERVAL </td>
    <td> Time interval b/w two successive broker failures (sec) </td>
    <td> Optional </td>
    <td> Defaults to 5s </td>
  </tr>
  <tr>
    <td> KILL_COUNT </td>
    <td> No. of application pods to be deleted </td>
    <td> Optional  </td>
    <td> Default to `1`, kill_count > 1 is only supported by litmus lib , not by the powerfulseal </td>
  </tr>
  <tr>
    <td> LIB </td>
    <td> The chaos lib used to inject the chaos </td>
    <td> Optional </td>
    <td> Defaults to `litmus`. Supported: `litmus`, `powerfulseal </td>
  </tr>
</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/master/charts/kafka/kafka-broker-pod-failure/engine.yaml yaml"

```yaml
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: kafka-chaos
  namespace: default
spec:
  # It can be true/false
  annotationCheck: "true"
  # It can be active/stop
  engineState: "active"
  #ex. values: ns1:name=percona,ns2:run=nginx
  auxiliaryAppInfo: ""
  appinfo:
    appns: "default"
    applabel: "app=cp-kafka"
    appkind: "statefulset"
  chaosServiceAccount: kafka-broker-pod-failure-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: kafka-broker-pod-failure
      spec:
        components:
          env:
            # choose based on available kafka broker replicas
            - name: KAFKA_REPLICATION_FACTOR
              value: "3"

            # get via 'kubectl get pods --show-labels -n <kafka-namespace>'
            - name: KAFKA_LABEL
              value: "app=cp-kafka"

            - name: KAFKA_NAMESPACE
              value: "default"

            # get via 'kubectl get svc -n <kafka-namespace>'
            - name: KAFKA_SERVICE
              value: "kafka-cp-kafka-headless"

            # get via 'kubectl get svc -n <kafka-namespace>'
            - name: KAFKA_PORT
              value: "9092"

            # Recommended timeout for EKS platform: 60000 ms
            - name: KAFKA_CONSUMER_TIMEOUT
              value: "30000" # in milliseconds

            # ensure to set the instance name if using KUDO operator
            - name: KAFKA_INSTANCE_NAME
              value: ""

            - name: ZOOKEEPER_NAMESPACE
              value: "default"

            # get via 'kubectl get pods --show-labels -n <zk-namespace>'
            - name: ZOOKEEPER_LABEL
              value: "app=cp-zookeeper"

            # get via 'kubectl get svc -n <zk-namespace>
            - name: ZOOKEEPER_SERVICE
              value: "kafka-cp-zookeeper-headless"

            # get via 'kubectl get svc -n <zk-namespace>
            - name: ZOOKEEPER_PORT
              value: "2181"

            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "60"

            # set chaos interval (in sec) as desired
            - name: CHAOS_INTERVAL
              value: "20"

            # pod failures without '--force' & default terminationGracePeriodSeconds
            - name: FORCE
              value: "false"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

### Watch Chaos progress

- View pod terminations & recovery by setting up a watch on the pods in the Kafka namespace

  `watch -n 1 kubectl get pods -n <kafka-namespace>`

### Check Chaos Experiment Result

- Check whether the kafka deployment is resilient to the broker pod failure, once the experiment (job) is completed.
  The ChaosResult resource name is derived like this: `<ChaosEngine-Name>-<ChaosExperiment-Name>`.

  `kubectl describe chaosresult kafka-chaos-kafka-broker-pod-failure -n <kafka-namespace>`

## Kafka Broker Pod Failure Demo

- TODO: A sample recording of this experiment execution is provided here.

---
