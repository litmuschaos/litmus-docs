---
id: chaos-control-plane
title: Chaos Control Plane
sidebar_label: Chaos Control Plane
---

---

<img src={require("../assets/chaos-control-plane.png").default} alt="Chaos Control Plane" />

Chaos Control Plane consists of micro-services responsible for the functioning of the ChaosCenter, the website-based portal that can be used for interacting with Litmus, apart from the CLI. Chaos Plane facilitates the creation and scheduling of chaos experiments, system observability during the event of chaos, and post-processing and analysis of fault results.

## Chaos Control Plane Components

- **Authentication Server:** A Golang micro-service that is responsible for authorizing, authenticating the requests received from ChaosCenter and managing users along with their projects. It primarily serves the cause of user creation, user login, resetting the password, updating user information, creating project, managing project related operations.

- **Backend Server:** A GraphQL based Golang micro-service that serves the requests received from ChaosCenter, by either querying the database for the relevant information or by fetching information from the Execution Plane.

- **Database:** A NoSQL MongoDB database micro-service that is accountable for storing users' information, past chaos experiments, saved chaos experiment templates, user projects, ChaosHubs, and GitOps details, among the other information.

- **ChaosCenter:** Refers to the interfaces used by Litmus for creation and scheduling of chaos experiments, system observability during chaos injection, and post chaos result analysis. It includes:

  - **Web UI:** A React.js based frontend application micro-service with built-in system observability capabilities and an analytics dashboard. It also facilitates teams of users to collaborate over chaos experiments using role-based user accounts.

  - **Litmusctl:** A command-line tool that allows management of Litmus Chaos Infrastructure components. It can be used to create chaos infrastructures, project, and manage multiple Litmus accounts.

  - **Litmus API:** Refers to two different Litmus APIs, namely Litmus Authentication API and Litmus Portal API:

    - **Litmus Authentication API:** Used to authenticate the identity of a user and to perform several user and project specific tasks like create new users, update profile, update password, create project, invite users to project, get project details etc. It uses the Authentication Server to perform these tasks.

    - **Litmus Portal API:** Provides command-line and UI experience for managing and monitoring the events around chaos experiments. It uses the Backend Server to perform its functions.

## Standard Chaos Control Plane Flow

1. The User logs in to the ChaosCenter using a valid login credential. A default project is created for the user on initial login. Every user is a part of a project and has a role assigned to them. To schedule a chaos experiment, the user needs to have an Editor or Owner role assigned in the project.
2. The user uploads a Chaos Experiment manifest using the ChaosCenter, which is received by the Backend Server.
3. Backend Server stores the manifest in the Database and also sends it to the Chaos Infrastructure.
4. Chaos Infrastructure uses the Chaos Experiment manifest to inject chaos into the target resources. The steps of the Chaos Experiment execution can be visualized using the ChaosCenter.
5. Chaos Infrastructure returns the results of the chaos faults that were a part of the chaos experiment back to the Backend Server, along with the fault logs.
6. Backend Server then sends the chaos fault results and logs to the ChaosCenter. It also stores the results into the Database for generating post-chaos experiment statistics and information.
