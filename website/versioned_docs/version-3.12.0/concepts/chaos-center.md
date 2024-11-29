---
id: chaos-center
title: ChaosCenter
sidebar_label: ChaosCenter
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
