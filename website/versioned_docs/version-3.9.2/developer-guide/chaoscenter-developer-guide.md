---
id: chaoscenter-developer-guide
title: ChaosCenter Developer Guide
sidebar_label: ChaosCenter Developer Guide 
---

---

## **Prerequisites**
:::note
This document is intended to be implemented locally. Please do not use in dev or prod environments.
:::

- Kubernetes 1.17 or later
- Helm3 or Kubectl
- Node and npm
- Docker
- Golang
- Local Kubernetes Cluster (via minikube, k3s or kind)

## **Control Plane**
Backend components consist of three microservices
1. GraphQL server
2. Authentication server
3. MongoDB

Frontend component
1. React

## **Steps to run the Control Plane**

### 1. Run MongoDB

Step-1: Pull and run the image 

```bash
docker pull mongo:5

docker network create mongo-cluster 

docker run -d --net mongo-cluster -p 27015:27015 --name m1 mongo:4.2 mongod --replSet rs0 --port 27015 
docker run -d --net mongo-cluster -p 27016:27016 --name m2 mongo:4.2 mongod --replSet rs0 --port 27016
docker run -d --net mongo-cluster -p 27017:27017 --name m3 mongo:4.2 mongod --replSet rs0 --port 27017
```

Step-2: Add hosts 

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="win" label="Windows">

```bash
# add hosts in hosts 
notepad C:\Windows\System32\drivers\etc\hosts

# add the below line
127.0.0.1       m1 m2 m3
```

</TabItem>
<TabItem value="linux" label="macOS/Linux">

```bash
# add hosts in hosts 
sudo vim /etc/hosts

# add the below line
127.0.0.1       m1 m2 m3
```

</TabItem>
</Tabs>


Step-3: Configure the mongoDB replica set

```bash
docker exec -it m1 mongo -port 27015

config={"_id":"rs0","members":[{"_id":0,"host":"m1:27015"},{"_id":1,"host":"m2:27016"},{"_id":2,"host":"m3:27017"}]}

rs.initiate(config)

db.getSiblingDB("admin").createUser({user:"admin",pwd:"1234",roles:[{role:"root",db:"admin"}]});
```

### 2. Run the Authentication Server

:::note
Make sure to run backend services before the frontend. If you haven’t already cloned the litmus project do so from the `litmuschaos/litmus` repository
:::

```bash
git clone https://github.com/litmuschaos/litmus.git litmus --depth 1
```


Step-1: Export the following environment variables

```bash
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=litmus
export DB_SERVER="mongodb://m1:27015,m2:27016,m3:27017/?replicaSet=rs0"
export DB_USER=admin
export DB_PASSWORD=1234
export JWT_SECRET=litmus-portal@123
export PORTAL_ENDPOINT=http://localhost:8080
export LITMUS_SVC_ENDPOINT=""
export SELF_AGENT=false
export INFRA_SCOPE=cluster
export INFRA_NAMESPACE=litmus
export LITMUS_PORTAL_NAMESPACE=litmus
export PORTAL_SCOPE=namespace
export SUBSCRIBER_IMAGE=litmuschaos/litmusportal-subscriber:ci
export EVENT_TRACKER_IMAGE=litmuschaos/litmusportal-event-tracker:ci
export CONTAINER_RUNTIME_EXECUTOR=k8sapi
export ARGO_WORKFLOW_CONTROLLER_IMAGE=argoproj/workflow-controller:v2.11.0
export ARGO_WORKFLOW_EXECUTOR_IMAGE=argoproj/argoexec:v2.11.0
export CHAOS_CENTER_SCOPE=cluster
export WORKFLOW_HELPER_IMAGE_VERSION=3.0.0
export LITMUS_CHAOS_OPERATOR_IMAGE=litmuschaos/chaos-operator:3.0.0
export LITMUS_CHAOS_RUNNER_IMAGE=litmuschaos/chaos-runner:3.0.0
export LITMUS_CHAOS_EXPORTER_IMAGE=litmuschaos/chaos-exporter:3.0.0
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=litmus
export VERSION=ci
export HUB_BRANCH_NAME=v2.0.x
export INFRA_DEPLOYMENTS="[\"app=chaos-exporter\", \"name=chaos-operator\", \"app=event-tracker\",\"app=workflow-controller\"]"                                                                         
export INFRA_COMPATIBLE_VERSIONS='["0.2.0", "0.1.0","ci"]'
export DEFAULT_HUB_BRANCH_NAME=master
export ENABLE_INTERNAL_TLS=false
export REST_PORT=3000
export GRPC_PORT=3030
```

<Tabs groupId="operating-systems">
<TabItem value="win" label="Windows">

Docker or Hyper-V is reserving that port range. You can use 3030 ports by running the command below

```bash
netsh interface ipv4 show excludedportrange protocol=tcp
net stop winnat
netsh int ipv4 add excludedportrange protocol=tcp startport=3030 numberofports=1
net start winnat
```

</TabItem>
</Tabs>

Step-2: Run the go application

```bash
cd chaoscenter/authentication/api
go run main.go
```

### 3. Run the GraphQL Server  

Step-1: Export the following environment variables

```bash
export DB_SERVER="mongodb://m1:27015,m2:27016,m3:27017/?replicaSet=rs0"
export DB_USER=admin
export DB_PASSWORD=1234
export JWT_SECRET=litmus-portal@123
export PORTAL_ENDPOINT=http://localhost:8080
export LITMUS_SVC_ENDPOINT=""
export SELF_AGENT=false
export INFRA_SCOPE=cluster
export INFRA_NAMESPACE=litmus
export LITMUS_PORTAL_NAMESPACE=litmus
export PORTAL_SCOPE=namespace
export SUBSCRIBER_IMAGE=litmuschaos/litmusportal-subscriber:ci
export EVENT_TRACKER_IMAGE=litmuschaos/litmusportal-event-tracker:ci
export CONTAINER_RUNTIME_EXECUTOR=k8sapi
export ARGO_WORKFLOW_CONTROLLER_IMAGE=argoproj/workflow-controller:v2.11.0
export ARGO_WORKFLOW_EXECUTOR_IMAGE=argoproj/argoexec:v2.11.0
export CHAOS_CENTER_SCOPE=cluster
export WORKFLOW_HELPER_IMAGE_VERSION=3.0.0
export LITMUS_CHAOS_OPERATOR_IMAGE=litmuschaos/chaos-operator:3.0.0
export LITMUS_CHAOS_RUNNER_IMAGE=litmuschaos/chaos-runner:3.0.0
export LITMUS_CHAOS_EXPORTER_IMAGE=litmuschaos/chaos-exporter:3.0.0
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=litmus
export VERSION=ci
export HUB_BRANCH_NAME=v2.0.x
export INFRA_DEPLOYMENTS="[\"app=chaos-exporter\", \"name=chaos-operator\", \"app=event-tracker\",\"app=workflow-controller\"]"
export INFRA_COMPATIBLE_VERSIONS='["0.2.0", "0.1.0","ci"]'
export DEFAULT_HUB_BRANCH_NAME=master
```

Step-2: Run the go application

```bash
cd chaoscenter/graphql/server
go run server.go
```

### 4. Run Frontend

:::note
Make sure to run backend services before the frontend.
:::

Step-1: Install all the dependencies

```bash
cd litmus/chaoscenter/web
yarn
```

Step-2: Generate the ssl certificate
<Tabs groupId="operating-systems">
<TabItem value="win" label="Windows">

The command you run is in the script/generate-certificate.sh file, but it doesn't work in a Windows environment, so please run the script below instead

```bash
mkdir -p certificates

openssl req -x509 -newkey rsa:4096 -keyout certificates/localhost-key.pem -out certificates/localhost.pem -days 365 -nodes -subj '//C=US'
```

</TabItem>
<TabItem value="linux" label="macOS/Linux">

```bash
yarn generate-certificate
```

</TabItem>
</Tabs>

Step-3: Run the frontend project

```bash
yarn dev 
```

> It’ll prompt you to start the development server at port `8185` or any other port than 3000 since it is already being used by the auth server.

Once you are able to see the Login Screen of Litmus use the following default credentials

```
Username: admin
Password: litmus
```

<img src={require('../assets/login.png').default} width="800" />


## **Steps to connect Chaos Infrastructure**
### Using Litmusctl
Use [litmusctl](https://github.com/litmuschaos/litmusctl) on the same box/local cluster and connect an ns infrastructure

### Using Chaoscenter
Use Chaoscenter to connect an Infrastructure, download the manifest and apply it on k3d/minikube. Once the pods are up(except the subscriber), run the following command:

```bash
cd subscriber

INFRA_ID=<INFRA_ID> ACCESS_KEY=<ACCESS_KEY> INFRA_SCOPE=cluster SERVER_ADDR=http://localhost:8080/query INFRA_NAMESPACE=litmus IS_INFRA_CONFIRMED="false" COMPONENTS="DEPLOYMENTS: ["app=chaos-exporter", "name=chaos-operator", "app=workflow-controller"]"  START_TIME=1631089756 VERSION="ci" AGENT_POD="subscriber-78f6bd4db5-ck5d9" SKIP_
SSL_VERIFY="false" go run subscriber.go -kubeconfig ~/.kube/config
```