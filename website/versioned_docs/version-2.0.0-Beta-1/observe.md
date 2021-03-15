---
id: observe
title: How to Observe/Track a Workflow
sidebar_label: Observe
---

## Observe a Workflow

---

After scheduling a workflow, the user can track the status of the workflow from the Browse Workflow section. The status that are currently displayed are :
- Failed
- Running
- Succeeded

### 1. Workflow Analysis

The user can analyze a workflow using two methods: 

#### a. Visualize the workflow graph
After scheduling a workflow, the user can click on the **Show the workflow** option to see the real-time graph of the workflow.
<figure>
<img src={require('./assets/experiment-graph.png').default} width="800" />
<i>Fig 1 : Graph of Kube Proxy Chaos workflow with chaos logs and chaos result of node-cpu-hog experiment.</i>
</figure>

 The graph consists of useful information such as :
- Phase of individual nodes.
- Total time taken for the nodes to execute.
- Structure of the experiments (Serial or Parallel experiments).
- **Logs of individual nodes**: The user can click on the nodes to get the logs of that particular step. If the revert-chaos step is disabled, the complete logs are available which include the runner pod logs and the chaos logs.
- **Chaos Results** :  Once the experiment completes, the Chaos Results are also available alongside the logs. The Chaos results are directly fetched from the ChaosResult CRD. 

#### b. Analytics from the workflow table

Once the workflow execution completes, the user can click the **Show the analytics** option which opens up a time series graph of the workflow. This graph can be crucial to analyse the Cron Workflows. Each bar in the graph represents one run of the workflow. 
On hovering over the bar, the user can view the following information related to the workflow run: 
- Resilience Score
- Passed Tests
- Failed Tests

On clicking the bar, a table is shown below the graph which displays all the experiments present in the workflow run and their individual result points. These result points are then used to calculate the **Resilience Score** of the workflow which is displayed at the end of the table.
