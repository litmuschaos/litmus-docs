---
id: kafka-broker-disk-failure
title: Kafka Broker Disk Failure Experiment Details
sidebar_label: Broker Disk Failure
original_id: kafka-broker-disk-failure
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
    <td> Fail kafka broker disk/storage </td>
    <td> Confluent, Kudo-Kafka </td>
    <td> GKE </td>
  </tr>
</table>

## Prerequisites

- Ensure that the Litmus Chaos Operator is running by executing `kubectl get pods` in operator namespace (typically, `litmus`). If not, install from [here](https://docs.litmuschaos.io/docs/getstarted/#install-litmus)
- Ensure that Kafka & Zookeeper are deployed as Statefulsets
- If Confluent/Kudo Operators have been used to deploy Kafka, note the instance name, which will be
  used as the value of `KAFKA_INSTANCE_NAME` experiment environment variable

  - In case of Confluent, specified by the `--name` flag
  - In case of Kudo, specified by the `--instance` flag

  Zookeeper uses this to construct a path in which kafka cluster data is stored.

- Ensure that the kafka-broker-disk failure experiment resource is available in the cluster by executing `kubectl get chaosexperiments` in the desired namespace. If not, install from [here](https://hub.litmuschaos.io/api/chaos/1.11.0?file=charts/kafka/kafka-broker-disk-failure/experiment.yaml)

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

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/kafka/kafka-broker-disk-failure/rbac.yaml yaml"

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kafka-broker-disk-failure-sa
  namespace: default
  labels:
    name: kafka-broker-disk-failure-sa
    app.kubernetes.io/part-of: litmus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kafka-broker-disk-failure-sa
  labels:
    name: kafka-broker-disk-failure-sa
    app.kubernetes.io/part-of: litmus
rules:
  - apiGroups: ["", "litmuschaos.io", "batch", "apps"]
    resources:
      [
        "pods",
        "jobs",
        "pods/log",
        "events",
        "pods/exec",
        "statefulsets",
        "secrets",
        "chaosengines",
        "chaosexperiments",
        "chaosresults",
      ]
    verbs: ["create", "list", "get", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kafka-broker-disk-failure-sa
  labels:
    name: kafka-broker-disk-failure-sa
    app.kubernetes.io/part-of: litmus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kafka-broker-disk-failure-sa
subjects:
  - kind: ServiceAccount
    name: kafka-broker-disk-failure-sa
    namespace: default
```

### Prepare ChaosEngine

- Provide the application info in `spec.appinfo`
- Provide the experiment tunables. While many tunables have default values specified in the ChaosExperiment CR, some need to be explicitly supplied in `experiments.spec.components.env`
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
    <td> CLOUD_PLATFORM </td>
    <td> Cloud platform type on which to inject disk loss </td>
    <td> Mandatory </td>
    <td> Supported platforms: GKE </td>
  </tr>
  <tr>
    <td> PROJECT_ID </td>
    <td> GCP Project ID in which the Cluster is created </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> DISK_NAME </td>
    <td> GCloud Disk attached to the Cluster Node where specified broker is scheduled </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> ZONE_NAME </td>
    <td> Zone in which the Disks/Cluster are created </td>
    <td> Mandatory </td>
    <td>  </td>
  </tr>
  <tr>
    <td> KAFKA_BROKER </td>
    <td> Kafka broker pod which is using the specified disk </td>
    <td> Mandatory </td>
    <td> Experiment verifies this by mapping node details </td>
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
    <td> Defaults to 30000ms </td>
  </tr>
  <tr>
    <td> TOTAL_CHAOS_DURATION </td>
    <td> The time duration for chaos insertion (seconds) </td>
    <td> Optional </td>
    <td> Defaults to 15s </td>
  </tr>
  <tr>
    <td> INSTANCE_ID </td>
    <td> A user-defined string that holds metadata/info about current run/instance of chaos. Ex: 04-05-2020-9-00. This string is appended as suffix in the chaosresult CR name.</td>
    <td> Optional  </td>
    <td> Ensure that the overall length of the chaosresult CR is still &lt; 64 characters </td>
  </tr>

</table>

#### Sample ChaosEngine Manifest

[embedmd]: # "https://raw.githubusercontent.com/litmuschaos/chaos-charts/v1.11.x/charts/kafka/kafka-broker-disk-failure/engine.yaml yaml"

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
  chaosServiceAccount: kafka-broker-disk-failure-sa
  monitoring: false
  # It can be delete/retain
  jobCleanUpPolicy: "delete"
  experiments:
    - name: kafka-broker-disk-failure
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

            # in milliseconds
            - name: KAFKA_CONSUMER_TIMEOUT
              value: "70000"

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

            # get from google cloud console or 'gcloud projects list'
            - name: PROJECT_ID
              value: "argon-tractor-237811"

            # attached to (in use by) node where 'kafka-0' is scheduled
            - name: DISK_NAME
              value: "disk-1"

            - name: ZONE_NAME
              value: "us-central1-a"

            # Uses 'disk-1' attached to the node on which it is scheduled
            - name: KAFKA_BROKER
              value: "kafka-0"

            # set chaos duration (in sec) as desired
            - name: TOTAL_CHAOS_DURATION
              value: "60"
```

### Create the ChaosEngine Resource

- Create the ChaosEngine manifest prepared in the previous step to trigger the Chaos.

  `kubectl apply -f chaosengine.yml`

- If the chaos experiment is not executed, refer to the [troubleshooting](https://docs.litmuschaos.io/docs/faq-troubleshooting/)
  section to identify the root cause and fix the issues.

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
