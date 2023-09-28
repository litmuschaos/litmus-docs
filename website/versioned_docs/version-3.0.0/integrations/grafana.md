---
id: grafana
title: Observe chaos impact using Grafana
sidebar_label: Grafana
---

---

Chaos Engineering is the discipline of experimenting on a system to build confidence in the system’s capability to withstand turbulent conditions in production. Monitoring a system's resilience and its performance under chaos are one of the fundamental principles of chaos engineering. Litmus has sample chaos interleaved dashboards available on Grafana’s community dashboards as well as provisioned dashboards along with provisioned data sources. Some sample chaos interleaved dashboards can be found [here](https://github.com/litmuschaos/litmus/tree/master/monitoring/grafana-dashboards)

## Before you begin

The following should be required before integrating Grafana with litmus 2.0:

- [Running Chaos Experiments](../getting-started/run-your-first-experiment.md)
- [Prometheus TSDB](https://prometheus.io/)
- [Prometheus Integration](prometheus.md)

## Grafana setup with provisioned data source amd dashboards using Prometheus deployment with scrape jobs

The following steps can be followed to set up Grafana with Prometheus for accessing the integrated and interleaved dashboards

- Clone the litmus repo

```bash
git clone https://github.com/litmuschaos/litmus.git
cd litmus/monitoring
```

- Create monitoring namespace on the cluster

```bash
kubectl create ns monitoring
```

- Deploy prometheus components

```bash
kubectl -n monitoring apply -f utils/prometheus/prometheus-scrape-configuration/
```

- Deploy metrics exporters

```bash
kubectl -n monitoring apply -f utils/metrics-exporters/node-exporter/
kubectl -n monitoring apply -f utils/metrics-exporters/kube-state-metrics/
```

- Deploy chaos-exporter when the cluster is not connected to litmus 2.0 control plane via litmus chaos delegate (exporter is installed as a part of the chaos delegate bundle)

```bash
kubectl -n litmus apply -f utils/metrics-exporters/litmus-metrics/chaos-exporter/
```

- Deploy Grafana

```bash
kubectl -n monitoring apply -f utils/grafana/
```

_You may access the grafana dashboard via the LoadBalancer (or NodePort) service IP or via a port-forward operation on localhost and then view it from manage dashboards section._

> View the services running in the monitoring namespace

```bash
kubectl get svc -n monitoring
```

> Now copy the EXTERNAL-IP of grafana and view it in the browser

Default username/password credentials: `admin/admin`

### Screenshots

#### Chaos Result selector dropdown:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/chaos-result-selector.png?raw=true)

#### Chaos Engine Context (Target application's NAMESPACE_LABEL) selector dropdown:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/chaos-engine-context-selector.png?raw=true)

#### Chaos Engines with Experiments as Chaos Results:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/chaos-experiments.png?raw=true)

#### Chaos event annotations:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/chaos-event-annotation.png?raw=true)

#### Chaos Result verdict annotations:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/chaos-result-verdict-annotation.png?raw=true)

#### Interleaved Chaos events:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/interleaved-events.png?raw=true)

#### Interleaved Chaos Result verdicts:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/interleaved-results.png?raw=true)

#### Chaos Result verdict failure alerts:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/verdict-failure-alert.png?raw=true)

#### Chaos Result probe failure alerts:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/probe-failure-alert.png?raw=true)

#### Systems healthy / in steady state OR no alerts to be issued:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/no-alerts-issued.png?raw=true)

#### Systems un-healthy / failed to regain steady state after chaos / meet SLO OR alerts are issued:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/alerts-active.png?raw=true)

#### Alerts issued:

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/sock-shop/alerts-sent.png?raw=true)

## Chaos interleaving over infra and application metrics

Chaos interleaving can be achieved using the `litmuschaos_awaited_experiments` and `litmuschaos_experiment_verdict` prometheus metrics which can be transformed using grafana variables and annotations into chaos injection events with metadata and results to monitor the application under test or infrastructure under test.

> Sample variable configurations:

_Queries:_

**chaosresult_name**

```json
label_values(litmuschaos_awaited_experiments{app=~"chaos-exporter"}, chaosresult_name)
```

**chaosengine_context**

```json
label_values(litmuschaos_experiment_verdict{app=~"chaos-exporter"}, chaosengine_context)
```

#### Screenshots

<figure>
<img src={require('../assets/integrations/grafana/variable-result-name.png').default} />
<i>Chaos result name variable</i>
</figure>

<figure>
<img src={require('../assets/integrations/grafana/variable-engine-context.png').default} />
<i>Chaos engine context variable</i>
</figure>

> Sample annotation configurations:

_Queries:_

**LitmusChaos Events**

```json
litmuschaos_awaited_experiments{chaosresult_name=~"$chaosresult_name", job="litmus/chaos-exporter", app="chaos-exporter"}
```

**LitmusChaos Metrics**

```json
litmuschaos_experiment_verdict{chaosresult_name=~"$chaosresult_name",chaosengine_context=~"$chaosengine_context", job="litmus/chaos-exporter", app="chaos-exporter"}
```

#### Screenshots

<figure>
<img src={require('../assets/integrations/grafana/annotation-events.png').default} />
<i>Chaos event annotation</i>
</figure>

<figure>
<img src={require('../assets/integrations/grafana/annotation-metrics.png').default} />
<i>Chaos metric annotation</i>
</figure>

## Fault injection and system failure alerts

These alerts can be configured and triggered based on conditions set on panels using the `litmuschaos_awaited_experiments` and `litmuschaos_experiment_verdict` metrics. The same can be issued to various channels registered for the corresponding alerts on Grafana.

> Sample alert configuration for chaos result verdict

_Query:_

```json
litmuschaos_experiment_verdict{job="litmus/chaos-exporter", app="chaos-exporter", chaosresult_verdict="Fail"}
```

#### Screenshots

<figure>
<img src={require('../assets/integrations/grafana/experiment-verdict-failure-alert-query.png').default} />
<i>Experiment verdict failure alert query</i>
</figure>

<figure>
<img src={require('../assets/integrations/grafana/experiment-verdict-failure-alert-config.png').default} />
<i>Experiment verdict failure alert configuration</i>
</figure>

> Sample alert configuration for probe success percentage

_Query:_

```json
litmuschaos_experiment_verdict{job="litmus/chaos-exporter", app="chaos-exporter", probe_success_percentage!="100.000000"}
```

#### Screenshots

<figure>
<img src={require('../assets/integrations/grafana/probe-failure-alert-query.png').default} />
<i>Probe failure alert query</i>
</figure>

<figure>
<img src={require('../assets/integrations/grafana/probe-failure-alert-config.png').default} />
<i>Probe failure alert configuration</i>
</figure>

## Gauges from metrics for aggregated view of chaos injections

Metrics from chaos-exporter like `litmuschaos_passed_experiments`, `litmuschaos_failed_experiments` and `litmuschaos_awaited_experiments` when ingested in Prometheus which is connected as a data source can provide an aggregated view of chaos injections on a chaos delegate cluster or namespace.

_Queries:_

**Total Experiments Runs**

```json
sum(litmuschaos_passed_experiments{job="litmus/chaos-exporter"} + litmuschaos_failed_experiments{job="litmus/chaos-exporter"})
```

**Passed Experiments**

```json
sum(litmuschaos_passed_experiments{job="litmus/chaos-exporter"})
```

**Failed Experiments**

```json
sum(litmuschaos_failed_experiments{job="litmus/chaos-exporter"})
```

**Queued Experiments**

```json
sum(litmuschaos_awaited_experiments{job="litmus/chaos-exporter"})
```

#### Screenshot

<figure>
<img src={require('../assets/integrations/grafana/gauges.png').default} />
<i>Gauge metrics</i>
</figure>

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/fi-vhKE5vKI?start=2040" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Observability Considerations in Chaos: The Metrics Story](https://dev.to/ksatchit/observability-considerations-in-chaos-the-metrics-story-6cb)

## Learn More

- [Observability Setup](../user-guides/observability-set-up.md)
