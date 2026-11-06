# API Reference

Base URL: `http://localhost:3000`

## GET /

Returns API status and available endpoint groups.

**200 OK**

```json
{
  "success": true,
  "message": "Student Management System REST API is running",
  "endpoints": {
    "students": "/students",
    "health": "/health"
  }
}
```

## GET /health

**200 OK**

```json
{
  "success": true,
  "status": "UP"
}
```

## GET /students

**200 OK**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Rahul",
      "course": "BCA"
    }
  ]
}
```

## GET /students/:id

**200 OK**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rahul",
    "course": "BCA"
  }
}
```

Possible errors:

- `400` invalid ID
- `404` student not found

## POST /students

Request:

```json
{
  "name": "Neha",
  "course": "BCA"
}
```

**201 Created**

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 4,
    "name": "Neha",
    "course": "BCA"
  }
}
```

## PUT /students/:id

Request:

```json
{
  "name": "Rahul Sharma",
  "course": "MCA"
}
```

**200 OK**

Updates the requested student.

## PATCH /students/:id

Request:

```json
{
  "course": "MCA"
}
```

**200 OK**

Updates only the supplied fields.

## DELETE /students/:id

**200 OK**

```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 1,
    "name": "Rahul",
    "course": "BCA"
  }
}
```

## Status codes used

| Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Student created |
| 400 | Invalid input |
| 404 | Route/student not found |
| 500 | Unexpected server error |
