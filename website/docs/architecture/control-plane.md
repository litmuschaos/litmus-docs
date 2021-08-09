---
id: control-plane
title: Control Plane
sidebar_label: Control Plane
---

---

Control Plane consists of micro-services responsible for the functioning of the ChaosCenter, the website based portal that can be used for interacting with Litmus, apart from the CLI. Chaos Plane facilitates the creation and scheduling of chaos workflows, system observability during the event of chaos, and post-processing and analysis of experiment results. To achieve this, it uses four separate components:

1. **Authentication Server:** A golang micro-service which is responsible for authorizing as well as authenticating the requests received from ChaosCenter. It primarily serves the cause of user creation, user login, reset password, and update user information.

2. **Backend Server:** A GraphQL based golang micro-service that serves the requests received from ChaosCenter, by either querying the database for the relevant information or by fetching information from the execution plane.

3. **Database:** A NoSQL MongoDB database micro-service that is accountable for storing users' information, past workflows and saved workflow templates, user projects, ChaosHubs, and GitOps details, among the other information.

4. **ChaosCenter:** A React.js based frontend application micro-service that serves as the user front facing component that allows creation and scheduling of chaos workflows, system observability during the chaos injection, and chaos result analysis. 

In order to schedule and execute a chaos workflow using the ChaosCenter, the user is required to login to the portal using a valid login credential. This will lead them to the user dashboard where they will be able to access the Litmus projects they are a part of. In order to schedule a workflow, the user needs to have an Editor or Owner access in the project. Once the user successfully creates a chaos workflow manifest, it is received by the backend server that forwards it to the Chaos Agent as well as stores it in the database. The Chaos Agent is responsible for applying the chaos workflow in the target cluster to inject chaos in the target resources and return the experiment logs and results for the chaos experiments that are a part of the workflow back to the backend server. The backend server then displays the information in the ChaosCenter. At the end of the workflow execution, the Chaos Agent also returns the workflow resiliency score and analytics to the backend server, which are also displayed to the user via the ChaosCenter. Finally, the workflow resiliency score and analytics are also stored in the database by the backend server to populate the workflow run history in the ChaosCenter. 