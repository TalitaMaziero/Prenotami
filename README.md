# Prenotami Documentation 

## Introduction

Prenotami is an application that searches for appointment slots for document submission at the Italian consulate in Brazil using the Prenotami system. If no slots are available, the application captures a screenshot of the page and sends it to the specified email address.

## Requirements

Before starting, make sure you have the following software installed on your system:

- Node.js (version 18 or higher)

## Installation

Follow the steps below to install and configure Prenotami:

1. Clone the Prenotami repository to your local machine:

2. Create a .env file in the root directory of the project and define the necessary environment variables:

```shell
# Prenotami System Login Credentials
LOGIN_EMAIL=prenotami_email_login
LOGIN_PASSWORD=prenotami_password

# Email Credentials for Sending Notifications
EMAIL_USER=your_email_gmail
EMAIL_PASSWORD=email_password_app

```

3. Install the project dependencies:

```shell
npm install
```

4. Start the service:

```shell
npm start
```

## Usage

### 1. Search for Appointment Slots

The application automatically searches for appointment slots in the Prenotami system. The search is performed periodically, and if slots are found, the user is notified by email.

### 2. Screenshot Capture and Email Sending

If no slots are available, the application captures a screenshot of the Prenotami system's page and sends it to the email address configured in the sendEmailWithAttachment function in the sendEmail.js file under the to: '' field.

### 3. Logs

The application saves logs whenever no slots are found. These logs can be found in the logs folder.


## Configuration files

- *`.env`* - Enviroment settings

## Technologies Used

- *Backend*: Node.js with ES Modules
- *Email Sending*: Nodemailer
- *Browser Automation*: Selenium WebDriver
- *Environment Configuration*: dotenv
- *Logging*: File system (fs)
