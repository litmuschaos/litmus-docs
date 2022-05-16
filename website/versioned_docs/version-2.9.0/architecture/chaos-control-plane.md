---
id: chaos-control-plane
title: Chaos Control Plane
sidebar_label: Chaos Control Plane
---

---

<img src={require("../assets/chaos-control-plane.png").default} alt="Chaos Control Plane" />

Chaos Control Plane consists of micro-services responsible for the functioning of the Chaos Center, the website-based portal that can be used for interacting with Litmus, apart from the CLI. Chaos Plane facilitates the creation and scheduling of chaos workflows, system observability during the event of chaos, and post-processing and analysis of experiment results. 

## Chaos Control Plane Components

* **Authentication Server:** A Golang micro-service that is responsible for authorizing, authenticating the requests received from Chaos Center and managing users along with their projects. It primarily serves the cause of user creation, user login, resetting the password, updating user information, creating project, managing project related operations.

* **Backend Server:** A GraphQL based Golang micro-service that serves the requests received from Chaos Center, by either querying the database for the relevant information or by fetching information from the Execution Plane.

* **Database:** A NoSQL MongoDB database micro-service that is accountable for storing users' information, past workflows, saved workflow templates, user projects, ChaosHubs, and GitOps details, among the other information.

* **Chaos Center:** Refers to the interfaces used by Litmus for creation and scheduling of chaos workflows, system observability during chaos injection, and post chaos result analysis. It includes: 

  * **Web UI:** A React.js based frontend application micro-service with built-in system observability capabilities and an analytics dashboard. It also facilitates teams of users to collaborate over  chaos workflows using role-based user accounts.

  * **Litmusctl:** A command-line tool that allows management of Litmus Agent Infrastructure components. It can be used to create agents, project, and manage multiple Litmus accounts.

  * **Litmus API:** Refers to two different Litmus APIs, namely Litmus Authentication API and Litmus Portal API:

    * **Litmus Authentication API:** Used to authenticate the identity of a user and to perform several user and project specific tasks like create new users, update profile, update password, create project, invite users to project, get project details etc. It uses the Authentication Server to perform these tasks.

    * **Litmus Portal API:** Provides command-line and UI experience for managing and monitoring the events around chaos workflows. It uses the Backend Server to perform its functions.

## Standard Chaos Control Plane Flow

1. The User logs in to the ChaosCenter using a valid login credential. A default project is created for the user on initial login. Every user is a part of a project and has a role assigned to them. To schedule a workflow, the user needs to have an Editor or Owner role assigned in the project.
2. The user uploads a Chaos Workflow manifest using the ChaosCenter, which is received by the Backend Server.
3. Backend Server stores the manifest in the Database and also sends it to the Chaos Agent.
4. Chaos Agent uses the Chaos Workflow manifest to inject chaos into the target resources. The steps of the Chaos Workflow execution can be visualized using the ChaosCenter.
5. Chaos Agent returns the results of the chaos experiments that were a part of the workflow back to the Backend Server, along with the experiment logs.
6. Backend Server then sends the chaos experiment results and logs to the ChaosCenter. It also stores the results into the Database for generating post-chaos workflow statistics and information.
