---
id: chaos-observability-flow-summarisation
title: Summarisation
sidebar_label: Summarisation 
---

---

<img src={require("../assets/chaos-observability-flow-summarisation.png").default} alt="Chaos Observability Flow Summarisation" />

Summarisation is the process of aggregating the information pertaining to a Chaos Experiment's execution over time. 

In Litmus, summarisation is performed using the ChaosResult CR. It stores all the information relevant to a ChaosExperiment's execution over time, including events, experiment verdict, probe success percentage, target resource details, etc. 

## Observability Flow for Summarisation
1. In the Chaos Execution Plane, the ChaosEngine Details and ChaosResult are fetched by the Chaos Agent.
2. Chaos Agent then forwards them to the Backend Server in the Chaos Control Plane and later they get stored into the Database.
3. When a user requests for the ChaosResult for a particular Chaos Experiment using the ChaosCenter, the request is received by the Backend Server.
4. Backend Server queries the Database for the particular ChaosResult for the input Chaos Experiment.
5. The ChaosResult is fetched from the Database by the Backend Server. 
6. ChaosResult is forwarded to the ChaosCenter.
