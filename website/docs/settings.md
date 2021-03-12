---
id: settings
title: Settings
sidebar_label: Settings
---

---

## My Account

Here you can edit your personal details such as full Name, email-id, and password. Username can’t be changed and to update the password you are also required to enter your current password. In case you forget your current password, you need to contact the Admin for a password reset which you can change later in this section.

**Note:** Edit Avatar feature will be available in the upcoming releases.

## User Management

User Management section is only available to Admin users, where the Admin can:

### 1. Create User

Create a new user by providing details such as full name, the username(mandatory), email, and password(mandatory). Please remember that the username can’t be changed later.

**Note:** You might get an error while creating a user that `user already exists. This can occur if the username is already taken by anyone else. In that case, you can try changing the username and create again.

### 2. View user list

This section displays a list of users created by the Admin along with other details such as their current status(currently logged in or not), full name, username, email-id, date and time of the user creation, and a menu containing an option for password reset:

- **Edit profile:** Here, the Admin can reset the password of other users.

## GitOps

This section lets you choose where to store the workflow configuration. You can either store it locally in Litmus or in a Git repository. If you want to store it in litmus, you can just choose the first option(by default the first option is selected). Else if you want to store it in a repo, you can do the following steps:

1. You need to first create an empty repo, then enter the Git URL and branch name in the given fields in which you want to push the workflow configuration.
2. Then you can either choose to provide the access token which can be generated from your GitProvider by going to `Developer Settings` &rightarrow; `Personal Access token` &rightarrow; `Generate New token` or you can choose the SSH method, here you need to copy the generated key and add it to your repo by going to `Settings(of the repo)` &rightarrow;`Deploy Keys` &rightarrow; `Add deploy keys`. Make sure you check the `Allow write access` checkbox.
3. Once the Step 2 is done, click on the `connect` button to link it to your repo. Now every time you run a workflow, the configurations will get pushed to your repo.
