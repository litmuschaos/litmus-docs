---
id: visualize-workflow
title: Visualize the Chaos Scenario Execution
sidebar_label: Visualize Chaos Scenario
---

---

Visualization is an important aspect while doing chaos engineering. It allows the user to discover and inspect different changes that occur during a Chaos Scenario execution. <br/>
With ChaosCenter, the real-time data and status of the chaos scenarios can be observed. Valuable information like pod logs, chaos scenario status, chaos results can also be viewed.

## Prerequisites

The following should be required before creating a Chaos Scenario:

- ChaosCenter
- [Chaos Scenarios](chaos-workflow.md)

## Litmus Chaos Scenario

After scheduling a chaos scenario, you are redirected to the Litmus Chaos Scenario page which is divided into 2 sections `Runs` and `Schedules`.

### Runs

This section consists the list of individual chaos scenario
runs and its related data like `Chaos Scenario Name`, `Status`, `Reliability Score` etc. <br/>
This table displays the real-time status of the chaos scenarios.

### Schedules

This section consists the list of chaos scenario schedules.
These schedules can consist one time chaos scenario runs or Cron Chaos Scenarios. User can perfom serveral operations in this table, few of them are listed below:

- Disable a Cron Chaos Scenario
- Download the chaos scenario manifest
- Save the chaos scenarios as a template
- Edit a schedule
- Re-run a chaos scenario etc

## Visualize a Litmus Chaos Scenario

To observe a chaos scenario, user can either click on the chaos scenario name or click on the three dots and select `Show the chaos scenario` option in the runs table.<br/>
<img src={require('../assets/workflow-observe-select.png').default} width="800" />

The Chaos Scenario Details page is divided into 2 sections:

- **Graph View**: In this section a realtime graph of the chaos scenario is displayed. This graph contains valuable information regarding the status of individual steps of the chaos scenario.<br/><br/>
  <img src={require('../assets/workflow-observe-running.png').default} width="800" /><br/><br/>
  To view the details of the step, you can click on the individual nodes. This will open a field which displays the node details and the logs related to it.
  <br/><br/>
  <img src={require('../assets/workflow-observe-log.png').default} width="800" />

:::note
If the selected node is an experiment pod which consists of ChaosEngine CRD, a button to Download the logs will be available. Similarly, a tab named `Chaos Results` will also be available, which displays the ChaosResult of the experiment once the chaos scenario execution is completed.
:::

- **Table View** : Similar to the Graph View, this tab consists the table view of the chaos scenario. The table consists of the different chaos scenario steps along with their status. <br/><br/>
  <img src={require('../assets/workflow-observe-table.png').default} width="800" />
  <br/><br/>
  On clicking the <b>View Logs & Results</b> button in the table, a pop-over is displayed with the logs of the selected step. <br/><br/>
  <img src={require('../assets/workflow-observe-table-logs.png').default} width="800" />

## Summary

After scheduling a chaos scenario, a user can view the details of the running chaos scenario from the ChaosCenter. ChaosCenter provides a realtime graph that is used to visualise the chaos scenario and get the details of individual step of the chaos scenario. Important details like the logs and target applications can be viewed from ChaosCenter. These logs are also downloadable. User can view the details in 2 different ways i.e `Graph View` and `Table View`. Once the chaos scenario exection is completed, the resiliency score is calcualted and the ChaosResult for the ChaosEngine pods are available now.

## Learn More

- [Explore Probes](probes.md)
- [What is a Chaos Scenario](chaos-workflow.md)
- [Examine the ChaosResult](chaos-result.md)
