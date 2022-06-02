---
id: chaos-workflow-creation
title: Create Chaos Workflows using Litmusctl
sidebar_label: Create Chaos Workflows
---

---

# Usage: Litmusctl v0.3.0

> Notes:
>
> - For litmusctl v0.3.0 or latest
> - Compatible with Litmus 2.0.0 or latest

### litmusctl Syntax

`litmusctl` has a syntax to use as follows:

```shell
litmusctl [command] [TYPE] [flags]
```

- Command: refers to what you do want to perform (create, get and config)
- Type: refers to the feature type you are performing a command against (agent, project etc.)
- Flags: It takes some additional information for resource operations. For example, `--installation-mode` allows you to specify an installation mode.

Litmusctl is using the `.litmusconfig` config file to manage multiple accounts

1. If the --config flag is set, then only the given file is loaded. The flag may only be set once and no merging takes place.
2. Otherwise, the ${HOME}/.litmusconfig file is used, and no merging takes place.

---

### Steps to create a Chaos Workflow

* To setup an account with litmusctl
```shell
litmusctl config set-account --endpoint="" --username="" --password=""
```

* To create a Chaos Workflow by passing a manifest file
> Note:
> * To get `project-id`, apply `litmusctl get projects`
> * To get `agent-id`, apply `litmusctl get agents --project-id=""`
```shell
litmusctl create workflow -f custom-chaos-workflow.yml --project-id="" --agent-id=""
```

#### Verify the new Chaos Workflow

To verify the successful creation, you can either view the list of chaos workflows at the ChaosCenter dashboard or run the below given command to list the chaos workflow within a given project.

```shell
litmusctl get workflows --project-id=""
```

**Output:**

```
WORKFLOW ID                          WORKFLOW NAME                    WORKFLOW TYPE     NEXT SCHEDULE AGENT ID                             AGENT NAME LAST UPDATED BY
9433b48c-4ab7-4544-8dab-4a7237619e09 custom-chaos-workflow-1627980541 Non Cron Workflow None          f9799723-29f1-454c-b830-ae8ba7ee4c30 Self-Agent admin

Showing 1 of 1 workflows
```

---

### Additional commands

* To list all the chaos workflow runs within a project, issue the following command.
```shell
litmusctl get workflowruns --project-id=""
```

**Output:**

```
WORKFLOW RUN ID                      STATUS  RESILIENCY SCORE WORKFLOW ID                          WORKFLOW NAME                    TARGET AGENT LAST RUN                 EXECUTED BY
8ceb712c-1ed4-40e6-adc4-01f78d281506 Running 0.00             9433b48c-4ab7-4544-8dab-4a7237619e09 custom-chaos-workflow-1627980541 Self-Agent   June 1 2022, 10:28:02 pm admin

Showing 1 of 1 workflow runs
```


* To describe a particular chaos workflow, issue the following command.
```shell
litmusctl describe workflow 9433b48c-4ab7-4544-8dab-4a7237619e09 --project-id=""
```

**Output:**

```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
    creationTimestamp: null
    labels:
        cluster_id: f9799723-29f1-454c-b830-ae8ba7ee4c30
        subject: custom-chaos-workflow_litmus
        workflow_id: 9433b48c-4ab7-4544-8dab-4a7237619e09
        workflows.argoproj.io/controller-instanceid: f9799723-29f1-454c-b830-ae8ba7ee4c30
    name: custom-chaos-workflow-1627980541
    namespace: litmus
spec:
...
```


* To delete a particular chaos workflow, issue the following command.
```shell
litmusctl delete workflow df91c6b2-ad33-45ae-9a2f-00cb87978657 --project-id=""
```

**Output:**

```
🚀 ChaosWorkflow successfully deleted.
```

For more information related to flags, Use `litmusctl --help`.

---

## Learn More

- [Learn More about Litmusctl](installation.md)
- [Installing ChaosAgents in interactive mode](./agent-installation-interactive-mode.md)
- [Installing ChaosAgents in non interactive mode](./agent-installation-non-interactive-mode.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](../user-guides/setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](../user-guides/setup-with-ingress.md)
