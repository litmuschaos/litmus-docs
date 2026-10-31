---
id: air-gapped
title: Run Litmus in Air-gapped Environments
sidebar_label: Air Gapped Environment
---

---

An air-gapped cluster cannot pull from public registries or from GitHub. To run Litmus there, mirror every image to a registry the cluster can reach, point the Helm charts at it, and host the ChaosHub content inside your network.

:::note
This guide is based on the `litmus` and `litmus-agent` Helm charts at version `3.30.0`. The image names and tags below come from the chart values and templates, so check them against the chart version you install (`helm show values litmuschaos/litmus`). The ChaosHub and experiment-image steps have not been verified in a fully disconnected cluster.
:::

## Before you begin

- A private container registry reachable from the cluster, and a machine that can reach both the public internet and that registry to copy the images.
- The charts themselves, either from a Helm repository you mirror or as packaged `.tgz` files (`helm pull litmuschaos/litmus` and `helm pull litmuschaos/litmus-agent`).
- If the registry needs credentials, an image pull secret in the namespace you install into.

In the examples, `registry.example.com/litmuschaos` stands for your registry and repository path.

## Step 1: Mirror the ChaosCenter images

The `litmus` chart builds most image references as `<image.imageRegistryName>/<repository>:<tag>`, so the images must keep their repository names under your registry.

| Component | Image (default tag in chart `3.30.0`) |
| --- | --- |
| Frontend | `litmusportal-frontend:3.30.0` |
| GraphQL server | `litmusportal-server:3.30.0` |
| Auth server | `litmusportal-auth-server:3.30.0` |
| MongoDB wait init container | `mongo:6` |

The init container that waits for MongoDB is also prefixed with `image.imageRegistryName`, so it has to be available as `<your registry>/mongo:6`, not as the unprefixed Docker Hub name.

The MongoDB subchart does not use `image.imageRegistryName`. It has its own settings and defaults to Docker Hub:

| Component | Image (default in chart `3.30.0`) |
| --- | --- |
| MongoDB | `docker.io/bitnamilegacy/mongodb:8.0.13-debian-12-r0` |
| Volume permissions init container | `docker.io/bitnamilegacy/os-shell:12-debian-12-r51` |

## Step 2: Mirror the images the server deploys

The GraphQL server uses the `portal.server.graphqlServer.imageEnv` values to decide which images it puts into the chaos infrastructure it creates. Each value is also prefixed with `image.imageRegistryName`:

| Value | Image (default tag in chart `3.30.0`) |
| --- | --- |
| `SUBSCRIBER_IMAGE` | `litmusportal-subscriber:3.30.0` |
| `EVENT_TRACKER_IMAGE` | `litmusportal-event-tracker:3.30.0` |
| `ARGO_WORKFLOW_CONTROLLER_IMAGE` | `workflow-controller:v3.3.1` |
| `ARGO_WORKFLOW_EXECUTOR_IMAGE` | `argoexec:v3.3.1` |
| `LITMUS_CHAOS_OPERATOR_IMAGE` | `chaos-operator:3.30.0` |
| `LITMUS_CHAOS_RUNNER_IMAGE` | `chaos-runner:3.30.0` |
| `LITMUS_CHAOS_EXPORTER_IMAGE` | `chaos-exporter:3.30.0` |

## Step 3: Copy the images

Copy each image with the tool you prefer. For example, with `skopeo`:

```bash
SRC=litmuschaos.docker.scarf.sh/litmuschaos
DST=registry.example.com/litmuschaos

for image in \
  litmusportal-frontend:3.30.0 \
  litmusportal-server:3.30.0 \
  litmusportal-auth-server:3.30.0 \
  litmusportal-subscriber:3.30.0 \
  litmusportal-event-tracker:3.30.0 \
  workflow-controller:v3.3.1 \
  argoexec:v3.3.1 \
  chaos-operator:3.30.0 \
  chaos-runner:3.30.0 \
  chaos-exporter:3.30.0; do
  skopeo copy --all "docker://$SRC/$image" "docker://$DST/$image"
done

# Not under the litmuschaos repository:
skopeo copy --all docker://docker.io/library/mongo:6 docker://$DST/mongo:6
skopeo copy --all docker://docker.io/bitnamilegacy/mongodb:8.0.13-debian-12-r0 \
  docker://registry.example.com/bitnamilegacy/mongodb:8.0.13-debian-12-r0
skopeo copy --all docker://docker.io/bitnamilegacy/os-shell:12-debian-12-r51 \
  docker://registry.example.com/bitnamilegacy/os-shell:12-debian-12-r51
```

## Step 4: Install ChaosCenter from your registry

Create a values file that redirects every image:

```yaml
image:
  imageRegistryName: registry.example.com/litmuschaos
  imagePullSecrets:
    - name: registry-credentials   # only if the registry needs credentials

mongodb:
  image:
    registry: registry.example.com
    repository: bitnamilegacy/mongodb
  volumePermissions:
    image:
      registry: registry.example.com
      repository: bitnamilegacy/os-shell
```

Then install with it:

```bash
helm install chaos litmuschaos/litmus --namespace litmus --create-namespace \
  -f air-gapped-values.yaml
```

If you also changed the tags (for example because you mirrored a different release), update `portal.frontend.image.tag`, `portal.server.graphqlServer.image.tag`, `portal.server.authServer.image.tag` and the `imageEnv` entries to match.

## Step 5: Install the chaos infrastructure from your registry

The `litmus-agent` chart pulls its images through its subcharts, and each one sets its own full repository (registry included) instead of using `image.imageRegistryName`. Override all of them:

```yaml
image:
  repository: registry.example.com/litmuschaos/litmus-helm-agent   # pre-install hook job

chaos-operator:
  image:
    repository: registry.example.com/litmuschaos/chaos-operator
  runner:
    image:
      repository: registry.example.com/litmuschaos/chaos-runner

chaos-exporter:
  image:
    repository: registry.example.com/litmuschaos/chaos-exporter

event-tracker:
  image:
    repository: registry.example.com/litmuschaos/litmusportal-event-tracker

subscriber:
  image:
    repository: registry.example.com/litmuschaos/litmusportal-subscriber
  appSettings:
    executorImage: "registry.example.com/litmuschaos/argoexec:v3.3.1"

workflow-controller:
  image:
    repository: registry.example.com/litmuschaos/workflow-controller
  appSettings:
    executorImage: "registry.example.com/litmuschaos/argoexec:v3.3.1"
```

Also mirror `litmus-helm-agent` (used by the pre-install hook job), and add `imagePullSecrets` to each subchart if your registry needs credentials. The chart pins each image to its `appVersion` unless you set a `tag`, so mirror the tag that matches the chart version you install.

## Step 6: Experiment images

Chaos experiments run images such as `go-runner` and the helper images they start. Mirror the ones you use and point ChaosCenter at your registry under **Project Setup** > **Image Registry** (see [Using different image registries](image-registry.md)). Experiment manifests that still reference a public image will fail with `ImagePullBackOff`.

## Step 7: Host the ChaosHub

The default ChaosHub syncs from GitHub, which is not reachable. Clone the [chaos-charts](https://github.com/litmuschaos/chaos-charts) repository on a machine with access, push it to a Git server inside your network, and connect it from ChaosCenter as described in [ChaosHub](../concepts/chaoshub.md). Experiment manifests in the hub reference images too, so they must point at your mirrored registry.

## Troubleshooting

- **`ImagePullBackOff` on an `init` container or a pod you did not expect:** run `kubectl describe pod` and check which image it tried. Images prefixed by `image.imageRegistryName` (including `mongo:6`) must exist under that path in your registry.
- **MongoDB pods stuck pulling:** the MongoDB subchart ignores `image.imageRegistryName`. Set `mongodb.image.registry` and `mongodb.volumePermissions.image.registry`.
- **Infrastructure pods pull from the public registry:** the `imageEnv` values and the `litmus-agent` subchart images are separate settings. Check both.
