Bynar frontend react web application
==================================================
## Directory Description
### public
| Name | Description |
| :--- | :--- |
| assets | web assets image files |
| Grid | TreeGrid libary files |
| images | svg img files |
| Layouts | TreeGrid service files |

### src
| Name | Sub Directory | Description |
| :--- | :--- |:--- |
| components | Auth | Auth service component|
|  | Cards |Credit card manment service component|
|  | Dashboard |Dashboard page comppnent|
|  | HeaderAuthenticated | Authenticated Page header component|
|  | HeaderTab | Inline and drop-down tabs in header|
|  | JSONS | Json config files |
|  | Login | Sign in page component |
|  | MagicLinkValidation | Magic link validation component|
|  | media | Media files |
|  | OrganizationAccountPanel | Organization account panel component|
|  | ProfileDropdown | Profile dropdown component|
|  | SidePanel | Side panel component|
|  | SignFooter | Sign in footer component|
|  | SignHeader | Sign in header component|
|  | SignHeaderSelect | Sign in select language component|
|  | TreeGrid | All treeGrid services component|
|  | UserCardManagementPanel | User card management panel component|
|  | UserDetailPanel | User detail panel component|
| pages | Dashboard | Dashboard page|
|  | Home | Home page|
|  | signin | Signin page|
|  | signup | Signup page|
|  sdk | AddCardModal | add card modal|
|  | context | |
|  | hooks | |
|  | new-theme | |
|  | RemoveModalWithLoading | |
|  | translation | |
|  | uploadprofileimage | |
|  styles | | custom css styles|

## How to run

Before start make sure bynar backend run first. Then change .env file REACT_APP_BASE_URL to http://localhosy:3001 (backend server end point)

```bash
$ npm install # Install dependency packages
$ npm start # start server on port 3000
```

## ENV keys
.env file keys description

| Key | Description |
| :--- | :--- |
| REACT_APP_BASE_URL| bynar backend base url address|
| REACT_APP_CHECKOUT_PUBLIC_KEY| checkout api public key|
| REACT_APP_FIREBASE_API_KEY| firebase api key|
| REACT_APP_FIREBASE_AUTH_DOMAIN| firebase auth domains|

## How to test

env file REACT_APP_BASE_URL change to http://127.0.0.1:8080

## How to deploy

When push code to master will trigger google cloud build, google cloud build will run by cloudbuild.yaml step by step. As it store in google storage cloud, just access static files.

## How to config custom domain
### Create A records

create A records for custom domain www.example.com and example.com, use the following:

```
NAME                  TYPE     DATA
www                   A        34.111.11.161
@                     A        34.111.11.161
```

### Create an SSL certificate resource

Please reference below guide:

https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs?hl=en

### Create load balancer

Please reference below guide:

https://cloud.google.com/load-balancing/docs/https/ext-load-balancer-backend-buckets?hl=en#create_an_with_backend_buckets

- ip select 34.111.11.161
- Protocol select https, and select certificate which you set in above step
- Enable HTTP to HTTPS redirect
