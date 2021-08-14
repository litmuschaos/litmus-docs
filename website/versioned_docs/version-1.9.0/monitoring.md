---
id: monitoring
title: Monitoring
sidebar_label: Monitoring
original_id: monitoring
---

---

### Monitoring Chaos

Chaos Engineering is the discipline of experimenting on a system to build confidence in the system’s capability to withstand turbulent conditions in production. Monitoring system's resilience and its performance under chaos are one of the fundamental principles of chaos engineering.

Building a hypothesis around steady-state behaviour, varying real-world events, running experiments in production, automating them to run as a workflow in CI pipelines, and minimizing the blast radius are some advanced chaos practices. These are all backed by extensive monitoring infrastructure managed by SREs heading IT operations. Monitoring chaos and performance metrics is an observability paradigm providing real-time insights into the four golden signals for monitoring distributed systems namely, latency, traffic, errors, and saturation.

### LitmusChaos plugins for monitoring

LitmusChaos facilitates real-time monitoring for events using litmus event router and for metrics using our native chaos exporter. These events and metrics can be exported into any TSDBs (Time-series databases) to overlay on top of application performance graphs and also as additional visualizations for chaos testing statistics. To set up or configure your monitoring infrastructure to support litmus chaos events and metrics, we provide both service endpoints and service monitors setup and pre-configured Grafana dashboards overlayed with chaos events and gauges for chaos experiment statistics. Interleaving application dashboards can be achieved by using a TSDB data source configured for litmus metrics and events.

### How to setup/configure monitoring infrastructure?

- Clone the litmus repo

  ```bash
  git clone https://github.com/litmuschaos/litmus.git
  cd litmus/monitoring
  ```

- Switch to Utilities

  ```bash
  cd utils
  ```

- Create monitoring namespace on the cluster

  ```
  kubectl create ns monitoring
  ```

- Create the operator to instantiate all CRDs

  ```
  kubectl -n monitoring apply -f prometheus/prometheus-operator/
  ```

- Deploy native K8s, AUT and litmus monitoring components in their respective namespaces.

  ```
  kubectl -n monitoring apply -f metrics-exporters-with-service-monitors/node-exporter/
  kubectl -n monitoring apply -f metrics-exporters-with-service-monitors/kube-state-metrics/
  kubectl -n monitoring apply -f alert-manager-with-service-monitor/
  kubectl -n sock-shop apply -f sample-application-service-monitors/sock-shop/
  kubectl -n litmus apply -f metrics-exporters-with-service-monitors/litmus-metrics/chaos-exporter/
  kubectl -n litmus apply -f metrics-exporters-with-service-monitors/litmus-metrics/litmus-event-router/
  ```

- Deploy Prometheus instance and all the service monitors for targets

  ```
  kubectl -n monitoring apply -f prometheus/prometheus-configuration/
  ```

- Apply the Grafana manifests after deploying Prometheus for all metrics.

  ```
  kubectl -n monitoring apply -f grafana/
  ```

- Access the Grafana dashboard via the LoadBalancer (or NodePort) service IP or a port-forward operation on localhost

  Note: To change the service type to NodePort, perform a `kubectl edit svc prometheus-k8s -n monitoring` and replace
  `type: LoadBalancer` to `type: NodePort`

  ```
  kubectl get svc -n monitoring
  ```

  Default username/password credentials: `admin/admin`

- Add the Prometheus data source from monitoring namespace as DS_PROMETHEUS for Grafana via the Grafana Settings menu

  ![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/data-source-config.png?raw=true)

- Import the Grafana dashboards

  ![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/import-dashboard.png?raw=true)

- Import the Grafana dashboard "Sock-Shop Performance" provided [here](https://raw.githubusercontent.com/litmuschaos/litmus/master/monitoring/grafana-dashboards/sock-shop/Sock-Shop-Performance-Under-Chaos.json)

- Import the Grafana dashboard "Node and Pod Chaos Demo" provided [here](https://raw.githubusercontent.com/litmuschaos/litmus/master/monitoring/grafana-dashboards/kubernetes/Node-and-pod-metrics-dashboard.json)

### How to interleave chaos events with existing application metric graphs?

- Write queries for Prometheus or other TSDBs using ChaosEngine Name as label selector.

  ```json
  heptio_eventrouter_normal_total{reason="ChaosEngineInitialized",involved_object_namespace="litmus",involved_object_name="orders-pod-memory-hog",involved_object_kind="ChaosEngine"} - on () (heptio_eventrouter_normal_total{reason="ChaosEngineCompleted",involved_object_namespace="litmus",involved_object_name="orders-pod-memory-hog",involved_object_kind="ChaosEngine"} OR on() vector(0))
  ```

- Add the queries as Grafana annotations.

  ```json
    {
      "datasource": "${DS_DS_PROMETHEUS}",
      "enable": true,
      "expr": "heptio_eventrouter_normal_total{reason="ChaosEngineInitialized", involved_object_namespace="litmus", involved_object_name="orders-pod-memory-hog", involved_object_kind="ChaosEngine"} - on () (heptio_eventrouter_normal_total{reason="ChaosEngineCompleted", involved_object_namespace="litmus", involved_object_name="orders-pod-memory-hog", involved_object_kind="ChaosEngine"} OR on() vector(0))",
      "hide": false,
      "iconColor": "#F2CC0C",
      "limit": 100,
      "name": "orders-pod-memory-hog",
      "showIn": 0,
      "step": "30s",
      "tagKeys": "Chaos-orders-pod-memory-hog",
      "tags": [],
      "textFormat": "",
      "titleFormat": "orders-pod-memory-hog",
      "type": "tags"
    },
  ```

  or on each graph as a second Y-axis value with a label.

  ```json
    {
      "expr": "heptio_eventrouter_normal_total{reason="ChaosInject", involved_object_name="orders-pod-memory-hog", involved_object_namespace="litmus", involved_object_kind="ChaosEngine"} - on () (heptio_eventrouter_normal_total{reason="ChaosEngineCompleted", involved_object_name="orders-pod-memory-hog", involved_object_namespace="litmus", involved_object_kind="ChaosEngine"} OR on() vector(0))",
      "interval": "",
      "legendFormat": "orders-pod-memory-hog",
      "refId": "E"
    },
  ```

### How to obtain gauge metrics of chaos exporter?

- Write queries for Prometheus or other TSDBs using job name as label selector.

  ```json
  sum(chaosengine_experiments_count{engine_namespace="litmus",job="chaos-monitor"})
  ```

### Observe chaos on Application under test and native K8s resources.

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/Sock-Shop-Dashboard.png?raw=true)

![image](https://github.com/litmuschaos/litmus/blob/master/monitoring/screenshots/Node-and-Pod-metrics-Dashboard.png?raw=true)
