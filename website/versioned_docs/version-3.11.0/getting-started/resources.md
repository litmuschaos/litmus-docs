---
id: resources
title: Resources
sidebar_label: Resources
---

---

## ChaosCenter
ChaosCenter is a unified pane that controls all the functions Litmus provides. You can use ChaosCenter to manage the entire lifecycle of the chaos experiments, including the components within.

ChaosCenter comes pre-packaged as a part of LitmusChaos installation and you can easily access it via [ingress](../user-guides/setup-with-ingress.md), [NodePort](../user-guides/setup-without-ingress.md#with-nodeport) or [LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer). Since Litmus has cross-cloud support, you get seamless access to the ChaosCenter regardless of where you deploy it.

ChaosCenter gives you a plethora of features, that include:

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

## Chaos Infrastructure
Chaos infrastructure is a service that runs in your target environment and aids Litmus in accessing and injecting chaos into your target environment. To execute an experiment, you need at least one chaos infrastructure connected to the ChaosCenter.

## Types of Chaos Infrastructure

In Litmus, you can classify chaos infrastructure into two types:

- **Self chaos infrastructure:** A chaos infrastructure that is connected to the same cluster and namespace where the ChaosCenter is deployed. You can use this to target the workloads executing on that cluster only.

- **External chaos infrastructure:** A chaos infrastructure connected to a remote Kubernetes cluster. You can operate ChaosCenter in a cross-cloud manner, connecting multiple external chaos infrastructures to the same ChaosCenter with the help of the [litmusctl](../litmusctl/installation.md) CLI. Once connected you can manage, monitor, observe, and induce chaos from the ChaosCenter to the respective external chaos infrastructures.