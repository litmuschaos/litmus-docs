---
id: prometheus
title: Collecting metrics using Prometheus
sidebar_label: Prometheus
---

---

LitmusChaos facilitates real-time monitoring for events and metrics using it’s native chaos exporter. These events and metrics can be exported into any TSDBs (Time-series databases) to overlay on top of application performance graphs and also as additional visualizations for chaos testing statistics. To set up or configure your monitoring infrastructure to support litmus chaos events and metrics, we provide both service endpoints and service monitors setup.

## Before you begin

The following should be required before integrating Prometheus in litmus 2.0:

- [Running Chaos Workflows](../getting-started/run-your-first-workflow.md)
- [Prometheus TSDB](https://prometheus.io/)
- [Probes](../concepts/probes.md)
- [Data source](../concepts/datasource.md)

## Prometheus deployment with scrape job

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

- Deploy chaos-exporter when the cluster is not connected to litmus 2.0 control plane via litmus agent (exporter is installed as a part of the agent bundle)

```bash
kubectl -n litmus apply -f utils/metrics-exporters/litmus-metrics/chaos-exporter/
```

> Sample scrape job

```yaml
- job_name: 'chaos-exporter'
  static_configs:
    - targets: ['chaos-exporter.litmus.svc.cluster.local:8080']
  relabel_configs:
    - target_label: instance
      replacement: 'chaos-exporter-service'
```

## Prometheus operator with service monitor

- Clone the litmus repo

```bash
git clone https://github.com/litmuschaos/litmus.git
cd litmus/monitoring
```

- Create monitoring namespace on the cluster

```bash
kubectl create ns monitoring
```

- Create the operator to instantiate all CRDs

```bash
kubectl -n monitoring apply -f utils/prometheus/prometheus-operator/
```

- Deploy monitoring components

```bash
kubectl -n monitoring apply -f utils/metrics-exporters-with-service-monitors/node-exporter/
kubectl -n monitoring apply -f utils/metrics-exporters-with-service-monitors/kube-state-metrics/
```

- Deploy chaos-exporter when the cluster is not connected to litmus 2.0 control plane via litmus agent (exporter is installed as a part of the agent bundle)

```bash
kubectl -n litmus apply -f utils/metrics-exporters-with-service-monitors/litmus-metrics/chaos-exporter/
```

- Deploy prometheus instance and all the service monitors for targets

```bash
kubectl -n monitoring apply -f utils/prometheus/prometheus-configuration/
```

> Sample service monitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: chaos-exporter
  labels:
    k8s-app: chaos-exporter
  namespace: litmus
spec:
  jobLabel: app
  selector:
    matchLabels:
      app: chaos-exporter
  namespaceSelector:
    matchNames:
      - litmus
  endpoints:
    - port: tcp
      interval: 1s
      metricRelabelings:
        - targetLabel: instance
          replacement: 'chaos-exporter-service'
```

## Prometheus community version (helm) - kube-prometheus-stack with pod monitor

- Clone the litmus repo

```bash
git clone https://github.com/litmuschaos/litmus.git
cd litmus/monitoring
```

- Deploy chaos-exporter when the cluster is not connected to litmus 2.0 control plane via litmus agent (exporter is installed as a part of the agent bundle)

```bash
kubectl -n litmus apply -f utils/metrics-exporters/litmus-metrics/chaos-exporter/
```

- Create monitoring namespace on the cluster

```bash
kubectl create ns monitoring
```

- Install prometheus via helm

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prom prometheus-community/kube-prometheus-stack --namespace monitoring
```

- Create the pod monitor as specified

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: chaos-exporter-monitor
  namespace: monitoring
  labels:
    release: prometheus-stack
spec:
  selector:
    matchLabels:
      app: chaos-exporter
  namespaceSelector:
    matchNames:
      - litmus
  podMetricsEndpoints:
    - port: tcp
    - interval: 1s
      metricRelabelings:
        - targetLabel: instance
          replacement: 'chaos-exporter-service'
```

## Prometheus alertmanager for generating alerts for experiment results

Prometheus alerts can be triggered on alertmanager based on chaos experiment verdicts, probe success percentage and related metadata on the metric `litmuschaos_experiment_verdict` from `chaos-exporter`

Link: [https://github.com/litmuschaos/tutorials/issues/6](https://github.com/litmuschaos/tutorials/issues/6)

## promProbe for prometheus metrics

The promProbe allows users to run Prometheus queries and match the resulting output against specific conditions. The intent behind this probe is to allow users to define metrics-based SLOs in a declarative way and determine the experiment verdict based on its success. The probe runs the query on a Prometheus server defined by the endpoint, and checks whether the output satisfies the specified criteria.

Know more on promProbe [here](../concepts/probes.md)

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/fi-vhKE5vKI?start=2040" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [Application and infrastructure monitoring](../concepts/app-infra-monitoring.md)
- [Observability Setup](../user-guides/observability-set-up.md)
- [Configure Data Source](../user-guides/configure-datasource.md)
- [Grafana Integration](grafana.md)
