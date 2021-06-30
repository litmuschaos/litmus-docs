---
id: introduction
title: Litmus Introduction
sidebar_label: Overview
---

---

Welcome to the documentation for the **LitmusChaos** project. Litmus is used by devs & SREs alike to create, manage and monitor chaos workflows by extending Kubernetes itself. Find everything that you need for creating and running chaos workflows on and around Kubernetes.

<img src={require('./assets/litmus-overview.png').default} width="800" />

Service downtimes are always expensive and they are very difficult to predict and respond to. Certifying if a given change is going to break the services that are functioning well has become increasingly challenging for IT teams. What's more? With the evolution of modern cloud-native micro services these changes have become more dynamic. In such an atmosphere, Chaos Engineering is increasingly becoming the go-to solution within cloud-native ecosystems for asserting the resilience of a service or application at any stage of rolling out changes.

LitmusChaos is a complete framework to implement chaos engineering within a cloud-native ecosystem. It helps both Developers and SREs automate the chaos experiments at different stages within the DevOps pipeline like development, during CI/CD, & in production.

- What is a Chaos Experiment?

Chaos Experiments are fundamental units within the LitmusChaos architecture. Users can choose between readily available chaos experiments or create new ones to construct a required chaos workflow.

- What is a Chaos Workflow?

A chaos workflow is much more than a simple chaos experiment. It supports the user in defining the expected result, observing the result, analysing the overall system behaviour, and in the decision-making process if the system needs to be tuned for improving the resilience.
LitmusChaos provides necessary infrastructure to develop, use, and manage chaos workflows for a typical development or operations team. Teaming and GitOps features of Litmus help greatly to collaborate the chaos workflows management within the teams or software organisations.

### Litmus 2.0 Prologue {#litmus-20-prologue}

The goal of the LitmusChaos project is to create a complete solution to implement chaos engineering at scale, the Kubernetes way! Of course this had to be done incrementally by first creating a toolset for chaos injection and then adding additional features to make it a platform. Litmus 1.x achieved the goal of keeping it completely open source, creating a ChaosHub and the required CRDs, Operators, and Schedulers. With Litmus 1.x, users have a working chaos engineering toolset aligned with the original goals. Over time, the monthly cadence releases added the following features.

- Chaos experiments become building blocks of a ChaosWorkflow, to allow users to create larger chaos scenarios.

- A portal to centrally visualize the chaos workflows, get chaos analytics, get the teaming in place for collaborating on chaos workflows.

- Chaos GitOps for highly scalable automation of chaos workflows. Chaos can now be triggered as a result of a change to an application. This integrates with other CD tools like ArgoCD and FluxCD

- Chaos Interleaved dashboards. A step toward open observability that is interleaved with chaos incident details.

  _Note:_ Litmus itself is composed of microservices. For 2.0, more microservices have been added and the existing ones will continue to work. Litmus 2.0 is completely backward compatible. No features are deprecated. Migration path is about constructing new artifacts such as ChaosWorkflows that include the current chaos experiments in use by the users.

Below is a high level comparison between Litmus 1.x and Litmus 2.0 providing a holistic view of the feature additions you get in Litmus 2.0.

| Litmus 1.x            | Litmus 2.0                            |
| --------------------- | ------------------------------------- |
| Experiments           | Chaos Workflows                       |
| Per user              | Teams (Multi Tenant)                  |
| Per cluster           | Per organisation (Cross Cloud)        |
| Only Public Chaos hub | Public and Private Chaos Hubs         |
| CLI only              | CLI and GUI                           |
|                       | GitOps                                |
|                       | Scalability                           |
|                       | Integrated and Interleaved monitoring |

## Litmus quick access links

### [Litmus features](gitops)

### [Access Litmus API](https://litmuschaos.github.io/litmus/api.html)
