---
id: litmus-demo
title: Chaos Engineering in a Microservices Environment
sidebar_label: Litmus Demo
original_id: litmus-demo
---

---

The Litmus Demo is a quick way to introduce yourself to the world of Cloud Native Chaos Engineering. It helps familiarize
oneself with running litmus chaos experiments in a realistic app environment running multiple services on a Kubernetes cluster.
In other words, you will be able to create a cluster, install a sample application that will be subject to chaos, build the
chaos infrastructure & run the chaos experiments, all in a matter of minutes, using a simple python script.

It is designed to help you experience chaos injection almost out of the box and is expected to serve as a precursor to a
more involved exploration of LitmusChaos framework for your own business application/infrastructure chaos needs.

## The Demo Environment

Three cluster types are supported:

- **KinD:** A 3 node KinD cluster pre-installed with the sock-shop demo application, litmus chaos CRDs, operator, and a minimal
  set of prebuilt chaos experiment CRs is setup.

- **GKE:** A 3 node GKE cluster pre-installed with the sock-shop demo application, litmus chaos CRDs, operator, and the full generic
  Kubernetes chaos experiment suite is setup.

- **EKS:** A 3 node EKS cluster pre-installed with the sock-shop demo application, litmus chaos CRDs, operator, and the full generic
  Kubernetes chaos experiment suite is setup.

## PreRequisites

- Docker 18.09 or greater (When using containerized setup)

- Docker, Kubectl & Python3.7+ (with the PyYaml package) are all you will need for running the KinD platform based chaos demo. If GKE/EKS is your platform choice, you may need to configure gcloud/aws (When using a non-containerized setup).

## Getting started:

To get started with any of the above platforms we will follow the following steps.

- Clone litmus demo repository in your system.

  ```bash
  git clone https://github.com/litmuschaos/litmus-demo.git
  cd litmus-demo
  ```

We can Setup litmus demo in two different ways:

<table>
  <tr>
    <th>Containerized Setup</th>
    <td>All the dependencies are installed inside a container we just need to have docker installed to run the container. It has been tested for Kind platform. </td>
  </tr>
  <tr>
    <th>Non-Containerized Setup</th>
    <td>We need to make sure that all the prerequisites are installed manually before running the demo script.</td>
  </tr>
</table>

### Containerized Setup

You can setup & run the demo from a containerized environment by following the below-mentioned steps:

```bash
make build
```

OR

```bash
docker build -t litmuschaos/litmus-demo .
```

Run docker container interactive, now you can run any commands mentioned in the usage section with python3.

```bash
make exec
```

OR

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock --net="host" -it --entrypoint bash litmuschaos/litmus-demo
```

Now you can run the litmus demo script in the following ways:

- **Execing into the container:** The `make exec` will exec into the litmus demo container where you can use the `./manage.py` script directly to run the demo script.

```bash
$ make exec
------------------
--> Login to Litmus Demo container

bash-5.0# ./manage.py -h
usage: manage.py [-h] {start,test,list,stop} ...

Spin up a Demo Environment on Kubernetes.

positional arguments:
  {start,test,list,stop}
    start               Start a Cluster with the demo environment deployed.
    test                Run Litmus ChaosEngine Experiments inside litmus demo environment.
    list                List all available Litmus ChaosEngine Experiments available to run.
    stop                Shutdown the Cluster with the demo environment deployed.

optional arguments:
  -h, --help            show this help message and exit
bash-5.0#
```

- **Without execing into the container:** You can run the demo script from outside the container using the `runcmd` script.

```bash

$ ./runcmd -h
running -h inside container

usage: manage.py [-h] {start,test,list,stop} ...

Spin up a Demo Environment on Kubernetes.

positional arguments:
  {start,test,list,stop}
    start               Start a Cluster with the demo environment deployed.
    test                Run Litmus ChaosEngine Experiments inside litmus demo environment.
    list                List all available Litmus ChaosEngine Experiments available to run.
    stop                Shutdown the Cluster with the demo environment deployed.

optional arguments:
  -h, --help            show this help message and exit
```

### Non Containerized Setup

To get started with the non containerized setup we need to clone the litmus-demo repository and run the demo script as mentioned in the Usage section below.

```bash
git clone https://github.com/litmuschaos/litmus-demo.git
cd litmus-demo
```

Now we can use the `manage.py` python script to setup the litmus demo environment.

```bash
$ ./manage.py -h
usage: manage.py [-h] {start,test,list,stop} ...

Spin up a Demo Environment on Kubernetes.

positional arguments:
  {start,test,list,stop}
    start               Start a Cluster with the demo environment deployed.
    test                Run Litmus ChaosEngine Experiments inside litmus demo
                        environment.
    list                List all available Litmus ChaosEngine Experiments
                        available to run.
    stop                Shutdown the Cluster with the demo environment
                        deployed.

optional arguments:
  -h, --help            show this help message and exit
```

## Usage

If you are using containerized setup. Follow one of the steps mentioned above to run the litmus demo. If you want to run the demo script without execing into the container
replace `./manage.py` with `./runcmd` from the below commands. For a non-containerized setup you can directly run the commands mentioned below.

- Install the demo environment using one of the platforms with the start argument

  **For KinD Cluster**

  - Install & bring-up the KinD cluster using the following command

    ```bash
    ./manage.py start --platform kind
    ```

  - Wait for all the pods to get in a ready state. You can monitor this using

    ```bash
    watch kubectl get pods --all-namespaces
    ```

    Once all pods come into Running state we can access the sock-shop application through web-ui which will help us to
    visualize the impact of chaos on the application and whether the application persists after chaos injections.

  - Get the port of frontend deployment

    ```bash
    kubectl get deploy front-end -n sock-shop -o jsonpath='{.spec.template.spec.containers[?(@.name == "front-end")].ports[0].containerPort}'
    ```

  - Perform port forwarding on the port obtained above

    ```bash
    kubectl port-forward deploy/front-end -n sock-shop 3000:<port-number> (typically, 8079)
    ```

  - Access the web-ui (catalogue) of the sock-shop app via the address `127.0.0.1:3000` on your browser

  **For GKE Cluster**

  - Create the GKE cluster (ensure you have set up access to your gcloud project)

    ```bash
    ./manage.py start --platform GKE
    ```

  - Wait for all the pods to get in a ready state. You can monitor this using

    ```bash
    watch kubectl get pods --all-namespaces
    ```

    Once all pods come into Running state we can access the sock-shop application through web-ui which will help us to
    visualize the impact of chaos on the application and whether the application persists after chaos injections.

  - After a few min, identify the ingress IP to access the web-ui

    ```bash
    kubectl get ingress basic-ingress --namespace=sock-shop
    ```

    You can access the web application in a few minutes at `http://<ingress-ip>`

  **For EKS Cluster**

  - Create the EKS cluster (ensure you have setup access to your AWS project)

    ```bash
    ./manage.py start --platform EKS --name {EKS_CLUSTER_NAME}
    ```

  - Wait for all the pods to get in a ready state. You can monitor this using

    ```bash
    watch kubectl get pods --all-namespaces
    ```

    Once all pods come into Running state we can access the sock-shop application through web-ui which will help us to
    visualize the impact of chaos on the application and whether the application persists after chaos injections.

  - After a few min, identify the ingress IP to access the web-ui

    ```bash
    kubectl get ingress basic-ingress --namespace=sock-shop
    ```

    You can access the web application in a few minutes at `http://<ingress-ip>`

## Running Chaos in Demo Environment

- To find out the supported tests for a platform, execute the following command:

  ```bash
  ./manage.py list --platform <kind|gke>
  ```

- For running all experiments, run:

  ```bash
  ./manage.py test --platform <platform-name>
  ```

- For running selective experiments

  ```bash
  ./manage.py test  --platform <platform-name> --test <test-name>
  ```

  Example: For running the pod-delete experiment.

  ```bash
  ./manage.py test  --platform kind --test pod-delete
  ```

### Chaos Experiment Results

The experiment results (Pass/Fail) are derived based on the simple criteria of app availability post chaos & are summarized on the console once the execution completes. You are also encouraged to check the changes to the status of the web-ui & the
respective microservices/pods as the experiment execute to get an idea of the failure injection process and subsequent recovery.

Get more details about the flags used to configure and run the chaos tests please refer to the parameter tables in the
[test](https://github.com/litmuschaos/litmus-demo#test) section.

## Generate PDF of the experiment result summary

We can also generate the pdf report of the experiment result summary using <code>--report</code> flag as follow:

```bash
./manage.py test --report=yes
```

It will generate a pdf report of the name `chaos-report.pdf` in the current location containing the ChaosResult summary.

## Deleting Cluster / Cluster Clean Up

- To shut down and destroy the cluster when you're finished, run the following commands:

  For KinD cluster

  ```bash
  ./manage.py --platform kind stop
  ```

  For GKE cluster

  ```bash
  ./manage.py --platform GKE stop --project {GC_PROJECT}
  ```

  For EKS cluster

  ```bash
  ./manage.py --platform EKS stop --name {EKS_CLUSTER_NAME} --awsregion {EKS_REGION_NAME}
  ```
