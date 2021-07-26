---
id: chaosagents
title: ChaosAgents
sidebar_label: ChaosAgents
---

A <span style={{color: '#5B44BA'}}>**ChaosAgent**</span> in Litmus is nothing but the target cluster where Chaos would be injected via Litmus. There should always be atleast one or more than one ChaosAgents connected to the ChaosCenter. Each individual ChaosAgent can be chosen to be the Target Agent for Chaos Injection.

## Types of ChaosAgents

In Litmus, ChaosAgents can be classified into two types

- <span style={{color: '#5B44BA'}}><b>Self Agent</b></span>
- <span style={{color: '#5B44BA'}}><b>External Agent</b></span>

As part of the Litmus installation, a Self Agent would be registered as a default Agent in the ChaosCenter. The same cluster where Litmus is installed is chosen as the Self Agent by the installer. From the ChaosCenter you can now induce chaos into this Self Agent and observe the results.

Since the ChaosCenter is Cross Cloud, you can connect multiple external Kubernetes agents to the same with the help of the command line utility <span style={{color: '#5B44BA'}}><b>litmusctl</b></span>. Once connected you can manage, monitor, observe and induce chaos from the ChaosCenter to the respective ChaosAgents.
