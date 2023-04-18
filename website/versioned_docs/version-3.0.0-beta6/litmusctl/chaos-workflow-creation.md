---
id: chaos-workflow-creation
title: Create Scenarios using Litmusctl
sidebar_label: Create Chaos Scenarios
---

---

> Notes:
>
> - For litmusctl v0.10.0 or latest
> - Compatible with Litmus 2.9.0 or latest

### litmusctl Syntax

`litmusctl` has a syntax to use as follows:

```shell
litmusctl [command] [TYPE] [flags]
```

- Command: refers to what you do want to perform (create, get and config)
- Type: refers to the feature type you are performing a command against (chaos delegate, project etc.)
- Flags: It takes some additional information for resource operations. For example, `--installation-mode` allows you to specify an installation mode.

Litmusctl is using the `.litmusconfig` config file to manage multiple accounts

1. If the --config flag is set, then only the given file is loaded. The flag may only be set once and no merging takes place.
2. Otherwise, the ${HOME}/.litmusconfig file is used, and no merging takes place.

---

### Steps to create a Chaos Scenario

- To setup an account with litmusctl

```shell
litmusctl config set-account --endpoint="" --username="" --password=""
```

- To create a Chaos Scenario by passing a manifest file
  > Note:
  >
  > - To get `project-id`, apply `litmusctl get projects`
  > - To get `chaos-delegate-id`, apply `litmusctl get chaos-delegates --project-id=""`

```shell
litmusctl create chaos-scenario -f custom-chaos-scenario.yml --project-id="" --chaos-delegate-id=""
```

#### Verify the new Chaos Scenario

To verify the successful creation, you can either view the list of chaos scenarios at the ChaosCenter dashboard or run the below given command to list the chaos scenarios within a given project.

```shell
litmusctl get chaos-scenarios --project-id=""
```

**Output:**

```
CHAOS SCENARIO ID                          CHAOS SCENARIO NAME                    CHAOS SCENARIO TYPE     NEXT SCHEDULE CHAOS DELEGATE ID                             CHAOS DELEGATE NAME LAST UPDATED BY
9433b48c-4ab7-4544-8dab-4a7237619e09 custom-chaos-scenario-1627980541 Non Cron Scenario None          f9799723-29f1-454c-b830-ae8ba7ee4c30 Self-Chaos-Delegate admin
Showing 1 of 1 chaos scenarios
```

---

### Additional commands

- To list all the chaos scenario runs within a project, issue the following command.

```shell
litmusctl get chaos-scenario-runs --project-id=""
```

**Output:**

```
CHAOS SCENARIO RUN ID                      STATUS  RESILIENCY SCORE CHAOS SCENARIO ID                          CHAOS SCENARIO NAME                    TARGET CHAOS DELEGATE LAST RUN                 EXECUTED BY
8ceb712c-1ed4-40e6-adc4-01f78d281506 Running 0.00             9433b48c-4ab7-4544-8dab-4a7237619e09 custom-chaos-scenario-1627980541 Self-Chaos-Delegate   June 1 2022, 10:28:02 pm admin
Showing 1 of 1 scenario runs
```

- To describe a particular chaos scenario, issue the following command.

```shell
litmusctl describe chaos-scenario 9433b48c-4ab7-4544-8dab-4a7237619e09 --project-id=""
```

**Output:**

```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
    creationTimestamp: null
    labels:
        cluster_id: f9799723-29f1-454c-b830-ae8ba7ee4c30
        subject: custom-chaos-scenario_litmus
        workflow_id: 9433b48c-4ab7-4544-8dab-4a7237619e09
        workflows.argoproj.io/controller-instanceid: f9799723-29f1-454c-b830-ae8ba7ee4c30
    name: custom-chaos-scenario-1627980541
    namespace: litmus
spec:
...
```

- To delete a particular chaos scenario, issue the following command.

```shell
litmusctl delete chaos-scenario df91c6b2-ad33-45ae-9a2f-00cb87978657 --project-id=""
```

**Output:**

```
🚀 Chaos scenario successfully deleted.
```

For more information related to flags, Use `litmusctl --help`.

---

## Learn More

- [Learn More about Litmusctl](installation.md)
- [Installing Chaos Delegate in interactive mode](./usage-interactive-mode.md)
- [Installing Chaos Delegate in non interactive mode](./usage-non-interactive-mode.md)
- [Setup Endpoints and Access ChaosCenter without Ingress](../user-guides/setup-without-ingress.md)
- [Setup Endpoints and Access ChaosCenter with Ingress](../user-guides/setup-with-ingress.md)
