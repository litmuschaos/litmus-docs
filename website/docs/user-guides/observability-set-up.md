---
id: observability-set-up
title: Setup Observability with ChaosCenter
sidebar_label: Setup Observability
---

---

Overview Tab helps you to manage your connected data sources and dashboards, all while making it easier to view and analyze your chaos scenarios. The overview tab is split into 3 parts -

- Data Sources
- Application Dashboards
- Chaos Scenario Dashboards

## Before you begin

Before starting with observability setup, you have to connect an chaos delegate to get chaos scenario statistics & keep track of chaos scenarios performance.
For connecting a new chaos delegate, you can follow [here](../litmusctl/installation.md) .

---

Once the chaos delegate is connected, you will see a banner for adding data sources and a list of recently updated chaos scenario dashboards (if any).

<figure>
<img src={require('../assets/user-guides/observability/setup/overview-first-look.png').default} />
<i>Overview page, When no chaos scenarios are running</i>
</figure>

<figure>
<img src={require('../assets/user-guides/observability/setup/recently-updated-workflow-dashboards.png').default} />
<i>Overview page, When some chaos scenarios have been already scheduled </i>
</figure>

If you already have a data source, then they can connect the same by clicking on _**Add data source**_ button and following the corresponding instructions. For deploying a new data source, you can follow the sample configuration steps by clicking on _**Sample Prometheus configuration**_.

Once you have added a data source successfully, you will be able to see the data source listed on the overview page.you can add more data sources by clicking on _**Add data source**_ button.

<img src={require('../assets/user-guides/observability/setup/overview-with-datasource.png').default} />

Now, you will get a banner with an option to add a dashboard for visualizing the data from the connected data sources.

After setting up the dashboard, you will be able to see the dashboard on the overview page.

<img src={require('../assets/user-guides/observability/setup/overview-with-dashboards.png').default} />

You can view, configure & download the dashboards in the form of JSON for reusability using provided buttons.

You can check the chaos scenario analytics and the chaos scenario run graph by clicking on _**see chaos scenario run**_ & _**see chaos scenario analytics**_ icons for a chaos scenario from the list of chaos scenario dashboards present on the overview page.

## Learn more

- [Analyze a Chaos Scenario](analyze-workflow.md)
- [Configure Datasource](configure-datasource.md)
- [Manage Application Dashboard](manage-app-dashboard.md)
