---
id: chaosagents-installation
title: ChaosAgents Installation
sidebar_label: ChaosAgents
---

---

## Prerequisites

- Before connecting a ChaosAgent to the [ChaosCenter](../getting-started/resources.md#chaoscenter), learn about what is a [ChaosAgent](../getting-started/resources.md#chaosagents) in Litmus.
- Make sure [litmusctl](../litmusctl/installation.md) is installed.

## Connecting ChaosAgents

- Learn to [connect ChaosAgents with non interactive mode using litmuctl](../litmusctl/usage-non-interactive-mode.md)
- Learn to [connect ChaosAgents with interactive mode using litmuctl](../litmusctl/usage-interactive-mode.md)

## Resource Requiremenets for Agents-plane components

The Resource requests provided here have been estimated using data gathered manually through different methods -

- Using command `kubectl top`
- Recommendations from Vertical-Pod-Autoscaler
- Recommendations by a great utility [Goldilocks](https://github.com/FairwindsOps/goldilocks).

These resources are getting monitored continuously and the information below will be updated as the metrics changes.

<table>
   <tr>
    <th>Pod</th>
    <th>Container</th>
    <th>CPU(Requested)</th>
    <th>Memory(Requested)</th>
   </tr>
   <tr>
    <td>chaos-operator-ce</td>
    <td>chaos-operator-ce</td>
    <td>25m</td>
    <td>300M</td>
   </tr>
   <tr>
    <td>chaos-exporter</td>
    <td>chaos-exporter</td>
    <td>25m</td>
    <td>300M</td>
   </tr>
   <tr>
    <td>event-tracker</td>
    <td>litmus-event-tracker</td>
    <td>25m</td>
    <td>300M</td>
   </tr>
   <tr>
    <td>subscriber</td>
    <td>subscriber</td>
    <td>25m</td>
    <td>300M</td>
   </tr>
   <tr>
    <td>workflow-controller</td>
    <td>workflow-controller</td>
    <td>25m</td>
    <td>300M</td>
   </tr>
</table>

## Learn more

- [Setup Endpoints and Access ChaosCenter without Ingress](setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](setup-with-ingress.md)
