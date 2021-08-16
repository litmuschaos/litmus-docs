---
id: projects
title: Projects
sidebar_label: Projects
---

---

The ChaosCenter comes with a project management system which can be used for working on chaos workflows with multiple different projects across different agents.

## Prerequisites

Before learning abpout the concept of `projects`, it is important to note that a `project` signifies a separation between Agents,Schedules, [Visualization](visualize-workflow.md), and Teams (discussed in the next section) configurations, and prior knowledge of these will prove fruitful in understanding the concept of `projects` in-depth.

## Projects

The project management feature is the second level of privilege layer delivered by the ChaosCenter and a breakdown can be observed in the below diagram:

<img src={require('../assets/concepts/projects/flow-chart.png').default} width="1000" height="500" />

The specifics of project management with respect to different first layer privilege levels (Admin/non-admin users) are discussed below:

The **Admin** user of the portal has a default project (named as `admin’s project`) created on the initial login, and by default has the `owner` privileges in this project.

The Admin can [create a user](../user-guides/create-user.md) (these users will be treated as **non-admin** users), and each of these users will have their own projects created on completion of their initial login. The `Owner` of a project can invite multiple users to their project, and a user can be a part of multiple projects, these features are covered under the [teaming](teaming.md) section.

## Summary

Projects can be imagined as separations between multiple different configurations for your chaos and help you manage collaborations between multiple teams.

## Learn more

- [More about project management](../user-guides/change-project-name.md)
- [More about Teaming](teaming.md)
- [Invite a member to your project](../user-guides/invite-team-member.md)
