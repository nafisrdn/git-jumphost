# Git Jumphost

Git Jumphost is a Node.js-based tool that provides a bridge between cloud source code management (SCM) systems and enterprise systems that cannot be accessed publicly. The tool works by receiving a request from the cloud SCM via a webhook, fetching the repository from the cloud SCM, and pushing it to the private enterprise CMS.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you can use Git Jumphost, you need to have the following installed on your machine:

- Node.js
- npm (comes bundled with Node.js)

### Installing

To install Git Jumphost on your machine, follow these steps:

1. Clone the repository to your local machine:
   `git clone https://github.com/<your-username>/git-jumphost.git`

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

- **Nafis Ramadhan Fadhlurrohman** - _Initial work_ - [nafisrdn](https://github.com/nafisrdn)
