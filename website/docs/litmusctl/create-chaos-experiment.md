---
id: create-chaos-experiment
title: Create Chaos Experiment
sidebar_label: Create Chaos Experiment
---

# Create a Chaos Experiment (litmusctl)

This document explains how to create and manage Chaos Experiments using `litmusctl`.

> **Prerequisite:** You should have a configured `litmusctl` account. See `litmusctl config set-account` to add an account.

---

## litmusctl quick syntax

```shell
litmusctl [command] [TYPE] [flags]
```

- **command**: what you want to perform (`connect`, `create`, `get`, `run`, `describe`, `delete`, etc.)  
- **TYPE**: the resource type (e.g., `chaos-infra`, `project`, `chaos-experiment`)  
- **flags**: additional information for the command (for example `--project-id`, `--chaos-infra-id`, `--endpoint`, `--non-interactive`)

`litmusctl` uses a config file at `${HOME}/.litmusconfig` by default. You can override this with `--config <file>`.

If required flags are not provided, `litmusctl` will prompt you interactively unless you use `--non-interactive`.

---

## 1. Setup account (if not already done)

```shell
# interactive (recommended)
litmusctl config set-account

# non-interactive (example)
litmusctl config set-account --endpoint="https://preview.litmuschaos.io" --username="admin" --password="PASSWORD"
```

After running, verify using:

```shell
litmusctl config view
```

---

## 2. Get project and chaos-infra IDs

You will need `project-id` and `chaos-infra-id` to create an experiment.

```shell
litmusctl get projects
# Note the PROJECT ID you want to use.

litmusctl get chaos-infra --project-id "<project-id>"
# Note the CHAOS INFRA ID from the output.
```

---

## 3. Create a Chaos Experiment from a manifest

You can create a Chaos Experiment by passing a YAML manifest:

```shell
litmusctl create chaos-experiment -f custom-chaos-experiment.yml --project-id "<project-id>" --chaos-infra-id "<chaos-infra-id>"
```

If creation is successful, you will receive confirmation and the created experiment ID.

**Example:**
```text
🚀 Chaos Experiment/experiment-1 successfully created 🎉
```

---

## 4. Save a Chaos Experiment (store manifest in Litmus)

If you want to save an experiment manifest in the project:

```shell
litmusctl save chaos-experiment -f custom-litmus-experiment.yaml --project-id "<project-id>"
```

---

## 5. Run a Chaos Experiment

You can run a previously created experiment by ID:

```shell
litmusctl run chaos-experiment --project-id "<project-id>" --chaos-experiment-id "<experiment-id>"
```

If the command prompts for values, provide the requested `project-id` and `experiment-id`.

---

## 6. Verify the experiment & runs

- To list all experiments in a project:
```shell
litmusctl get chaos-experiment --project-id "<project-id>"
```

- To list runs for a project:
```shell
litmusctl get chaos-experiment-runs --project-id "<project-id>"
```

- To list runs for a specific experiment:
```shell
litmusctl get chaos-experiment-runs --project-id "<project-id>" --experiment-id "<experiment-id>"
```

- To describe a specific experiment:
```shell
litmusctl describe chaos-experiment --project-id "<project-id>" <chaos-experiment-id>
# Or use interactive mode: `litmusctl describe chaos-experiment`
```

---

## 7. Delete an experiment

```shell
litmusctl delete chaos-experiment <chaos-experiment-id> --project-id "<project-id>"
# or interactive: litmusctl delete chaos-experiment
```

---

## Useful extra commands

```shell
# View config file
litmusctl config view

# List accounts in config
litmusctl config get-accounts

# Switch current account (interactive)
litmusctl config use-account

# Create a project (interactive)
litmusctl create project
```

---

## Flags (summary)

| Flag     | Type    | Description |
|----------|---------|-------------|
| `--config` | string | path to config file (default: $HOME/.litmusctl) |
| `--cacert` | string | custom CA certificate for communicating with portal |
| `--skipSSL` | bool | skip TLS/SSL verification |
| `--help` / `-h` |      | show command help |

Use `litmusctl --help` or `litmusctl <command> --help` for more details.

---

## Notes & troubleshooting

- **Interactive vs non-interactive:** For scripts, prefer `--non-interactive` and pass required flags; otherwise `litmusctl` prompts for missing values.  
- **Project & infra IDs** are required for many operations — use `litmusctl get projects` and `litmusctl get chaos-infra` to retrieve them.  
- **Permissions:** Ensure the account has sufficient permissions to create/run experiments (cluster vs namespace mode).  
- **Preview:** After creating/running experiments, verify status in ChaosCenter UI (Targets → Chaos Infrastructures / Experiments).

---

## Example flow (compact)

```shell
# set account
litmusctl config set-account --endpoint="https://preview.litmuschaos.io" --username="admin" --password="PASSWORD"

# get project id and infra id
litmusctl get projects
litmusctl get chaos-infra --project-id "<project-id>"

# create from manifest
litmusctl create chaos-experiment -f custom-chaos-experiment.yml --project-id "<project-id>" --chaos-infra-id "<chaos-infra-id>"

# list runs
litmusctl get chaos-experiment-runs --project-id "<project-id>"
```
