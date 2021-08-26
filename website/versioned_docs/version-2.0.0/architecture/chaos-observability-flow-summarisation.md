---
id: chaos-observability-flow-summarisation
title: Summarisation
sidebar_label: Summarisation 
---

---

<img src={require("../assets/chaos-observability-flow-summarisation.png").default} alt="Chaos Observability Flow Summarisation" />

Summarisation offers an understanding of any Chaos Experiment in a concise manner. It can be regarded as the process of aggregation of relevant information related to a Chaos Experiment's execution and outcome. 

In Litmus, summarisation is performed using the ChaosResult CR. It stores all the information relevant to a Litmus Chaos Experiment'S execution and its outcome, including events, experiment verdict, probe success percentage, target resource details, etc.

## Observability Flow for Summarisation
1. In Chaos Execution Plane, the ChaosEngine CR is updated with the ChaosResult CR, during the execution of a Chaos Experiment.
2. ChaosResult CR is then fetched by the Subscriber and forwarded to the Backend Server in the Chaos Control Plane, which is then stored into the Database by the Backend Server.
3. When the user requests for the ChaosResult CR for a particular Chaos Experiment from the ChaosCenter, the request is received by the Backend Server.
4. Backend Server then queries the Database for the particular ChaosResult CR.
5. The Database returns the ChaosResult CR, which is fetched by the Backend Server and returned to the ChaosCenter.
