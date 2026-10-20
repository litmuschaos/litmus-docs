---

id: additional-commands
title: Additional Commands
sidebar_label: Additional Commands
----------------------------------

This guide covers additional litmusctl commands for managing your ChaosCenter account, projects, environments, and chaos infrastructures.

Follow this [guide](https://github.com/litmuschaos/litmusctl/blob/master/Usage_0.23.0.md#additional-commands) to learn more about litmusctl commands.

---

## Account and Configuration Commands

### View Current Configuration

Displays the current configuration from `.litmusconfig`.

```bash
litmusctl config view
```

**Example Output:**

```
accounts:
- users:
  - username: admin
    expires_in: "1626897027"
    token: eyJhbGciOi...
  endpoint: https://preview.litmuschaos.io
apiVersion: v1
current-account: https://preview.litmuschaos.io
current-user: admin
kind: Config
```

### List Accounts

Shows all accounts configured in `.litmusconfig`.

```bash
litmusctl config get-accounts
```

**Example Output:**

```
CURRENT  ENDPOINT                         USERNAME  EXPIRESIN
         https://preview.litmuschaos.io   admin     2021-07-22 01:20:27 +0530 IST
*        https://preview.litmuschaos.io   raj       2021-07-22 14:33:22 +0530 IST
```

### Switch Account

Switch between multiple configured accounts.

```bash
litmusctl config use-account
```

**Example:**

```
Host endpoint where litmus is installed: https://preview.litmuschaos.io
Username: admin
Successfully set the current account to 'admin' at 'https://preview.litmuschaos.io'
```

### Update Password

Change your ChaosCenter account password.

```bash
litmusctl update password
```

**Example:**

```
Username: admin
Old Password: ********
New Password: ********
Confirm Password: ********
Password updated successfully!
```

---

## Project and Environment Management

### Create a Project

Creates a new project in ChaosCenter.

```bash
litmusctl create project
```

**Example:**

```
Enter a project name: new
Project 'new' created successfully!
```

### Create an Environment

Creates a new environment within a project.

```bash
litmusctl create environment
```

**Example:**

```
Enter the Project ID: eb7fc0a0-5878-4454-a9db-b67d283713bc
Enter the Environment Name: test2
New Chaos Environment creation successful!
```

### Delete an Environment

Deletes an existing environment from a project.

```bash
litmusctl delete chaos-environment
```

**Example:**

```
Enter the Project ID: eb7fc0a0-5878-4454-a9db-b67d283713bc
Enter the Environment ID: testenv
Are you sure you want to delete this Chaos Environment? (y/n): y
Chaos Environment deleted successfully.
```

### List Projects

View all available projects.

```bash
litmusctl get projects
```

**Example:**

```
PROJECT ID                                PROJECT NAME       CREATEDAT
50addd40-8767-448c-a91a-5071543a2d8e      Developer Project  2021-07-21 14:38:51 +0530 IST
7a4a259a-1ae5-4204-ae83-89a8838eaec3      DevOps Project     2021-07-21 14:39:14 +0530 IST
```

### List Environments

List all environments within a project.

```bash
litmusctl list chaos-environments --project-id=""
```

**Example:**

```
CHAOS ENVIRONMENT ID  CHAOS ENVIRONMENT NAME   CREATED AT                       CREATED BY
testenv               testenv                  55985-01-15 01:42:33 +0530 IST   admin
shivamnewenv          shivamnewenv             55962-10-01 15:05:45 +0530 IST   admin
```

---

## Chaos Infrastructure Management

### Get Chaos Infrastructures

List all Chaos Infrastructures in a project.

```bash
litmusctl get chaos-infra
```

**Example:**

```
CHAOS INFRASTRUCTURE ID                  CHAOS INFRASTRUCTURE NAME    STATUS
55ecc7f2-2754-43aa-8e12-6903e4c6183a    chaos-infra-1                ACTIVE
13dsf3d1-5324-54af-4g23-5331g5v2364f    chaos-infra-2                INACTIVE
```

### Disconnect Chaos Infrastructure

Disconnect a Chaos Infrastructure from a project.

```bash
litmusctl disconnect chaos-infra <chaos-infra-id> --project-id=""
```

**Example Output:**

```
Chaos Infrastructure successfully disconnected.
```

---

## Chaos Experiment Management

### List Experiments

Get all Chaos Experiments in a project.

```bash
litmusctl get chaos-experiment --project-id=""
```

### Describe a Chaos Experiment

View details of a specific Chaos Experiment.

```bash
litmusctl describe chaos-experiment <chaos-experiment-id> --project-id=""
```

### Delete a Chaos Experiment

Remove a specific Chaos Experiment.

```bash
litmusctl delete chaos-experiment <chaos-experiment-id> --project-id=""
```

**Example Output:**

```
Chaos Experiment successfully deleted.
```

### List Experiment Runs

Get all Chaos Experiment runs within a project.

```bash
litmusctl get chaos-experiment-runs --project-id=""
```

### Get Experiment Run by ID

Get details of a specific Chaos Experiment run.

```bash
litmusctl get chaos-experiment-runs --project-id="" --experiment-run-id=""
```

---

## Flag Reference

| Flag        | Short | Type   | Description                                                      |
| ----------- | ----- | ------ | ---------------------------------------------------------------- |
| `--cacert`  |       | string | Custom CA certificate used by litmusctl for portal communication |
| `--config`  |       | string | Configuration file path (default `$HOME/.litmusctl`)             |
| `--skipSSL` |       | bool   | Skip SSL/TLS verification                                        |
| `--help`    | `-h`  |        | Display help for command                                         |

---

This update aligns the `additional-command.md` documentation with `litmusctl v0.23.0+`, ensuring users have access to the latest command syntax, examples, and flag information.
