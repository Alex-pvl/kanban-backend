# Task Manager API

It is a RESTful task management API developed using Node.js, Express and PostgreSQL. The API provides the ability to create, receive, update, and delete tasks for users.

<hr>

## Actions
- User registration and authentication
- Creating new tasks with the title, description, priority and status
- Getting a list of all the user's tasks
- Updating task information, including title, description, status and priority
- Removing a task from the list

<hr>

## Technologies
- TypeScript
- Node.js
- Express
- PostgreSQL
- JWT

<hr>

## Usage
Clone this repository and install dependencies
```bash
git clone https://github.com/alex-pvl/kanban-backend
cd kanban-backend
npm install
```
Create `.env` file in the root directory of the project and configure the following environment variables:
```makefile
PORT=app_port
DB_USER=database_user
DB_HOST=database_host
DB_DATABASE=database_name
DB_PASSWORD=database_password
DB_PORT=database_port
```
Generate RSA keys by running
```bash
node secret/rsa.js
```
Run sql script in `db/schema.sql`
Start application
```bash
npm start
```