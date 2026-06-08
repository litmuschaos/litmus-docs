---
id: delete-experiment
title: Delete a chaos experiment
sidebar_label: Delete chaos experiment
---

---

If required, it is possible to delete a chaos experiment schedule that you no longer wish to run against your application.

:::note
This also means that all the runs corresponding to that chaos experiment will also be deleted.
:::

## Before you begin

You can learn about the concept of chaos experiments [here](../concepts/chaos-workflow.md) and how to schedule your first chaos experiment [here](schedule-experiment.md).

## 1. Go to the chaos experiments sections

In the **Chaos experiment** page, go to the specific experiment you wish to delete:

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-1.png').default} width="1000" height="500" />

## 2. Select Delete Experiment option

After opening the options menu and clicking on the **Delete Experiment** option, you'll see a prompt in order to confirm your action. Please ensure that you want to delete the selected chaos experiment and click the **Confirm** button:

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-2.png').default} width="1000" height="500" />

## 3. Verify that experiment has been deleted

You will observe that the chaos experiment no longer appears in the list of schedules and has been removed.

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-3.png').default} width="1000" height="500" />

As stated above, the runs have been removed as well.

## Learn more

- [schedule a chaos experiment](schedule-experiment.md)
