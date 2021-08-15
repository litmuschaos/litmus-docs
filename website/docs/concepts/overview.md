---
id: overview
title: Overview
sidebar_label: Overview
---

---

The Concepts section contains Definitions, Design principles, Terminology and Working technical theory. This section will not have the actual usage instructions or guides those will be made available in the [User Guides](../user-guides/overview) section.

### [Chaos Experiment](chaos-experiment)

ChaosExperiment CR is the heart of litmus and contains the low-level execution information.

### [Probes](probes)

Probes are pluggable checks that can be defined within the ChaosEngine for any Chaos Experiment.

### [ChaosEngine](chaos-engine)

The ChaosEngine CR is the main user-facing chaos custom resource with a namespace scope and is designed to hold information around how the chaos experiments are executed.

### [ChaosResult](chaos-result)

ChaosResult resource holds the results of a ChaosExperiment with a namespace scope.

### [ChaosHub](chaoshub)

ChaosHub allows you to orchestrate workflows from the Public **[ChaosHub](http://hub.litmuschaos.io/)** or an alternate source for the Experiments.

### [Chaos Workflow](chaos-workflow)

Probes are pluggable checks that can be defined within the ChaosEngine for any Chaos Experiment.

### [Observability](workflow-statistics)

Monitoring and observability during and post chaos using built-in Litmus analytics dashboard as well as external observability tools.

### [User Management](user-management)

Role Privileges of different users in the ChaosCenter.

### [Projects](projects)

Project management system which can be used for working on chaos workflows with multiple different projects across different agents.

### [Teaming](probes)

Teaming feature to facilitate collaboration between users using project level role access.

### [GitOps](gitops)

GitOps feature in Litmus enables you to configure a single source of truth for your chaos workflows and experiments.
