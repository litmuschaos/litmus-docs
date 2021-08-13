---
id: architecture
original_id: architecture
title: Litmus Architecture
sidebar_label: Architecture
---

<hr/>

<img src={require("./assets/litmus-schematic.png").default} width="800" />

**Chaos-Operator**

Chaos-Operator watches for the ChaosEngine CR and executes the Chaos-Experiments mentioned in the CR. Chaos-Operator is namespace scoped. By default, it runs in `litmus` namespace. Once the experiment is completed, chaos-operator invokes chaos-exporter to export chaos metrics to a Prometheus database.

**Chaos-CRDs**

During installation, the following three CRDs are installed on the Kubernetes cluster.

`chaosengines.litmuschaos.io`

`chaosexperiments.litmuschaos.io`

`chaosresults.litmuschaos.io`

**Chaos-Experiments**

Chaos Experiment is a CR and are available as YAML files on <a href="https://hub.litmuschaos.io" target="_blank">ChaosHub</a>. For more details visit ChaosHub [documentation](chaoshub.md).

**Chaos-Engine**

ChaosEngine CR links application to experiments. User has to create ChaosEngine YAML by specifying the application label and experiments and create the CR. The CR is watched by Chaos-Operator and chaos-experiments are executed on a given application.

**Chaos-Exporter**

Optionally metrics can be exported to a Prometheus database. Chaos-Exporter implements the Prometheus metrics endpoint.

<br/>

<br/>

<hr/>

<br/>

<br/>
