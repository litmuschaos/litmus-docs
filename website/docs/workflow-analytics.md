---
id: workflow-analytics
title: Workflow Analytics Using Litmus-Portal
sidebar_label: Workflow Analytics
---

---

Once users have successfully scheduled a workflow (Recurring/ Non-recurring), The users can check how there workflows are running, analyse the workflow runs Hourly/daily/Monthly using workflow dashboards and check how their system behaves when chaos injection happens using Application dashboards.

### Overview

Overview Tab helps users to manage their connected Datasources and Dashboards & makes it easier to view analyse the workflows. Overview Tab is divided into 3 parts -

- Data Sources
- Dashboards
- Workflow Dashboards

> When no agent is connected or in active state, the overwiew page will show a banner for connecting an agent. Users can deploy a new agent using [litmusctl](https://github.com/litmuschaos/litmusctl).

<img src={require('./assets/overview-agent-connect.png').default} width="1000" height="500" />

Once the agent is connected, Users will see a banner for adding datasources and list of recently updated workflow runs (if any).

<img src={require('./assets/overview-first-look.png').default} width="1000" height="500" />

For Adding a Data source, Users can follow [here]("")

Once users have added a data source sucessfully, they will be able to see the data source listed on the overview page.

<img src={require('./assets/overview-with-datasource.png').default} width="1000" />

Now, users will get an banner with an option to add a dashboard for visualizing the data from the connected the data sources.

For Adding a Dashboard, Users can follow [here](""), After setting up the dashboard, the users will be able to see the the dashboard on overview page.

<img src={require('./assets/overview-with-dashboard.png').default} width="1000" />

Users can check workflow analytics and workflow run graph by clicking on _**see workflow run**_ & _**see workflow analytics**_ icons for a workflow from list of workflows shown on overview page.

### Workflow Analytics

As we have already discussed about the workflow run graph in other parts of [documentation](""), we can proceed with workflow analytics. On clicking _**see workflow analytics**_, Users will be redirected to workflow analytics page for that particular workflow.

<img src={require('./assets/workflow-analytics.png').default} width="1000" height="500" />

On workflow analytics page, In the first container, user will be able to see the details about the selected workflow like Worklflow name, workflow id, agent details like name and namespace and workflow run details like last run and it's Regularity.

On clicking on **show statistics**, we can see the experiment statistics, average resiliency score and pass/fail ratio for the workflows/Experiments.

<img src={require('./assets/workflow-single-run.png').default} width="1000"/>

If selected workflow is a recurring workflow or the selected is ran for multiple times, then it will show Average Resiliency Score for all workflow runs, and also users will be able to switch between workflows & experiments using dropdown for checking Pass/Fail ratio.

<img src={require('./assets/workflow-multi-run.png').default} width="1000"/>

If the Selected workflow is a recurring workflow users will get a heatmap, showing all the workflow runs for the selected workflow. On hovering over the points in heatmap, we can see the average resiliency score for that particular day.

<img src={require('./assets/workflows-heatmap.png').default} width="1000"/>

If user clicks on a heatmap entry, they are presented with a stackbar graph, where users can see the workflow runs on that day and hover over the bars to see the resiliency for that particular workflow run on that day.

<img src={require('./assets/workflow-activity.png').default} width="1000"/>

User can click on a bar to get more details about the workflow run represented by that stackbar. After clicking on bar, we can see a table showing Test names, Experiment names, Test results & Weights,etc.

<img src={require('./assets/experiments-table.png').default} width="1000"/>
