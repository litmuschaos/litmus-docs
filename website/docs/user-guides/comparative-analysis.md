---
id: comparative-analysis
title: Comparative Analysis of Chaos Workflows
sidebar_label: Compare Workflows
---

Workflow Dashboard allows users to manage their workflows runs, schedules & statistics.

### Linear Area Graph

Linear Area graph gives the statistics of workflow runs & statistics.

In first tab, Users can compare number of workflow runs according to selected granuality i.e. Daily/Monthly/Hourly. Granuality can be changed using drop-down in top right corner.

<img src={require('../assets/workflow-runs-stats.png').default} />
<img src={require('../assets/workflow-runs-stats-dropdown.png').default} />

Similarily, In other tab, Users can also compare schedules according to selected granuality.

<img src={require('../assets/schedules-stats.png').default} />
<img src={require('../assets/schedules-stats-dropdown.png').default} />

:::info

Users can hover over the respective graphs to get the total workflow runs & total schedules respectively.

:::

### Workflow Runs Radial chart

Workflows runs radial chart allows users to see how many of their scheduled have been passing/ failing & running. This helps you to see average behaviour of all the workflow runs.

<img src={require('../assets/workflows-radial-chart.png').default} />

### Workflows Comparison

The workflows table helps the users to keep track of their scheduled workflows along with associated details like workflow name, target agent, starting time,etc & allows to compare the workflows by selecting them from the table.

<img src={require('../assets/workflows-comparison-table-1.png').default} />

For comparing the workflows, Users can select the workflows from the table & click on _**Compare workflows**_ button.

<img src={require('../assets/workflows-comparison-table-2.png').default} />

Once, User clicks on _**Compare workflows**_ button, they will be presented with a graph, which shows comparison of selected workflows with respect to resilience score.

<img src={require('../assets/comparison-graph.png').default} />

Users can change the granuality by clicking on drop-down in top right corner. We can choose between Hourly/ Daily/ Monthly.

<img src={require('../assets/comparison-graph-with-dropdown.png').default} />

:::note

By hovering over the dots on comparison graph, we can see the resiliency score of compared workflows & also average workflows.

:::

<img src={require('../assets/comparison-graph-hover.png').default} />

The Comparison report can be downloaded in PDF form using the _**export button**_ given in header of table.

<img src={require('../assets/export-button.png').default} />

> **Sample workflows comparison report can be downloaded from [here](../assets/chaos-center-analytics.pdf)**

## Learn More

- [See Workflow Analytics](analyze-workflow)
