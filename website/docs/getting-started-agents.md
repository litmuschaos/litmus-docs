---
id: agents
title: Agents
sidebar_label: Agents
---

An Agent in Litmus is nothing but the target cluster where Chaos would be injected via Litmus. There should always be atleast one or more than one Agents connected to the Litmus Control Plane. Each individual Agent can be chosen to be the Target Agent for Chaos Injection.

## Types of Agent

In Litmus the Agents can be classified into two types

- <span style={{color: '#5B44BA'}}><b>Self Agent</b></span>
- <span style={{color: '#5B44BA'}}><b>External Agent</b></span>

As part of the Litmus installation, a Self Agent would be registered as a default Agent in the Control Plane. The same cluster where Litmus is installed is chosen as the Self Agent by the installer. From the Control Plane you can now induce chaos into this Self Agent and observe the results.

Since the Chaos Control Plane is Cross Cloud, you can connect multiple external Kubernetes agents to the same with the help of the command line utility <span style={{color: '#5B44BA'}}><b>litmusctl</b></span>. Once connected you can manage, monitor, observe and induce chaos from the Control Plane to the respective agent.
