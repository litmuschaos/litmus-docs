---
id: d1-schedule
title: How to Schedule a Workflow
sidebar_label: Schedule workflow
---

## Workflow Scheduling

---

### 1. Scheduling

After selecting the reliability scores for the tests, the user can now schedule the workflows. The default option in this screen is **Schedule Now**. With this option the user can run a workflow immediately once the workflow creation is completed. The second option available to the user is **Schedule Later**. With this option, the user can schedule the workflow at any time in the future. When this option is selected , the kind of the workflow changes from **Workflow** to **CronWorkflow** with a Cron syntax added in the workflow manifest. The following options are available to the user for scheduling a workflow later:

- Every Hour
- Every Day
- Every Week
- Every Month

### 2. Verify and Commit

After adding the schedules, the user can see the verify and commit screen where all the details of the workflow are present such as the workflow name, the target cluster, workflow manifest, test weights etc. Once the user finishes configuring the workflow, it can be started by selecting the **Finish** button.
