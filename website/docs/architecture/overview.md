---
id: overview
title: Overview
sidebar_label: Overview
---

---

The entirety of the Litmus architecture is split into two sections: 
1. Control Plane 
2. Execution Plane 

Control Plane consists of micro-services responsible for the functioning of the Chaos Center, the website based portal used for interacting with Litmus, that primarily facilitates the creation and scheduling of chaos workflows, system observability during the event of chaos, and post-processing and analysis of experiment results. To achieve this, it uses an authentication server, a backend server, and a database. The authentication server is a golang micro-service which is concerned with authorizing as well as authenticating the requests received from the Chaos Center. It primarily serves the cause of user creation, user login, reset password, and update user information. The backend server has been developed using GraphQL in golang, which serves the requests received from the frontend application, by either querying the database for the relevant information or by fetching information from the Execution plane. The NoSQL MongoDB database is accountable for storing users' information, past workflows and saved workflow templates, user projects, chaos hubs, and GitOps details, among the other information. 

The Execution Plane contains the components responsible for executing the chaos. It can be further segregated into Litmus Agent Infrastructure components and Litmus Backend Execution Infrastructure components. Litmus Agent Infrastructure components get installed in the cluster belonging to the target resource by the Litmus agent and help facilitate the chaos injection and its observability on the target resource. These components include:
1. **Argo workflow controller:** Used for the creation of chaos workflows for Litmus using the Chaos Workflow CR.
2. **Subscriber:** Serves as the link between the Execution Plane and the Control Plane, where it acts as a source of information for the different aspects and events of the Execution plane to which the GraphQL server subscribes.
3. **Event Tracker:** An optional component that is capable of triggering automated chaos workflow runs based on a set of defined conditions. It works alongside GitOps, only if it is enabled, where in it serves as the single source of truth for the chaos workflow and chaos experiments stored in it. 
4. **GitOps Controller:** 
5. **Chaos exporter:** Responsible for exporting the observed metrics of the target resource to be fetched as time series data by the Prometheus DB for its post-processing and analysis.

Litmus Backend Execution Infrastructure components execute in the host Litmus cluster, and they are responsible for orchestrating the execution of chaos workflows in the various target resources. These components include:
1. **Chaos Workflow CR:** Refers to the Argo workflow CR which defines the Litmus chaos workflow that is used by the Argo workflow controller to inject chaos in the respective target resources.
2. **ChaosExperiment CR:** Used for defining the low-level execution information for any Litmus chaos experiment as well as to store the various experiment tunables.
3. **ChaosEngine CR:** Used to hold information about how the chaos experiments are executed. It connects an application instance with one or more chaos experiments, while allowing the users to specify run level details.
4. **Chaos Operator:** A Kubernetes custom-controller that manages the lifecycle of certain resources or applications with the objective of validating their "desired state". It helps reconcile the state of the ChaosEngine by performing specific actions upon CRUD of the ChaosEngine. It also defines a secondary resource (the ChaosEngine Runner pod), which is created & managed by it in order to implement the reconcile functions.
5. **ChaosResult CR:** Holds the results of a chaos experiment, such as ChaosEngine reference, Experiment State, Verdict of the experiment (on completion), salient application/result attributes. It also acts as a source for metrics collection for observability.