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
1. The Chaos Workflow run is specified by the user as an input using the ChaosCenter.
2. The request for workflow run statistics and information is served by the Backend Server.
3. The Backend Server queries the Database for the details of the ChaosEngines which were a part of the Chaos Workflow.
4. Fetched ChaosEngine details are fetched by the Backend Server.
5. Backend Server processes the fetched details and generates the workflow statistics and information using it.
6. Workflow statistics and information is returned to ChaosCenter.
