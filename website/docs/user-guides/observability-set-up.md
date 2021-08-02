---
id: observability-set-up
title: Setup Observability with Chaos Center
sidebar_label: Setup Observability
---

---

### Overview

Overview Tab helps you to manage your connected data sources and dashboards, all while making it easier to view and analyze your workflows. The overview tab is split into 3 parts -

- Data Sources
- Application Dashboards
- Workflow Dashboards

:::note
When there is no agent connected or in the `active` state, the overview tab will show a banner for connecting an agent.
Users can connect a new agent using [litmusctl](https://github.com/litmuschaos/litmusctl).
:::

<img src={require('../assets/overview-without-agent.png').default} />

Once the agent is connected, Users will see a banner for adding data sources and a list of recently updated workflow dashboards (if any).

<figure>
<img src={require('../assets/overview-first-look.png').default} />
<i>Overview page, When no workflows are running</i>
</figure>

<figure>
<img src={require('../assets/recently-updated-workflow-dashboards.png').default} />
<i>Overview page, When some workflows have been already scheduled </i>
</figure>

If users already have a data source, then they can connect the same by clicking on _**Add data source**_ button and following the corresponding instructions. For deploying a new data source, users can follow the sample configuration steps by clicking on _**Sample Prometheus configuration**_.

Once you have added a data source successfully, users will be able to see the data source listed on the overview page. Users can add more data sources by clicking on _**Add data source**_ button.

<img src={require('../assets/overview-with-datasource.png').default} />

Now, Users will get a banner with an option to add a dashboard for visualizing the data from the connected data sources.

After setting up the dashboard, users will be able to see the dashboard on the overview page.

<img src={require('../assets/overview-with-dashboards.png').default} />

Users can view, configure & download the dashboards in the form of JSON for reusability.

You can check the workflow analytics and the workflow run graph by clicking on _**see workflow run**_ & _**see workflow analytics**_ icons for a workflow from the list of workflow dashboards present on the overview page.

## Learn More
