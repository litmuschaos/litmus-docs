---
id: execution-plane
title: Execution Plane
sidebar_label: Execution Plane
---

---

<img src={require("../assets/execution-plane.png").default} alt="Execution Plane" />

Execution Plane contains the components responsible for executing the chaos. It can be further segregated into Litmus Agent Infrastructure components and Litmus Backend Execution Infrastructure components. Litmus Agent Infrastructure components get installed in the cluster belonging to the target resource by the Litmus agent and help facilitate the chaos injection and its observability on the target resource. These components include:

1. **Argo Workflow Controller:** Used for the creation of Chaos Workflows for Litmus using the Chaos Workflow CR.

2. **Subscriber:** Serves as the link between the Execution Plane and the Control Plane. It has a few distinct responsibilities including creation of a Chaos Workflow CR from a Chaos Workflow template, watching for Chaos Workflow events during its execution, and sending the chaos workflow result to the Control Plane. 

3. **Event Tracker:** An optional component that is capable of triggering automated chaos workflow runs based on a set of defined conditions. It is managed by the Backend GitOps Controller, and can only be used if GitOps is enabled.

4. **Chaos Exporter:** An optional component that is responsible for exporting the observed metrics of the target resource as time series data to the Prometheus DB for its post-processing and analysis.


Litmus Backend Execution Infrastructure components execute in the host Litmus cluster, and they are responsible for orchestrating the execution of Chaos Workflows in the various target resources. These components include:

1. **Chaos Workflow CR:** Refers to the Argo workflow CR which defines the Litmus chaos workflow that is used by the Argo workflow controller to inject chaos in the respective target resources.

2. **ChaosExperiment CR:** Used for defining the low-level execution information for any Litmus chaos experiment as well as to store the various experiment tunables.

3. **ChaosEngine CR:** Used to hold information about how the chaos experiments are executed. It connects an application instance with one or more chaos experiments, while allowing the users to specify run level details.

4. **Chaos Operator:** A Kubernetes custom-controller that manages the lifecycle of certain resources or applications with the objective of validating their "desired state". It helps reconcile the state of the ChaosEngine by performing specific actions upon CRUD of the ChaosEngine. It also defines a secondary resource (the ChaosEngine Runner pod), which is created & managed by it in order to implement the reconcile functions.

5. **ChaosResult CR:** Holds the results of a chaos experiment, such as ChaosEngine reference, Experiment State, Verdict of the experiment (on completion), salient application/result attributes. It also acts as a source for metrics collection for observability.

6. **Chaos Runner:** Acts as a bridge between the Chaos Operator and Chaos Experiments. It is a lifecycle manager for the chaos experiments that creates Experiment Jobs for the execution of experiment business logic and monitors the experiment pods (jobs) until completion.

7. **Experiment Jobs:** Refers to the pods that execute the experiment logic. One experiment pod is created per chaos experiment in the workflow.

When Subscriber receives the Chaos Workflow manifest from the Control Plane, it applies the manifest to create a Chaos Workflow CR. Chaos Workflow CRs are tracked by the Argo Workflow Controller. When the Argo Workflow Controller finds a new Chaos Workflow CR, it creates the ChaosExperiment CRs and the ChaosEngine CRs for the chaos experiments that are a part of the workflow execution. ChaosEngine CRs are tracked by the Chaos Operator. Once a ChaosEngine CR is ready, the Chaos Operator updates the ChaosEngine state to reflect that the particular ChaosEngine is now performing the respective chaos experiment and creates Chaos Runner. Chaos Runner firstly reads the chaos parameters from the ChaosExperiment CR and overrides with values from the ChaosEngine CR. It then constructs the Experiment Jobs and monitors them until their completion. Experiment Jobs execute the experiment business logic and undertake chaos injection on target resources. Once done, the ChaosResult is updated with the experiment verdict. Chaos Runner then fetches the updated ChaosResult and updates the ChaosEngine status as well as the verdict. Once the ChaosEngine is updated, Subscriber fetches the ChaosEngine Details and sends them to the Control Plane.

If configured, Chaos Exporter fetches data from the ChaosResult CR and converts it in a time-series format to be consumed by the Prometheus DB. An Event Tracker Policy can also be setup as part of the Backend GitOps, where the Backend GitOps Controller tracks a set of specified resources in the target cluster for any change. If any of the tracked resources undergo any change and their resulting state matches to the state defined in the Event Tracker Policy, then a pre-defined Chaos Workflow is executed.
