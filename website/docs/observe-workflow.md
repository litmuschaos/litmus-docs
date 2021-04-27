---
id: observe-workflow
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
<img src={require('./assets/argo-graph.png').default} width="800" />
<i>Fig 1 : Graph of Kube Proxy Chaos workflow.</i>
</figure>

The graph consists of useful information such as :

- Phase of individual nodes.
- Total time taken for the nodes to execute.
- Structure of the experiments (Serial or Parallel experiments).
- **Logs of individual nodes**: The user can click on the nodes to get the logs of that particular step. If the revert-chaos step is disabled, the complete logs are available which include the runner pod logs and the chaos logs.
- **Chaos Results** : Once the experiment completes, the Chaos Results are also available alongside the logs. The Chaos results are directly fetched from the ChaosResult CRD.

<figure>
<img src={require('./assets/node-details.png').default} width="1000" />
<i>Fig 2 : Graph of Kube Proxy Chaos workflow with chaos logs and chaos result of pod-memory-hog experiment.</i>
</figure>
