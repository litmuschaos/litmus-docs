---
id: glossary
title: Glossary
sidebar_label: Glossary
---

:::note
Please note that Litmus 3.0 is not backward compatible and will require a fresh installation for users looking to migrate from previous versions
:::

## Chaos Resources

At the heart of the Litmus Platform are the chaos custom resources. This section consists of the specification (details of each field within the .spec & .status of the resources) as well as standard examples for tuning the supported parameters.

<table>
<tr>
  <th>Chaos Resource Name</th>
  <th>Description</th>
  <th>User Guides</th>
</tr>
<tr>
  <td>ChaosEngine</td>
  <td>Contains the ChaosEngine specifications user-guide</td>
  <td><a href="https://litmuschaos.github.io/litmus/experiments/concepts/chaos-resources/chaos-engine/contents/">ChaosEngine</a></td>
</tr>
<tr>
  <td>ChaosExperiment</td>
  <td>Contains the ChaosExperiment specifications user-guide</td>
  <td><a href="https://litmuschaos.github.io/litmus/experiments/concepts/chaos-resources/chaos-experiment/contents/">ChaosExperiment</a></td>
</tr>
<tr>
  <td>ChaosResult</td>
  <td>Contains the ChaosResult specifications user-guide</td>
  <td><a href="https://litmuschaos.github.io/litmus/experiments/concepts/chaos-resources/chaos-result/contents/">ChaosResult</a></td>
</tr>
</table>

## Terminology Changes

With the latest release of LitmusChaos 3.0.0 the following terminologies have been changed:

<table>
<tr>
  <th>Old terminology</th>
  <th>Updated terminology</th>
</tr>
<tr>
<td>Chaos Experiment</td>
<td>Chaos Fault</td>
</tr>
<tr>
<td>Chaos Scenario/Workflow</td>
<td>Chaos Experiment</td>
</tr>
<tr>
<td>Chaos Delegate/Agent</td>
<td>Chaos Infrastructure</td>
</tr>
</table>
