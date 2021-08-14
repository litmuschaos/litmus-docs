---
id: chaos-experiment
title: Chaos Experiment
sidebar_label: Chaos Experiment
---

---

The experiment execution is triggered upon creation of the ChaosEngine resource (various examples of which are provided under the respective experiments). Typically, these [Chaos Engines](chaos-engine) are embedded within the 'steps' of a Litmus Chaos Workflow. However, one may also create the Chaos Engines directly by hand, and the chaos-operator reconciles this resource and triggers the experiment execution.
​
Experiments are classified as
​

- Kubernetes Experiments
  - Generic
  - Node Chaos
- Application Chaos
- Cloud Infrastructure
  ​

Detailed Experiment docs can be found [here](https://litmuschaos.github.io/litmus/experiments/categories/getstarted/)
