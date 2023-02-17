# Git Jumphost

Git Jumphost is a Node.js-based tool that provides a bridge between cloud source code management (SCM) systems and enterprise systems that cannot be accessed publicly. The tool works by receiving a request from the cloud SCM via a webhook, fetching the repository from the cloud SCM, and pushing it to the private enterprise CMS.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you can use Git Jumphost, you need to have the following installed on your machine:

- Node.js
- npm (comes bundled with Node.js)
- A `.env` file that includes the following variables:
    ```
    PORT=8000

    SOURCE_REPO_URL=gitlab.com/user/source.git
    TARGET_REPO_URL=gitlab.com/user/target.git

    SOURCE_GIT_USERNAME=source_token
    SOURCE_GIT_PASSWORD=password

    TARGET_GIT_USERNAME=target_token
    TARGET_GIT_PASSWORD=password

    # DEV | PROD
    ENVIRONMENT=DEV

    WEBHOOK_TOKEN=gitlab_token_123
    ```


### Installing

To install Git Jumphost on your machine, follow these steps:

1. Clone the repository to your local machine:
   `git clone https://github.com/nafisrdn/git-jumphost.git`

2. Navigate to the repository directory:
   `cd git-jumphost`

3. Install the dependencies:
   `npm install`

## Deployment

To deploy Git Jumphost in a production environment, follow these steps:

1. Run production command:
   `npm run prod`

## Built With

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [simple-git](https://github.com/steveukx/git-js)
- [winston](https://github.com/winstonjs/winston)

## Authors

- **Nafis Ramadhan Fadhlurrohman** - [nafisrdn](https://github.com/nafisrdn)
