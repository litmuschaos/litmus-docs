---
id: features
title: Why should you choose Litmus?
sidebar_label: Features
---

---

The goal of the LitmusChaos project is to create a complete solution to implement chaos engineering at scale, the Kubernetes way! Of course, this had to be done incrementally by first creating a toolset for chaos injection and then adding additional features to make it a platform. Litmus 1.x achieved the goal of keeping it completely open-source, creating a [ChaosHub](../concepts/chaoshub.md) and the required CRDs, Operators, and Schedulers. With Litmus 1.x, users have a working chaos engineering toolset aligned with the original goals.

Over time, with the monthly cadence releases and community engagement, we have added a lot of features and made LitmusChaos much easier for the end-users. With the launch of Litmus 2.0, a new way of chaos engineering can be performed by the users, a few high-level features are mentioned [below](features.md#advantages-of-litmus-20), however a detailed list can be found on the [release page](https://github.com/litmuschaos/litmus/releases).

LitmusChaos 3.0 brings a significant overhaul to its user experience, adopting a more streamlined UI for a simplified and user-friendly experience. It introduces Environments enabling users to efficiently organize their chaos infrastructures. The new Chaos Studio simplifies the process of fine-tuning chaos experiments, enhancing user capabilities. Additionally, it includes support for Resilience Probes for simplifying the management of Litmus probes. Finally, it extends compatibility to Mongo Replicas, which can be easily installed via Helm with Bitnami Mongo.

## Advantages of Litmus 3.0

Here's a summary of the major highlights of LitmusChaos 3.0:
- **Redefined User Experience**
  - Complete transformation of the user interface (UI) for a sleek and intuitive experience.
  - Leveraging the Harness UIcore library to provide an even smoother user journey.

- **Introduction to Environments**
  - Empowers users to efficiently manage their Chaos Infrastructures.
  - Helps categorize and compartmentalize chaos experiments for better organization and collaboration.

- **Chaos Studio**
  - Simplifies the adjustment of chaos parameters and configurations.
  - Eliminates complex setup procedures, making chaos engineering more accessible to all users.
  - Streamlines the process of fine-tuning chaos experiments.

- **Resilience Probes**
  - Resilience probes now support a plug-and-play architecture.
  - Users can create probes once and utilize them repeatedly across various experiments.
  - Comprehensive support for steady-state validation enhances system resilience.
  - Helps users assess the robustness of their applications more effectively.

- **MongoDB High Availability Support**
  - Users can now install MongoDB Replicas via Helm using Bitnami Mongo.
  - Seamless integration of chaos engineering into MongoDB infrastructure.
  - Uncover weaknesses and improve the overall reliability of MongoDB setups.

- **Terminology Changes**
  - A refinement of terminology for improved clarity and consistency.
  - **Chaos Agents/Delegates** are now referred to as **Chaos Infrastructures**.
  - **Chaos Scenarios/Workflows** have been simplified to **Chaos Experiments**.
  - **Chaos Experiments** are now called **Chaos Faults**.

- **API Refactoring and Enhanced Code Architecture**
  - Under-the-hood refactors and improvements in code architecture.
  - Addition of backend unit tests to enhance code reliability.
  - These technical enhancements make it easier for developers to contribute to the LitmusChaos ecosystem.
  - Improved code quality and maintainability for the project.

Litmus itself is composed of microservices. And we made sure that by adding the above features for 3.0, seamlessly integrates the additional microservices in conjunction with the existing one. Litmus 3.0 is completely backwards compatible. No features are deprecated.

The migration path is about constructing new artifacts such as Chaos Experiments that include the current chaos experiments in use by the users.

## Feature revision across Litmus 1.x, 2.x and 3.0

Litmus 3.0 culminates as well as enhances the features rolled-out through Litmus 1.x and 2.x. Below is a bird's eye view of all the enhancements made through the three major releases:

| Litmus 1.x           | Litmus 2.x                            | Litmus 3.0                 |
| -------------------- | ------------------------------------- | -------------------------- |
| Experiments          | Chaos Experiments                     | Revamped and simplified UX |
| Per user             | Teams (Multi Tenant)                  | Environments               |
| Per cluster          | Per organisation (Cross Cloud)        | Chaos Studio               |
| Only Public ChaosHub | Public and Private ChaosHubs          | Resilience probes          |
| CLI only             | CLI and GUI                           | Mongo DB Replicas          |
|                      | GitOps                                | Refactored APIs            |
|                      | Scalability                           |                            |
|                      | Integrated and Interleaved monitoring |                            |

## Learn more
- [Install Litmus](../getting-started/installation.md)
- [Visualize Chaos Experiments](../concepts/visualize-experiment.md)
- Chaos Schedule
- [View the different User Guides](../user-guides/overview.md)
