---
id: d0-observe
title: How to Observe/Track a Workflow
sidebar_label: Observe Workflow
---

## Observe a Workflow

---

After scheduling a workflow, the user can track the status of the workflow from the Browse Workflow section. The status that is currently displayed are :

- Failed
- Running
- Completed

### 1. Workflow Analysis

The user can analyze a workflow using two methods:

#### a. Visualize the workflow graph

After scheduling a workflow, the user can click on the **Show the workflow** option to see the real-time graph of the workflow.

<figure>
<img src={require('./assets/node-details.png').default} width="800" />
<i>Fig 1 : Graph of Kube Proxy Chaos workflow with chaos logs and chaos result of pod-memory-hog experiment.</i>
</figure>

The graph consists of useful information such as :

- Phase of individual nodes.
- Total time taken for the nodes to execute.
- Structure of the experiments (Serial or Parallel experiments).
- **Logs of individual nodes**: The user can click on the nodes to get the logs of that particular step. If the revert-chaos step is disabled, the complete logs are available which include the runner pod logs and the chaos logs.
- **Chaos Results** : Once the experiment completes, the Chaos Results are also available alongside the logs. The Chaos results are directly fetched from the ChaosResult CRD.

#### b. Analytics from the workflow table

Once the workflow execution completes, the user can click the **Show the analytics** option which opens up a time series graph of the workflow. This graph can be crucial to analyse the Cron Workflows. Each bar in the graph represents one run of the workflow.
On hovering over the bar, the user can view the following information related to the workflow run:

- Resilience Score
- Passed Tests
- Failed Tests

On clicking the bar, a table is shown below the graph which displays all the experiments present in the workflow run and their individual result points. These result points are then used to calculate the **Resilience Score** of the workflow which is displayed at the end of the table.

### 2. Resilience Score Calculation

A Resilience Score is the measure of how resilient your workflow is considering all the chaos experiments and their individual result points. This calculation takes into account the individual experiment weights (from a range of 1-10) which are relative to each other.

#### **The Importance of Weights in experiments**

Giving a weightage to your experiment is a way of signifying/attaching the importance/priority of that experiment in your workflow. The higher the weight, the more importance it holds.

The weight priority is generally divided into three sections:
* <span style="color:#CA2C2C">0-3: Low Priority</span>
* <span style="color:#DBA017">4-6: Medium Priority</span>
* <span style="color:#109B67">7-10: High Priority</span>

#### **The Calculation**

Once a weight has been assigned to the experiment, we look for the [Probe Success Percentage](https://docs.litmuschaos.io/docs/litmus-probe/) for that experiment itself (Post Chaos) and calculate the total resilience result for that experiment as a multiplication of the weight given and the probe success percentage returned after the Chaos Run.

```doc
Total Resilience for one single experiment = (Weight Given to that experiment * Probe Success Percentage)
```
> If an experiment doesn't have a probe in it, the probe success percentage returned can either be 0 or 100 based on the experiment verdict. If the experiment passed then it returns 100 else 0.

The Final Resilience Score is calculated by dividing the sum of all the weights provided by the total test result of all the experiments combined in a single workflow.

For example, if we consider two experiments in a workflow, here is what the calculation would look like.
> Considering Probe Success Percentage is 100

| Experiment | Weight | Probe Success Percentage | Total Test Result |
| :------------- | :----------: | -----------: | -----------: |
| exp1 | 3 | 100 | (3 * 100) = 300 |
| exp2 | 9 | 100 | (9 * 100) = 900 |
|  | Weight Sum = 3 + 9 = 12 | | Total Test Result = 300 + 900 = 1200 |

```
Resilience Score = Total Test Result / Weight Sum 
                 = 1200 / 12 
                 = 100%
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/OuB3dS05DHU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>