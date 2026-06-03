---
id: examples
title: Example Interactions
---

In this documentation, you can find copy-paste-ready interactions you can perform via the MCP server. Each example pairs a natural language prompt with the underlying tool calls and a sample response so you can replicate the workflow quickly.

If you’re new to the tool surface, see `mcp-server/available-tools.md` for a complete reference of capabilities and parameters.

## Quick Start

A common end-to-end flow looks like this:

1. List experiments → pick one to run.
2. Run an experiment → capture the Run ID.
3. Monitor the run → check steps, logs, and probe results.
4. (Optional) Stop the run if needed.

Below, you’ll find detailed examples for these and more scenarios.

## Sample Prompts

- Prompt
  ```text
  Show me available chaos experiments in the staging environment that target Kubernetes.
  ```
  It will: List chaos experiments filtered by environment and platform so you can choose one to run.

- Prompt
  ```text
  Run experiment "pod-delete-basic" now in staging and return the run ID.
  ```
  It will: Trigger an on-demand run of the chosen experiment and return the Run ID.

- Prompt
  ```text
  Show me the latest status, timeline, and probe results for run ID <RUN_ID>.
  ```
  It will: Retrieve detailed run information including step timeline and probe outcomes.

- Prompt
  ```text
  Stop the currently running run <RUN_ID> and confirm the termination.
  ```
  It will: Attempt to stop the in-progress run and report acceptance.

- Prompt
  ```text
  List all registered infrastructures and show which ones are healthy.
  ```
  It will: Return the registered infrastructures with their connection/health status.

- Prompt
  ```text
  Onboard a new Kubernetes cluster named "edge-lab" and provide the registration steps.
  ```
  It will: Initiate registration and return the manifest or token with next steps.

- Prompt
  ```text
  Create an HTTP probe that checks GET https://myapp.example.com/health returns 200 in under 2s.
  ```
  It will: Create a reusable HTTP probe definition for steady-state validation.

- Prompt
  ```text
  List all probes so I can attach one to my next experiment.
  ```
  It will: List available resilience probes with IDs and brief specs.

- Prompt
  ```text
  Show me available ChaosHubs and then list Kubernetes pod-level faults.
  ```
  It will: List connected hubs and then fetch faults filtered by platform/category.

- Prompt
  ```text
  Create a new environment called "chaos-lab" for ad-hoc testing.
  ```
  It will: Create a new environment grouping that you can target in experiments.

- Prompt
  ```text
  List environments so I can verify "chaos-lab" exists.
  ```
  It will: List all environments with their IDs and names.

## Tips and Good Practices

- Start broad with listing tools (`list_chaos_experiments`, `list_experiment_runs`, `list_chaos_infrastructures`, `list_environments`) before drilling down.
- Prefer IDs over names for precision when running or stopping experiments.
- After `run_chaos_experiment`, immediately capture the `runId` to monitor or stop it later.
- Reuse probes across experiments to standardize resilience checks.
- Keep filters small and focused to reduce noise in large projects.

For detailed parameter schemas and additional examples, see `mcp-server/available-tools.md`.

## Learn more

- [Installation](./installation)
- [Available Tools](./available-tools)
- [Troubleshooting](./troubleshooting)
