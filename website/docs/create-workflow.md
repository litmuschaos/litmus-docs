---
id: create-workflow
title: How to Create a Sample Workflow
sidebar_label: Create Workflow
---

---

Click on the **Schedule your first workflow** button on the home page to get started. It will take you to the workflow page where you can choose or design your own workflow by doing the following steps:

### 1. Choose Target Agent

This is the first step in workflow creation. In this step, you can select a target agent where the chaos workflow will be scheduled. These agents consist the CRDs and the required resources to run a chaos workflow.
While installing the Litmus Portal, a default agent named **Self Cluster** is created.

After Selecting the agent, you can continue by clicking on **Next** button.

```
Note:
 You may have to wait for the agent to be up and ready, after which you can move forward by again clicking on “Next”. Newly created users by the admin can’t schedule a workflow, As non-admin users, you will  get a message  ‘No Cluster Registered With Your Project ID, Please Wait…’   if you try to create a workflow.
```

### 2. Choose a Workflow

In this step, you can create a workflow from different methods, these include:

- **Create a new workflow from one of the pre-defined chaos experiment** : With this option, you can select a pre-defined workflow which is available in the connected ChaosHub. The default ChaosHub consists of 2 pre-defined workflows `podtato-head` and `sock-shop`.

- **Create a new workflow by cloning and existing workflow** : With this option, you can create a new workflow from an existing one. You an save an existing workflow as a template from the schedules tab present in the Browse Workflow section. You can provide a `workflow name` and `workflow description` to the template. After successfully saving the templates, you can view them here.

- **Create a new workflow using experiments from MyHub** : With this option, you can create custom workflows from the connected ChaosHubs.

- **Import workflow using YAML** : With this option, you can import a hand-crafted chaos workflow manifest and tune it according to the use-case.

### 3. Workflow Settings

In this section, you can change the name of the workflow and also provide a description to the workflow. This section also consists information regarding the namespace where the workflow will be scheduled.

### 4. Tune Workflow

This section consists of all the information related to the chaos workflow.
Some new and advanced features that are present in this section are :

1. **Workflow Visualization** : This feature allows you to visualize the workflow even before scheduling it.
   This gives a brief information related to the structure of workflow <i>i.e</i> if the experiments are present in serial or parallel way.
2. **Workflow Table** : This table contains the list of experiments present in the worklow. It also consists of some valuable information related to the target applications.
3. **Add Experiment** : If you have selected `Create a new workflow using experiments from MyHub` in Choose a Workflow step, you can see a `Add a new experiment` button, this will allow you to add more experiments to the workflow.
4. **Edit Workflow** : With this option, you can view and make changes in the workflow manifest with a YAML editor.
5. **Revert Chaos** : For custom workflows, you can now enable or disable the revert step from the portal.
   With revert step enabled, a new functionality called `podGC` is also added which deletes the workflow pods after the completion of workflow as part of the clean-up process.

Some of the other features that are included with Litmus Portal 2.0 are :

1. **Target Selection** : On the workflow table, you can select an experiment to edit the engine configuration directly from the portal. You can change the `annotationCheck` and `jobCleanUpPolicy` according to the use-case.
   You can also target the application by selecting the namespace and the respective label of that application. We have added a functionality to fetch the live data from the kubernetes cluster like the available namespaces and resources that you can target.

2. **Defining the steady state for the application** : With this step, you can add probes to your experiments. Probes are some additional checks that you can provide in your experiments. To know more about probes, you can visit [here](https://docs.litmuschaos.io/docs/litmus-probe/).

### 5. Reliability score

In this step, you can assign weights to the experiments present in the workflow. These weights will be then used for the calculation of the resilience score after the workflow completion. By default, 10 points are assigned to each experiment. This can be altered as per your use-case.

### 6. Schedule

In this step, you can schedule the workflow in 2 ways:

1. **Schedule now** : With this option, the workflow will start as soon as you schedule it.
2. **Recurring Schedule** : This option will allow you to schedule the workflow in recurring ways. It converts a normal workflow to `Cron` workflow and a cron syntax is added in the workflow manifest. The following methods are available to schedule a workflow in recurring ways:
   1. Every Hour
   2. Every Day
   3. Every Week
   4. Every Month

### 7. Verify and Commit

This is the final step in workflow creation process. In this step, you can validate all the changes related to the workflow like the workflow name, the experiment weights, workflow description, workflow manifest etc. Once you have verified all the changes, you can click the **Finish** button to start the schedule.
