---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

---

## Probes

#### Restrict execution scope

- In the case where a malicious, privileged user (who doesn't have cluster access) tries to extract the SA token from the probe pod and leverages it for destructive action, the recommended way to prevent it would be to have a reduced scope within the service account itself i.e. create an RBAC without loopholes.

  The RBAC for the agent itself can be subject to scrutiny before deployment, it can be restricted to a namespace with verbs against restricted resources, etc. The agent setup can be performed using Helm too, with changes to templates undergoing review.

  The intent of the command probe pod is to allow the users to perform custom checks which allow them to either (a) validate the impact of chaos, either within or outside the cluster (b) manually trigger remediation or (c) perform tasks that complement the chaos itself (such as load etc.,).

  Having a restrictive scope for this feature would depend on what kind of tasks are allowed by the cluster/devops admins within the purview of (a), (b), (c) - rather than being imposed from within the product by default. If some of the validations involve performing kube-api calls, we would need to support that / binding the admin's decision.

- Only users with **Executor** roles can carry out executing probes. Project **Owners**, however, wield the authority to create, edit, and execute probes, shaping them to suit project needs and objectives. This division ensures efficient probe management, with the Executors handling execution and the project Owners overseeing customization and design.

#### Future Roadmap

- Resilience probes addition and execution are to be supported via ChaosHub and is also expected to have preset templates. The change entails probes being introduced as first class citizens/resources within the platform that can be reused across experiments via Hub. In this context, the ability to create and modify experiments/probes can be provided to a owner persona, with the probes being maintained in a Git repository (with its introduction in ChaosHub), which is also expected to have the right number of approvals for use. These are then executed as is by the executor persona on the platform.

- Adding a command scanner to restrict malicious linux commands/attacks used against cmdProbes via enhanced checks. Integrate the command scanner into the CREATE and UPDATE APIs of cmdProbes ensures that all commands passed through these interfaces are subjected to thorough scrutiny. This involves modifying the API endpoints to include the command scanning functionality and implementing appropriate validation logic.
