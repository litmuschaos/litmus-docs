---
id: schedule-experiment
title: Schedule a chaos experiment
sidebar_label: Schedule chaos experiment
---

---

## Before you begin

You must connect a Chaos Infrastructure before scheduling a chaos experiment. You can [connect an external Chaos Infrastructure](../litmusctl/installation.md).

---

Click on the **Schedule a chaos scenario** button on the home page or **Schedule chaos scenario** button in Litmus Chaos Scenarios page to get started.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/new-experiment-overview-home.png').default} alt="Home Page" />
</figure>

It will take you to the **Chaos Studio** page where you can choose or design your own chaos scenario by doing the following steps:

## 1. Provide the identifiers for the experiment to be created

In the Experiment Overview, enter the experiment Name and optional Description and Tags.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/new-experiment-identifiers.png').default} alt="Add Identifiers" />
</figure>

## 2. Choose target chaos infrastructure

In **Select a Chaos Infrastructure**, select the infrastructure where the target resources reside, and then click **Apply**.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/new-experiment-infra-select.png').default} alt="Selecting an Chaos Infrastructure " />
</figure>

After Selecting the chaos Infrastructure , you can continue by clicking on **Next** button. This takes you to the Experiment Builder tab, where you can choose how to start building your experiment.

## 3. Choose you want to build your chaos experiment

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/new-experiment-choose-method.png').default} alt="Choosing a method " />
</figure>

Select how you want to build the experiment. The options, explained later, are:

- Blank Canvas - Lets you build the experiment from scratch, adding the specific faults you want.

- Templates from Chaos Hubs - Lets you preview and select and experiment from pre-curated experiment templates available in Chaos Hubs.

- Upload YAML - Lets you upload an experiment manifest YAML file.

These options are explained below.

**If you select Blank Canvas:**

The Experiment Builder tab is displayed.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/new-experiment-blank-canvas.png').default} alt="Add to blank canvas" />
</figure>

a. Select **Add**, then select each fault you want to add to the experiment individually.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/litmus-chaos-hub.png').default} alt="litmus-chaos-hub" />
</figure>

For each fault you select, you'll tune the fault's properties next.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/tune-fault.png').default} alt="tune-fault" />
</figure>

b. To tune each fault:

- **Specify the target application (only for pod-level Kubernetes faults):** This lets the application's corresponding pods be targeted.

- **Tune fault parameters:** Every fault has a set of common parameters, such as the chaos duration, ramp time, etc., and a set of unique parameters that may be customised as needed.

- **Add chaos probes:** On the Probes tab, you can add chaos probes to automate the chaos hypothesis checks for a fault during the experiment execution. Probes are declarative checks that aid in the validation of certain criteria that are deemed necessary to declare an experiment as passed.

- **Tune fault weightage:** Set the weight for the fault, which sets the importance of the fault relative to the other faults in the experiments. This is used to calculate the resilience score of the experiment.

c. To add a fault that runs in parallel to another fault, point your mouse below an existing fault, and then select Add.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/add-parallel-faults.png').default} alt="add-parallel-faults" />
</figure>

In Experiment Builder, faults that are stacked vertically run in parallel, and faults or groups of parallel faults run in sequence from left to right.

**If you select Templates from Chaos Hubs:**

a. Select an experiment template from a chaos hub.

Select Experiment Type to see available chaos hubs to select templates from.
Select a template to see a preview of the faults included.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/select-template-from-chaos-hub.png').default} alt="select-template-from-chaos-hub" />
</figure>

You can edit the template to add more faults or update the existing faults.

**If you select Upload YAML:**

a. Upload an experiment manifest YAML file to create the experiment.

You can edit the experiment to update the existing faults or add more of them.

## 4. Save the experiment.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/chaos-experiment-save.png').default} alt="chaos-experiment-save" />
</figure>

Now, you can choose to either run the experiment right away by selecting the Run button on the top, or create a recurring schedule to run the experiment by selecting the Schedule tab.

## Advanced experiment setup options

You can select Advanced Options on the Experiment Builder tab to configure the advanced options (described below) while creating an experiment for a Kubernetes chaos infrastructure:

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/advanced-options-experiment-creation.png').default} alt="advanced-options-experiment-creation" />
</figure>

## General options

### Node Selector

Specifies the node on which the experiment pods will be scheduled. Provide the node label as a key-value pair.

- Can be used with node-level faults to avoid the scheduling of the experiment pod on the target node(s).

- Can be used to limit the scheduling of the experiment pods on nodes that have an unsupported OS.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/node-selectors.png').default} alt="node-selectors" />
</figure>

### Toleration

Specifies the tolerations that must be satisfied by a tainted node to be able to schedule the experiment pods. For more information on taints and tolerations, go to the [Kubernetes documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/).

- Can be used with node-level faults to avoid the scheduling of the experiment pod on the target node(s).

- Can be used to limit the scheduling of the experiment pods on nodes that have an unsupported OS.

<figure>
<img src={require('../assets/user-guides/injecting-fault/schedule-workflow/tolerations.png').default} alt="tolerations" />
</figure>

## Learn more

- [Observe Chaos Scenario ](observe-experiment.md)
- [Edit Schedule](edit-schedule.md)
- [Save Chaos Scenarios as a Template](save-as-template.md)
