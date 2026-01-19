# API Reference Guide

## Base URL
```
http://localhost:3333
```

## Authentication

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (201):
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response (201):
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name"
}
```

### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}

Response (200):
{
  "message": "Senha alterada com sucesso"
}
```

## Categories

### List Categories
```
GET /api/categories?type=income
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Salário",
    "type": "income",
    "icon": "circle",
    "color": "#10b981",
    "createdAt": "2026-01-19T...",
    "updatedAt": "2026-01-19T..."
  }
]
```

### Create Category
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Freelance",
  "type": "income",
  "icon": "circle",
  "color": "#3b82f6"
}

Response (201):
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Freelance",
  "type": "income",
  "icon": "circle",
  "color": "#3b82f6",
  "createdAt": "2026-01-19T...",
  "updatedAt": "2026-01-19T..."
}
```

### Update Category
```
PUT /api/categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "color": "#ff0000"
}

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Updated Name",
  "type": "income",
  "icon": "circle",
  "color": "#ff0000",
  "createdAt": "2026-01-19T...",
  "updatedAt": "2026-01-19T..."
}
```

### Delete Category
```
DELETE /api/categories/{id}
Authorization: Bearer <token>

Response (200):
{
  "message": "Categoria excluída com sucesso"
}
```

## Transactions

### List Transactions
```
GET /api/transactions?type=expense
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "uuid",
    "userId": "uuid",
    "categoryId": "uuid",
    "type": "expense",
    "name": "Grocery Shopping",
    "amount": 50.25,
    "date": "2026-01-19",
    "description": "Weekly groceries",
    "isRecurring": false,
    "createdAt": "2026-01-19T...",
    "updatedAt": "2026-01-19T...",
    "category": {
      "id": "uuid",
      "name": "Alimentação",
      "color": "#f97316"
    }
  }
]
```

### Get Transaction Summary
```
GET /api/transactions/summary
Authorization: Bearer <token>

Response (200):
{
  "totalIncome": 5000.00,
  "totalExpense": 1500.50,
  "balance": 3499.50
}
```

### Create Transaction
```
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Salary",
  "type": "income",
  "amount": 5000,
  "date": "2026-01-19",
  "categoryId": "uuid",
  "employeeId": null,
  "description": "Monthly salary",
  "isRecurring": true
}

Response (201):
{
  "id": "uuid",
  "userId": "uuid",
  "categoryId": "uuid",
  "type": "income",
  "name": "Salary",
  "amount": 5000,
  "date": "2026-01-19",
  "description": "Monthly salary",
  "isRecurring": true,
  "createdAt": "2026-01-19T...",
  "updatedAt": "2026-01-19T...",
  "category": {
    "id": "uuid",
    "name": "Salário",
    "color": "#10b981"
  }
}
```

### Update Transaction
```
PUT /api/transactions/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5200,
  "description": "Updated salary"
}

Response (200):
[similar to create response]
```

### Delete Transaction
```
DELETE /api/transactions/{id}
Authorization: Bearer <token>

Response (200):
{
  "message": "Transação excluída com sucesso"
}
```

## Employees (People)

### List Employees
```
GET /api/employees
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "John Doe",
    "createdAt": "2026-01-19T...",
    "updatedAt": "2026-01-19T..."
  }
]
```

### Create Employee
```
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith"
}

Response (201):
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Jane Smith",
  "createdAt": "2026-01-19T...",
  "updatedAt": "2026-01-19T..."
}
```

### Update Employee
```
PUT /api/employees/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name"
}

Response (200):
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Updated Name",
  "createdAt": "2026-01-19T...",
  "updatedAt": "2026-01-19T..."
}
```

### Delete Employee
```
DELETE /api/employees/{id}
Authorization: Bearer <token>

Response (200):
{
  "message": "Pessoa excluída com sucesso"
}
```

## Admin

### Create User (Admin Only)
```
POST /api/admin/users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}

Response (201):
{
  "id": "uuid"
}
```

## Error Responses

All errors follow this format:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Error message describing what went wrong"
}
```

Common error codes:
- `400` - Bad request (missing or invalid fields)
- `401` - Unauthorized (no token or invalid token)
- `404` - Not found (resource doesn't exist)
- `500` - Server error

## Authentication Header

For all protected endpoints, include:
```
Authorization: Bearer <your-jwt-token>
```

Token is obtained from login/signup endpoints and is valid for 7 days.
