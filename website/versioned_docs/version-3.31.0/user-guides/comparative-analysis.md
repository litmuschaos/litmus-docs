---
id: comparative-analysis
title: Comparative Analysis of Chaos Scenarios
sidebar_label: Compare Scenarios
---

---

Chaos Scenario Dashboard allows you to manage your chaos scenario runs, schedules & statistics.

## Long-term Statistics

Long-term Statistics provides details about chaos scenario runs & schedules over time.

In first tab, you can compare number of chaos scenario runs according to selected granuality i.e. Daily/Monthly/Hourly. Granuality can be changed using drop-down in top right corner.

<img src={require('../assets/user-guides/observability/workflow-dashboard/workflow-runs-stats.png').default} />
<img src={require('../assets/user-guides/observability/workflow-dashboard/workflow-runs-stats-dropdown.png').default} />

Similarily, In other tab, you can also compare schedules according to selected granuality.

<img src={require('../assets/user-guides/observability/workflow-dashboard/schedules-stats.png').default} />
<img src={require('../assets/user-guides/observability/workflow-dashboard/schedules-stats-dropdown.png').default} />

:::info

You can hover over the respective graphs to get the total chaos scenario runs & total schedules respectively.

:::

## Total Chaos Scenario Statistics

Total Chaos Scenario Statistics helps you to see how many of their scheduled have been passing/ failing & running. This helps you to see average performance of all the chaos scenario runs.

<img src={require('../assets/user-guides/observability/workflow-dashboard/workflows-radial-chart.png').default} />

## Comparing Multiple Scenarios

List of chaos scenarios provided on the page helps you to keep track of their scheduled chaos scenarios along with associated details like chaos scenario name, chaos delegate, starting time,etc & allows to compare the chaos scenarios by selecting them from the table.

<img src={require('../assets/user-guides/observability/workflow-dashboard/workflows-comparison-table-1.png').default} />

For comparing the chaos scenarios, you can select the scenarios from the table & click on _**Compare Chaos Scenario**_ button.

<img src={require('../assets/user-guides/observability/workflow-dashboard/workflows-comparison-table-2.png').default} />

Once, user clicks on _**Compare Chaos Scenario**_ button, they will be presented with a graph, which shows comparison of selected chaos scenarios with respect to resilience score.

<img src={require('../assets/user-guides/observability/workflow-dashboard/comparison-graph.png').default} />

You can change the granuality by clicking on drop-down in top right corner. We can choose between Hourly/ Daily/ Monthly.

<img src={require('../assets/user-guides/observability/workflow-dashboard/comparison-graph-with-dropdown.png').default} />

:::note

By hovering over the dots on comparison graph, you can see the resiliency score of compared chaos scenarios & also average chaos scenarios.

:::

<img src={require('../assets/user-guides/observability/workflow-dashboard/comparison-graph-hover.png').default} />

The Comparison report can be downloaded in PDF form using the _**export button**_ given in header of table.

<img src={require('../assets/user-guides/observability/workflow-dashboard/export-button.png').default} />

> **Sample chaos scenario comparison report can be downloaded from [here](../assets/chaos-center-analytics.pdf)**

## Learn more

- [Configure Datasource](configure-datasource.md)
- [See Chaos Scenario Analytics](analyze-workflow.md)
- [Manage Application Dashboard](manage-app-dashboard.md)
