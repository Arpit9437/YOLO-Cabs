# Uber Clone

A full-stack ride-sharing application built with React, Node.js, and Socket.IO featuring real-time location tracking and ride management.

## Features

### User Features
- **User Authentication**: Secure signup/login system for riders
- **Location Search**: Integrated Google Maps for address search and suggestions
- **Ride Booking**: Select vehicle type (Car, Auto, Motorcycle) with fare estimates
- **Real-time Tracking**: Live tracking of assigned captain's location
- **Ride Management**: View ride details, OTP verification, and ride completion
- **Secure Payments**: Cash payment support with fare calculation

### Captain Features
- **Captain Authentication**: Dedicated signup/login system for drivers
- **Vehicle Management**: Register and manage vehicle details
- **Ride Requests**: Accept/decline incoming ride requests
- **Navigation**: Real-time navigation with pickup and drop-off locations
- **Earnings Tracking**: Monitor daily earnings and completed trips
- **Profile Stats**: View performance metrics like rating and hours online

### Technical Features
- **Real-time Communication**: Socket.IO integration for live updates
- **Google Maps Integration**: Location services, routing, and distance calculation
- **State Management**: Context API for global state handling
- **Protected Routes**: Authentication-based route protection
- **Token-based Auth**: JWT implementation for secure API access

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Socket.IO Client
- Google Maps API
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB
- Socket.IO
- JWT Authentication
- Google Maps Services

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── middleware/
    └── package.json
```

## Getting Started

1. Clone the repository
2. Set up environment variables:
   ```
   # Frontend .env
   VITE_API_URL=your_backend_url
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

   # Backend .env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

3. Install dependencies and run:
   ```sh
   # Frontend
   cd frontend
   npm install
   npm run dev

   # Backend
   cd backend
   npm install
   nodemon index.js
   ```

## API Documentation

Comprehensive API documentation is available in the backend README file, including:
- Authentication endpoints
- Ride management endpoints
- Location services endpoints
- WebSocket events

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
