---
id: configure-datasource
title: Configuring a Datasource
sidebar_label: Configure Datasource
---

---

Litmus 2.0 provides in-house monitoring support which can be leveraged by connecting a data source to the chaos center, configured to scrape chaos event metics and application or infrastructure metics.

### Before you begin

To configure a data source for a chaos center project, you must first setup the data source. To learn more about data source setup [click here](setup-datasource.md)

### Connecting a data source

- Click on the `Observability` section from the sidebar then switch to the `Data Source` tab. Click the `Add data source` button to open the data source connection form.

The _first page_ of the form requires the user to provide the general details, It also has a link to documentation around setting up a Prometheus data source (Litmus center supports Prometheus 2.1 or later) to collect chaos events and metrics along with generic node-exporter and kube-state-metrics. Form fields on page 1 for data source connection:

- **Data source name** - alias.
- **Data source type** - defaults to Prometheus in Litmus 2.0.
- **Data source endpoint URL** - IP OR Host along with port number. The user can also use the Kubernetes DNS provided and kubelet configured fully qualified domain name (FQDN) with port for prometheus server service, prefixed with `http://` to connect a data source hosted on the control plane cluster for a secure internal connection on K8s.
  (Ex. - http://prometheus-k8s.monitoring.svc.cluster.local:9090)
- **Access type** - defaults to Server.

<figure>
<img src={require('../assets/user-guides/observability/data-source/connection-form-page-1.png').default} />
<i>Data source connection form page - 1</i>
</figure>

On clicking the next button, the _second page_ of the form appears which requires the user to provide more details:

- **Authentication option** - defaults to `No auth` for Litmus 2.0.
- **Scrape interval** - scrape interval in seconds for the TSDB, The scrape interval is used to control the lower limit of minStep for queries multiplying by denominator of query resolution for a dashboard consuming the data source; the same might be used for limiting the refresh rate for dashboard views with relative time range in later versions of the Litmus center.
- **Query timeout** - query timeout in seconds for the TSDB, The query timeout is used for all the queries associated with all the dashboards connected to the given data source although the default request timeout for the health check of the data source while connecting, updating or listing it is 5 seconds.
- **HTTP method** - defaults to `POST` as Litmus uses the Prometheus client APIs to query the data source using POST requests which support bigger queries.

<figure>
<img src={require('../assets/user-guides/observability/data-source/connection-form-page-2.png').default} />
<i>Data source connection form page - 2</i>
</figure>

After filling up all the details, the user can connect the data source to the project in the Litmus center by clicking the `Save changes` button.

### Data source table, re-configure, deletion

- Click on the `Observability` section from the sidebar then switch to the `Data Source` tab. This tab contains a data source table which lists all the data sources connected to the Litmus center associated with the currently active project. This table has different fields like, `Status` which is essentially health check status with a timeout of 5 seconds for each data source, `Name`, `Type` which defaults to Prometheus for Litmus 2.0, `Last configured` and `Link` to the data source. The last column has a menu with options to `Configure` OR `Delete` the data source.

<figure>
<img src={require('../assets/user-guides/observability/data-source/tab.png').default} />
<i>Data sources tab</i>
</figure>

- Configuring the data source allows the user to update data source details entered while connecting it to the Litmus center. It takes the user to the connection form with the details pre-filled as per previous configuration. The update works only if the data source endpoint is healthy and active.

<figure>
<img src={require('../assets/user-guides/observability/data-source/configure.png').default} />
<i>Data source configuration screen</i>
</figure>

- Deletion allows the user to disconnect the data source from the Litmus center’s project. If any dashboard is consuming the data source then the user is given an option to `Force delete` the data source which also deletes all the dashboards consuming it.

<figure>
<img src={require('../assets/user-guides/observability/data-source/deletion-confirmation.png').default} />
<i>Data source deletion confirmation</i>
</figure>

<figure>
<img src={require('../assets/user-guides/observability/data-source/force-delete.png').default} />
<i>Data source force delete</i>
</figure>

- The table also allows searching for data source by it’s `Name`, filtering entries based on `Status` and `Last configured` date and time.

### Related features

Number of connected data sources are also listed on `Overview` tab of `Observability section` and when no data source connected then user is prompted to add a data source while browsing the `Application monitoring` tab, if an existing inactive data source is found, option to re-configure it is also made available to the user.

### Uses of data source in application monitoring

- [Data source linking during creation and update of application monitoring dashboards](manage-app-dashboard.md)
- [Tuning queries for dashboards uses data source details associated with the linked data source](editing-queries-app-dashboard.md)
- [Application monitoring dashboard uses the data source details to perform a health check before pulling application metrics, chaos events and verdict from it to be observed by the user to analyse chaos impact on services or resources](view-chaos-impact.md)

### Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/fi-vhKE5vKI?start=2040" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Learn more

- [Observability Setup](observability-set-up.md)
- [Manage Application Dashboards](manage-app-dashboard.md)
