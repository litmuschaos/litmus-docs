---
id: resources
title: Resources
sidebar_label: Resources
---

---

## ChaosCenter

<span style={{color: '#5B44BA'}}><b>ChaosCenter</b></span> is a single source of truth to control all the functions provided by Litmus. From ChaosCenter, you get the freedom to manage every single part of Litmus and shape your chaos experiments exactly the way you want it.

**ChaosCenter comes pre-packaged** as a part of LitmusChaos installation and can be easily accessed via [Ingress](../user-guides/setup-with-ingress.md), [NodePort](../user-guides/setup-without-ingress.md#with-nodeport) or [LoadBalancer](../user-guides/setup-without-ingress.md#with-loadbalancer). Since Litmus has Cross-Cloud support, you get seamless access to the ChaosCenter irrespectively of where you deploy it.

> [Get a broader view of which Platforms are supported by Litmus](https://github.com/litmuschaos/litmus/tree/master/litmus-portal#platforms-support)

ChaosCenter gives you access to a plethora of features, the major ones include:

- Chaos Experiment Creation
  <span style={{color: '#696F8C'}}>
    <ul>
        <li>From Templates, Custom Chaos Experiments from Scratch (using ChaosHubs), From pre-created YAMLs</li>
        <li>Chaos Experiments Sequence Control (Parallel as well as Sequential steps creation)</li>
        <li>Creation of either Singular or Cron Chaos Experiments as Schedules</li>
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
- Chaos Experiment Management
  <span style={{color: '#696F8C'}}>
    <ul>
        <li>Rolling out automated changes using GitOps</li>
        <li>Allowing image addition from custom image server (both public and private)</li>
        <li>Measure and Analyze the Resilience Score of each chaos scenario</li>
    </ul>
    </span>

## Chaos Infrastructures
<span style={{color: '#5B44BA'}}><b>Chaos infrastructure</b></span> is a service that runs in your target environment and aids Litmus in accessing and injecting chaos to your target environment. There should always be at least one or more than one chaos infrastructure connected to the ChaosCenter.

## Types of Chaos Infrastructures

In Litmus, chaos infrastructures can be classified into two types

- <span style={{color: '#5B44BA'}}><b>Self Chaos Infrastructures</b></span>
- <span style={{color: '#5B44BA'}}><b>External Chaos Infrastructures</b></span>

As part of the Litmus installation, a Self Chaos Infrastructure would be registered as a default Chaos Infrastructure in the ChaosCenter. The same cluster where Litmus is installed is chosen as the Self Chaos Infrastructure by the installer. From the ChaosCenter you can now induce chaos into this Self Chaos Infrastructure and observe the results.

Since the ChaosCenter is Cross Cloud, you can connect multiple External Chaos Infrastructure to the same ChaosCenter with the help of the command line utility [litmusctl](../litmusctl/installation.md). Once connected you can manage, monitor, observe and induce chaos from the ChaosCenter to the respective Chaos Infrastructures.
