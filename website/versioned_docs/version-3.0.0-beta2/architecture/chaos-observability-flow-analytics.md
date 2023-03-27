---
id: chaos-observability-flow-analytics
title: Analytics
sidebar_label: Analytics
---

---

<img src={require("../assets/chaos-observability-flow-analytics.png").default} alt="Chaos Observability Flow Analytics" />

Analytics is an integral part of Chaos Engineering, as it offers key insights that are required to fully understand a system during the chaos and functions as a decision-making tool for improving system resiliency.

In Litmus, chaos scenario run statistics and information are generated post the chaos scenario execution, which can be accessed directly using the ChaosCenter.

## Observability Flow for Analytics

1. In the Chaos Execution Plane, the ChaosEngine Details and ChaosResult are fetched by the Chaos Delegate.
2. Chaos Delegate then forwards them to the Backend Server in the Chaos Control Plane and later they get stored into the Database.
3. User specifies the Chaos Scenario Schedule for which the Chaos Scenario statistics and information is to be fetched as an input in the ChaosCenter.
4. The request for the Chaos Scenario statistics and information is received by the Backend Server.
5. Backend Server queries the Database for the details of past Chaos Scenario Runs.
6. Aggregated Chaos Scenario statistics based on the ChaosResult verdict and probe success percentage are fetched from the Database by Backend Server.
7. Chaos Scenario statistics and information are forwarded to ChaosCenter by Backend Server.
