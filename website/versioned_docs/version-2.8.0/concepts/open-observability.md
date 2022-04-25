---
id: open-observability
title: Open Observability
sidebar_label: Open Observability
---

---

Litmus 2.0 builds on principle of Open observability through observability hooks such as probes to validate steady state hypothesis along with chaos injection. Chaos exporter also provides prometheus metrics which can be used to generate alerts based on events and also to view chaos impact and application performance in terms of probe success percentage and experiment verdict. It provides for several integration points with Prometheus's alert manager and Grafana, also for the in-house application and infrastructure monitoring capabilities with chaos events, metadata and results.

## Prerequisites

The following should be required before knowing about Open observability hooks in litmus 2.0:

- [Probes](probes.md)
- [Application / Infra. monitoring](app-infra-monitoring.md)

## Probes

Litmus probes are pluggable checks that can be defined within the ChaosEngine for any chaos experiment. The experiment pods execute these checks based on the mode they are defined in & factor their success as necessary conditions in determining the verdict of the experiment (along with the standard `in-built` checks).

_Litmus currently supports four types of probes:_

- **httpProbe:** To query health/downstream URIs
- **cmdProbe:** To execute any user-desired health-check function implemented as a shell command
- **k8sProbe:** To perform CRUD operations against native & custom Kubernetes resources
- **promProbe:** To execute promql queries and match prometheus metrics for specific criteria

These probes can be used in isolation or in several combinations to achieve the desired checks.

More about Probes can be found [here](probes.md)

## Chaos exporter

Chaos exporter is a custom `Prometheus` and `CloudWatch` exporter to expose Litmus Chaos metrics. Typically deployed along with the chaos-operator deployment, which, in-turn is associated with all `chaosresults` in the cluster.

_Two types of metrics are exposed:_

#### AggregateMetrics:

These metrics are derived from all the `chaosresults` present inside WATCH_NAMESPACE. If WATCH_NAMESPACE is not defined then it derives metrics from all namespaces. It exposes total_passed_experiment, total_failed_experiment, total_awaited_experiment, experiment_run_count, experiment_installed_count metrics.

#### ExperimentScoped:

Individual experiment run status. It exposes passed_experiment, failed_experiment, awaited_experiment, probe_success_percentage, startTime, endTime, totalDuration, chaosInjectTime metrics

All metrics exported from chaos exporter can be found [here](https://github.com/litmuschaos/chaos-exporter)

## Integrations

- [Prometheus](../integrations/prometheus)

- [Grafana](../integrations/grafana)

- [AlertManager](https://github.com/litmuschaos/tutorials/issues/6)

## Summary

Litmus supports several kinds of `probes` and also has a `chaos-exporter` on it's execution plane on the target agent's cluster which is essential for interleaved monitoring, integrated alerts and to hook into existing observability infrastructure. Chaos experimentation is a lot about hypothesizing around the application and/or infrastructure behavior, controlling blast radius & measuring SLOs. SREs love to visualize the impact of chaos - either actively (live) or recorded (as with automated chaos tests)

## Resources

[Observability Considerations in Chaos: The Metrics Story](https://dev.to/ksatchit/observability-considerations-in-chaos-the-metrics-story-6cb)

[Monitoring Litmus Chaos Experiments](https://dev.to/ksatchit/monitoring-litmus-chaos-experiments-198a)

## Learn More

- [Prometheus](../integrations/prometheus)
- [Grafana](../integrations/grafana)
- [Application and infrastructure monitoring](app-infra-monitoring.md)
