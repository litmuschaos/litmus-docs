---
id: run-your-first-workflow
title: Run your First Chaos Workflow in 5 minutes
sidebar_label: Run Your First Workflow
---

---

Welcome to this scenario, in this section you will get an overview of how to execute a sample Litmus Workflow on your application to induce Chaos as well as to observe the results and resilience score.

## Prerequisites

Before starting with your first Chaos Workflow make sure the [Litmus ChaosCenter](resources#chaoscenter) is installed in either one of these scopes

- [Cluster Scope](../user-guides/chaoscenter-cluster-scope-installation.md)
- [Namespace Scope](../user-guides/chaoscenter-namespace-scope-installation.md)

## Aim of the scenario

In this scenario we will execute a pod-delete fault on a sample micro-service application called [Podtato Head](https://github.com/cncf/podtato-head/). This scenario will help you

- Install and execute a pod-delete fault on the [Podtato Head](https://github.com/cncf/podtato-head/) Application
- Visualize and analyze the chaos experiment

---

## Schedule your First Workflow

### Select the podtato-head predefined workflow

1. Click on <span style={{color: '#5B44BA'}}>**Schedule a Workflow**</span> from the ChaosCenter Homepage or from the top right button in the **Litmus Workflows** tab.

<img src={require("../assets/getting-started/run-your-first-workflow/schedule-workflow-from-homepage.png").default} width="350" alt="Schedule Workflow from Homepage" /> <img src={require("../assets/getting-started/run-your-first-workflow/schedule-workflow-from-litmus-workflows.png").default} width="350" alt="Schedule Workflow from Litmus Workflows" />

<br /> <br />

2. Select **Self Agent** as the target [ChaosAgent](resources#chaosagents) for Chaos Injection. This is where we'll select which ChaosAgent to choose as the Target Agent.

   <img src={require("../assets/getting-started/run-your-first-workflow/selecting-self-agent.png").default} alt="Selecting Self Agent" />

3. Expand the first radio button (To create a new workflow from Predefined Workflow Templates) and select **podtato-head** from the list of Predefined Workflows.

   <img src={require("../assets/getting-started/run-your-first-workflow/select-podtato-head.png").default} alt="Select Podtato Head" />

4. View the workflow details in the **Workflow Settings**, you can modify the name and description of the workflow to suit your needs.

   <img src={require("../assets/getting-started/run-your-first-workflow/workflow-settings-podtato-head.png").default} alt="Modify Details of Podtato Head Workflow" />

### Simulate the Workflow Steps Visualization

5. View the visualization of the Litmus Workflow you are about to execute. This step also allows for you to edit or modify the YAML/tunable if required. We would just stick with the default configurations for now.

   <img src={require("../assets/getting-started/run-your-first-workflow/podtato-head-tune-workflow.png").default} alt="Visualize Podtato Head Workflow" />

   > By default in the Podtato Head Workflow Template the steps to gracefully delete the Chaos Resources (`revert-chaos`) and also the Podtato Head application (`delete-application`) are present.

### Assign Weights to the Workflow Experiments

6. Assign weights to the chaos experiments that are part of the workflow using the slider. This is typically used when there are multiple experiments as part of a workflow. These weights influence the **Resilience Score** calculation for the chaos workflow.

   <img src={require("../assets/getting-started/run-your-first-workflow/adjust-weights-for-podtato-head.png").default} alt="Assign Weights for Workflow Experiments" />

### Schedule the Podtato-Head Workflow

7. Schedule the Litmus Workflow for immediate and one-time execution by selecting the **Schedule Now** option

   <img src={require("../assets/getting-started/run-your-first-workflow/choose-schedule.png").default} alt="Choose a Schedule for Workflow Execution" />

8. Verify and click on **Finish** to start the Chaos Injection

   <img src={require("../assets/getting-started/run-your-first-workflow/verify-and-commit-podtato-head.png").default} alt="Verify and Schedule the Podtato Head Workflow" />

### Congratulations

And with that you have successfully scheduled your first Chaos Workflow with Litmus.

<img src={require("../assets/getting-started/run-your-first-workflow/scheduled-successfully.png").default} alt="Podtato Head Workflow Scheduled Successfully" />

---

## Visualize and Analyze

1. To check the current progress of the Podtato-Head workflow, view the status of the Workflow from the **Litmus Workflows** Tab.

   <img src={require("../assets/getting-started/run-your-first-workflow/podtato-head-workflow-running.png").default} alt="Podtato Head Workflow in Running State" />

2. Litmus deploys a sample multi-replica hello-service application before going onto pull the pod-delete ChaosExperiment template. In the next step, it creates the ChaosEngine to launch the chaos injection via dedicated pods.

   To see all these steps live in action on the `workflow name` from the **Runs** Tab or select **Show the workflow** from the three dot menu.

   <img src={require("../assets/getting-started/run-your-first-workflow/podtato-head-workflow-in-action.png").default} alt="Podtato Head Workflow in Action" />

   To see them in action on the terminal itself watch the pods in the namespace where ChaosCenter is installed.

   > In this case we would consider ChaosCenter to be installed in the `litmus` namespace

   ```bash
   kubectl get pods -n litmus
   ```

   <span style={{color: 'green'}}><b>Expected Output</b></span>

   ```bash
   NAME                                        READY   STATUS              RESTARTS   AGE
   chaos-exporter-547b59d887-4dm58             1/1     Running             0          6h16m
   chaos-operator-ce-84ddc8f5d7-l8c6d          1/1     Running             0          6h16m
   event-tracker-5bc478cbd7-xlflb              1/1     Running             0          6h16m
   litmusportal-frontend-698bcb686f-xm4q5      1/1     Running             0          6h26m
   litmusportal-server-5bb94f65d7-llzng        2/2     Running             1          6h26m
   mongo-0                                     1/1     Running             0          6h26m
   pod-delete-llu29u-vh8w9                     1/1     Running             0          21s
   podtato-5554584d7-68bts                     1/1     Running             0          94s
   podtato-5554584d7-cjmv6                     0/1     ContainerCreating   0          2s
   podtato-5554584d7-z4cwl                     0/1     Terminating         0          94s
   podtato-head-chaos-1622018315-1170130526    0/2     Completed           0          112s
   podtato-head-chaos-1622018315-3739956689    2/2     Running             0          31s
   podtato-head-chaos-1622018315-80657052      0/2     Completed           0          79s
   podtato-head-pod-delete-chaosx55vh-runner   1/1     Running             0          25s
   subscriber-958948965-qbx29                  1/1     Running             0          6h16m
   workflow-controller-78fc7b6c6-w82m7         1/1     Running             0          6h16m
   ```

3. Post Chaos Execution view the Experiment Results. Click on the **pod-delete** node on the graph to launch a results console. Click on the **Chaos Results** tab to view the details around success/failure of the steady-state hypothesis constraints (podtato-head website availability through pod deletion period) and the experiment verdict.

   <img src={require("../assets/getting-started/run-your-first-workflow/chaos-result-of-podtato-head.png").default} alt="ChaosResult of Podtato Head" />

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/hcPvbDSPdeo?start=871" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Beginner Friendly Resources

✨ Below is a list of beginner-level resources, everything you need to get started in your Cloud-Native Chaos Engineering journey ✨

[List of Beginner Friendly Resources](https://github.com/litmuschaos/litmus/tree/master/resources)

## Various Ways of Learning Litmus

- [Learn Concept](../concepts/overview.md)
- [View User Guides](../user-guides/overview.md)
- [Learn by Running a sample Katakoda Scenario](https://www.katacoda.com/litmusbot/scenarios/getting-started-with-litmus)
