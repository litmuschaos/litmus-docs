---
id: delete-experiment
title: Delete a Chaos Scenario
sidebar_label: Delete Chaos Scenario
---

---

If required, it is possible to delete a chaos scenario schedule that you no longer wish to run against your application.

:::note
This also means that all the runs corresponding to that chaos scenario will also be deleted.
:::

## Before you begin

You can learn about the concept of chaos scenarios [here](../concepts/chaos-workflow.md) and how to schedule your first chaos scenario [here](schedule-experiment.md).

## 1. Go to the chaos scenarios sections

In the `Chaos Scenario` page, go to the `Schedules` tab and click on the options menu for the specific schedule you wish to delete:

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-1.png').default} width="1000" height="500" />

## 2. Click on the `Delete chaos scenario` option

After opening the options menu and clicking on the `Delete chaos scenario` option, you'll see a prompt in order to confirm your action. Please ensure that you want to delete the selected chaos scenario and click the `Delete` button:

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-2.png').default} width="1000" height="500" />

## 3. The Chaos Scenario has been deleted

You will observe that the chaos scenario no longer appears in the list of schedules and has been removed.

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-3.png').default} width="1000" height="500" />

As stated above, we observe that the runs have been removed as well.

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-4.png').default} width="1000" height="500" />

## Learn more

- [schedule a chaos scenario](schedule-experiment.md)
