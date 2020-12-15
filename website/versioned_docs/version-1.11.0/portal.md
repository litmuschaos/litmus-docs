---
id: portal
title: Litmus Portal
sidebar_label: Litmus Portal (beta-0)
original_id: portal
---

---

import useBaseUrl from '@docusaurus/useBaseUrl';

## What is the Litmus Portal

It is a centralized web portal for creating, scheduling, and monitoring [Chaos Workflows](https://docs.litmuschaos.io/docs/chaos-workflows/).
The Litmus Portal simplifies the chaos engineering experience for users by providing multiple features, some of which are listed below. It is
in the `beta-0` phase as of the 1.11.0 release & is undergoing active [development](https://github.com/litmuschaos/litmus/tree/master/litmus-portal).

- Ability to launch and manage chaos across Kubernetes clusters (connected as "targets" to the portal)
- Basic authentication with support for organization teaming to collaborate on experiments
- Wizard to construct workflows by selecting, tuning and ordering experiments from the public [ChaosHub](https://hub.litmuschaos.io) or an alternate
  ChaosExperiment source (structured similarly, i.e., essentially a [fork](https://github.com/litmuschaos/chaos-charts) of the public source with custom experiments)
- Assignment of weights for chaos experiments in a workflow and derivation of Resilience Score for each workflow run
- Support for repeated execution via workflow schedule
- Chaos workflow visualization with on-demand log-lookup for individual chaos pods/resources
- Dashboards to view chaos workflow status & history
- Analytics to compare resilience scores across workflow runs based on custom timelines

The portal also allows execution of "predefined chaos workflows" that can be uploaded on-demand to aid more customization, especially in the cases where the workflows
involve other Kubernetes actions (such as load generation) apart from chaos experiments.

Refer to the Litmus Portal [User Guide](https://docs.google.com/document/d/1fiN25BrZpvqg0UkBCuqQBE7Mx8BwDGC8ss2j2oXkZNA/edit#) to get started with the installation and usage.

<img src={require('./assets/portal-arch.jpg').default} width="800" />
