---
id: chaos-observability-flow-summary
title: Summary
sidebar_label: Summary 
---

---

Observability in Litmus serves a two-fold cause:

1. To provide the right hooks to APM platforms so as to enable visualization and understand the behavior of application/microservices under chaotic conditions.

2. Ability to gather, record & factor in data provided by standard observability frameworks as part of SLO validation in automated chaos experiment runs - the results of which can be stored & analyzed as experiment “verdicts” or “metadata”. 

Chaos Observability in Litmus can be sectioned into the following:
1. **Visualising Chaos Workflow (Visualization)** 
  - **Workflow Execution Graph:** Workflow execution graph consisting of nodes which are representative of the various steps performed as part of the chaos workflow.
2. **Fetching Logs (Logging)**
  - Litmus Checker Logs
  - Experiment Logs
  - Non-Chaos Workflow Logs
3. **Monitoring Systems in Real Time During chaos (Monitoring)**
  - Metrics
  - Events
4. **Viewing Experiment Verdict and Summary (Summarization)**
  - **Chaos Result:** Refers to the ChaosResult CR, which accumulates and summarizes the various aspects of a chaos experiment, such as experiment verdict, probe success percentage, target resource details, etc.
5. **Analysing Aggregated results from workflow run history (Analytics)**
  - **Post-Chaos Analytics:** Refers to the workflow statistics generated post the chaos workflow execution.