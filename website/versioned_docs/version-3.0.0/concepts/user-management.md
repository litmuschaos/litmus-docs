---
id: user-management
title: User management
sidebar_label: User management
---

---

The ChaosCenter supports two different levels of hierarchy, a portal level access and a project level access.

> This section discusses the detailed breakdown of the portal level roles a user may have. For project level roles, refer [here](teaming.md).

## Portal level user roles

ChaosCenter supports two portal level roles for defining the privilege levels of a certain user:

**Admin:** The admin user is created by default upon setup and can be used for logging in to the ChaosCenter using the credentials once the server pod (auth container) is up.

**Non-admin users:** The admin of the ChaosCenter can exclusively create any number of non-admin users.

## Role privileges

**Admin:** It is the highest privilege role offered in the ChaosCenter which provides complete access to all the features.

**Non-admin users:** Non-admin users get all the same privileges as an admin-level user, with the exception of the user management feature which is an admin-exclusive feature to facilitate an admin to manage their teams on the ChaosCenter. For example, in an organization there can be different teams who'd utilize different chaos infrastructures that have no layover between each other.

## Learn more

- [View Users](../user-guides/view-user.md)
- [Create a user](../user-guides/create-user.md)
- [Reset password of a user](../user-guides/reset-password.md)
- [Deactivate a user](../user-guides/deactivate-user.md)
