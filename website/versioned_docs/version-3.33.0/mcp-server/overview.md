---
id: overview
title: Overview
---

Litmus MCP Server is a Model Context Protocol (MCP) server for LitmusChaos 3.x that lets AI assistants interact with your chaos engineering platform via natural language.

- Built in Go
- Works with LitmusChaos Chaos Center 3.x
- Manage experiments, infrastructures, environments, and resilience probes

See the [GitHub repository](https://github.com/litmuschaos/litmus-mcp-server) for more details.

## Prerequisites

- Go 1.21+
- Access to a LitmusChaos 3.x Chaos Center
- Valid project credentials

## Key Features

Use these MCP tools to manage chaos with plain language: find and run experiments, track results, and manage infrastructure, environments, probes, and hubs.

### Chaos Experiment Management

The MCP server exposes tools to help you discover and operate chaos experiments through natural language.

- List and describe available chaos experiments in a project
- Execute experiments on demand or via cron-like schedules
- Stop or abort running experiments with granular control
- Provide dry-run style validations where supported by the backend

Use cases: quickly preview experiment details, trigger a one-off chaos run, or halt an experiment that is impacting a sensitive window.

### Infrastructure Operations

Operate LitmusChaos infrastructures (formerly agents/chaos delegates) programmatically via the MCP server.

- List and get infrastructure details, including connection and health status
- Monitor infrastructure heartbeat, last seen time, and readiness
- Generate installation manifests tailored to your environment
- Support for both namespace-scoped and cluster-scoped deployments

Use cases: verify delegate health, fetch installation YAML, or confirm whether an infra is cluster-wide.

### Environment Organization

Organize your resources using environments to separate PROD and NON_PROD workloads and operations.

- Create and manage environments (for example, PROD and NON_PROD)
- Associate infrastructures with specific environments
- Filter experiments and operations based on environment context

Use cases: keep production chaos separate from staging, and apply environment-aware policies and filters.

### Experiment Execution Tracking

Gain visibility into experiment runs and their outcomes directly from your AI assistant.

- Retrieve detailed run history with status, duration, and timeline
- Monitor active executions in near real time
- Track fault-level success/failure signals
- View resiliency score calculations and contributing factors

Use cases: audit past runs, inspect an in-progress execution, or report the resiliency trend to stakeholders.

### Resilience Probes

Probes validate steady-state behavior and success criteria during chaos runs.

- Built-in probe types: HTTP, Command, Kubernetes, and Prometheus
- Plug-and-play probe architecture for easy composition
- Steady-state and post-injection validations during experiments

Use cases: verify service health with HTTP checks, run diagnostic commands, or evaluate Prometheus metrics as SLOs.

### ChaosHub Integration

Discover and manage chaos faults from one or more hubs.

- Browse available chaos faults and their documentation
- Support multiple hubs (Git-backed and remote hubs)
- Categorization and search to quickly find relevant faults

Use cases: explore new faults to adopt, compare hub versions, or locate a fault by category.

### Statistics and Analytics

Get aggregated views across experiments and infrastructures to understand overall resilience.

- Project-wide experiment and infrastructure statistics
- Resiliency score distributions over time or by environment
- Run status breakdowns and failure modes

Use cases: track adoption, identify flaky faults, and quantify improvements to resilience.

## Learn more

- [Installation](./installation)
- [Available Tools](./available-tools)
- [Example Interactions](./examples)
- [Troubleshooting](./troubleshooting)
