---
id: delete-resilience-probe
title: Delete a Resilience Probe
sidebar_label: Delete a Resilience Probe
---

:::note
Deleting a probe will delete all the associations with experiment runs from the chaos control plane. This will also misplace any analytics that had incurred for the previous runs for said probe.
:::

## 1. Go to the probes sections

In the **Resilience Probes** page, go to the specific probe you wish to delete:

<img src={require('../assets/user-guides/resilience-probes/delete-probe/step-1.png').default} />

## 2. Click on the Delete Probe option

After opening the options menu and clicking on the **Delete Probe** option, you'll see a prompt in order to confirm your action. Please ensure that you want to delete the selected Resilience Probe and select the **Confirm** button:

<img src={require('../assets/user-guides/resilience-probes/delete-probe/step-2.png').default} />

## 3. The Resilience probe has been deleted

You will observe that the resilience probe no longer appears in the list of probes and has been removed.

<img src={require('../assets/user-guides/resilience-probes/delete-probe/step-3.png').default} />
