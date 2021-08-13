---
id: chaoshub
title: Using and contributing to ChaosHub
sidebar_label: ChaosHub
original_id: chaoshub
---

---

**Important links**

ChaosHub is maintained at https://hub.litmuschaos.io

To contribute new ChaosCharts visit: https://github.com/litmuschaos/chaos-charts

**Introduction**

Litmus chaos hub is a place where the Chaos Engineering community members publish their chaos experiments. A set of related chaos experiments are bundled into a `Chaos Chart`. Chaos Charts are classified into the following categories.

- [Generic Chaos](#generic-chaos)
- [Application Chaos](#application-chaos)
- [Platform Chaos](#platform-chaos)

### Generic Chaos

Chaos actions that apply to generic Kubernetes resources are classified into this category. Following chaos experiments are supported under Generic Chaos Chart

| Experiment name         | Description                                                              | User guide link                                       |
| ----------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| Container Kill          | Kills the container in the application pod                               | [container-kill](container-kill.md)                   |
| Pod Delete              | Deletes the application pod                                              | [pod-delete](pod-delete.md)                           |
| Pod Network Latency     | Injects network latency into the pod                                     | [pod-network-latency](pod-network-latency.md)         |
| Pod Network Loss        | Injects network loss into the pod                                        | [pod-network-loss](pod-network-loss.md)               |
| Node CPU Hog            | Exhaust CPU resources on the Kubernetes Node                             | [node-cpu-hog](node-cpu-hog.md)                       |
| Node Memory Hog         | Exhaust Memory resources on the Kubernetes Node                          | [node-memory-hog](node-memory-hog.md)                 |
| Disk Fill               | Fillup Ephemeral Storage of a Resource                                   | [disk-fill](disk-fill.md)                             |
| Disk Loss               | External disk loss from the node                                         | [disk-loss](disk-loss.md)                             |
| Node Drain              | Drains the node where application pod is scheduled                       | [node-drain](node-drain.md)                           |
| Pod CPU Hog             | Consumes CPU resources on the application container                      | [pod-cpu-hog](pod-cpu-hog.md)                         |
| Pod Memory Hog          | Consumes Memory resources on the application container                   | [pod-memory-hog](pod-memory-hog.md)                   |
| Pod Network Corruption  | Injects Network Packet Corruption into Application Pod                   | [pod-network-corruption](pod-network-corruption.md)   |
| Kubelet Service Kill    | Kills the kubelet service on the application node                        | [kubelet-service-kill](kubelet-service-kill.md)       |
| Docker Service Kill     | Kills the docker service on the application node                         | [docker-service-kill](docker-service-kill.md)         |
| Node Taint              | Taints the node where application pod is scheduled                       | [node-taint](node-taint.md)                           |
| Pod Autoscaler          | Scales the application replicas and test the node autoscaling on cluster | [pod-autoscaler](pod-autoscaler.md)                   |
| Pod Network Duplication | Injects Network Packet Duplication into Application Pod                  | [pod-network-duplication](pod-network-duplication.md) |
| Pod IO Stress           | Injects IO stress resources on the application container                 | [pod-io-stress](pod-io-stress.md)                     |
| Node IO stress          | Injects IO stress resources on the application node                      | [node-io-stress](node-io-stress.md)                   |

### Application Chaos

While Chaos Experiments under the Generic category offer the ability to induce chaos into Kubernetes resources, it is difficult to analyze and conclude if the chaos induced found a weakness in a given application. The application specific chaos experiments are built with some checks on _pre-conditions_ and some expected outcomes after the chaos injection. The result of the chaos experiment is determined by matching the outcome with the expected outcome.

<div class="danger">
<strong>NOTE:</strong> If the result of the chaos experiment is `pass`, it means that the application is resilient to that chaos.
</div>

#### Benefits of contributing an application chaos experiment

Application developers write negative tests in their CI pipelines to test the resiliency of the applications. These negative can be converted into Litmus Chaos Experiments and contributed to ChaosHub, so that the users of the application can use them in staging/pre-production/production environments to check the resilience. Application environments vary considerably from where they are tested (CI pipelines) to where they are deployed (Production). Hence, running the same chaos tests in the user's environment will help determine the weaknesses of the deployment and fixing such weaknesses leads to increased resilience.

Following Application Chaos experiments are available on ChaosHub

| Application | Description                                                   | Chaos Experiments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenEBS     | Container Attached Storage for Kubernetes                     | [openebs-pool-pod-failure](openebs-pool-pod-failure.md)<br/>[openebs-pool-container-failure](openebs-pool-container-failure.md)<br/>[openebs-target-pod-failure](openebs-target-pod-failure.md)<br/>[openebs-target-container-failure](openebs-target-container-failure.md)<br/>[openebs-target-network-delay](openebs-target-network-delay.md)<br/>[openebs-target-network-loss](openebs-target-network-loss.md) <br/>[openebs-control-plane-chaos](openebs-control-plane-chaos.md) <br/>[openebs-nfs-provisioner-kill](openebs-nfs-provisioner-kill.md) <br/>[openebs-target-network-loss](openebs-target-network-loss.md) <br/>[openebs-pool-disk-loss](openebs-pool-disk-loss.md) <br/>[openebs-pool-network-loss](openebs-pool-network-loss.md) <br/>[openebs-pool-network-delay](openebs-pool-network-delay.md) |
| Kafka       | Open-source stream processing software                        | [kafka-broker-pod-failure](kafka-broker-pod-failure.md)<br/>[kafka-broker-disk-failure](kafka-broker-disk-failure.md)<br/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| CoreDns     | CoreDNS is a fast and flexible DNS server that chains plugins | [coredns-pod-delete](coredns-pod-delete.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Cassandra   | Cassandra is an opensource distributed database               | [cassandra-pod-delete](cassandra-pod-delete.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### Platform Chaos

Chaos experiments that inject chaos into the platform resources of Kubernetes are classified into this category. Management of platform resources vary significantly from each other, Chaos Charts may be maintained separately for each platform (For example, AWS, GCP, Azure, etc)

Following Platform Chaos experiments are available on ChaosHub

| Platform | Description                                 | Chaos Experiments |
| -------- | ------------------------------------------- | ----------------- |
| AWS      | Amazon Web Services platform. Includes EKS. | None              |
| GCP      | Google Cloud Platform. Includes GKE.        | None              |
| Azure    | Microsoft Azure platform. Includes AKS.     | None              |
