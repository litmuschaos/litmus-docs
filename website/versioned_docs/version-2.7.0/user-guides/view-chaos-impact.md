---
id: view-chaos-impact
title: Viewing Chaos Impact on Applications Metrics Across Agent’s Scope
sidebar_label: Viewing Chaos Impact
---

---

After creating a dashboard, you view the corresponding metrics along with the chaos events in order to understand the impact of the chaos on various applicatons.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-first-look.png').default} />
<i>Viewing particular application dashboard</i>
</figure>

## Dashboard Navigation

- **Dashboard Info:** All the dashboard meta-data (name, type, data source, agent ), selected applications and selected panels are displayed in this selection. To check on the data source connected with the dashboard click on the attached data source link. You may select/deselect the items listed in the selected applications and selected panels field to visualize the appropriate data.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-info.png').default} />
<i>Viewing the information related to the dashboard</i>
</figure>

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-more-options.png').default} />
<i>Viewing more options</i>
</figure>

- **More Options:**

  - Configure: To make changes in the metadata and/or fine-tune the queries. To learn about configuring a dashboard [click here.](manage-app-dashboard.md)
  - Clone: To make a copy of the current dashboard click on the clone button. Enter new name of the dashboard and click on `ok`

  - Download a JSON: To download the complete dashboard configuration in JSON format.

  - PDF report: For downloading all the metric data in report format with graphs and summary. This feature is under development and will be made available in an upcoming version.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-copy-dashboard.png').default} />
<i>Creating a copy of the dashboard</i>
</figure>

- **Select a time interval:** To visualize the metric data for a specific period, you may select the date and time for the start and end of the interval.

- **Refresh rate:** As the metrics data for a given data source is updated so to query and update all the graphs on the dashboard you may provide a refresh rate. By default, the refresh rate is set at 15 seconds.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-refresh-rate.png').default} />
<i>Setting up refersh rate for the dashboard</i>
</figure>

- **Hard Refresh:** To perform a refresh explicitly a hard refresh option is given to the user.

- **View chaos metric info:** For the particular graph, if you want to view the chaos workflow-related information in the table then you may first expand the graph and hover over the specific chaos event to view all its workflow-related information.

- **Popout:** To open the particular graph in a modal.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-popout.png').default} />
<i>View individulal graph in modal</i>
</figure>

- **Edit particular panel:** To edit the queries for the specific panel. On clicking on the `Edit` button you will be directed to the dashboard configuration page where you can tune the queries. To learn more about query editing [click here](editing-queries-app-dashboard.md).

- **Show chaos during this interval:** Among all the chaos injections that have been scheduled by the user, chaos events that lie within the selected time interval are listed in form of a table. You may select/deselect the specific chaos events to visualize them on the graphs as an overlay for the chaos during. Please note that all the chaos events come along with the lasted verdict corresponding to the chaos workflow.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-show-chaos-during-this-interval.png').default} />
<i>Selecting/deselecting chaos metric</i>
</figure>

- Edit: Click to edit the chaos annotations.
  - Event query: Queries related to the chaos injection events. You may edit them as per your requirement.
  - Verdict query: Query related to the verdict/results of the chaos injection. You may edit them as per your requirement.

<figure>
<img src={require('../assets/user-guides/observability/setup/view-chaos-impact-edit-chaos-queries.png').default} />
<i>Editing chaos metric queries</i>
</figure>

- **Switch between dashboards for the same agent:** You can switch between the dashboards for the selected agent. To view a different dashboard for the given agent, click the dropdown option placed next to the dashboard name which contains the list of all the configured dashboards for that agent and select a particular dashbord.

## Learn more

- [Manage Application Dashboard](manage-app-dashboard.md)
- [Editing Panel Queries](editing-queries-app-dashboard.md)
- [Sharing Application Dashboards](share-app-dashboard.md)
