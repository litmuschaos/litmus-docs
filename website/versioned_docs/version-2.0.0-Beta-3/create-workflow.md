---
id: create-workflow
title: How to Create a Sample Workflow
sidebar_label: Create Workflow
---

---

Click on the **Schedule your first workflow** button on the home page to get started. It will take you to the workflow page where you can choose or design your own workflow by doing the following steps:

### 1. Choose Target Agent

You have to select a cluster type. There are two types of clusters:

- Internal Cluster (Self Cluster)
- External Clusters that are available on the targets screen.

After Selecting the cluster, you can continue by clicking on **Select and Continue**.

```
Note:
 You may have to wait for the cluster to be ready, after which you can move forward by again clicking on “Select and
 Continue”. Newly created users by the admin can’t schedule a workflow, As non-admin users, you will  get a message  ‘No Cluster Registered With Your Project ID, Please Wait…’   if you try to create a workflow.
```

### 2. Choose a Workflow

Next, you need to choose/design the workflow, you will be given a collection of cards grouped as:

- **Predefined Workflow** : These are some workflows that are provided by default, these are already developed and can be tweaked by adding new environment variables according to the requirements of the user. After Selecting a predefined workflow you can choose to change the name and description of the selected workflow by clicking on “Edit Workflow Name”.

### 3. Tune Workflow (Optional)

The next step is tuning the workflow, this section is common for both custom or predefined workflows. You will be given an Editor to check the YAML syntax and also will be able to edit the content in the editor itself. Once the necessary changes have been done, click on Next to move to the next page.

### 4. Reliability Score (Optional)

Here, you can set the points for all the experiments present in the selected workflow. These points will affect the Resilience Weights of application to be used with chaos experiment. The weights have been pre-selected as 10 for each test for you. However, you may review and modify the weightage again. The weights are relative to each other which you can change. The successful outcome of each test carries a certain weight. After selecting weights click on the Next Button.

