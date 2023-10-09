---
id: architecture-summary
title: Architecture Summary
sidebar_label: Architecture Summary
---

---

<img src={require("../assets/architecture-summary.png").default} alt="Architecture Overview" />

The Litmus architecture can be segregated into two parts:

1. **Control Plane:** Contains the components required for the functioning of ChaosCenter, the website-based portal for Litmus.

2. **Execution Plane:** Contains the components required for the injection of chaos in the target resources.

ChaosCenter can be used for creating and scheduling Chaos Experiments, a set of chaos faults defined in a definitive sequence to achieve desired chaos impact on the target resources upon execution. Users can log in to the ChaosCenter using valid login credentials and leverage the interactive web UI to define their chaos experiment to target multiple aspects of their infrastructure. Once the user creates a Chaos Experiment using the ChaosCenter, it is passed on to the Execution Plane. The Execution Plane can be present either in the host cluster containing the Control Plane if the self chaos infrastructure is being used, or in the target cluster if an external chaos infrastructure is being used. The Execution Plane interprets the Chaos Experiment as a list of steps required for injecting chaos into the target resources. It ensures efficient orchestration of chaos in cloud-native environments using various Kubernetes CRs. Once the Chaos Experiment is executed, Execution Plane sends the chaos result to the Control Plane for their post-processing using either the built-in monitoring dashboard of Litmus or using external observability tools such as Prometheus DB and Grafana dashboard. Litmus also achieves automated Chaos Experiment runs to execute chaos as part of the CI/CD pipeline based on a set of defined conditions using GitOps.

:::note
With the latest release of LitmusChaos 3.0.0:

<li>The term <b>Chaos Delegate/Agent</b> has been changed to <b>Chaos Infrastructure.</b> </li>
<li>The term <b>Chaos Experiment</b> has been changed to <b>Chaos Fault.</b> </li>
<li>The term <b>Chaos Scenario/Workflow</b> has been changed to <b>Chaos Experiment.</b></li>
:::
