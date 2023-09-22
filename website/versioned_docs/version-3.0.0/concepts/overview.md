---
id: overview
title: Overview
sidebar_label: Overview
---

---

The Concepts section contains Definitions, Design principles, Terminology and Working technical theory. This section will not have the actual usage instructions or guides those will be made available in the [User Guides](../user-guides/overview.md) section.

### [Chaos Fault](chaos-experiment.md)

ChaosExperiment CR is the heart of litmus and contains the low-level execution information.

### [Probes](probes.md)

Probes are pluggable checks that can be defined within the ChaosEngine for any Chaos Fault.

### [ChaosEngine](chaos-engine.md)

The ChaosEngine CR is the main user-facing chaos custom resource with a namespace scope and is designed to hold information around how the chaos faults are executed.

### [ChaosResult](chaos-result.md)

ChaosResult resource holds the results of a Chaos Fault with a namespace scope.

### [ChaosHub](chaoshub.md)

ChaosHub allows you to orchestrate chaos experiments from the Public **[ChaosHub](http://hub.litmuschaos.io/)** or an alternate source for the Faults.

### [Chaos Experiment](chaos-workflow.md)

Chaos Experiment is a set of different operations coupled together to achieve desired chaos impact on a Kubernetes Cluster.

### [Environment](environments.md)

An environment represents where you are installing your Chaos Infrastructure acts as an additional level of abstraction for the same.

### [User Management](user-management.md)

Role Privileges of different users in the ChaosCenter.

### [Projects](projects.md)

Project management system which can be used for working on chaos experiment with multiple different projects across different chaos infrastructures.

### [Teaming](probes.md)

Teaming feature to facilitate collaboration between users using project level role access.

### [GitOps](gitops.md)

GitOps feature in Litmus enables you to configure a single source of truth for your chaos experiments and faults.
