---
id: chaos-observability-flow-analytics
title: Analytics
sidebar_label: Analytics 
---

---

<img src={require("../assets/chaos-observability-flow-analytics.png").default} alt="Chaos Observability Flow Analytics" />

Analytics is an integral part of Chaos Engineering, as it offers key insights that are required to fully understand a system during the chaos and functions as a decision-making tool for improving system resiliency.

In Litmus, workflow run statistics and information are generated post the chaos workflow execution, which can be accessed directly using the ChaosCenter.

## Observability Flow for Analytics
1. In the Chaos Execution Plane, the ChaosEngine Details and ChaosResult are fetched by the Chaos Agent.
2. Chaos Agent then forwards them to the Backend Server in the Chaos Control Plane and later they get stored into the Database.
3. User specifies the Chaos Workflow Schedule for which the workflow statistics and information is to be fetched as an input in the ChaosCenter.
4. The request for the workflow statistics and information is received by the Backend Server.
5. Backend Server queries the Database for the details of past Workflow Runs.
6. Aggregated workflow statistics based on the ChaosResult verdict and probe success percentage are fetched from the Database by Backend Server. 
7. Workflow statistics and information are forwarded to ChaosCenter by Backend Server.
