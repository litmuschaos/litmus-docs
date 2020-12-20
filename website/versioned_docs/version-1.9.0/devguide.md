---
id: devguide
title: Developer Guide for ChaosCharts
sidebar_label: Developer Guide
original_id: devguide
---

---

This page serves as a guide to develop either a new ChaosChart or a new experiment in a ChaosChart which are published at <a href="https://hub.litmuschaos.io" target="_blank">ChaosHub</a>.

Below are some key points to remember before understanding how to write a new chart or an experiment.

> ChaosCharts repository : https://github.com/litmuschaos/chaos-charts
>
> Litmusbooks repository : https://github.com/litmuschaos/litmus-ansible/tree/master/experiments
>
> Website rendering code repository: https://github.com/litmuschaos/charthub.litmuschaos.io

The experiments & chaos libraries are typically written in Ansible, though not mandatory. Ensure that
the experiments can be executed in a container & can read/update the litmuschaos custom resources. For example,
if you are writing an experiment in Go, use this [clientset](https://github.com/litmuschaos/chaos-operator/tree/master/pkg/client)

<hr/>

## Glossary

### ChaosChart

A group of ChaosExperiments put together in a YAML file. Each group or chart has a metadata manifest called `ChartServiceVersion`
that holds data such as `ChartVersion`, `Contributors`, `Description`, `links` etc.., This metadata is rendered on the ChartHub.
A ChaosChart also consists of a `package` manifest that is an index of available experiments in the chart.

Here is an example of the [ChartServiceVersion](https://github.com/litmuschaos/chaos-charts/blob/master/charts/generic/generic.chartserviceversion.yaml) & [package](https://github.com/litmuschaos/chaos-charts/blob/master/charts/generic/generic.package.yaml) manifests of the generic ChaosChart.

### ChaosExperiment

ChaosExperiment is a CRD that specifies the nature of a ChaosExperiment. The YAML file that constitutes a ChaosExperiment CR
is stored under a ChaosChart of ChaosHub and typically consists of low-level chaos parameters specific to that experiment, set
to their default values.

Here is an example chaos experiment CR for a [pod-delete](https://github.com/litmuschaos/chaos-charts/blob/master/charts/generic/pod-delete/experiment.yaml) experiment

### Litmus Book

Litmus book is an `ansible` playbook that encompasses the logic of pre-checks, chaos-injection, post-checks, and result-updates.
Typically, these are accompanied by a Kubernetes job that can execute the respective playbook.

Here is an example of the litmus book for the [pod-delete](https://github.com/litmuschaos/litmus-ansible/tree/master/experiments/generic/pod_delete) experiment.

### Chaos functions

The `ansible` business logic inside Litmus books can make use of readily available chaos functions. The chaos functions are available as `task-files` which are wrapped in one of the chaos libraries. See [plugins](plugins.md) for more details.

<hr/>

## Developing a ChaosExperiment

A detailed how-to guide on developing chaos experiments is available [here](https://github.com/litmuschaos/litmus-ansible/tree/master/contribute/developer_guide)

<br/>

<hr/>

<br/>

<br/>
