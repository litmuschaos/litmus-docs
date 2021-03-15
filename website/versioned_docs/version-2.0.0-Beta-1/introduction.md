---
id: introduction
title: Litmus Introduction
sidebar_label: Overview
---

---

Welcome to **Litmus documentation**. Here you find everything you need for creating and running chaos workflows on and around Kubernetes.

<img src={require('./assets/litmus-overview.png').default} width="800" />

Service downtimes are always expensive, and they are very difficult to predict and respond to. At the same time, it continues to be a challenge for IT teams to certify if a given change is not going to break the services that are functioning well, and with the modern cloud-native micro services evolution, the change has become more dynamic. Especially in the cloud-native ecosystem, Chaos Engineering is increasingly becoming the go-to solution to resolve the issue of asserting the resilience of a service or application at any stage of rolling out the change.

Litmus is a complete framework to practice chaos engineering in a cloud-native way. Litmus helps both Developers and SREs in automating the chaos experiments at different stages of DevOps such as during development, in CI pipelines, during CD and in production. A chaos experiment is a fundamental unit in Litmus architecture. Users use readily available chaos experiments or create new experiments to construct a required chaos workflow. A chaos workflow is much more than a simple chaos experiment, it provides support to the user in terms of defining the expected result, observing the result, analysing the overall system behaviour and finally in making a decision if the system has to be tuned for increasing the resilience.

Litmus provides necessary infrastructure to develop, use and manage chaos workflows for a typical development or operations team. Teaming and GitOps features of Litmus help greatly to collaborate the chaos workflows management within the teams or software organisations.

## Litmus 2.0 Prologue

The goal of Litmus project is to create a complete platform to practice chaos engineering at scale in a Kubernetes way. Of course this had to be done incrementally, first create a toolset for chaos injection and then add additional features to make it a platform. Litmus 1.x achieved the goal of keeping it completely open source, creating a ChaosHub and creating the required CRDs, Operators and Schedulers. With Litmus 1.x, users have a working chaos engineering toolset aligned with the original goals. Over time, the monthly cadence releases added the following features.

- Chaos experiments become building blocks of a ChaosWorkflow, to allow users to create a larger chaos scenarios.

- A portal to centrally visualize the chaos workflows, get chaos analytics, get the teaming in place for collaboration of chaos workflows.

- Chaos GitOps for highly scalable automation of chaos workflows. Chaos can now be triggered as a result of a change to an application. This integrates with other CD tools like ArgoCD and FluxCD

- Chaos Interleaved dashboards. A step toward open observability that is interleaved with chaos incident details.

  _Note:_ Litmus itself is composed of microservices. For 2.0, more microservices are added and the the existing ones will continue to work. Litmus 2.0 is completely backward compatible. No features are deprecated. Migration path is about constructing new artifacts such as ChaosWorkflows that include the current chaos experiments in use by the users.

A high level comparison between Litmus 1.x and Litmus 2.0 providing a holistic view of the feature addition you get in Litmus 2.0.

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
