---
id: machine-agent
title: Machine Agent (m-agent)
sidebar_label: Machine Agent (m-agent)
---

The Machine Agent (m-agent) is a lightweight, platform-generic daemon designed to remotely inject faults into machine-scoped resources, such as physical servers or virtual machines, as part of LitmusChaos experiments. Unlike the standard chaos infrastructure that runs within Kubernetes, m-agent runs as a `systemd` service on the target machine and communicates via WebSockets to trigger and manage chaos experiments.

## Why do we need m-agent?

In many enterprise environments, not all workloads are containerized or run on Kubernetes. Critical infrastructure often includes legacy applications, databases, or specialized services running directly on physical or virtual machines. 

m-agent provides the following benefits:
- **Machine-Scoped Chaos**: Enables chaos injection into non-Kubernetes resources.
- **Lightweight Footprint**: Designed to be minimal and unobtrusive on the target system.
- **Platform Generic**: Works across various Linux distributions.
- **Remote Orchestration**: Controlled via the LitmusChaos Execution Plane using WebSockets.

## Prerequisites

- Target machine running a Linux distribution with `systemd` (e.g., Ubuntu, CentOS, RHEL, SUSE).
- Network connectivity between the LitmusChaos Control Plane and the target machine on the configured port (default is 41365).
- Root or `sudo` access for installation and service management.

## Installation

You can install the m-agent using a provided installation script.

1.  **Download the installation script**:
    ```bash
    curl -O https://raw.githubusercontent.com/litmuschaos/m-agent/master/get_m-agent.sh
    ```
2.  **Make the script executable**:
    ```bash
    chmod +x get_m-agent.sh
    ```
3.  **Run the installation**:
    ```bash
    ./get_m-agent.sh
    ```
    *Note: If you do not have sudo access, you can use the `--no-sudo` flag, although some functionality may be limited.*

Once installed, the agent will automatically start as a `systemd` service named `m-agent`.

## Usage

### Authentication

The m-agent uses token-based authentication to secure requests. You must generate an authentication token before running experiments.

- **Interactive Mode**:
    ```bash
    m-agent -get-token
    ```
- **Non-interactive Mode (with specific expiry)**:
    ```bash
    m-agent -get-token -token-expiry-duration 30m
    ```
    *The duration can be specified in minutes (m), hours (h), or days (D), e.g., `15D` for 15 days.*

### Service Management

You can manage the m-agent service using standard `systemctl` commands:

- **Check Status**: `systemctl status m-agent`
- **Restart Agent**: `sudo systemctl restart m-agent`
- **Stop Agent**: `sudo systemctl stop m-agent`

### Configuration

The agent listens on port **41365** by default. You can update the port if needed:

1.  **Update the port**:
    ```bash
    sudo m-agent -updated-port <NEW_PORT>
    ```
2.  **Restart the service**:
    ```bash
    sudo systemctl restart m-agent
    ```

## Uninstallation

To remove the m-agent and its associated service from your system, use the uninstallation script:

1.  **Download and run the remove script**:
    ```bash
    curl -fsSL -o remove_m-agent.sh https://raw.githubusercontent.com/litmuschaos/m-agent/master/scripts/uninstall.sh
    chmod 700 remove_m-agent.sh
    ./remove_m-agent.sh
    ```

## Learn More

- [GitHub Repository](https://github.com/litmuschaos/m-agent)
- [Chaos Infrastructure Concepts](../concepts/chaos-infrastructure)
