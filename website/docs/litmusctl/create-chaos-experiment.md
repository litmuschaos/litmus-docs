---
id: create-chaos-experiment
title: Create Chaos Experiment
sidebar_label: Create Chaos Experiment
---

# Create a Chaos Experiment (litmusctl)

This document explains how to create and manage Chaos Experiments using `litmusctl`.

> **Prerequisite:** You should have a configured `litmusctl` account. See `litmusctl config set-account` to add an account.

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

## 2. Get project and chaos-infra IDs

You will need `project-id` and `chaos-infra-id` to create an experiment.

```shell
litmusctl get projects
# Note the PROJECT ID you want to use.

litmusctl get chaos-infra --project-id "<project-id>"
# Note the CHAOS INFRA ID from the output.
```

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

## 4. Save a Chaos Experiment (store manifest in Litmus)

If you want to save an experiment manifest in the project:

```shell
litmusctl save chaos-experiment -f custom-litmus-experiment.yaml --project-id "<project-id>"
```

## 5. Run a Chaos Experiment

You can run a previously created experiment by ID:

```shell
litmusctl run chaos-experiment --project-id "<project-id>" --chaos-experiment-id "<experiment-id>"
```

If the command prompts for values, provide the requested `project-id` and `experiment-id`.
