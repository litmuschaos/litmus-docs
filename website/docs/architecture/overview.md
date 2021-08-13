---
id: overview
title: Overview
sidebar_label: Overview
---

---
<img src={require("../assets/architecture-overview.png").default} alt="Architecture Overview" />

The Litmus architecture can be segregated into two parts:

1. **Control Plane:** Contains the components required for the functioning of Chaos Center, the website based portal for Litmus.

2. **Execution Plane:** Contains the components required for the injection of chaos in the target resources.

Chaos Center can be used for creating, scheduling, and monitoring Chaos Workflows, a set of chaos experiments defined in a definitive sequence to achieve desired chaos impact on the target resources upon execution. Users can login to the Chaos Center using valid login credentials and use the interactive web UI to define their chaos workflow to target multiple aspects of their infrastructure. Once the user creates a Chaos Workflow using the Chaos Center, it is passed on to the Execution Plane. The Execution Plane can be present either in the host cluster containing the Control Plane if the self agent is being used, or in the target cluster if external agent is being used. The Execution Plane interprets the Chaos Workflow as a list of steps required for injecting chaos into the target resources. It ensures efficient orchestration of chaos in cloud-native environments using various Kubernetes CRs. Once the Chaos Workflow is executed, Execution Plane sends the chaos result to the Control Plane for their post-processing using either the built-in monitoring dashboard of Litmus or using external observability tools such as Prometheus DB and Grafana dashboard. Litmus also achieves automated Chaos Workflow runs to execute chaos as part of the CI/CD pipeline based on a set of defined conditions using GitOps. 

The Architecture section contains the component overview, sequence diagrams and description of flow of information through the Litmus architecture.

### [Control Plane](control-plane)

Consists of micro-services responsible for the functioning of the ChaosCenter, the web based portal used for creating, scheduling, and monitoring chaos workflows.

### [Execution Plane](execution-plane)

Contains the components required for the orchestration of chaos injection in the target resources.

### [Chaos Experiment Flow](chaos-experiment-flow)

Flow of information during the execution of Litmus chaos experiments, grouped into the categories such as pod-level, node-level, application-level, and public-cloud.

### [Chaos Observability Flow](chaos-observability-flow)

Information flow for monitoring and observability during and post chaos using built-in Litmus analytics dashboard as well as external observability tools.
