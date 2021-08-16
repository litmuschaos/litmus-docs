---
id: features
title: Why should you choose Litmus?
sidebar_label: Features
---

---

The goal of the LitmusChaos project is to create a complete solution to implement chaos engineering at scale, the Kubernetes way! Of course, this had to be done incrementally by first creating a toolset for chaos injection and then adding additional features to make it a platform. Litmus 1.x achieved the goal of keeping it completely open-source, creating a [ChaosHub](../concepts/chaoshub.md) and the required CRDs, Operators, and Schedulers. With Litmus 1.x, users have a working chaos engineering toolset aligned with the original goals.

Over time, with the monthly cadence releases and community engagement, we have added a lot of features and made LitmusChaos much easier for the end-users. With the launch of Litmus 2.0, a new way of chaos engineering can be performed by the users, a few high-level features are mentioned [below](features.md#advantages-of-litmus-20), however a detailed list can be found on the [release page](https://github.com/litmuschaos/litmus/releases).

## Advantages of Litmus 2.0

A high-level feature overview of Litmus 2.0 are as follows

- The Addition of [Chaos Workflow](../concepts/chaos-workflow.md) creation, Chaos experiments become building blocks of a Chaos Workflow, to allow users to create a larger chaos scenario using sequential or parallel experiment executions.
- Addition of [ChaosCenter](../getting-started/resources.md#chaoscenter) where you can take advantage of all these features and a lot more
  - Workflow Creation
    <span style={{color: '#696F8C'}}>
    <ul>
    <li>From Templates, Custom Workflows from Scratch (using ChaosHubs), From pre-created YAMLs</li>
    <li>Chaos Experiments Sequence Control (Parallel as well as Sequential steps creation)</li>
    <li>Creation of either Singular or Cron Workflows as Schedules</li>
    <li>Attaching priority to Chaos Experiments based on your use cases</li>
    </ul>
    </span>
  - Users & Teams
    <span style={{color: '#696F8C'}}>
    <ul>
    <li>Creation of <a href="../concepts/user-management">Users</a> with Role Based Access Control</li>
    <li>Creating a <a href="../concepts/teaming" >Team</a> of multiple Users</li>
    <li>Authenticating Users</li>
    </ul>
    </span>
  - Monitoring & Observability
    <span style={{color: '#696F8C'}}>
    <ul>
    <li><a href="../concepts/datasource">Connect a Data Source</a> (from any Agent) and monitor workflows</li>
    <li>Visualize workflow run statistics and aggregated schedules</li>
    <li>Compare two or more Workflows</li>
    <li>Upload shared/downloadable dashboards available in the community</li>
    <li>Edit queries, Tune dashboards to create a custom one from scratch</li>
    <li>Monitor effect of chaos in real time with interleaved events and metrics from Prometheus Datasource</li>
    </ul>
    </span>
  - Workflow Management
    <span style={{color: '#696F8C'}}>
    <ul>
    <li>Rolling out automated changes using <a href="../concepts/gitops" >GitOps</a></li>
    <li>Allowing image addition from custom image server (both public and private)</li>
    <li>Measure and Analyse the Resilience Score of each workflow</li>
    </ul>
    </span>

Litmus itself is composed of microservices. And we made sure that by adding the above features for 2.0, seamlessly integrates the additional microservices in conjunction with the existing one. Litmus 2.0 is completely backwards compatible. No features are deprecated.

The migration path is about constructing new artifacts such as Chaos Workflows that include the current chaos experiments in use by the users.

## Feature Comparison between 1.x and 2.0

Below is a high level comparison between Litmus 1.x and Litmus 2.0 providing a holistic view of the feature additions you get in Litmus 2.0.

| Litmus 1.x           | Litmus 2.0                            |
| -------------------- | ------------------------------------- |
| Experiments          | Chaos Workflows                       |
| Per user             | Teams (Multi Tenant)                  |
| Per cluster          | Per organisation (Cross Cloud)        |
| Only Public ChaosHub | Public and Private ChaosHubs          |
| CLI only             | CLI and GUI                           |
|                      | GitOps                                |
|                      | Scalability                           |
|                      | Integrated and Interleaved monitoring |

## Learn more

- [Run your first workflow in 5 minutes](../getting-started/run-your-first-workflow.md)
- [Install Litmus](../getting-started/installation.md)
- [Visualize Workflows](../concepts/visualize-workflow.md)
- Chaos Schedule
- [Monitoring](../concepts/app-infra-monitoring.md)
- [View the different User Guides](../user-guides/overview.md)
