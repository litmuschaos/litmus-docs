---
id: overview
title: m-agent
sidebar_label: Overview
---

---

Machine Agent, a.k.a. m-agent is a lightweight, platform-generic daemon agent that can remotely inject faults into machine scoped resources as part of the LitmusChaos Experiments.

## Why do you need m-agent?
In the context of machine-scoped chaos experiments for LitmusChaos, despite using various cloud platform specific VM agents for the execution of the chaos, there have been several limitations such as:
- Inflexible APIs for run-command which translates to poor chaos orchestration and chaos rollback abilities.
- Individual experiment codebases for each cloud platform, which is difficult to maintain.
- Lack of observability of resources in the target machine during the chaos injection.
- Limited scope for Litmus probes as they can’t be executed within the target machine.

To address these issues, m-agent has been introduced. m-agent provides many advantages over the current approach, such as:
- Enhanced OS resource state monitoring in the target machine
- Ability to run Litmus probes natively within the target machine
- Establishes the basis for injecting application-level chaos in the further iterations
- Introduces error classification for simplifying the process of their mitigation

## How does m-agent work?
m-agent is essentially a server which lies within the target machine, where it performs different actions on behalf of the experiment pod, that lies in the execution plane. These actions include, but are not limited to:
- Check Steady State
- Inject Chaos
- Execute Litmus Probe
- Revert Chaos
- Check Liveness, etc. 

The experiment pod and m-agent communicate with each other using the [websocket](https://en.wikipedia.org/wiki/WebSocket) protocol.
<img src={require("../assets/m-agent-design.png").default} alt="m-agent design summary" />

