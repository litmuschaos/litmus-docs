---
id: available-tools
title: Available Tools
---

In MCP, a “tool” is a simple action you can call programmatically: it takes clear inputs and returns structured outputs. 

Litmus MCP tools map to common chaos engineering workflows, managing experiments, monitoring runs, connecting infrastructures, organizing environments, defining resilience probes, and discovering faults and analytics, so assistants and automations can perform these tasks reliably.

Use this page as a practical reference. Each section explains what a tool does, when to use it, typical inputs, and the kind of output you can expect.

## Overview of tool categories

- Experiment Management: create visibility into experiments and run or stop them.
- Execution Monitoring: see execution history and drill into run details and logs.
- Infrastructure Management: register and inspect Kubernetes infrastructures.
- Environment Organization: group experiments and resources by environment.
- Resilience Validation: define probes to validate steady state and SLOs.
- Discovery & Analytics: explore available faults and review platform statistics.

Below is the full list of 17 tools, organized by category.

## Experiment Management

These tools help you find, inspect, run, and stop chaos experiments.

### list_chaos_experiments
List all chaos experiments with optional filtering.
- What it does: Returns a list of experiments. You can filter by project, environment, tags, or name.
- When to use: To see which experiments exist before selecting one to run or inspect.
- Typical input: Project ID or Name, optional filters (environment, labels, search text), pagination.
- Output: A paginated list of experiments with key fields like name, ID, environment, and status.

### get_chaos_experiment
Get detailed information about a specific chaos experiment.
- What it does: Fetches full details for a single experiment.
- When to use: To review experiment structure, faults used, probes, and configuration before running it.
- Typical input: Experiment ID (or name + project/environment context).
- Output: Experiment spec including faults, probes, parameters, schedules, and metadata.

### run_chaos_experiment
Execute a chaos experiment immediately (on-demand run).
- What it does: Triggers an on-demand run of the selected experiment.
- When to use: To start a test now (outside of any scheduled cadence) for debugging or validation.
- Typical input: Experiment ID and optional overrides (variables, run labels, dry-run flag if supported).
- Output: A run ID (or execution reference) you can use to monitor progress.

### stop_chaos_experiment
Stop an in-progress chaos experiment run.
- What it does: Attempts to stop an in-progress experiment run.
- When to use: If a test must be halted due to impact, misconfiguration, or a time limit.
- Typical input: Experiment ID or Run ID.
- Output: Confirmation that the stop request was accepted; subsequent run status should show as stopped/terminated.

## Execution Monitoring

These tools help you track experiment execution over time, and inspect an individual run in depth.

### list_experiment_runs
List experiment execution history with flexible filters.
- What it does: Lists runs across experiments, with filters such as experiment, environment, status, or time range.
- When to use: To review what ran recently, identify failed runs, or audit changes over time.
- Typical input: Experiment ID (optional), status filters (Succeeded/Failed/Running), time window, pagination.
- Output: A list of runs with IDs, timestamps, duration, status, and basic metadata.

### get_experiment_run_details
Get detailed information about a single run, including timeline, logs, and probe results.
- What it does: Shows a single run’s timeline, step status, logs, and probe results.
- When to use: For debugging failures, verifying probe outcomes, or sharing evidence of success.
- Typical input: Run ID.
- Output: Detailed run record including events, steps, logs, artifacts, and final status.

## Infrastructure Management

Use these tools to manage and view the Kubernetes infrastructures where experiments run.

### list_chaos_infrastructures
List all registered infrastructures (for example, Kubernetes clusters/agents).
- What it does: Returns all infrastructures registered to the project (for example, Kubernetes clusters/agents).
- When to use: To confirm which clusters are connected and healthy.
- Typical input: Project ID or Name, optional filters (status, type), pagination.
- Output: A list of infrastructures with IDs, names, types, connection status, and last heartbeat.

### get_infrastructure_details
Get detailed information about a specific infrastructure.
- What it does: Shows full details about a specific infrastructure.
- When to use: To review configuration, connected namespaces, resource quotas, and health.
- Typical input: Infrastructure ID.
- Output: Detailed infrastructure profile including metadata, status, capabilities, and version info.

### register_chaos_infrastructure
Register a new Kubernetes infrastructure to run experiments.
- What it does: Starts the registration/handshake for a new Kubernetes cluster or agent.
- When to use: When onboarding a new cluster to run chaos experiments.
- Typical input: Project context, cluster name, and registration parameters. You may receive a token or manifest to apply.
- Output: Registration info and next steps (for example, a YAML manifest to install or a token to use with the agent).

## Environment Organization

Organize experiments and resources into environments (for example, dev, staging, prod).

### list_environments
List all environments defined in the project.
- What it does: Lists environments defined in the project.
- When to use: To pick the right environment for creating or running experiments.
- Typical input: Project ID or Name, pagination.
- Output: A list of environments with IDs, names, and basic metadata.

### create_environment
Create a new environment for organizing experiments and resources.
- What it does: Creates a new environment grouping.
- When to use: When you need a separate space for a team, app, or lifecycle stage.
- Typical input: Environment name, description, optional tags/labels.
- Output: The newly created environment with its ID and details.

## Resilience Validation

Probes validate steady state or desired outcomes before, during, and after experiments.

### list_resilience_probes
List all configured resilience probes.
- What it does: Lists probes available in the project or environment.
- When to use: To see what checks exist and reuse them across experiments.
- Typical input: Optional filters like environment, probe type (HTTP, CMD, K8s, Prometheus), pagination.
- Output: A list of probes with IDs, names, types, and brief specs.

### create_resilience_probe
Create a new probe (HTTP, CMD, K8s, or Prometheus) for resilience validation.
- What it does: Creates a new probe definition to validate resilience signals.
- When to use: To add new SLO checks or steady-state validations.
- Typical input: Probe name, type, and spec:
  - HTTP: URL, method, headers, expected status/body.
  - CMD: Command, arguments, timeout, expected exit code.
  - K8s: Resource query (pods/deployments), conditions, namespace.
  - Prometheus: Query, comparison operator, threshold, evaluation window.
- Output: The created probe with ID and full spec.

## Discovery & Analytics

Explore the chaos library and get high-level insights about usage and outcomes.

### list_chaos_hubs
List available ChaosHubs that provide faults and experiments.
- What it does: Lists connected ChaosHubs that provide faults/experiments.
- When to use: To discover which hubs are available (public or private) and browse their content.
- Typical input: Optional filters, pagination.
- Output: A list of hubs with IDs, names, types, and availability.

### get_chaos_faults
Browse available chaos faults from connected hubs.
- What it does: Returns chaos faults available from hubs, with metadata like category, platform, and parameters.
- When to use: To select a fault to add to an experiment.
- Typical input: Hub ID (optional), search query, categories, pagination.
- Output: A list of faults with names, descriptions, supported platforms, and input parameters.

### get_experiment_statistics
Get comprehensive platform-level statistics and recent activity.
- What it does: Provides aggregate stats such as number of experiments, runs, success/failure rates, and recent activity.
- When to use: For reporting, governance, and tracking adoption over time.
- Typical input: Optional time range, environment, or project filters.
- Output: Summary metrics, charts-ready aggregates, and counts.

## Learn more

- [Installation](./installation)
- [Example Interactions](./examples)
- [Troubleshooting](./troubleshooting)
