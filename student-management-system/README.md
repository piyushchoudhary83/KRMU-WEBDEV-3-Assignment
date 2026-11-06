# Student Management System — REST API

A modular Student Management System built with **Node.js + Express.js**. It implements RESTful CRUD operations using JSON data, custom middleware, centralized error handling, and a ready-to-import Postman collection.

## Features

- RESTful API design
- CRUD operations for students
- `POST /students` — Create
- `GET /students` — Read all
- `GET /students/:id` — Read one
- `PUT /students/:id` — Update
- `PATCH /students/:id` — Partial update
- `DELETE /students/:id` — Delete
- Custom request logger middleware
- 404 invalid-route middleware
- Centralized error-handling middleware
- Input validation
- Proper HTTP status codes
- JSON file data store
- `.env` configuration for the port
- Postman collection included

## Project structure

```text
student-management-system/
├── controllers/
│   └── studentController.js
├── data/
│   ├── studentStore.js
│   └── students.json
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
├── postman/
│   └── Student-Management-System.postman_collection.json
├── routes/
│   └── studentRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 1. Requirements

Install:

- Node.js 18+ recommended
- npm
- Postman (for API testing)

## 2. Install dependencies

Open a terminal inside the project folder:

```bash
npm install
```

## 3. Configure environment

Create `.env` from `.env.example`.

Example:

```env
PORT=3000
NODE_ENV=development
```

Do not commit `.env` if it contains secrets.

## 4. Start the server

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

Server:

```text
http://localhost:3000
```

## 5. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Health check |
| POST | `/students` | Create student |
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| PUT | `/students/:id` | Replace/update student |
| PATCH | `/students/:id` | Partially update student |
| DELETE | `/students/:id` | Delete student |

### Create

`POST /students`

```json
{
  "name": "Neha",
  "course": "BCA"
}
```

Returns `201 Created`.

### Read all

`GET /students`

Returns `200 OK`.

### Read one

`GET /students/1`

Returns `200 OK`.

### Update

`PUT /students/1`

```json
{
  "name": "Rahul Sharma",
  "course": "MCA"
}
```

Returns `200 OK`.

### Delete

`DELETE /students/1`

Returns `200 OK`.

## Error examples

### Invalid ID

`GET /students/abc`

```json
{
  "success": false,
  "message": "Student ID must be a positive integer."
}
```

Status: `400 Bad Request`

### Student not found

`GET /students/9999`

```json
{
  "success": false,
  "message": "Student Not Found"
}
```

Status: `404 Not Found`

### Invalid route

`GET /does-not-exist`

Returns `404 Not Found`.

## Postman

Import:

```text
postman/Student-Management-System.postman_collection.json
```

Then run the requests in this order:

1. Health
2. Get All Students
3. Get Student By ID
4. Create Student
5. Update Student
6. Patch Student
7. Delete Student
8. Invalid Student ID
9. Student Not Found
10. Invalid Route

## How the backend works

```text
Postman / Frontend
       |
       | HTTP Request + JSON
       v
   server.js
       |
       v
 express.json()
       |
       v
 logger middleware
       |
       v
 /students router
       |
       v
 controller
       |
       v
 studentStore
       |
       v
 students.json
       |
       v
 JSON Response
```

### Why the code is split into folders

- **routes**: defines URLs and HTTP methods.
- **controllers**: contains request/business logic.
- **middleware**: logger and centralized error handling.
- **data**: handles the JSON-backed student data.
- **server.js**: application entry point and middleware/router setup.

This separation follows the modular routing/controller structure expected for a scalable Express application.
