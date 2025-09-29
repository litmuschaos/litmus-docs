---
id: chaos-fault-flow
title: Chaos Fault Flow
sidebar_label: Chaos Fault Flow
---

---

<img src={require("../assets/experiment-flow.png").default} alt="Chaos Fault Flow" />

The fault execution is triggered upon the creation of a ChaosEngine resource. The ChaosEngine resource interacts with Chaos Runner, which is created by the Chaos Operator. The Chaos Runner creates Fault Jobs that execute the fault business logic. Typically, these ChaosEngines are embedded within the 'steps' of a Litmus Chaos Experiment. However, one may also create and apply the Chaos Engines manually, and then the chaos-operator reconciles this resource and triggers the fault execution. Chaos faults are classified as:

- Kubernetes Faults
  - Pod-Level Chaos
  - Node-Level Chaos
- Application Chaos
- Cloud Infrastructure

## Chaos Fault Flow Steps

1. Chaos fault execution gets triggered by the Fault Job.
2. Fault tunables and low-level execution details are fetched.
3. ChaosResult gets initialized and its verdict is updated as "Awaited" to indicate that the fault is currently running.
4. Steady-state condition for the respective fault is validated. If the condition is found to be invalid, the fault execution is stopped and the ChaosResult is updated as "Fail".
5. Once the steady-state condition is validated, fault resources are created to facilitate the chaos injection.
6. Chaos injection is performed on the target resources for the specified chaos duration.
7. Chaos injection gets reverted.
8. Post chaos status-check is performed to ensure that the steady-state is still maintained.
9. If the check is invalid, the ChaosEngine and ChaosResult verdicts are updated as "Fail", otherwise they are updated as "Pass".
10. Fault execution ends.

:::note
With the latest release of LitmusChaos 3.0.0:

<li>The term <b>Chaos Experiment</b> has been changed to <b>Chaos Fault.</b> </li>
<li>The term <b>Chaos Experiment/Workflow</b> has been changed to <b>Chaos Experiment.</b></li>
:::
