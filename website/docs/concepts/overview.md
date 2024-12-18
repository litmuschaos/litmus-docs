---
id: overview
title: Overview
sidebar_label: Overview
---

---

The Concepts section contains Definitions, Design principles, Terminology and Working technical theory. This section will not have the actual usage instructions or guides those will be made available in the [User Guides](../user-guides/overview.md) section.

### [Chaos Infrastructure](infrastructure.md)

Chaos infrastructure is a service that runs in your target environment and aids Litmus control plane in accessing and injecting chaos.

### [ChaosHub](chaoshub.md)

ChaosHub allows you to orchestrate chaos experiments from the Public **[ChaosHub](http://hub.litmuschaos.io/)** or an alternate source for the Faults.

### [Chaos Experiment](chaos-workflow.md)

Chaos Experiment is a set of different operations coupled together to achieve desired chaos impact on a Kubernetes Cluster.

### [Resilience Probes](probes.md)

Probes are pluggable checks that can be defined within the ChaosEngine for any Chaos Fault.

### [User Management](user-management.md)

Role Privileges of different users in the ChaosCenter.

### [Projects](projects.md)

Project management system which can be used for working on chaos experiment with multiple different projects across different chaos infrastructures.

### [Teaming](probes.md)

Teaming feature to facilitate collaboration between users using project level role access.

### [GitOps](gitops.md)

GitOps feature in Litmus enables you to configure a single source of truth for your chaos experiments and faults.

### [Authentication in ChaosCenter](oauth-dex-concept.md)

Authentication in ChaosCenter supports both local and OAuth-based authentication through the Authentication Server and Dex OIDC Server, offering enhanced flexibility and secure access management.

### [Visualize Chaos Experiment](visualize-experiment.md)

ChaosCenter enables users to visualize the execution of chaos experiments in real-time, displaying key details like step statuses, logs, and results. This visualization helps in analyzing the impact and resiliency of the experiment, with graphs showing the experiment’s progress and individual node information.

