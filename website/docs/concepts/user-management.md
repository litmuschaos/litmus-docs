---
id: user-management
title: User Management
sidebar_label: User Management
---

The Litmus portal supports two different levels of hierarchy, a portal level access, and a project level access.

>This section discusses the detailed breakdown of the portal level roles a user may have. For project level roles refer [here](teaming).

### Portal level user Roles (Admin, Non-Admins)
Litmus supports two portal level roles for defining the privilege levels of a certain user:

**Admin:** the admin user is created by default on initial project setup and can log into the portal using the credentials `admin/litmus` once the server pod (auth container) is up.

**Non-admin users:** The admin of the portal has the exclusive ability to create any number of non-admin users.

### Role Privileges

**Admin** is the highest privilage level offered in the portal and the admin has complete access to all the features offered by the portal.


**Non-admin users:** Non-admin users get all the same privileges as an admin level user, with the exception of the user management feature which is an admin exclusive feature to facilitate an admin to manage their teams on the portal. (Example: In an organization, multiple different teams might be formed to inject chaos on different agents which have no layover between each other.)
