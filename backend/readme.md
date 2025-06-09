# Backend API Documentation

## User Endpoints

### /users/register Endpoint

**Description**  
Registers a new user by creating a user account with the provided information.

**HTTP Method**  
POST

**Request Body**  
The request body should be in JSON format and include the following fields:

- `fullname` (object):
  - `firstname` (string, required): User's first name (minimum 3 characters)
  - `lastname` (string, optional): User's last name
- `email` (string, required): User's email address (must be a valid email)
- `password` (string, required): User's password (minimum 6 characters)

**Example Response**
\`\`\`json
{
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  },
  "token": "string"
}
\`\`\`

### /users/login Endpoint

**Description**  
Authenticates a user using their email and password, returning a JWT token upon successful login.

**HTTP Method**  
POST

**Request Body**  
The request body should be in JSON format and include the following fields:

- `email` (string, required): User's email address (must be a valid email)
- `password` (string, required): User's password (minimum 6 characters)

**Example Response**
\`\`\`json
{
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string"
  },
  "token": "string"
}
\`\`\`

### /users/profile Endpoint

**Description**  
Retrieves the profile information of the currently authenticated user.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

**Example Response**
\`\`\`json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string"
}
\`\`\`

### /users/logout Endpoint

**Description**  
Logout the current user and blacklist the token provided in cookie or headers.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header or cookie.

**Example Response**
\`\`\`json
{
  "message": "Logged out"
}
\`\`\`

## Captain Endpoints

### /captains/register Endpoint

**Description**  
Registers a new captain by creating a captain account with the provided information.

**HTTP Method**  
POST

**Request Body**  
The request body should be in JSON format and include the following fields:

- `fullname` (object):
  - `firstname` (string, required): Captain's first name (minimum 3 characters)
  - `lastname` (string, optional): Captain's last name
- `email` (string, required): Captain's email address (must be a valid email)
- `password` (string, required): Captain's password (minimum 6 characters)
- `vehicle` (object):
  - `color` (string, required): Vehicle color (minimum 3 characters)
  - `plate` (string, required): Vehicle plate number (minimum 3 characters)
  - `capacity` (number, required): Vehicle passenger capacity (minimum 1)
  - `vehicleType` (string, required): Type of vehicle (must be 'car', 'motorcycle', or 'auto')

**Example Response**
\`\`\`json
{
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    }
  },
  "token": "string"
}
\`\`\`

### /captains/login Endpoint

**Description**  
Authenticates a captain using their email and password, returning a JWT token upon successful login.

**HTTP Method**  
POST

**Request Body**  
The request body should be in JSON format and include the following fields:

- `email` (string, required): Captain's email address (must be a valid email)
- `password` (string, required): Captain's password (minimum 6 characters)

**Example Response**
\`\`\`json
{
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    }
  },
  "token": "string"
}
\`\`\`

### /captains/profile Endpoint

**Description**  
Retrieves the profile information of the currently authenticated captain.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

**Example Response**
\`\`\`json
{
  "captain": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    }
  }
}
\`\`\`

### /captains/logout Endpoint

**Description**  
Logout the current captain and blacklist the token provided in cookie or headers.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header or cookie.

**Example Response**
\`\`\`json
{
  "message": "Logout successfully"
}
\`\`\`

## Ride Endpoints

### /rides/create Endpoint

**Description**  
Creates a new ride request for the authenticated user.

**HTTP Method**  
POST

**Authentication**  
Requires a valid JWT token for a user in the Authorization header: `Authorization: Bearer <token>`

**Request Body**  
The request body should be in JSON format and include the following fields:

- `pickup` (string, required): Pickup location (minimum 3 characters)
- `destination` (string, required): Destination location (minimum 3 characters)
- `vehicleType` (string, required): Type of vehicle requested (must be 'auto', 'car', or 'moto')

**Example Response**
\`\`\`json
{
  "ride": {
    "user": "user_id",
    "pickup": "string",
    "destination": "string",
    "vehicleType": "string",
    "status": "string"
  }
}
\`\`\`

### /rides/get-fare Endpoint

**Description**  
Calculates and returns the estimated fare for a ride.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token for a user in the Authorization header: `Authorization: Bearer <token>`

**Query Parameters**
- `pickup` (string, required): Pickup location (minimum 3 characters)
- `destination` (string, required): Destination location (minimum 3 characters)

**Example Response**
\`\`\`json
{
  "fare": "number"
}
\`\`\`

### /rides/confirm Endpoint

**Description**  
Allows a captain to confirm a ride request.

**HTTP Method**  
POST

**Authentication**  
Requires a valid JWT token for a captain in the Authorization header: `Authorization: Bearer <token>`

**Request Body**  
The request body should be in JSON format and include the following field:

- `rideId` (string, required): MongoDB ObjectId of the ride to confirm

**Example Response**
\`\`\`json
{
  "ride": {
    "user": "user_id",
    "captain": "captain_id",
    "pickup": "string",
    "destination": "string",
    "vehicleType": "string",
    "status": "confirmed"
  }
}
\`\`\`

### /rides/start-ride Endpoint

**Description**  
Allows a captain to start a confirmed ride.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token for a captain in the Authorization header: `Authorization: Bearer <token>`

**Query Parameters**
- `rideId` (string, required): MongoDB ObjectId of the ride to start
- `otp` (string, required): One-time password provided by the user (6 characters)

**Example Response**
\`\`\`json
{
  "ride": {
    "user": "user_id",
    "captain": "captain_id",
    "pickup": "string",
    "destination": "string",
    "vehicleType": "string",
    "status": "in_progress"
  }
}
\`\`\`

### /rides/end-ride Endpoint

**Description**  
Allows a captain to end an ongoing ride.

**HTTP Method**  
POST

**Authentication**  
Requires a valid JWT token for a captain in the Authorization header: `Authorization: Bearer <token>`

**Request Body**  
The request body should be in JSON format and include the following field:

- `rideId` (string, required): MongoDB ObjectId of the ride to end

**Example Response**
\`\`\`json
{
  "ride": {
    "user": "user_id",
    "captain": "captain_id",
    "pickup": "string",
    "destination": "string",
    "vehicleType": "string",
    "status": "completed"
  }
}
\`\`\`

## Map Endpoints

### /maps/get-coordinates Endpoint

**Description**  
Retrieves the coordinates for a given address.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

**Query Parameters**
- `address` (string, required): Address to get coordinates for (minimum 3 characters)

**Example Response**
\`\`\`json
{
  "ltd": "number",
  "lng": "number"
}
\`\`\`

### /maps/get-distance-time Endpoint

**Description**  
Calculates the distance and estimated travel time between two locations.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

**Query Parameters**
- `origin` (string, required): Starting location (minimum 3 characters)
- `destination` (string, required): Ending location (minimum 3 characters)

**Example Response**
\`\`\`json
{
  "distance": "string",
  "duration": "string"
}
\`\`\`

### /maps/get-suggestions Endpoint

**Description**  
Provides address suggestions based on user input.

**HTTP Method**  
GET

**Authentication**  
Requires a valid JWT token in the Authorization header: `Authorization: Bearer <token>`

**Query Parameters**
- `input` (string, required): User input for address suggestion (minimum 3 characters)

**Example Response**
\`\`\`json
{
  "suggestions": [
    {
      "description": "string",
      "placeId": "string"
    }
  ]
}
\`\`\`

## Error Responses

### Validation Error (400)
\`\`\`json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
\`\`\`

### Authentication Error (401)
\`\`\`json
{
  "message": "Invalid email or password"
}
\`\`\`

### Duplicate Entry Error (400)
\`\`\`json
{
  "message": "User/Captain already exists"
}
\`\`\`

