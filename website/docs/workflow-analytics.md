---
id: workflow-analytics
title: Workflow Analytics Using Litmus-Portal
sidebar_label: Workflow Analytics
---

---

Once you have successfully scheduled a workflow (recurring/ non-recurring), you can check how the workflows are running as well as analyze the workflow runs on an Hourly/Daily/Monthly basis using the workflow dashboards and check how a system behaves when chaos injection takes place using the application dashboards.

### Overview

The overview tab helps you to manage your connected data sources and dashboards, all while making it easier to view and analyze your workflows. The overview tab is split into 3 parts -

- Data Sources
- Dashboards
- Workflow Dashboards

> When no agent is connected or in the `active` state, the overview page will show a banner for connecting an agent. Users can deploy a new agent using [litmusctl](https://github.com/litmuschaos/litmusctl).

<img src={require('./assets/overview-agent-connect.png').default} width="1000" height="500" />

Once the agent is connected, you will see a banner for adding data sources and a list of recently updated workflow runs (if any).

<img src={require('./assets/overview-first-look.png').default} width="1000" height="500" />

For Adding a data source, you can refer to the following guide.

Once you have added a data source successfully, you will be able to see the data source listed on the overview page.

<img src={require('./assets/overview-with-datasource.png').default} width="1000" />

Now, you will get a banner with an option to add a dashboard for visualizing the data from the connected data sources.

For adding a Dashboard, you can refer to the following guide. After setting up the dashboard, you will be able to see the dashboard on the overview page.

<img src={require('./assets/overview-with-dashboard.png').default} width="1000" />

You can check the workflow analytics and the workflow run graph by clicking on _**see workflow run**_ & _**see workflow analytics**_ icons for a workflow from the list of workflows present on the overview page.

### Workflow Analytics

As we have already discussed the workflow run graph in other parts of documentation, this section will focus on workflow analytics. On clicking _**see workflow analytics**_, you will be redirected to the workflow analytics page for that particular workflow.

<img src={require('./assets/workflow-analytics.png').default} width="1000" height="500" />

On the workflow analytics page, In the first container, you will be able to see the details about the selected workflow such as the workflow name, workflow id, agent details(name, namespace, etc.), and the workflow run details like the last run as well as regularity.

On clicking on **show statistics**, you will be able to see the experiment statistics, average resiliency score and pass/fail ratio for the workflows/experiments.

<img src={require('./assets/workflow-single-run.png').default} width="1000"/>

If the selected workflow is recurring or is re-run multiple times, then the average resiliency score for all the workflow runs is shown. A drop-down has been provided to switch between workflows & experiments for checking the pass/fail ratio.

<img src={require('./assets/workflow-multi-run.png').default} width="1000"/>

If the selected workflow is recurring or is re-run multiple times, a heat map representing the days of the year showing all the workflow runs for the selected workflow can be observed. On hovering over a point in the heat map, the average resiliency score for that particular day will be shown in the form of a tool-tip.

<img src={require('./assets/workflows-heatmap.png').default} width="1000"/>

On clicking on a heat map entry, a stacked bar graph representing the pass/fail ratio is shown, on which you can see the workflow runs on that day and hover over the bars to see the resiliency for that particular workflow run on that day.

<img src={require('./assets/workflow-activity.png').default} width="1000"/>

On clicking on a bar, more details about the workflow run represented by that stacked bar are presented in a tabular format. Here, we can see a table showing test names, experiment names, test results & weights, etc.

<img src={require('./assets/experiments-table.png').default} width="1000"/>
