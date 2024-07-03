# Transfer Thought

Transfer Thought is a web-based platform for easily creating and deploying virtual reality experiences. 

Learn more by visiting our website: https://www.transferthought.com/
Or create a free account and try it out: https://scenario.transferthought.com/

## Contribution guidelines
Details on contribution guidelines coming soon. 

Discord Channel: https://discord.gg/xQ4zfw3UZc

### Disclaimer

We are excited to open source Transfer Thought under the MIT License. While we have made every effort to ensure that all components of the project conform to the MIT License, there may be proprietary or non-MIT licensed materials that were inadvertently included over time.

We are committed to identifying and removing any such materials as they are discovered. If you encounter any content within this project that you believe does not comply with the MIT License, please report it to us immediately.

Thank you for your understanding and cooperation.

# Transfer Thought Setup Instructions 
## Clone the Repository 
Go to your projects folder: `cd path/to/projects`

Clone the repository: `git clone https://github.com/transferthought/transfer-thought.git`

Local Environment Requirements
------------------------------

Ensure you have Node.js v20 installed.

Setup AWS Account
-----------------

Create an AWS account if you don't already have one: [https://aws.amazon.com/free](https://aws.amazon.com/free)

Install Amplify CLI
-------------------

Install Amplify CLI on your local computer: `npm install -g @aws-amplify/cli`

Configure Amplify with AWS Profile
----------------------------------

Configure Amplify: `amplify configure`

Follow the instructions here: https://docs.amplify.aws/gen1/javascript/tools/cli/start/set-up-cli/#configure-the-amplify-cli

You should have done this:
*   Created an IAM user account for Amplify Administrator
*   Created an access key
*   Created a local AWS profile

Setting up the Transfer Thought Amplify Project
-----------------------------------------------

Initialize the Amplify project: `amplify init`

* Select the dev environment or create a new one.
* Select the new environment.
* For Google OAuth, choose NA or enter your own credentials.
* Carry over secrets by selecting Yes.

Deploying Amplify Backend to Your AWS Account
---------------------------------------------

Push the backend resources to AWS: `amplify push`

For Appsync\_URL and Appsync\_ID, choose NA.

Install the Frontend Resources
------------------------------

Install the necessary packages: `npm install`

Run Frontend Locally
--------------------

Start the frontend locally (connected to the backend on AWS): `npm run serve`

Create and Deploy Frontend to AWS
---------------------------------

Add hosting for the frontend: `amplify add hosting`

Publish the frontend: `amplify publish`

Custom URL
----------

Follow the instructions provided by Amplify to set up your custom URL.
TODO
