---
id: chaos-control-plane
title: Chaos Control Plane
sidebar_label: Chaos Control Plane
---

---

<img src={require("../assets/chaos-control-plane.png").default} alt="Chaos Control Plane" />

Chaos Control Plane consists of micro-services responsible for the functioning of the Chaos Center, the website-based portal that can be used for interacting with Litmus, apart from the CLI. Chaos Plane facilitates the creation and scheduling of chaos workflows, system observability during the event of chaos, and post-processing and analysis of experiment results. 

## Chaos Control Plane Components

* **Authentication Server:** A Golang micro-service that is responsible for authorizing as well as authenticating the requests received from Chaos Center. It primarily serves the cause of user creation, user login, reset the password, and update user information.

* **Backend Server:** A GraphQL based Golang micro-service that serves the requests received from Chaos Center, by either querying the database for the relevant information or by fetching information from the Execution Plane.

* **Database:** A NoSQL MongoDB database micro-service that is accountable for storing users' information, past workflows, saved workflow templates, user projects, ChaosHubs, and GitOps details, among the other information.

* **Chaos Center:** Refers to the interfaces used by Litmus for creation and scheduling of chaos workflows, system observability during chaos injection, and post chaos result analysis. It includes: 

  * **Web UI:** A React.js based frontend application micro-service with built-in system observability capabilities and an analytics dashboard. It also facilitates teams of users to collaborate over  chaos workflows using role-based user accounts.

  * **Litmusctl:** A command-line tool that allows management of Litmus Agent Infrastructure components. It can be used to create agents, project, and manage multiple Litmus accounts.

  * **Litmus API:** Refers to two different Litmus APIs, namely Litmus Authentication API and Litmus Portal API:

    * **Litmus Authentication API:** Used to authenticate the idenity of a user and to perform several user-specific tasks like update profile, change password, reset password, create new users, etc. It uses the Authentication Server to perform these tasks.

    * **Litmus Portal API:** Provides command-line and UI experience for managing and monitoring the events around chaos workflows. It uses the Backend Server to perform its functions.

## Standard Chaos Control Plane Flow

To schedule and execute a chaos workflow using the Chaos Center, the user is required to log in to the portal using a valid login credential. This will lead them to the user dashboard where they will be able to access the Litmus projects they are a part of. To schedule a workflow, the user needs to have Editor or Owner access to the project. Once the user successfully creates a Chaos Workflow manifest using the interactive web UI, it is received by the backend server that forwards it to the Chaos Agent as well as stores it in the database. The Chaos Agent uses the Chaos Workflow in the target cluster to inject chaos in the target resources and return the experiment results for the chaos experiments that are a part of the workflow back to the backend server, along with the experiment logs. The backend server then sends the experiment results and logs to the Chaos Center. It also stores the results and logs into the database to populate the workflow run history. This information can then be used to perform post-processing of the Chaos Workflow run, using the built-in analytics dashboard in the Chaos Center.
