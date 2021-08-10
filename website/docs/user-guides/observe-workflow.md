---
id: observe-workflow
title: Observe Workflow
sidebar_label: Observe Workflow
---

## Before you begin

You must schedule a workflow. To know more about scheduling workflows click [here](schedule-workflow)

---

After scheduling a workflow, the user can track the status of the workflow run from the `Runs` tab in the `Litmus Workflow`. The status that is currently displayed are:

- Failed
- Running
- Completed

<figure>
<img src={require('../assets/user-guides/injecting-fault/observe-workflow/runs-table.png').default} alt="Workflow Runs Table showing a Running Workflow" />
<i>Workflow Runs Table showing a Running Workflow</i>
</figure>

---

The user can analyze a workflow using two methods:

## Visualize the workflow run graph

After scheduling a workflow, the user can click on the **Show the workflow** option or click on the wor to see the real-time graph of the workflow.

<figure>
<img src={require('../assets/user-guides/injecting-fault/observe-workflow/running-workflow.png').default} alt="Workflow Runs Graph of Podtato Head workflow" />
<i>Graph of Podtato Head workflow</i>
</figure>

The graph consists of useful information such as :

- Phase of individual nodes.
- Total time taken for the nodes to execute.
- Structure of the experiments (Serial or Parallel experiments).

## View logs of individual nodes

The user can click on the nodes to get the logs of that particular step. If the revert-chaos step is disabled, the complete logs are available which include the runner pod logs and the chaos logs.

<figure>
<img src={require('../assets/user-guides/injecting-fault/observe-workflow/running-workflow-with-logs.png').default} alt="Workflow Runs Podtato Head workflow with Logs" />
<i>Podtato Head workflow with Logs</i>
</figure>

## View chaos results

Once the experiment completes, the [Chaos Results](../concepts/chaos-results) are also available alongside the logs. The Chaos Results are directly fetched from the ChaosResult CRD.

<figure>
<img src={require('../assets/user-guides/injecting-fault/observe-workflow/completed-workflow-with-chaos-results.png').default} alt="Podtato Head workflow with chaos logs and chaos result of pod-delete experiment" />
<i>Podtato Head workflow with chaos logs and chaos result of generic/pod-delete experiment</i>
</figure>

## Learn more

- [Edit Schedule](edit-schdule)
- [Download Workflow Manifest](download-workflow-manifest)
- [Re-run a Workflow](re-run-workflow)
