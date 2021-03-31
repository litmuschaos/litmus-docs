---
id: d1-update
title: How to Update a Workflow
sidebar_label: Update Workflow
---

## Update a Workflow

---

After scheduling a workflow, the user can update the scheduled configuration of the workflow by clicking on Schedules tab. 
Here the user can view several options like:
- Re-Run schedule
- Edit Schedule
- Delete Schedule
- Download Manifest 

### 1. Re-Run Schedule
This option allows the user to re-run a workflow with the same configuration as earlier. This option is only available when the workflow is scheduled once.

### 2. Edit Schedule
This option allows the user to edit the schedule configuration of the workflow. The user can either disable the workflow or change the Cron Syntax by changing the scheduled timings.
The disable workflow option adds a label **suspend: true** that disables any scheduled workflow.
This option is only available if the workflow is a Cron Workflow i.e a recurring workflow.

### 3. Delete Schedule
This option allows the user to delete a scheduled workflow. This is an irreversible process and once the delete option is selected, all the workflow configuration and the schedules are deleted from the portal.

### 4. Download Manifest
This option allows the user to download the manifest of the workflow. The manifest consists of all the configurations that the user has added while workflow creation. The user can then alter changes in this manifest and upload it with the portal to schedule a new workflow.
