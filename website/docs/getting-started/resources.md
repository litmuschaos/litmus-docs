---
id: resources
title: Resources
sidebar_label: Resources
---

---

## ChaosCenter

The <span style={{color: '#5B44BA'}}>**ChaosCenter**</span> is a single source of truth to control all the different Chaos Activities happening around Litmus. From the ChaosCenter you get the freedom to manage every single part of Litmus and shape your chaos scenarios exactly the way you want it.

**ChaosCenter comes pre-packaged** as a part of LitmusChaos installation and can be easily accessed via [Ingress](../user-guides/setup-with-ingress.md), [NodePort](../user-guides/setup-without-ingress.md#with-nodeport) or [LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer). Since Litmus has Cross-Cloud support, you get seamless access to the ChaosCenter irrespectively of where you deploy it.

> [Get a broader view of which Platforms are supported by Litmus](https://github.com/litmuschaos/litmus/tree/master/litmus-portal#platforms-support)

The ChaosCenter gives you access to a plethora of features, the major ones include

- Chaos Scenario Creation
  <span style={{color: '#696F8C'}}>
    <ul>
        <li>From Templates, Custom Chaos Scenarios from Scratch (using ChaosHubs), From pre-created YAMLs</li>
        <li>Chaos Experiments Sequence Control (Parallel as well as Sequential steps creation)</li>
        <li>Creation of either Singular or Cron Chaos Scenarios as Schedules</li>
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
        <li>Connect a Data Source (from any Chaos Delegate) and monitor chaos scenarios</li>
        <li>Visualize chaos scenario run statistics and aggregated schedules</li>
        <li>Compare two or more Chaos Scenarios</li>
        <li>Upload shared/downloadable dashboards available in the community</li>
        <li>Edit queries, Tune dashboards to create a custom one from scratch</li>
        <li>Monitor effect of chaos in real time with interleaved events and metrics from Prometheus Datasource</li>
    </ul>
    </span>
- Chaos Scenario Management
  <span style={{color: '#696F8C'}}>
    <ul>
        <li>Rolling out automated changes using GitOps</li>
        <li>Allowing image addition from custom image server (both public and private)</li>
        <li>Measure and Analyse the Resilience Score of each chaos scenario</li>
    </ul>
    </span>

## Chaos Delegates

A <span style={{color: '#5B44BA'}}>**Chaos Delegate**</span> in Litmus is nothing but the target cluster where Chaos would be injected via Litmus. There should always be at least one or more than one Chaos Delegates connected to the ChaosCenter. Each individual Chaos Delegate can be chosen to be the Chaos Delegate for Chaos Injection.

## Types of Chaos Delegates

In Litmus, Chaos Delegates can be classified into two types

- <span style={{color: '#5B44BA'}}><b>Self Chaos Delegate</b></span>
- <span style={{color: '#5B44BA'}}><b>External Chaos Delegate</b></span>

As part of the Litmus installation, a Self Chaos Delegate would be registered as a default Chaos Delegate in the ChaosCenter. The same cluster where Litmus is installed is chosen as the Self Chaos Delegate by the installer. From the ChaosCenter you can now induce chaos into this Self Chaos Delegate and observe the results.

Since the ChaosCenter is Cross Cloud, you can connect multiple external Chaos Deleagtes to the same with the help of the command line utility [litmusctl](../litmusctl/installation.md). Once connected you can manage, monitor, observe and induce chaos from the ChaosCenter to the respective Chaos Delegates.
