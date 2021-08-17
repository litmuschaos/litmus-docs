---
id: manage-app-dashboard
title: Creating and Updating an Application Dashboard
sidebar_label: Manage Application Dashboard
---

---

Observing chaos injections and deriving insights from the chaos events is the core part of Chaos Observability. Whenever a chaos workflow run is performed its impact may be observed across different services and applications. Application dashboards provide a systematic visualization of all such events along with the performance of the individual service/application. To learn more about the dashboard schema architecture [click here](https://raw.githubusercontent.com/litmuschaos/litmus/master/monitoring/portal-dashboards/schema.json)

## Before you begin

To configure an application dashboard, you must first add a data source. To learn more about data sources [click here](configure-datasource.md)

- If no data source is available, a banner on the application dashboard tab requests you to add it before configuring a dashboard.

<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-no-data-source-dashboard.png').default} />
<i>Application dashboard with no configured data source</i>
</figure>

- If a data source becomes inactive after dashboard creation then you will be requested to either reconfigure the dashboard with another data source or update the existing data source.

---

## Table for configured dashboards

All the configured dashboards are listed under the Dashboards table. The table provides you all the details related to the dashboard like the name of the dashboard, the agent with which it has been connected, type of the dashboard, connected data source type and the last date it was opened.

For all the dashboards listed in the table, you can filter the dashboard with respect to agent name, dashboard-type and time period for dashboard creation.

<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-table.png').default} />
<i>Application dashboard table with a configured dashboard</i>
</figure>

On clicking on more options, you can select `View` to open the dashboards, click on configure to make changes in the existing dashboard, you can also download the dashboard in `JSON` format and click on `Delete` to remove the dashboard.

## Create dashboard

- To add a dashboard, click on the `Create dashboard` button placed at the right corner.

<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-create-dashboard.png').default} />
<i>Creating a dashboard</i>
</figure>

- **Choose a dashboard-type:**
<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-dashboard-type.png').default} />
<i>Select dashboard type</i>
</figure>

You need to select the dashboard type from the following options:

- _Predefined dashboards:_ Litmus provides a set of predefined dashboards for different applications and use-cases like Node metric, Pod metric, Sock Shop etc along with the chaos events and chaos exporter metrics.
- _Custom dashboard:_ To create your custom dashboard from scratch.
- _Upload a dashboard:_ To upload a dashboard in a JSON file format. This option is helpful for users who already have a JSON file for the dashboard configurations.

<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-metadata.png').default} />
<i>Configuring the metadata of the dashboard</i>
</figure>

- **Dashboard metadata:**

  - Name: Enter the name for your dashboard. A default name for the dashboard is provided you may override it as per your requirement.
  - Agent: Select the agent for which you want to set up the dashboard. By default, an agent from the list of all connected agents is selected for you. You may override this as per your requirement.
  - Data source: Select the data source from which you want to scrap the metrics and visualise it. By default, a data source from the list of all the active data sources is selected for you. You may override this as per your requirement.
  - Dashboard type: It contains information about the type of the dashboard being configured. If you want to change it you may navigate back to `Choose a dashboard type` and select the desired dashboard type. Once the dashboard is created its type cannot be changed.
  - Applications: You can make selections for particular namespaces, application types and specific applications which will assist you while tuning the queries and visualizing the metrics.

<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-applications-selection.png').default} />
<i>Selecting applications</i>
</figure>

- **Select the metrics:** For the predefined dashboards, the checklist of the corresponding metrics is provided from which you may select the required metrics to be plotted.

<figure>
<img src={require('../assets/user-guides/observability/setup/manage-application-dashboard-select-metrics.png').default} />
<i>Selecting the required metrics</i>
</figure>

The dashboards comprise panel groups each having a set of panel metrics. For example here, CPU Utilization Metrics is the panel group and Chaos-Node-CPU Utilization is the panel metric.

- **Tune the queries:**
  Tuning the queries is an optional step. If you want to continue with the default set of queries then click on Save Changes and the dashboard will be created. To learn more about tuning the queries [click here](editing-queries-app-dashboard.md).

## Learn more

- [Editing Panel Queries](editing-queries-app-dashboard.md)
- [Sharing Application Dashboards](share-app-dashboard.md)
