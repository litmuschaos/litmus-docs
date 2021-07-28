---
id: chaoscenter
title: ChaosCenter
sidebar_label: ChaosCenter
---

---

The <span style={{color: '#5B44BA'}}>**ChaosCenter**</span> is a single source of truth to control all the different Chaos Activities happening around Litmus. From the ChaosCenter you get the freedom to manage every single part of Litmus and shape your workflows exactly the way you want it.

**ChaosCenter comes pre-packaged** as a part of LitmusChaos installation and can be easily accessed via <span style={{color: '#5B44BA'}}>Ingress, NodePort</span> or <span style={{color: '#5B44BA'}}>LoadBalancer</span>. Since Litmus has Cross-Cloud support, you get seamless access to the ChaosCenter irrespectively of where you deploy it.

> [Get a broader view of which Platforms are supported by Litmus](https://github.com/litmuschaos/litmus/tree/master/litmus-portal#platforms-support)

The ChaosCenter gives you access to a plethora of features, the major ones include

- Workflow Creation
  <span style={{color: '#909191'}}>
    <ul>
        <li>From Templates, Custom Workflows from Scratch (using ChaosHubs), From pre-created YAMLs</li>
        <li>Chaos Experiments Sequence Control (Parallel as well as Sequential steps creation)</li>
        <li>Creation of either Singular or Cron Workflows as Schedules</li>
        <li>Attaching priority to Chaos Experiments based on your use cases</li>
    </ul>
    </span>
- Users & Teams
  <span style={{color: '#909191'}}>
    <ul>
        <li>Creation of Users with Role Based Access Control</li>
        <li>Creating a Team of multiple Users</li>
        <li>Authenticating Users</li>
    </ul>
    </span>
- Monitoring & Observability
  <span style={{color: '#909191'}}>
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
  <span style={{color: '#909191'}}>
    <ul>
        <li>Rolling out automated changes using GitOps</li>
        <li>Allowing image addition from custom image server (both public and private)</li>
        <li>Measure and Analyse the Resilience Score of each workflow</li>
    </ul>
    </span>
