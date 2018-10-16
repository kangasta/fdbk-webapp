# Running fdbk-webapp in OpenShift Online

[OpenShift Online](https://www.openshift.com/products/online/) is Red Hat's public cloud application deployment and hosting platform.
It offers both free and paid hosting for your container based applications, such as fdbk-webapp.

Instructions for setting up a project in OpenShift can be found [online](https://docs.openshift.com/online/getting_started/index.html).


## Prerequisites
You should already have an Openshift project created and [cli](https://docs.openshift.com/container-platform/3.9/cli_reference/get_started_cli.html) set up and logged in.

You will also need to create mongodb:
```
oc new-app \
    --name database \
    -p DATABASE_SERVICE_NAME=database \
    -p MONGODB_USER=<mongo_username> \
    -p MONGODB_PASSWORD=<mongo_password> \
    -p MONGODB_DATABASE=feedback \
    -p MONGODB_ADMIN_PASSWORD=<admin_password> \
    mongodb-persistent
```

## Deploying

Modify OpenShift template `fdbk-webapp/openshift/fdbk-webapp.yaml` with correct credentials:
```
"DBParameters": [
      "database",
      "feedback",
      "<mongo_username>",
      "<mongo_password>"
],
```

Make sure you are logged in to OpenShift with cli and run following command:
```
oc new-app -f fdbk-webapp.yaml
```
