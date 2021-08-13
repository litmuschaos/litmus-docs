---
id: chaos-control-plane
title: Chaos Control Plane
sidebar_label: Chaos Control Plane
---

---

<img src={require("../assets/control-plane.png").default} alt="Chaos Control Plane" />

Chaos Control Plane consists of micro-services responsible for the functioning of the Chaos Center, the website based portal that can be used for interacting with Litmus, apart from the CLI. Chaos Plane facilitates the creation and scheduling of chaos workflows, system observability during the event of chaos, and post-processing and analysis of experiment results. To achieve this, it uses four separate components:

1. **Authentication Server:** A Golang micro-service which is responsible for authorizing as well as authenticating the requests received from Chaos Center. It primarily serves the cause of user creation, user login, reset password, and update user information.

2. **Backend Server:** A GraphQL based Golang micro-service that serves the requests received from Chaos Center, by either querying the database for the relevant information or by fetching information from the Execution Plane.

3. **Database:** A NoSQL MongoDB database micro-service that is accountable for storing users' information, past workflows, saved workflow templates, user projects, ChaosHubs, and GitOps details, among the other information.

4. **Chaos Center:** A React.js based frontend application micro-service that serves as the user front facing component that allows creation and scheduling of chaos workflows, system observability during the chaos injection, and chaos result analysis. 

In order to schedule and execute a chaos workflow using the Chaos Center, the user is required to login to the portal using a valid login credential. This will lead them to the user dashboard where they will be able to access the Litmus projects they are a part of. In order to schedule a workflow, the user needs to have an Editor or Owner access in the project. Once the user successfully creates a Chaos Workflow manifest using the interactive web UI, it is received by the backend server that forwards it to the Chaos Agent as well as stores it in the database. The Chaos Agent uses the Chaos Workflow in the target cluster to inject chaos in the target resources and return the experiment results for the chaos experiments that are a part of the workflow back to the backend server, along with the experiment logs. The backend server then sends the experiment results and logs to the Chaos Center. It also stores the results and logs into the database to populate the workflow run history. This information can then be used to perform post-processing of the Chaos Workflow run, using the built-in analytics dashboard in the Chaos Center.
