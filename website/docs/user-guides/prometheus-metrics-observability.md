---
id: prometheus-metrics-observability
title: Leveraging Prometheus Metrics for Better Observability
sidebar_label: Prometheus Metrics
---

---

LitmusChaos exposes a set of Prometheus metrics from the ChaosCenter GraphQL server, giving you visibility into the control plane itself — how many experiments are running, how long they take, API performance, and the health of your connected chaos infrastructure.

## Before you begin

You'll need:
- LitmusChaos installed on a Kubernetes cluster
- [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) installed via Helm (includes Prometheus and Grafana)

---

## Metrics exposed

The GraphQL server exposes metrics on port `8889` at `/metrics`. This port is configurable via the `METRICS_PORT` environment variable.

### API metrics

| Metric | Type | Description |
|--------|------|-------------|
| `litmus_api_requests_total` | Counter | Total API requests, labeled by endpoint, status, operation name and type |
| `litmus_api_response_time_milliseconds` | Histogram | API response time in milliseconds |
| `litmus_api_error_requests_total` | Counter | Total API errors, labeled by endpoint and error type |
| `litmus_api_authentication_failures_total` | Counter | Total authentication failures |

### Experiment metrics

| Metric | Type | Description |
|--------|------|-------------|
| `litmus_experiments_total` | Gauge | Total experiments per project |
| `litmus_experiment_runs_total` | Counter | Total experiment runs per project |
| `litmus_experiment_run_duration_seconds` | Histogram | Duration of experiment runs in seconds |
| `litmus_experiment_status` | Gauge | Current status of experiment runs — `1` = started, `0` = completed |

### Infrastructure agent metrics

| Metric | Type | Description |
|--------|------|-------------|
| `litmus_connected_agents` | Gauge | Number of connected chaos agents per project |
| `litmus_disconnected_agents` | Gauge | Number of disconnected agents per project |
| `litmus_total_agents` | Gauge | Total registered agents per project |

### Go runtime metrics

Standard Go runtime metrics are also exposed automatically under the `go_*` and `process_*` prefixes, including goroutine counts, memory usage, and GC statistics.

---

## Setting up Prometheus scraping

### Step 1: Verify the metrics endpoint

```bash
kubectl port-forward -n litmus deployment/litmusportal-server 8889:8889
curl http://localhost:8889/metrics | grep litmus_
```

You should see the metrics listed above.

### Step 2: Create a Kubernetes Service

Create a service to expose the metrics port:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: litmus-server-metrics
  namespace: litmus
  labels:
    app: litmus-server-metrics
spec:
  selector:
    component: litmusportal-server
  ports:
    - name: metrics
      port: 8889
      targetPort: 8889
  type: ClusterIP
```

```bash
kubectl apply -f litmus-server-metrics-service.yaml
```

### Step 3: Create a ServiceMonitor

Create a `ServiceMonitor` so Prometheus automatically discovers and scrapes the metrics:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: litmus-server-metrics
  namespace: litmus
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: litmus-server-metrics
  endpoints:
    - port: metrics
      path: /metrics
      interval: 30s
```

```bash
kubectl apply -f litmus-server-metrics-monitor.yaml
```

> **Note:** The `release: prometheus` label must match the label selector configured in your Prometheus operator. Update this label if you used a different Helm release name.

### Step 4: Verify Prometheus is scraping

Port-forward to Prometheus and check the targets:

```bash
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
```

Open `http://localhost:9090/targets` and look for `litmus-server-metrics`. It should show as `UP`.

---

## Importing the Grafana dashboard

A pre-built Grafana dashboard is included in the LitmusChaos repository at:

```
chaoscenter/graphql/server/grafana/litmuschaos-metrics-dashboard.json
```

To import it:

1. Port-forward to Grafana:
```bash
kubectl port-forward -n monitoring deployment/prometheus-grafana 3000:3000
```

2. Open `http://localhost:3000` and log in.

3. Go to **Dashboards → New → Import**.

4. Upload `litmuschaos-metrics-dashboard.json`.

5. Select **Prometheus** as the datasource and click **Import**.

The dashboard includes panels for API request rate and latency, experiment run counts and durations, experiment status, and infrastructure agent health.

---

## Useful PromQL queries

**Currently running experiments:**
```promql
litmus_experiment_status == 1
```

**Experiment run rate over the last hour:**
```promql
rate(litmus_experiment_runs_total[1h])
```

**API error rate:**
```promql
rate(litmus_api_error_requests_total[5m])
```

**95th percentile API response time:**
```promql
histogram_quantile(0.95, rate(litmus_api_response_time_milliseconds_bucket[5m]))
```

**Connected agents per project:**
```promql
litmus_connected_agents
```

---

## Learn more

- [Setup Observability](observability-set-up.md)
- [Configure Datasource](configure-datasource.md)
- [Manage Application Dashboard](manage-app-dashboard.md)
