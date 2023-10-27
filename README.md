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
| components | Auth | Auth react component|
|  | Cards ||
|  | Dashboard ||
|  | GeneralPostingSetup |General Posting Setup treegrid service component|
|  | Header | No authenticated  page header component|
|  | HeaderAuthenticated | Authenticated Page header component|
|  | InvoicesTable | Invoices service treegrid component|
|  | JSONS | Json config files |
|  | Login | Sign in page component |
|  | MagicLinkValidation | Magic link validation component|
|  | media | Media files |
|  | OrganizationList | Organization service treegrid component|
|  | ProfileDropdown | Profile dropdown component|
|  | SidePanel | Side panel component|
|  | SideHeader | Side header component|
|  | TreeGrid | TreeGrid component|
|  | UserCardManagementPanel | User card management panel component|
|  | UserDetailPanel | User detail panel component|
|  | UserGroupList | User group service treegrid component|
|  | UserList | User service treegrid component|
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

## How to deploy

When push code to master will trigger google cloud build, google cloud build will run by cloudbuild.yaml step by step. As it store in google storage cloud, just access static files.

## How to config domain
1. DNS A address set
A address set to ip 34.111.11.161

2. Apply https Certificate
Edit bynar-frontend and in Frontend configuration, add https protocol then upload certificate.
