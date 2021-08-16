---
id: core-principles
title: Core principles of Litmus
sidebar_label: Core principles
---

---

<img src={require("../assets/introduction/core-principles/litmus-principles.png").default} alt="Core Principles" />

Cloud Native Chaos Engineering, defined as engineering practices focused on (and built on) Kubernetes environments, applications, microservices, and infrastructure follows these core principles -

## Driven by Open Source

Cloud-native software provides the ideal platform for multi-cloud deployments because it is rooted in open-source standards established by the World Wide Web Consortium (W3C). Digital transformation requires real-time, event-driven data collection and the W3C “One Web” vision defines an ideal architecture for any data to run with any app across any W3C-compliant cloud.

This principle focuses on the framework to be completely open-source under the Apache2 License to encourage broader community participation and inspection. The number of applications moving to the Kubernetes platform is limitless. At such a large scale, only the Open Chaos model will thrive and get the required adoption.

## CRDs for Chaos Management

Custom Resource Definition(CRD) is what you use to define a Custom Resource. This is a powerful way to extend Kubernetes capabilities beyond the default installation. These Kubernetes native CRDs defined here should be used as APIs for both Developers and SREs to build and orchestrate chaos testing. The CRDs act as standard APIs to provision and manage the chaos.

## Extensible and Pluggable

One lesson learned why cloud native approaches are winning is that their components can be relatively easily swapped out and new ones introduced as needed. Any standard chaos library or functionality developed by other open-source developers should be able to be integrated into and orchestrated for testing via this pluggable framework.

## Broad Community Adoption

Once we have the APIs, Operator, and plugin framework, we have all the ingredients needed for a common way of injecting chaos. The chaos will be run against a well-known infrastructure like Kubernetes or applications like databases or other infrastructure components like storage or networking. These chaos experiments can be reused, and a broad-based community is useful for identifying and contributing to other high-value scenarios. Hence a Chaos Engineering framework should provide a central hub or forge where open-source chaos experiments are shared, and collaboration via code is enabled.

[Learn more about our community adoption](community.md)

## GitOps for Chaos Management

Use GitOps as an operational framework that takes DevOps best practices used for application development such as version control, collaboration, compliance, and CI/CD, and applies them to infrastructure automation. With the demands made on today’s infrastructure, it has become increasingly crucial to implement infrastructure automation. Modern infrastructure needs to be elastic so that it can effectively manage cloud resources that are needed for continuous deployments.
