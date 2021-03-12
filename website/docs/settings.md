---
id: settings
title: Settings
sidebar_label: Settings
---

---
Settings section allows a user to manage user related information and settings. At highlevel the settings section can be classified into the following

1. My Account
2. Team
3. User Management
4. GitOps


## My Account

Here you can edit your personal details such as full Name, email-id, and password. Username can’t be changed and to update the password you are also required to enter your current password. In case you forget your current password, you need to contact the Admin for a password reset which you can change later in this section.

**Note:** Edit Avatar feature will be available in the upcoming releases.

## Team

Teaming is based on the following principles and each user can have one of the 3 user roles:
1. Owner
2. Viewer
3. Editor
- Owner: A user would be the owner of his/her project by default. Only one user can be owner of one project

- Owner can invite other users using the following roles:
    - Viewer: Can view the project, like view the workflow schedule, but can’t create or delete any workflow   schedules
    - Editor: Can make changes to the project, like view, edit, delete and create the workflow schedules

- Settings page will not be visible to the user if he/she is browsing someone else’s project. The user can view the settings page if the user is the project owner.

- On the teaming tab, owner can view the list of team members with other details including their role in the project, email-id, date-time of joining the team of the project. Owner can view/send/accept an invitation. Owner can remove a member from his/her project. User can also exit a project of which he/she is a part of.

## User Management

User Management section is only available to Admin users, where the Admin can:

### 1. Create User

Create a new user by providing details such as full name, the username(mandatory), email, and password(mandatory). Please remember that the username can’t be changed later.

**Note:** You might get an error while creating a user that `user already exists. This can occur if the username is already taken by anyone else. In that case, you can try changing the username and create again.

### 2. View user list

This section displays a list of users created by the Admin along with other details such as their current status(currently logged in or not), full name, username, email-id, date and time of the user creation, and a menu containing an option for password reset:

- **Edit profile:** Here, the Admin can reset the password of other users.

## GitOps

This section lets you choose where to store the workflow configuration. You can either store it locally in Litmus or in a Git repository. If you want to store it in litmus, you can just choose the first option(by default the first option is selected). Else if you want to store it in a git repository, you can do the following steps:

1. You need to have an access to a repository or create an empty repository, then enter the Git URL and branch name in the given fields in which you want to push the workflow configuration.
2. Then you can either choose to provide by either of the following methods
   - **Access token**-  User needs to provide the access token here, which can be generated from your Git provider by going to `Developer Settings` &rightarrow; `Personal Access token` &rightarrow; `Generate New token`. Make sure you have write access.
   - **SSH** - User needs to copy the generated key and add it to your repository by going to `Settings(of the repo)` &rightarrow;`Deploy Keys` &rightarrow; `Add deploy keys`. Make sure you check the `Allow write access` checkbox.
3. Once the Step 2 is done, click on the `connect` button to link it to your repository. Now every time you run a workflow, the configurations will get pushed to your repository.

***Note*** On selecting GitOps, only new workflows will be synced to git repository. Any existing or active workflows saved locally will not be synced into the git repository. 

