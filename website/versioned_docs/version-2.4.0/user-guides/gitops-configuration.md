---
id: gitops-configuration
title: Configuring GitOps
sidebar_label: Configuring GitOps
---

## Introduction

GitOps enables you to configure a single source of truth for your chaos workflows and experiments, any changes made either to the artifacts stored in the configured git repository or the portal will be synced.

## Before you begin
- [Gitops](../concepts/gitops.md)
- ChaosAgent
- [ChaosWorkflow](../concepts/chaos-workflow.md)
- Ensure that you have an active internet connection and a git repository. 


## Steps to configure GitOps



- Setup a git repository, so that the ChaosCenter can sync with it, and push all the workflows in that repository.
- The git repo can be public or private but for authorization, you have to provide an access token or any other mode of authentication.
- Login into ChaosCenter, go to `GitOps` tab under `Settings`.
<br/><br/>
<img src={require('../assets/user-guides/gitops/gitops.png').default} width="800"  />
<br/><br/>
- Select the `Git Repository` radio button.
- Copy the git URL of your git repository and paste it in the `Git URL` text box.
- Enter the branch where you want to sync your workflows.
<br/><br/>
<img src={require('../assets/user-guides/gitops/gitops-config.png').default} width="800"  />
<br/><br/>
- You can allow access of your repository either through an access token or through an SSH key.
- In the case of the SSH key, just copy the key and paste it in the`Deploy Keys` Tab inside `Settings` in your git - repository. Click on the allow write access checkbox, and then on the `Add key` button.
- Go back to the portal and click on the update button. A modal will pop up showing, `Successfully updated GitOps!` message.
- Some metadata will be pushed to your repository, that is the projectID of your project.
- Now whenever you schedule a workflow, it will automatically be pushed to your repository. And that repository will be the single source of truth.

:::note
It is also possible to account for the workflows that are created and pushed to the git repository directly, after configuring GitOps. In this case, if the workflow is a single run workflow, then it starts executing as soon as it is pushed to the repository. Alternatively, if the workflow is a scheduled workflow, then it executes as per the defined schedule. On the other hand, updating an existing workflow present in the git repository will not execute the workflow but only sync the workflow resource definition with the ChaosCenter, if applicable.
:::

## Steps to configure Event-Triggered Chaos Injection

- Once the workflow is pushed to your repository, you’ll notice every workflow has a `workflow_id`. You can get this from the workflow YAML file. You need to copy the id and annotate the target application so that if there’s any change in the application, gitops will sync the workflow using this workflow_id and run it on your target application. You can use the following command:

```
kubectl annotate deploy/target-application litmuschaos.io/workflow=${workflow_id}
```

```
kubectl annotate deploy/target-application litmuschaos.io/gitops=true
```

- You can check if the event-tracker is running using this command:<br/>
```
kubectl get pods -n litmus -w
```

- To check the logs copy the pod name of the event-tracker and add it to the following command:
```
kubectl logs -f event-tracker-pod-name -n litmus
```
	
In the logs, you’ll notice that the event-tracker has started.
If you make changes in the application the event tracker will trigger the chaos injection. If the policy conditions are met then the event tracker will inform the server to schedule a workflow in that same target. For eg: if you have an Nginx app as your target application, you can just edit the deployment and change its image tag, this will trigger the chaos injection.

Below is a sample policy where two conditions are present and will be validated by the respective operator. The chaos workflow will be triggered if both conditions are met due to the `AND` condition type.

```
apiVersion: eventtracker.litmuschaos.io/v1
kind: EventTrackerPolicy
metadata:
  name: eventtrackerpolicy-sample
  namespace: litmus
spec:
  # Add fields here
  condition_type: "and"
  conditions:
  - key: "spec.replicas"
    value: "1"
    operator: EqualTo
  - key: "spec.template.spec.containers[0].image"
    value: "nginx:1.18"
    operator: EqualTo

```

Currently supported policy operators are:
- EqualTo
- NotEqualTo
- LessThan
- GreaterThan
- GreaterThanEqualTo
- LessThanEqualTo

## Resources

<iframe width="560" height="315" src="https://www.youtube.com/embed/7cF3rwcZMcA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/><br/>
<iframe width="560" height="315" src="https://www.youtube.com/embed/uIVrNH2_nVI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learn More

- [Schedule a workflow](../user-guides/schedule-workflow.md)
- [Observe a Chaos Workflow](../user-guides/observe-workflow.md)
