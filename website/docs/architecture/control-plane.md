---
id: control-plane
title: Control Plane
sidebar_label: Control Plane
---

---

Control Plane gets installed as a part of the Litmus installation in Kubernetes. It involves two Deployments, one for the frontend application and another one for the backend server, including the GraphQL server and the authentication server, and a statefulset for the database. Both the deployments create one pod each with the replica count of one by default and one NodePort service each to access the application endpoints inside the pods. The statefulset for the database also creates a pod with a single replica count and a ClusterIP service. All of these resources can be observed in the cluster with the following command:
```bash
kubectl get all -n litmus
```
The frontend React.js application can be accessed using the assigned NodePort along with the host's external IP address. It only communicates with either the authentication server or the backend GraphQL server to process the requests made by the user in the frontend. 

The requests related to user authentication and authorization are performed using JSON Web Tokens (JWT) using the following routes in the authentication server:
1. **`/status`:** A GET request that checks for the list of all the users and returns a 200 response if user list is found.
2. **`/login`:** A POST request for facilitating user login using username and password.
3. **`/update/password`:** A POST request for facilitating user password updation.
4. **`/reset/password`:** A POST request for facilitating user password reset.
5. **`/create`:** A POST request for facilitating new user creation by the administrator.
6. **`/update/details`:** A POST request for facilitating user details updation.
7. **`/users`:** A GET request for fetching all the available users.
8. **`/updatestate`:** A POST request for updating a given user's state, such as, whether the user is activated or deactivated.

The GraphQL backend server is responsible for listening to the requests made by the user via the ChaosCenter in order to perform the various tasks such as: 
1. Chaos Workflow Creation
2. User and Teams Management
3. Workflow Monitoring and Observability
4. Workflow Management

Both the backend server and authentication server use the same MongoDB database to store information related to the Chaos Center by means of different collections including:
1. **ClusterCollection:** Stores the details of the agents connected to Litmus, such as agent name, agent type, and agent scope.
2. **UserCollection:** Stores the details of users such as username and user email address. The user's password is not stored here.
3. **ProjectCollection:** Stores the details of the projects such as the project names, project permissions, project members.
4. **WorkflowCollection:** Stores the chaos workflows details such as workflow names, workflow cron schedules, workflow manifests, and the cluster id in which the workflow is to be scheduled.
5. **WorkflowTemplateCollection:** Stores the static workflow templates to be used for future execution. 
6. **GitOpsCollection:** Stores the various Git credentials such as Git URL, branch, and the access token or the SSH details for performing GitOps operation.
7. **MyHubCollection:** Stores the details of ChaosHubs connected to Litmus such as Hub name, Git URL, branch, and the access token or the SSH details.
8. **DataSourceCollection:** Stores the details of the Prometheus data source connected to Litmus such as data source name, endpoint URL, and access.
9. **PanelCollection:** Stores the details of the various panels created as part of the connected data source.
10. **DashboardCollection:** Stores the details of the various dashboards including the chaos-exporter dashboard for observing chaos experiment metrics and node-exporter dashboard to observe the various hardware and OS metrics.
11. **ImageRegistryCollection:** Stores the custom image registry details to be used used along with the workflow manifest such as custom registry server URL, custom image registry name, and the registry type i.e. public or private. 