---
id: analyze-workflow
title: Analyzing a Chaos scenario
sidebar_label: Analyzing Chaos Scenario
---

---

Chaos Scenario Analytics allows you to analyze their chaos scenarios (Recurring/ Nonrecurring) & helps them to keep track of the chaos scenario runs of scheduled chaos scenarios and their behaviour.

## Chaos Scenario Details

On the chaos scenario analytics page, in the first container, you will be able to see the details about the selected chaos scenario such as the chaos scenario name, chaos scenario id, chaos delegate details(name, namespace, etc.), and the chaos scenario run details like the last run as well as regularity.

<img src={require('../assets/user-guides/observability/workflow-analysis/workflow-details.png').default} />

## Chaos Scenario Statistics

On clicking on **show statistics**, you will be able to see the experiment statistics, average resiliency score and pass/fail ratio for the chaos scenarios/experiments.

<img src={require('../assets/user-guides/observability/workflow-analysis/workflow-single-run.png').default} />

:::note

If the selected chaos scenario is recurring or is re-run multiple times, then the average resiliency score for all the chaos scenario runs is shown. A drop-down has been provided to switch between chaos scenarios & experiments for checking the pass/fail ratio.

:::

<img src={require('../assets/user-guides/observability/workflow-analysis/workflow-multi-run.png').default} />

## Chaos Scenario Heatmap

If the selected chaos scenario is recurring or is re-run multiple times, a heat map representing the days of the year showing all the chaos scenario runs for the selected chaos scenario can be observed. On hovering over a point in the heat map, the average resiliency score for that particular day will be shown in the form of a tool-tip.

<img src={require('../assets/user-guides/observability/workflow-analysis/workflow-heatmap.png').default} />

## Chaos Scenario Activity

On clicking on a heat map entry, a stacked bar graph representing the pass/fail ratio is shown, on which you can see the chaos scenario runs on that day and hover over the bars to see the resiliency for that particular chaos scenario run on that day.

<img src={require('../assets/user-guides/observability/workflow-analysis/workflow-activity.png').default} />

:::info

You can check Pass Count, Fail Count of Experiments & Resiliency Score by hovering over the bar for that chaos scenario run.

:::

## Experiments Table

On clicking on a bar, more details about the chaos scenario run represented by that stacked bar are presented in a tabular format. A table having individual experiments details is presented to the user, which helps them to get insights about the experiments.

<img src={require('../assets/user-guides/observability/workflow-analysis/experiments-table.png').default} />

## Learn more

- [Compare Chaos Experiments](comparative-analysis.md)
- [Manage Application Dashboard](manage-app-dashboard.md)
- [Configure Datasource](configure-datasource.md)
