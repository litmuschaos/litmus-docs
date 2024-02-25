---
id: create-resilience-probe
title: Create a Resilience Probe
sidebar_label: Create a Resilience Probe
---

## Before you begin

You can learn about the concept of resilience probes [here](../concepts/probes.md) and chaos experiments [here](../concepts/chaos-workflow.md). 

Here are some characterstics of resilience probes.
- **Unique Identifier**: Each Resilience Probe is identified by a unique name, serving as its identifier. Probe names cannot be reused for a given fault.
- **Deletion Behavior**: Deleting a Resilience Probe will disable it from further use but does not delete it from the system. This ensures that the probe's history and configuration remain intact for reference and analysis.

For this user guide, we will use a HTTP probe.

## 1. Go to the Resilience Probes section

Navigate to the `/probes` page (Resilience Probes on the left nav), and click on the `New Probe` button

<img src={require('../assets/user-guides/resilience-probes/create-probe/step-1.png').default} />

## 2. Select the type of probe

Select and click on the type of probe you would like to create, you can read about the available probe types [here](../concepts/probes.md)

<img src={require('../assets/user-guides/resilience-probes/create-probe/step-2.png').default} />

## 3. Enter the details of the probe to create

Enter the details of the probe such as name, description (optional), tags (optional)

<img src={require('../assets/user-guides/resilience-probes/create-probe/step-3.png').default} />

## 4. Configure the probe properties

Configure the properties for the probe you are creating, such as, Timeout, Interval, Retry, etc.

<img src={require('../assets/user-guides/resilience-probes/create-probe/step-4.png').default} />

## 5. Configure the probe details

Configure the details for the probe you are creating, once completed, click the `Setup Probe` button

<img src={require('../assets/user-guides/resilience-probes/create-probe/step-5.png').default} />

The new probe will appear in the list as shown:

<img src={require('../assets/user-guides/resilience-probes/create-probe/step-6.png').default} />

### Experiment Creation

When creating an experiment, it's imperative to include the Resilience Probe as part of the setup. This step is now mandatory to ensure accurate chaos injection and monitoring during the experiment. Follow these steps to add the probe to the experiment configuration:

1. **Identify Chaos Injection Points**: Determine the points within your system where chaos will be injected.

2. **Select Resilience Probe**: Choose the appropriate Resilience Probe that aligns with your experimentation goals and the type of chaos you want to inject as discussed above.

3. **Integrate Probe into Experiment YAML**: Add the Resilience Probe configuration to your experiment YAML file. Ensure that the probe is properly configured and referenced within the experiment setup.

4. **Validate Experiment Configuration**: Before initiating the experiment, validate the experiment configuration to ensure that the Resilience Probe is correctly included and configured.

### Annotations for Experiment Configuration

When creating experiments, it's essential to include a `probeRef` in annotations to associate Resilience Probes with the experiment. This step allows for seamless integration of probes into the chaos engineering workflow, whether constructing experiments manually or uploading YAML configurations. Follow these instructions to include `probeRef` effectively for chaos injection:

1. **Identify Probe to Associate**: Determine the Resilience Probe that you want to associate with the experiment.

2. **Add probeRef in Annotations**: In the experiment YAML configuration, include a `probeRef` field in annotations and specify the name of the Resilience Probe. Ensure that the `probeRef` is correctly formatted and matches the name of the chosen probe.

3. **Validate Annotations**: Before initiating the experiment, validate the experiment YAML configuration to ensure that the `probeRef` is properly included and associated with the Resilience Probe.
