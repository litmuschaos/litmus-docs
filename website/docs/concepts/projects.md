---
id: projects
title: Projects
sidebar_label: Projects
---

The ChaosCenter comes with a project management system which can be used for working on chaos workflows with multiple different projects across different agents.

> A project signifies a separation between Agents, Schedules, Teams (collaborating on that specific project), and observability configurations.

The project management feature is the second level of privilege layer delivered by the ChaosCenter and a breakdown can be observed in the below diagram:

<img src={require('../assets/concepts/projects/flow-chart.png').default} width="1000" height="500" />

The specifics of project management with respect to different first layer privilege levels (Admin/non-admin users) are discussed below:

The **Admin** user of the portal has a default project (named as `admin’s project`) created on the initial login, and by default has the `owner` privileges in this project.

The Admin can [create a user](../user-guides/create-user) (these users will be treated as **non-admin** users), and each of these users will have their own projects created on completion of their initial login. The `Owner` of a project can invite multiple users to their project, and a user can be a part of multiple projects, these features are covered under the [teaming](teaming) section.

### Learn More

- [More about project management](../user-guides/change-project-name)
- [More about Teaming](teaming)
- [Invite a member to your project](../user-guides/invite-team-member)
