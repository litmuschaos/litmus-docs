---
id: gitops
title: Litmus with GitOps
sidebar_label: GitOps
---

## Prerequisites
- [ChaosCenter](chaos-center)
- [ChaosAgent](agent)
- [ChaosWorkflow](chaos-workflow)
- Ensure that you have an active internet connection and a git repository. 

GitOps feature in Litmus enables you to configure a single source of truth for your chaos workflows and experiments, any changes made either to the artifacts stored in the configured git repository or the portal will be synced. This allows you to create and execute workflows directly from git enabling a vast scope of automation in CI/CD pipelines.

## Event-Driven Chaos Injection

Besides the sync feature, GitOps in Litmus provides a way of using Event-Driven Chaos Injection, where target resources(stateful sets, deployments, etc.) can be configured to automatically trigger chaos workflows with any changes in the resource spec. Currently, the event supported for chaos injection is resource image change, configuration change, change in replicas, and many more.
The event-driven chaos injection allows Litmus to be integrated with traditional GitOps flow that involves automated deployment of applications or workloads, for example, you can now automatically trigger chaos workflows whenever a new release is created for your application and is deployed by a continuous delivery system.
GitOps is by default disabled for the projects created in Litmus, but it can be enabled and configured from the `GitOps` tab in `Settings` in ChaosCenter. 

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/7cF3rwcZMcA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [Schedule a workflow](schedule-workflow)
- [Observe a Chaos Workflow](observe-workflow)
