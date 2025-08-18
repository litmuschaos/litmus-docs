---
id: delete-infrastructure
title: Delete an Infrastructure
sidebar_label: Delete an Infrastructure
---

## 1. Go to the Infrastructure section

Navigate to the infrastructure you want to delete, and click on the **⋮** icon to open the options menu and select **Disable** option:

<img src={require('../assets/user-guides/infrastructure/delete-infrastructure/step-1.png').default} />

## 2. Confirm Infrastructure deletion

After opening the options menu and clicking on the **Disable** option, you'll see a prompt in order to confirm your action. Please ensure that you want to delete the selected infrastructure and click the **Confirm** button:

:::note
The disabling of the infrastructure from the UI will clean-up the subscriber pod from the cluster, but the remaining resources are left to the user to clean up, please follow the steps and the commands provided in the deletion confirmation modal to do so.
:::

<img src={require('../assets/user-guides/infrastructure/delete-infrastructure/step-2.png').default} />

The deleted infrastructure will disappear from the list as shown:

<img src={require('../assets/user-guides/infrastructure/delete-infrastructure/step-3.png').default} />
