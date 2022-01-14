---
id: chaos-execution-plane
title: Chaos Execution Plane
sidebar_label: Chaos Execution Plane
---

---

<img src={require("../assets/chaos-execution-plane.png").default} alt="Chaos Execution Plane" />

Chaos Execution Plane contains the components responsible for orchestrating the chaos injection in the target resources. They get installed in either an external target cluster if an external agent is being used or in the host cluster containing the control plane if a self-agent is being used. It can be further segregated into Litmus Agent Infrastructure components and Litmus Backend Execution Infrastructure components. 

## Litmus Execution Plane Components

Litmus Agent Infrastructure components help facilitate the chaos injection, manage chaos observability, and enable chaos automation for target resources. These components include:

1. **Workflow Controller:** The Argo Workflow Controller responsible for the creation of Chaos Workflows using the Chaos Workflow CR.

2. **Subscriber:** Serves as the link between the Chaos Execution Plane and the Control Plane. It has a few distinct responsibilities such as performing health check of all the components in Chaos Execution Plane, creation of a Chaos Workflow CR from a Chaos Workflow template, watching for Chaos Workflow events during its execution, and sending the chaos workflow result to the Control Plane. 

3. **Event Tracker:** An optional component that is capable of triggering automated chaos workflow runs based on a set of defined conditions for any given resources in the cluster. It is a controller that manages EventTrackerPolicy CR, which is basically the set of defined conditions that is validated by Event Tracker. If the current state of the tracked resources match with the state defined in the EventTrackerPolicy CR, the workflow run gets triggered. This feature can only be used if GitOps is enabled.

4. **Chaos Exporter:** An optional component that facilitates external observability in Litmus by exporting the chaos metrics generated during the chaos injection as time-series data to the Prometheus DB for its processing and analysis.


Litmus Backend Execution Infrastructure components orchestrate the execution of Chaos Workflow in target resources. These components include:

1. **Chaos Workflow CR:** Refers to the Argo Workflow CR which describes the steps that are executed as a part of the chaos workflow. It is used to define failures during a certain workload condition (such as, say, percentage load), multiple (parallel) failures of dependent and independent services etc.

2. **ChaosExperiment CR:** Used for defining the low-level execution information for any Litmus chaos experiment as well as to store the various experiment tunables.

3. **ChaosEngine CR:** Used to hold information about how the chaos experiments are executed. It connects an application instance with one or more chaos experiments while allowing the users to specify run-level details.

4. **Chaos Operator:** A Kubernetes custom-controller that manages the lifecycle of certain resources or applications intending to validate their "desired state". It helps reconcile the state of the ChaosEngine by performing specific actions upon CRUD of the ChaosEngine. It also defines a secondary resource (the ChaosEngine Runner pod), which is created & managed by it to implement the reconcile functions.

<div style={{textAlign: 'center'}}>
  <img src={require("../assets/chaos-execution-plane-chaos-operator.png").default} alt="Chaos Operator" />
</div>

5. **ChaosResult CR:** Holds the results of a chaos experiment, such as ChaosEngine reference, Experiment State, Verdict of the experiment (on completion), salient application/result attributes. It also acts as a source for metrics collection for observability.

6. **Chaos Runner:** Acts as a bridge between the Chaos Operator and Chaos Experiments. It is a lifecycle manager for the chaos experiments that creates Experiment Jobs for the execution of experiment business logic and monitors the experiment pods (jobs) until completion.

<div style={{textAlign: 'center'}}>
  <img src={require("../assets/chaos-execution-plane-chaos-runner.png").default} alt="Chaos Runner" />
</div>

7. **Experiment Jobs:** Refers to the pods that execute the experiment logic. One experiment pod is created per chaos experiment in the workflow.

## Standard Chaos Execution Plane Flow

1. Subscriber receives the Chaos Workflow manifest from the Control Plane and applies the manifest to create a Chaos Workflow CR.
2. Chaos Workflow CRs are tracked by the Argo Workflow Controller. When the Workflow Controller finds a new Chaos Workflow CR, it creates the ChaosExperiment CRs and the ChaosEngine CRs for the chaos experiments that are a part of the workflow.
3. ChaosEngine CRs are tracked by the Chaos Operator. Once a ChaosEngine CR is ready, the Chaos Operator updates the ChaosEngine state to reflect that the particular ChaosEngine is now being executed.
4. For each ChaosEngine resource, a Chaos Runner is created by the Chaos Operator.
5. Chaos Runner firstly reads the chaos parameters from the ChaosExperiment CR and overrides them with values from the ChaosEngine CR. It then constructs the Experiment Jobs and monitors them until their completion.
6. Experiment Jobs execute the experiment business logic and undertake chaos injection on target resources. Once done, the ChaosResult is updated with the experiment verdict.
7. Chaos Runner then fetches the updated ChaosResult and updates the ChaosEngine status as well as the verdict.
8. Once the ChaosEngine is updated, Subscriber fetches the ChaosEngine details and the ChaosResult and forwards them to Chaos Control Plane.

It is worth noticing that:
- If configured, Chaos Exporter fetches data from the ChaosResult CR and converts it in a time-series format to be consumed by the Prometheus DB. 

- An Event Tracker Policy can also be set up as part of the Backend GitOps, where the Backend GitOps Controller tracks a set of specified resources in the target cluster for any change. If any of the tracked resources undergo any change and their resulting state matches the state defined in the Event Tracker Policy, then a pre-defined Chaos Workflow is executed.
