---
id: chaos-observability-flow-logging
title: Logging
sidebar_label: Logging
---

---

<img src={require("../assets/chaos-observability-flow-logging.png").default} alt="Chaos Observability Flow Logging" />

Logging is a pivotal observability aspect in LitmusChaos as it allows the user to track the exact system behavior during the scenario of a chaos. The logs can be classified into one of the following:

- **Litmus Checker Logs:** Logs generated as part of the validation for chaos resources that are required to execute a chaos experiment.
- **Experiment Logs:** Logs generated as part of the steps performed during the chaos experiment, including pre-chaos check logs, chaos injection logs, chaos probes logs, and post-chaos check logs.
- **Non-Chaos Scenario Step Logs:** Logs generated as part of the chaos scenario steps that facilitate the execution of the chaos experiment, such as chaos experiment installation step logs, chaos revert step logs, etc.

## Observability Flow for Logging

1. User requests the logs for any particular chaos scenario step using the ChaosCenter.
2. The request for the logs is received by the Backend Server and is forwarded to the Subscriber.
3. The subscriber checks if the chaos scenario step is a Chaos Experiment step or not.
4. If the chaos scenario step is a Chaos Experiment step, then the Litmus Checker logs and the Chaos Experiment Logs are fetched from the ChaosEngine CR by the subscriber. Else, the logs of the chaos scenario step pod is fetched from the respective chaos scenario step pod by the subscriber.
5. The fetched logs are returned to the Backend Server, which returns them to the ChaosCenter.
