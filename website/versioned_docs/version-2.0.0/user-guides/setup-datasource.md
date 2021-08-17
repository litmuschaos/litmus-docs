---
id: setup-datasource
title: Setting up Data source
sidebar_label: Setup Data source
---

---

This guide provides sample scrape job to be used for Prometheus deployment’s scrape-configmap and service monitors to be used with Prometheus operator for the different architectural topologies for integrating Prometheus (connecting a data source link) with Chaos center.

### Before you begin

To setup a data source for a chaos center project, you must know about [open observability](../concepts/open-observability.md) and [data source considerations](../concepts/datasource.md) in Litmus 2.0

### Topologies

Listed below are three among many topologies in which a data source can be setup for collecting agent cluster's metrics along with chaos metrics for chaos center.

#### For Control plane agent / Self agent with Prometheus - scraping chaos-exporter metrics and events along with other metrics

<figure>
<img src={require('../assets/user-guides/observability/data-source/self-agent-prometheus.png').default} />
<i>Data flow and topological diagram</i>
</figure>

_Scrape jobs:_

- **Chaos exporter**

```yaml
- job_name: 'chaos-exporter'
  static_configs:
    - targets: ['chaos-exporter.litmus.svc.cluster.local:8080']
```

- **Kube state metrics exporter**

```yaml
- job_name: 'kube-state-metrics'
  static_configs:
    - targets: ['kube-state-metrics.monitoring.svc.cluster.local:8080']
```

- [Node exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/prometheus/prometheus-scrape-configuration/02-prometheus-configMap.yaml)
- [Black box exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/prometheus/prometheus-scrape-configuration/02-prometheus-configMap.yaml)
- [cAdvisor](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/prometheus/prometheus-scrape-configuration/02-prometheus-configMap.yaml)

[Detailed setup guide for Prometheus deployment with scrape configuration](../integrations/prometheus)

_Service monitors:_

- **Chaos exporter**

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
```

- **Kube state metrics exporter**

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app.kubernetes.io/name: kube-state-metrics
    app.kubernetes.io/version: latest
    k8s-app: kube-state-metrics
  name: kube-state-metrics
  namespace: monitoring
spec:
  endpoints:
    - bearerTokenFile: /var/run/secrets/kubernetes.io/serviceaccount/token
      honorLabels: true
      interval: 30s
      port: http-metrics
      relabelings:
        - action: labeldrop
          regex: (pod|service|endpoint|namespace)
      scheme: http
      scrapeTimeout: 30s
      tlsConfig:
        insecureSkipVerify: true
    - bearerTokenFile: /var/run/secrets/kubernetes.io/serviceaccount/token
      interval: 30s
      port: telemetry
      scheme: http
      tlsConfig:
        insecureSkipVerify: true
  jobLabel: app.kubernetes.io/name
  selector:
    matchLabels:
      app.kubernetes.io/name: kube-state-metrics
```

- [Node exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/metrics-exporters-with-service-monitors/node-exporter/service-monitor.yaml)
- [Black box exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/metrics-exporters-with-service-monitors/prometheus-blackbox-exporter-metrics/service-monitor.yaml)

[Detailed setup guide for Prometheus operator with service monitors](../integrations/prometheus)

##### Note:

- Scrape jobs as per (above links) can also be added under [this](https://github.com/prometheus-community/helm-charts/blob/9b3d4815bdefa71ef94ac0d474934c4aaebb3891/charts/kube-prometheus-stack/values.yaml#L2247) additionalScrapeConfigs for the [Prometheus community’s Kube prometheus stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md)

- Pod labels to be used with Prometheus operator installed via helm as part of the [Prometheus community’s Kube prometheus stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md) configured for podMonitors or with [Prometheus’s inbuilt Kubernetes service discovery](https://github.com/prometheus-community/helm-charts/blob/9b3d4815bdefa71ef94ac0d474934c4aaebb3891/charts/kube-prometheus-stack/values.yaml#L2492)

_Chaos exporter_

> labels

```yaml
labels:
  app: chaos-exporter
  release: prometheus-stack
```

> pod monitor

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
```

_Black box exporter_

> labels

```yaml
labels:
  app: prometheus-blackbox-exporter
  release: prometheus-stack
```

> pod monitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: black-box-exporter-monitor
  namespace: monitoring
  labels:
    release: prometheus-stack
spec:
  selector:
    matchLabels:
      app: prometheus-blackbox-exporter
  namespaceSelector:
    matchNames:
      - monitoring
  podMetricsEndpoints:
    - port: http
    - interval: 1s
```

[Detailed setup guide for Prometheus operator with pod monitors](../integrations/prometheus)

#### For Multiple agents with multiple prometheus instances - scraping chaos-exporter metrics and events along with other metrics

<figure>
<img src={require('../assets/user-guides/observability/data-source/multiple-agents-multiple-prometheus.png').default} />
<i>Data flow and topological diagram</i>
</figure>

- Scrape job and service monitor remain same as in case of Control plane agent / self agent, the individual [Prometheus instances can be connected](configure-datasource) as separate data sources to the Chaos center. [Separate dashboards can be created](manage-app-dashboard) by selecting specific agents and their corresponding data source which is essentially a Prometheus time series database, collecting metrics from the agent cluster for application / infra metrics, chaos events and chaos verdicts.

#### For Multiple agents with single prometheus - scraping chaos-exporter metrics and events along with other metrics

- Separate dashboards can be created by selecting specific agents and the data source which is essentially a Prometheus time series database, collecting metrics from the agent cluster for application / infra metrics, chaos events and chaos verdicts.

<figure>
<img src={require('../assets/user-guides/observability/data-source/multiple-agents-single-prometheus.png').default} />
<i>Data flow and topological diagram</i>
</figure>

_Scrape jobs:_

- **Chaos-exporter - agent-1**

```yaml
- job_name: 'chaos-exporter-agent-1'
  static_configs:
    - targets: ['<AGENT_1_CHAOS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP:8080>']
```

- **Chaos-exporter - agent-2**

```yaml
- job_name: 'chaos-exporter-agent-2'
  static_configs:
    - targets: ['<AGENT_2_CHAOS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP:8080>']
```

- **Kube state metrics exporter - agent-1**

```yaml
- job_name: 'kube-state-metrics-agent-1'
  static_configs:
    - targets: ['<AGENT_1_KUBE_STATE_METRICS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP:8080>']
```

- **Kube state metrics exporter - agent-2**

```yaml
- job_name: 'kube-state-metrics-agent-2'
  static_configs:
    - targets: ['<AGENT_2_KUBE_STATE_METRICS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP:8080>']
```

- [Node exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/prometheus/prometheus-scrape-configuration/02-prometheus-configMap.yaml)
- [Black box exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/prometheus/prometheus-scrape-configuration/02-prometheus-configMap.yaml)
- [cAdvisor](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/prometheus/prometheus-scrape-configuration/02-prometheus-configMap.yaml)

[Detailed setup guide for Prometheus deployment with scrape configuration](../integrations/prometheus)

_Service endpoint, spec and monitors:_

- **Chaos-exporter - agent-1**

```yaml
kind: Service
apiVersion: v1
metadata:
  name: chaos-exporter-agent-1
  namespace: monitoring
spec:
  type: ClusterIP
  ports:
    - name: tcp
      port: 8080
      targetPort: 8080
---
kind: Endpoints
apiVersion: v1
metadata:
  name: chaos-exporter-agent-1
  namespace: monitoring
subsets:
  - addresses:
      - ip: <AGENT_1_CHAOS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP>
    ports:
      - name: tcp
        port: 8080
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    k8s-app: chaos-exporter-agent-1
  name: chaos-exporter-agent-1
  namespace: monitoring
spec:
  jobLabel: app
  selector:
    matchLabels:
      app: chaos-exporter-agent-1
  namespaceSelector:
    matchNames:
      - monitoring
  endpoints:
    - interval: 1s
      port: tcp
```

- **Chaos-exporter - agent-2**

```yaml
kind: Service
apiVersion: v1
metadata:
  name: chaos-exporter-agent-2
  namespace: monitoring
spec:
  type: ClusterIP
  ports:
    - name: tcp
      port: 8080
      targetPort: 8080
---
kind: Endpoints
apiVersion: v1
metadata:
  name: chaos-exporter-agent-2
  namespace: monitoring
subsets:
  - addresses:
      - ip: <AGENT_2_CHAOS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP>
    ports:
      - name: tcp
        port: 8080
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    k8s-app: chaos-exporter-agent-2
  name: chaos-exporter-agent-2
  namespace: monitoring
spec:
  jobLabel: app
  selector:
    matchLabels:
      app: chaos-exporter-agent-2
  namespaceSelector:
    matchNames:
      - monitoring
  endpoints:
    - interval: 1s
      port: tcp
```

- **Kube state metrics exporter - agent-1**

```yaml
kind: Service
apiVersion: v1
metadata:
  name: kube-state-metrics-agent-1
  namespace: monitoring
spec:
  type: ClusterIP
  ports:
    - name: tcp
      port: 8080
      targetPort: 8080
---
kind: Endpoints
apiVersion: v1
metadata:
  name: kube-state-metrics-agent-1
  namespace: monitoring
subsets:
  - addresses:
      - ip: <AGENT_1_KUBE_STATE_METRICS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP>
    ports:
      - name: tcp
        port: 8080
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    k8s-app: kube-state-metrics-agent-1
  name: kube-state-metrics-agent-1
  namespace: monitoring
spec:
  jobLabel: app
  selector:
    matchLabels:
      app: kube-state-metrics-agent-1
  namespaceSelector:
    matchNames:
      - monitoring
  endpoints:
    - interval: 30s
      port: tcp
```

- **Kube state metrics exporter - agent-2**

```yaml
kind: Service
apiVersion: v1
metadata:
  name: kube-state-metrics-agent-2
  namespace: monitoring
spec:
  type: ClusterIP
  ports:
    - name: tcp
      port: 8080
      targetPort: 8080
---
kind: Endpoints
apiVersion: v1
metadata:
  name: kube-state-metrics-agent-2
  namespace: monitoring
subsets:
  - addresses:
      - ip: <AGENT_2_KUBE_STATE_METRICS_EXPORTER_SERVICE_PUBLIC_HOSTNAME/IP>
    ports:
      - name: tcp
        port: 8080
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    k8s-app: kube-state-metrics-agent-2
  name: kube-state-metrics-agent-2
  namespace: monitoring
spec:
  jobLabel: app
  selector:
    matchLabels:
      app: kube-state-metrics-agent-2
  namespaceSelector:
    matchNames:
      - monitoring
  endpoints:
    - interval: 30s
      port: tcp
```

- [Node exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/metrics-exporters-with-service-monitors/node-exporter/service-monitor.yaml)
- [Black box exporter](https://github.com/litmuschaos/litmus/blob/master/monitoring/utils/metrics-exporters-with-service-monitors/prometheus-blackbox-exporter-metrics/service-monitor.yaml)

[Detailed setup guide for Prometheus operator with service monitors](../integrations/prometheus.md)

### Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/fi-vhKE5vKI?start=2040" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Learn more

- [Observability Setup](observability-set-up.md)
- [Configure Data Source](configure-datasource.md)
- [Manage Application Dashboards](manage-app-dashboard.md)
