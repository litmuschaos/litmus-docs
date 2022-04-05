---
id: delete-workflow
title: Delete a Workflow
sidebar_label: Delete Workflow
---

---

If required, it is possible to delete a workflow schedule that you no longer wish to run against your application.

:::note
This also means that all the runs corresponding to that workflow will also be deleted.
:::

## Before you begin

You can learn about the concept of workflows [here](../concepts/chaos-workflow.md) and how to schedule your first workflow [here](schedule-workflow.md).

## 1. Go to the workflows sections

In the `Workflows` page, go to the `Schedules` tab and click on the options menu for the specific schedule you wish to delete:

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-1.png').default} width="1000" height="500" />

## 2. Click on the `Delete workflow` option

After opening the options menu and clicking on the `Delete workflow` option, you'll see a prompt in order to confirm your action. Please ensure that you want to delete the selected workflow and click the `Delete` button:

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-2.png').default} width="1000" height="500" />

## 3. The Workflow has been deleted

You will observe that the workflow no longer appears in the list of schedules and has been removed.

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-3.png').default} width="1000" height="500" />

As stated above, we observe that the runs have been removed as well.

<img src={require('../assets/user-guides/injecting-fault/delete-workflow/step-4.png').default} width="1000" height="500" />

## Learn more

- [schedule a workflow](schedule-workflow.md)
