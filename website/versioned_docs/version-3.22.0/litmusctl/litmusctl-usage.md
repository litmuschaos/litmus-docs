---
id: litmusctl-usage
title: Overview
sidebar_label: Usage Overview
---

---

This section provides comprehensive guides for using litmusctl to manage your chaos engineering workflows. litmusctl is the command-line interface for LitmusChaos that enables you to interact with ChaosCenter and manage chaos experiments from your terminal.

## What You Can Do with litmusctl

With litmusctl, you can:

- **Connect Chaos Infrastructure**: Set up and connect chaos infrastructure to your ChaosCenter
- **Create and Manage Experiments**: Design, create, and run chaos experiments using manifest files
- **Manage Projects and Environments**: Organize your chaos engineering efforts across different projects and environments
- **Monitor and Control**: Track experiment status and manage your chaos engineering resources

## Getting Started

Before diving into the specific usage guides, ensure you have:

1. **litmusctl installed** - Follow the [installation guide](installation.md)
2. **Access to ChaosCenter** - You'll need valid credentials for your ChaosCenter instance
3. **Kubernetes cluster access** - Required for connecting chaos infrastructure

## Usage Guides

The following guides will walk you through the key litmusctl workflows:

### [Connect Chaos Infrastructure](connect-chaos-infrastructure.md)
Learn how to connect a chaos infrastructure to your ChaosCenter. This is typically the first step after installation, allowing you to run chaos experiments in your Kubernetes cluster.

### [Create Chaos Experiment](create-chaos-experiment.md)
Discover how to create and run chaos experiments using litmusctl. This guide covers creating experiments from manifest files, running them, and monitoring their progress.

### [Additional Commands](additional-commands.md)
Explore additional litmusctl commands for account management, project operations, environment handling, and infrastructure management.

## Quick Reference

| Task | Command |
|------|---------|
| Setup account | `litmusctl config set-account` |
| Connect infrastructure | `litmusctl connect chaos-infra` |
| Create experiment | `litmusctl create chaos-experiment -f <file>` |
| List projects | `litmusctl get projects` |
| List infrastructures | `litmusctl get chaos-infra` |

## Next Steps

1. Start with [Connect Chaos Infrastructure](connect-chaos-infrastructure.md) to set up your first chaos infrastructure
2. Move on to [Create Chaos Experiment](create-chaos-experiment.md) to run your first experiment
3. Explore [Additional Commands](additional-commands.md) for advanced usage and management tasks
