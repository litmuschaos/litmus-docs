---
id: resources
title: Resources
sidebar_label: Resources
---

---

## ChaosCenter
ChaosCenter is a unified pane that controls all the functions provided by Litmus. It can be used for managing the entire lifecycle of the chaos experiments, including all the components within.

ChaosCenter comes pre-packaged as a part of LitmusChaos installation and can be easily accessed via [Ingress](../user-guides/setup-with-ingress.md), [NodePort](../user-guides/setup-without-ingress.md#with-nodeport) or [LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer). Since Litmus has Cross-Cloud support, you get seamless access to the ChaosCenter irrespectively of where you deploy it.

ChaosCenter gives you access to a plethora of features, the major ones include:

- **Chaos experiment creation**
  - From templates, custom experiments from scratch (using ChaosHubs), from pre-created YAMLs
  - Experiments sequence control (parallel as well as sequential steps creation)
  - Creation of either singular or cron experiments as schedules
  - Attaching priority to experiments based on your use cases
- **Users and teams**
  - Creation of users with Role Based Access Control
  - Creating a team of multiple users
  - Authenticating users
- **Chaos experiment management**
  - Rolling out automated changes using GitOps
  - Allowing image addition from custom image server (both public and private)
  - Measure and analyze the Resilience Score of each chaos scenario

## Chaos Infrastructures
Chaos infrastructure is a service that runs in your target environment and aids Litmus in accessing and injecting chaos to your target environment. There should always be at least one or more than one chaos infrastructure connected to the ChaosCenter to execute an experiment.

## Types of Chaos Infrastructures

In Litmus, chaos infrastructures can be classified into two types:

- **Self Chaos Infrastructures:** A Chaos Infrastructure that is connected to the same cluster and namespace where the ChaosCenter is deployed. It can be used to target the workloads executing on that cluster only.

- **External Chaos Infrastructures:** A Chaos Infrastructure that is connected to a remote Kubernetes cluster. ChaosCenter can be operated in a cross-cloud manner, which allows connecting multiple External Chaos Infrastructure to the same ChaosCenter with the help of the [litmusctl](../litmusctl/installation.md) CLI. Once connected you can manage, monitor, observe and induce chaos from the ChaosCenter to the respective External Chaos Infrastructures.
