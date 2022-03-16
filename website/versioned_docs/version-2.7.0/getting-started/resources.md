---
id: resources
title: Resources
sidebar_label: Resources
---

---

## ChaosCenter

The <span style={{color: '#5B44BA'}}>**ChaosCenter**</span> is a single source of truth to control all the different Chaos Activities happening around Litmus. From the ChaosCenter you get the freedom to manage every single part of Litmus and shape your workflows exactly the way you want it.

**ChaosCenter comes pre-packaged** as a part of LitmusChaos installation and can be easily accessed via [Ingress](../user-guides/setup-with-ingress.md), [NodePort](../user-guides/setup-without-ingress.md#with-nodeport) or [LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer). Since Litmus has Cross-Cloud support, you get seamless access to the ChaosCenter irrespectively of where you deploy it.

> [Get a broader view of which Platforms are supported by Litmus](https://github.com/litmuschaos/litmus/tree/master/litmus-portal#platforms-support)

The ChaosCenter gives you access to a plethora of features, the major ones include

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
        <li>Creation of Users with Role Based Access Control</li>
        <li>Creating a Team of multiple Users</li>
        <li>Authenticating Users</li>
    </ul>
    </span>
- Monitoring & Observability
  <span style={{color: '#696F8C'}}>
    <ul>
        <li>Connect a Data Source (from any Agent) and monitor workflows</li>
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
        <li>Rolling out automated changes using GitOps</li>
        <li>Allowing image addition from custom image server (both public and private)</li>
        <li>Measure and Analyse the Resilience Score of each workflow</li>
    </ul>
    </span>

## ChaosAgents

A <span style={{color: '#5B44BA'}}>**ChaosAgent**</span> in Litmus is nothing but the target cluster where Chaos would be injected via Litmus. There should always be at least one or more than one ChaosAgents connected to the ChaosCenter. Each individual ChaosAgent can be chosen to be the Target Agent for Chaos Injection.

## Types of ChaosAgents

In Litmus, ChaosAgents can be classified into two types

- <span style={{color: '#5B44BA'}}><b>Self Agent</b></span>
- <span style={{color: '#5B44BA'}}><b>External Agent</b></span>

As part of the Litmus installation, a Self Agent would be registered as a default Agent in the ChaosCenter. The same cluster where Litmus is installed is chosen as the Self Agent by the installer. From the ChaosCenter you can now induce chaos into this Self Agent and observe the results.

Since the ChaosCenter is Cross Cloud, you can connect multiple external Kubernetes agents to the same with the help of the command line utility [litmusctl](../litmusctl/installation.md). Once connected you can manage, monitor, observe and induce chaos from the ChaosCenter to the respective ChaosAgents.
