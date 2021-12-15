---
id: gitops
title: Litmus with GitOps
sidebar_label: GitOps
---

---

## Prerequisites

- ChaosAgent
- [ChaosWorkflow](chaos-workflow.md)

GitOps feature in Litmus enables you to configure a single source of truth for your chaos workflows and experiments, any changes made either to the artifacts stored in the configured git repository or the portal will be synced. This allows you to create and execute workflows directly from git enabling a vast scope of automation in CI/CD pipelines.

## Event-Driven Chaos Injection

Besides the sync feature, GitOps in Litmus provides a way of using Event-Driven Chaos Injection, where target resources(stateful sets, deployments, etc.) can be configured to automatically trigger chaos workflows with any changes in the resource spec. Currently, the event supported for chaos injection is resource image change, configuration change, change in replicas, and many more.
The event-driven chaos injection allows Litmus to be integrated with traditional GitOps flow that involves automated deployment of applications or workloads, for example, you can now automatically trigger chaos workflows whenever a new release is created for your application and is deployed by a continuous delivery system.<br/><br/>

<img src={require('../assets/concepts/gitops/litmus-components.png').default} width="800" /><br/><br/>

In Litmus, there are two components, the external cluster(blue cluster) which is the target agent and can be more than one, other is the self-agent where the Litmus(red cluster) is installed. After an agent is connected to Litmus, an event-tracker pod will be installed which is responsible for event-driven chaos injection by tracking the changes in your target application.

> Event tracker is a policy-driven Kubernetes controller, where one can define N number of policies. It can track updates to statefulset, deployment, daemonset and it notifies the graphql server regarding the updates.<br/><br/>

<img src={require('../assets/concepts/gitops/architecture.png').default} width="800" /><br/><br/>

In the above architecture, the Event-tracker pod tracks the Web App continuously, if any change occurs (for eg: App version changes from V1 to V2), it gets triggered and informs the graphql-server pod, the server will then try to look for the chaos-workflow using `workflow_id` from the git repository. Once it gets the required workflow, it will send it to the subscriber which is responsible for applying the workflow into the target cluster. After the workflow run is completed you can check the resiliency of your application.

The event-tracker is not tracking all the applications, you need to annotate the particular application:

- `litmuschaos.io/gitops=true` , to enable the GitOps.
- `litmuschaos.io/workflow="WORKFLOW-ID"`, where `WORKFLOW-ID` is chaos workflow identity which will be subscribed by the target application deployment and it is present in the workflow label.

GitOps is by default disabled for the projects created in Litmus, but it can be enabled and configured from the `GitOps` tab in `Settings` in ChaosCenter.

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/7cF3rwcZMcA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/><br/>
<iframe width="560" height="315" src="https://www.youtube.com/embed/uIVrNH2_nVI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [Configuring GitOps](../user-guides/gitops-configuration.md)
- [Schedule a workflow](../user-guides/schedule-workflow.md)
- [Observe a Chaos Workflow](../user-guides/observe-workflow.md)
