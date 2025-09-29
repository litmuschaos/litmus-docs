---
id: backstage
title: Manage all components of Litmus in one place
sidebar_label: Backstage
---

---

[Backstage](https://backstage.io) is an open platform for building developer portals and is one of the most popular CNCF projects. It allows developers to manage cloud-native applications' numerous services and codes from a single point. Chaos engineering can verify an application's resilience. It gives you the opportunity to identify various vulnerabilities in your application. Therefore, having information about Litmus chaos experiments alongside other application elements, such as application code, and CI/CD pipeline information, is highly beneficial to developers.

## Features

### EntityLitmusCard

- See the number and status of your experiments in a graph.
- See representative information about Litmus (number of Chaos Hubs, GitOps status, etc.).
- Provide a direct link to Litmus.

![EntityLitmusCard](https://raw.githubusercontent.com/litmuschaos/backstage-plugin/master/docs/EntityLitmusCard.png)

### EntityLitmusContent

- The `Dev Info` section provides a number of useful links related to Litmus.
- The `Chaos Hubs` section provides information about the Chaos Hubs registered with Litmus.
  - Clicking on each item will redirect you to that item's detailed page.
- The `Environments` section provides information about the environments and infrastructures registered with Litmus.
  - Clicking on each item will redirect you to that item's detailed page.
- The `Experiments` section offers details on the Chaos Experiments that were created within the platform.
  - If you hover over 'RECENT EXPERIMENT RUNS', you can view detailed information about the experiments including resiliency score and status.
  - We can directly launch chaos experiments by clicking the play button.

![EntityLitmusContent](https://raw.githubusercontent.com/litmuschaos/backstage-plugin/master/docs/EntityLitmusContent.png)

## Before you begin

- Compatible only with Litmus version [3.0.0](https://github.com/litmuschaos/litmus/releases/tag/3.0.0) or later.

## Getting started

1. In the `./packages/app` project add the plugin.

   ```yaml
   yarn add backstage-plugin-litmus
   ```

2. Get Litmus API Token through the Litmus UI

   1. Click "SETTINGS" in the sidebar.
   2. Click "+ New Token" Button in the 'API Tokens' section.
      ![settings_tab](https://raw.githubusercontent.com/litmuschaos/backstage-plugin/master/docs/settings_tab.png)
   3. Enter your information and click "Confirm".
      ![create_dialog](https://raw.githubusercontent.com/litmuschaos/backstage-plugin/master/docs/create_dialog.png)
   4. Get the token in the "VALUE" column.

3. In the `app-config.yaml` file root directory, add litmus proxy and info like below
   ```yaml
   proxy:
     '/litmus':
       target: 'your-own-litmus-ui-url'
       changeOrigin: true
       headers:
         Authorization: 'Bearer ${LITMUS_AUTH_TOKEN}'
   litmus:
     baseUrl: 'your-own-litmus-ui-url'
     apiToken: ${LITMUS_AUTH_TOKEN}
   ```
4. Add your auth key to the environmental variables
   ```shell
   export LITMUS_AUTH_TOKEN="your-own-token"
   ```
5. Adding annotations and values to your component file.
   ```yaml
   apiVersion: backstage.io/v1alpha1
   kind: Component
   metadata:
     name: component-name
     description: 'description'
     annotations:
       litmuschaos.io/project-id: 'your-own-project-id'
   ```
6. Enabling frontend

   ```ts
   // packages/app/src/components/catalog/EntityPage.tsx
   import { isLitmusAvailable, EntityLitmusCard, EntityLitmusContent } from 'backstage-plugin-litmus'
   // ...
   const overviewContent = (
     <Grid container spacing={6} alignItems="stretch">
       // ...
       <EntitySwitch>
         <EntitySwitch.Case if={isLitmusAvailable}>
           <Grid item md={4} xs={12}>
             <EntityLitmusCard />
           </Grid>
         </EntitySwitch.Case>
       </EntitySwitch>
       // ...
     </Grid>
   )
   // ...
   const serviceEntityPage = (
     <EntityLayout>
       // ...
       <EntityLayout.Route path="/litmus" title="Litmus">
         <EntityLitmusContent />
       </EntityLayout.Route>
       // ...
     </EntityLayout>
   )
   ```

## Resources

- [GitHub](https://github.com/litmuschaos/backstage-plugin)
- [npm](https://www.npmjs.com/package/backstage-plugin-litmus)
