---
id: schedule-workflow
title: Schedule a Chaos Scenario
sidebar_label: Schedule Chaos Scenario
---

---

## Before you begin

You must connect an Chaos Delegate before scheduling a chaos scenario . There might be a default `Self Chaos Delegate` automatically created or you can [connect an external Chaos Delegate ](../litmusctl/installation.md).

---

Click on the **Schedule a chaos scenario ** button on the home page or **Schedule chaos scenario ** button in Litmus Chaos Scenarios page to get started.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/home-schedule-button.png').default} alt="Home Page" />
<i>Home Page</i>
</figure>

It will take you to the **Schedule a new Litmus chaos scenario ** page where you can choose or design your own chaos scenario by doing the following steps:

## 1. Choose targetchaos delegate

This is the first step in chaos scenario creation. In this step, you can select a target chaos delegate where the chaos scenario will be scheduled. These chaos delegate consist of the CRDs and the required resources to run a chaos scenario .
While installing the Litmus Portal, a default chaos delegate named **Self Chaos Delegate ** is created.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/select-agent.png').default} alt="Selecting an Chaos Delegate " />
<i>Selecting a Chaos Delegate </i>
</figure>

After Selecting thechaos delegate , you can continue by clicking on **Next** button.

> Note: You may have to wait for the chaos delegate to be up and ready, after which you can move forward by again clicking on “Next” . Newly created users by the admin won't have any chaos delegate connected and thus won't be able to schedule a chaos scenario . As non-admin users, you will get a message ‘No Cluster Registered With Your Project ID, Please Wait…’ if you try to create a chaos scenario .

## 2. Choose a chaos scenario

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/choose-workflow.png').default} alt="Choosing a Chaos Scenario " />
<i>Choosing a Chaos Scenario </i>
</figure>

In this step, you can create a chaos scenario from different methods, these include:

- **Create a new chaos scenario from one of the pre-defined chaos scenario s** : With this option, you can select a pre-defined chaos scenarios which are available in the connected ChaosHub.

- **Create a new chaos scenario by using cloned template chaos scenario ** : With this option, you can create a new chaos scenario from an existing one [saved as a template](save-as-template.md). Choose on of the saved templates and tweak it according to your requirements.

- **Create a new chaos scenario using experiments from MyHub** : With this option, you can create customized chaos scenarios from the one of your connected ChaosHubs. With this option you can add multiple experiments from that ChaosHub either serially or in parallel to construct your chaos scenario graphically.

- **Import chaos scenario using YAML** : With this option, you can import a [hand-crafted/constructed chaos scenario ](construct-workflow.md) manifest and tune it according to the use-case. You can also import a basic Argo chaos scenario using this functionality.
  :::note
  For an uploaded chaos scenario , the tune chaos scenario functionality will not be available. The uploaded chaos scenario is completely user-dependent or user-specific.

## 3. Chaos Scenario Settings

In this section, you can change the name of the chaos scenario and also provide a description to the chaos scenario . This section also consists information regarding the namespace where the chaos scenario will be scheduled.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/workflow-setting.png').default} alt="Change name and description" />
<i>Change name and description</i>
</figure>

## 4. Tune the chaos scenario

This section consists of all the information related to the chaos scenario .
Some new and advanced features that are present in this section are :

1. **Chaos Scenario Visualization** : This feature allows you to visualize the chaos scenario even before scheduling it.
   This gives a brief information related to the structure of chaos scenario <i>i.e</i> if the experiments are present in serial or parallel way.
2. **Chaos Scenario Table** : This table contains the list of experiments present in the chaos scenario . It also consists of some valuable information related to the target applications.
3. **Add Experiment** : If you have selected `Create a new chaos scenario using experiments from MyHub` in Choose a Chaos Scenario step, you can see a `Add a new experiment` button, this will allow you to add more experiments to the chaos scenario .
4. **Edit Chaos Scenario ** : With this option, you can view and make changes in the chaos scenario manifest with a YAML editor.
5. **Revert Chaos** : For custom chaos scenario s, you can now enable or disable the revert step from the portal.
   With revert step enabled, a new functionality called `podGC` is also added which deletes the chaos scenario pods after the completion of chaos scenario as part of the clean-up process.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/edit-predefined-workflow.png').default} alt="Choosing a Chaos Scenario " />
<i>Tuning a Predefined Chaos Scenario (Podtato Head)</i>
</figure>

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/edit-sequence.png').default} alt="Editing Experiment Sequence" />
<i>Editing Experiment Sequence</i>
</figure>

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/add-experiments.png').default} alt="Adding Experiments to Chaos Scenario (Available after choosing a Hub in previous step)" />
<i>Adding Experiments to Chaos Scenario (Available after choosing a Hub in previous step)</i>
</figure>

Some of the other features that are included with Litmus Portal 2.0 are :

1. **Target Selection** : On the chaos scenario table, you can select an experiment to edit the engine configuration directly from the portal. You can change the `annotationCheck` and `jobCleanUpPolicy` according to the use-case.
   You can also target the application by selecting the namespace and the respective label of that application. We have added a functionality to fetch the live data from the selected chaos delegate like the available namespaces and resources that you can target.

2. **Defining the steady state for the application** : With this step, you can add probes to your experiments. Probes are some additional checks that you can provide in your experiments. To know more about probes, you can visit [here](../concepts/probes.md).

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/target-selection.png').default} alt="Target Selection" />
<br />
<i>Target Selection</i>
</figure>

## 5. Assign weights to experiments

In this step, you can assign weights to the experiments present in the chaos scenario . These weights will be then used for the calculation of the resilience score after the chaos scenario completion. By default, 10 points are assigned to each experiment. This can be altered as per your use-case.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/adjust-weights.png').default} alt="Adjust Experiment Weights" />
<i>Adjust Experiment Weights</i>
</figure>

#### **The Importance of Weights in experiments**

Giving a weightage to your experiment is a way of signifying/attaching the importance/priority of that experiment in your chaos scenario . The higher the weight, the more importance it holds.

The weight priority is generally divided into three sections:

- **0-3:** Low Priority
- **4-6:** Medium Priority
- **7-10:** High Priority

## 6. Schedule

In this step, you can schedule the chaos scenario in 2 ways:

1. **Schedule now** : With this option, the chaos scenario will start as soon as you schedule it.
2. **Recurring Schedule** : This option will allow you to schedule the chaos scenario in recurring ways. It converts a normal chaos scenario to `Cron` chaos scenario and a cron syntax is added in the chaos scenario manifest. The following methods are available to schedule a chaos scenario in recurring ways:
   1. Every Hour
   2. Every Day
   3. Every Week
   4. Every Month

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/schedule.png').default} alt="Scheduling a Cron Chaos Scenario " />
<i>Scheduling a Cron Chaos Scenario </i>
</figure>

## 7. Verify and commit

This is the final step in chaos scenario creation process. In this step, you can validate all the changes related to the chaos scenario like the chaos scenario name, the experiment weights, chaos scenario description, chaos scenario manifest etc. Once you have verified all the changes, you can click the **Finish** button to start the schedule.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/verify-commit.png').default} alt="View Summary and Commit" />
<i>View Summary and Commit</i>
</figure>

## Learn more

- [Observe Chaos Scenario ](observe-workflow.md)
- [Edit Schedule](edit-schedule.md)
- [Save Chaos Scenarios as a Template](save-as-template.md)
