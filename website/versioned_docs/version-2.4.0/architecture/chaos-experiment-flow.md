---
id: chaos-experiment-flow
title: Chaos Experiment Flow
sidebar_label: Chaos Experiment Flow
---

---

<img src={require("../assets/experiment-flow.png").default} alt="Chaos Experiment Flow" />

The experiment execution is triggered upon the creation of a ChaosEngine resource. The ChaosEngine resource interacts with Chaos Runner, which is created by the Chaos Operator. The Chaos Runner creates Experiment Jobs that execute the experiment business logic. Typically, these ChaosEngines are embedded within the 'steps' of a Litmus Chaos Workflow. However, one may also create and apply the Chaos Engines manually, and then the chaos-operator reconciles this resource and triggers the experiment execution. Chaos experiments are classified as:

- Kubernetes Experiments
  - Pod-Level Chaos 
  - Node-Level Chaos 
- Application Chaos
- Cloud Infrastructure

## Chaos Experiment Flow Steps

1. Chaos experiment execution gets triggered by the Experiment Job.
2. Experiment tunables and low-level execution details are fetched.
3. ChaosResult gets initialized and its verdict is updated as "Awaited" to indicate that the experiment is currently running.
4. Steady-state condition for the respective experiment is validated. If the condition is found to be invalid, the experiment execution is stopped and the ChaosResult is updated as "Fail".
5. Once the steady-state condition is validated, experiment resources are created to facilitate the chaos injection.
6. Chaos injection is performed on the target resources for the specified chaos duration.
7. Chaos injection gets reverted.
8. Post chaos status-check is performed to ensure that the steady-state is still maintained.
9. If the check is invalid, the ChaosEngine and ChaosResult verdicts are updated as "Fail", otherwise they are updated as "Pass".
10. Experiment execution ends.
