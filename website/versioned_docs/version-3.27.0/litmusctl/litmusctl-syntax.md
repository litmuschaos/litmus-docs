---
id: litmusctl-syntax
title: Litmusctl Syntax
sidebar_label: Litmusctl Syntax
---

# Litmusctl Syntax

## Overview

`litmusctl` is a command-line tool for managing LitmusChaos infrastructure plane. It follows a structured syntax pattern that makes it intuitive to use for various chaos engineering operations.

## Basic Syntax

```bash
litmusctl [command] [TYPE] [flags]
```

### Components

- **Command**: Specifies the operation you want to perform (e.g., `connect`, `create`, `get`, `config`, `disconnect`, `run`, `update`)
- **Type**: Refers to the resource type you're operating on (e.g., `chaos-infra`, `project`, `chaos-experiment`, `chaos-environment`)
- **Flags**: Additional parameters that provide specific information for the operation (e.g., `--project-id`, `--non-interactive`, `--config`)

## Available Commands

### 1. `config` - Configuration Management

Manage litmusctl accounts and configuration settings.

#### Subcommands

**Set Account**
```bash
litmusctl config set-account
```
Configure a new ChaosCenter account with endpoint, username, and password.

**Use Account**
```bash
litmusctl config use-account --endpoint="<endpoint-url>" --username="<username>"
```
Switch between multiple configured accounts.

**Get Accounts**
```bash
litmusctl config get-accounts
```
List all configured accounts in `.litmusconfig`.

**View Configuration**
```bash
litmusctl config view
```
Display current `.litmusconfig` settings.

---

### 2. `connect` - Connect Resources

Establish connections to chaos resources.

**Connect Chaos Infrastructure**
```bash
litmusctl connect chaos-infra
```

**Flags:**
- `--project-id`: Specify the project ID
- `--environment-id`: Specify the environment ID
- `--non-interactive`: Enable non-interactive mode (all required information must be provided via flags)
- `--installation-mode`: Installation mode (`cluster` or `namespace`)
- `--chaos-infra-name`: Name for the chaos infrastructure
- `--chaos-infra-description`: Description for the chaos infrastructure
- `--platform-name`: Platform name (AWS, GKE, Openshift, Rancher, Others)
- `--namespace`: Kubernetes namespace for installation
- `--service-account`: Service account name
- `--skip-ssl`: Skip SSL/TLS verification (true/false)
- `--node-selector`: Node selector for deployments

**Example (Non-interactive mode):**
```bash
litmusctl connect chaos-infra \
  --project-id="<project-id>" \
  --environment-id="<environment-id>" \
  --chaos-infra-name="my-chaos-infra" \
  --installation-mode="cluster" \
  --non-interactive
```

---

### 3. `disconnect` - Disconnect Resources

Disconnect chaos resources from ChaosCenter.

**Disconnect Chaos Infrastructure**
```bash
litmusctl disconnect chaos-infra <chaos-infra-id> --project-id="<project-id>"
```

**Example:**
```bash
litmusctl disconnect chaos-infra 13dsf3d1-5324-54af-4g23-5331g5v2364f --project-id="50addd40-8767-448c-a91a-5071543a2d8e"
```

---

### 4. `create` - Create Resources

Create new projects, experiments, and environments.

**Create Project**
```bash
litmusctl create project --name="<project-name>"
```

**Create Chaos Environment**
```bash
litmusctl create chaos-environment
```
You will be prompted for:
- Project ID
- Environment Name
- Environment Type (Production/Non-Production)

**Create Chaos Experiment**
```bash
litmusctl create chaos-experiment -f <experiment-manifest.yml> --project-id="<project-id>" --chaos-infra-id="<chaos-infra-id>"
```

**Flags:**
- `-f`: Path to experiment manifest file
- `--project-id`: Target project ID
- `--chaos-infra-id`: Target chaos infrastructure ID

**Example:**
```bash
litmusctl create chaos-experiment \
  -f custom-chaos-experiment.yml \
  --project-id="eb7fc0a0-5878-4454-a9db-b67d283713bc" \
  --chaos-infra-id="e7eb0386-085c-49c2-b550-8d85b58fd"
```

---

### 5. `get` - Retrieve Information

Query and list various resources.

**Get Projects**
```bash
litmusctl get projects
```
Lists all projects accessible to the user with their IDs, names, and creation timestamps.

**Get Chaos Infrastructures**
```bash
litmusctl get chaos-infra
```
You will be prompted for the Project ID. Returns infrastructure ID, name, and status.

**Get Chaos Environments**
```bash
litmusctl get chaos-environment
```
Lists chaos environments with their IDs, names, types, and timestamps.

**Get Chaos Experiments**
```bash
litmusctl get chaos-experiments
```
Lists chaos experiments within a project.

---

### 6. `run` - Execute Operations

Execute chaos experiments and other operations.

**Run Chaos Experiment**
```bash
litmusctl run chaos-experiment
```
You will be prompted for:
- Project ID
- Chaos Experiment ID

**Example:**
```bash
litmusctl run chaos-experiment
# Enter the Project ID: eb7fc0a0-5878-4454-a9db-b67d283713bc
# Enter the Chaos Experiment ID: test_exp
```

---

### 7. `update` - Update Resources

Modify existing resources and settings.

**Update Password**
```bash
litmusctl update password
```
Change the password for your ChaosCenter account. You will be prompted for:
- Username
- Old Password
- New Password
- Confirm Password

---

### 8. `version` - Version Information

**Check Version**
```bash
litmusctl version
```
Display the current version of litmusctl.

---

## Global Flags

These flags can be used with most commands:

- `--config`: Specify a custom config file path (default: `${HOME}/.litmusconfig`)
- `--help` or `-h`: Display help information for any command

---

## Interactive vs Non-Interactive Mode

### Interactive Mode
By default, litmusctl operates in interactive mode where it prompts you for required information.

```bash
litmusctl connect chaos-infra
# Will prompt for all required details
```

### Non-Interactive Mode
Use the `--non-interactive` flag along with all required flags to run commands without prompts.

```bash
litmusctl connect chaos-infra \
  --project-id="<project-id>" \
  --environment-id="<environment-id>" \
  --chaos-infra-name="my-infra" \
  --non-interactive
```

**Note:** Only `litmusctl connect chaos-infra` requires the `--non-interactive` flag. Other commands automatically use non-interactive mode when all required flags are provided.

---

## Configuration File

litmusctl uses the `.litmusconfig` file to manage multiple accounts:

- **Default Location:** `${HOME}/.litmusconfig`
- **Custom Location:** Use `--config` flag to specify a different location
- **No Merging:** If `--config` is specified, only that file is loaded (no merging with default config)

---

## Common Workflows

### Initial Setup
```bash
# 1. Configure your account
litmusctl config set-account

# 2. View configured accounts
litmusctl config get-accounts

# 3. Create or select a project
litmusctl create project --name="my-project"
litmusctl get projects
```

### Connecting Infrastructure
```bash
# 1. Create an environment (if needed)
litmusctl create chaos-environment

# 2. Connect chaos infrastructure
litmusctl connect chaos-infra

# 3. Verify connection
litmusctl get chaos-infra
```

### Running Experiments
```bash
# 1. Create experiment
litmusctl create chaos-experiment -f experiment.yml --project-id="<id>" --chaos-infra-id="<id>"

# 2. Run experiment
litmusctl run chaos-experiment

# 3. List experiments
litmusctl get chaos-experiments
```

---

## Examples

### Example 1: Complete Setup in Non-Interactive Mode
```bash
# Set account
litmusctl config set-account \
  --endpoint="https://chaos.example.com" \
  --username="admin" \
  --password="password"

# Create project
litmusctl create project --name="production-chaos"

# Get project ID
litmusctl get projects

# Connect infrastructure
litmusctl connect chaos-infra \
  --project-id="50addd40-8767-448c-a91a-5071543a2d8e" \
  --environment-id="prod-env" \
  --chaos-infra-name="prod-cluster-1" \
  --installation-mode="cluster" \
  --platform-name="GKE" \
  --namespace="litmus" \
  --non-interactive
```

### Example 2: Interactive Workflow
```bash
# Configure account interactively
litmusctl config set-account
# Follow prompts for endpoint, username, password

# Connect infrastructure interactively
litmusctl connect chaos-infra
# Follow prompts for all required details

# Create and run experiment interactively
litmusctl create chaos-experiment -f my-experiment.yml
# Follow prompts for project-id and chaos-infra-id

litmusctl run chaos-experiment
# Follow prompts for project-id and experiment-id
```

---

## Additional Resources

- For detailed usage examples, refer to the [litmusctl usage documentation](/docs/next/litmusctl/litmusctl-usage)
- For installation instructions, see the [litmusctl installation guide](/docs/next/litmusctl/installation)
- [Contribute to litmusctl](https://github.com/litmuschaos/litmusctl)
