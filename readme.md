# YOLO Cabs - Ride Sharing Application

A comprehensive ride-sharing platform built with Node.js, featuring real-time ride matching, location services, payment processing, and rating system.

## 🚀 Features

### User Management
- **User Registration & Authentication**: Secure user signup and login with JWT tokens
- **Captain Registration**: Driver onboarding with vehicle information and validation
- **Profile Management**: User and captain profile endpoints
- **Session Management**: Token-based authentication with blacklist support
- **Real-time Status**: Socket-based connection tracking

### Ride Management
- **Ride Creation**: Users can request rides with pickup and destination
- **Fare Calculation**: Dynamic pricing based on distance, time, and vehicle type
- **Ride Confirmation**: Captains can accept ride requests
- **OTP Verification**: Secure 6-digit OTP ride start verification system
- **Ride Tracking**: Real-time ride status updates (pending → accepted → ongoing → completed)

### Location Services
- **Address Geocoding**: Convert addresses to coordinates using Mapbox API
- **Distance & Time Calculation**: Route optimization and ETA calculation
- **Autocomplete Suggestions**: Smart address suggestions for better UX
- **Captain Matching**: Find available captains within specified radius
- **Real-time Location**: Live captain location tracking

### Real-time Features
- **Socket.io Integration**: Real-time communication between users and captains
- **Live Notifications**: Instant updates for ride status changes
- **Captain Earnings**: Real-time earnings tracking and updates
- **Connection Management**: Socket ID tracking for users and captains

### Rating & Analytics System
- **Ride Ratings**: Users can rate their ride experience (1-5 stars)
- **Captain Reviews**: Comprehensive rating system with comments
- **Rating Analytics**: Track captain performance and average ratings
- **Earnings Tracking**: Daily and total earnings breakdown
- **Ride Statistics**: Total rides completed tracking

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with 24h expiration
- **Real-time**: Socket.io
- **Maps & Location**: Mapbox API
- **Validation**: Express Validator
- **Security**: bcrypt password hashing, token blacklisting

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ride-sharing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ridesharing
   JWT_SECRET=your_jwt_secret_key
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL = YOUR_BACKEND_URL
   VITE_MAPBOX_ACCESS_TOKEN=YOUR_TOKEN
   ```
4. **Start the application**
   ```bash
   npm start(FRONTEND)
   node index.js(BACKEND)
   ```

## 📚 API Endpoints

### Authentication

#### Users
- `POST /api/users/register` - Register new user
  - **Body**: `{ fullname: { firstname, lastname }, email, password }`
  - **Validation**: Email format, firstname min 3 chars, password min 6 chars
- `POST /api/users/login` - User login
  - **Body**: `{ email, password }`
- `GET /api/users/profile` - Get user profile (Auth required)
- `GET /api/users/logout` - User logout (Auth required)

#### Captains
- `POST /api/captains/register` - Register new captain
  - **Body**: `{ fullname: { firstname, lastname }, email, password, vehicle: { color, plate, capacity, vehicleType } }`
  - **Validation**: Vehicle type must be "car", "motorcycle", or "auto"
- `POST /api/captains/login` - Captain login
- `GET /api/captains/profile` - Get captain profile (Auth required)
- `GET /api/captains/logout` - Captain logout (Auth required)
- `GET /api/captains/stats/:captainId` - Get captain statistics (Auth required)
- `POST /api/captains/update-earnings` - Update captain earnings (Auth required)

### Rides
- `POST /api/rides/create` - Create new ride request (User auth required)
  - **Body**: `{ pickup, destination, vehicleType }`
- `GET /api/rides/get-fare` - Calculate ride fare (User auth required)
  - **Query**: `?pickup=address&destination=address`
- `POST /api/rides/confirm` - Confirm ride (Captain auth required)
  - **Body**: `{ rideId }`
  - **Validation**: MongoDB ObjectId format
- `GET /api/rides/start-ride` - Start ride with OTP verification (Captain auth required)
  - **Query**: `?rideId=id&otp=123456`
  - **Validation**: 6-character OTP
- `POST /api/rides/end-ride` - End completed ride (Captain auth required)
  - **Body**: `{ rideId }`

### Maps & Location
- `GET /api/maps/get-coordinates` - Get coordinates from address (User auth required)
  - **Query**: `?address=street address`
- `GET /api/maps/get-distance-time` - Calculate distance and time (User auth required)
  - **Query**: `?origin=address&destination=address`
- `GET /api/maps/get-suggestions` - Get address autocomplete suggestions (User auth required)
  - **Query**: `?input=partial address`

### Ratings
- `POST /api/ratings/submit` - Submit ride rating (User auth required)
  - **Body**: `{ rating, comment, captainId, rideId }`
  - **Validation**: Rating 1-5, comment max 500 chars
- `GET /api/ratings/captain/:captainId` - Get captain ratings (Captain auth required)
  - **Query**: `?page=1&limit=10`

## 🗃️ Data Models

### User Model
```javascript
{
  fullname: {
    firstname: String (required, min 3 chars),
    lastname: String (min 3 chars)
  },
  email: String (required, unique, min 5 chars),
  password: String (required, hashed),
  socketId: String
}
```

### Captain Model
```javascript
{
  fullname: {
    firstname: String (required, min 3 chars),
    lastname: String (min 3 chars)
  },
  email: String (required, unique),
  password: String (required, hashed),
  socketId: String,
  status: String (enum: ["active", "inactive"]),
  vehicle: {
    color: String (required, min 3 chars),
    plate: String (required, min 3 chars),
    capacity: Number (required, min 1),
    vehicleType: String (enum: ["car", "motorcycle", "auto"])
  },
  location: {
    ltd: Number,
    lng: Number
  },
  rating: {
    average: Number (0-5),
    totalRatings: Number,
    totalScore: Number
  },
  earnings: {
    total: Number,
    today: Number,
    thisWeek: Number,
    thisMonth: Number
  },
  totalRides: Number
}
```

### Ride Model
```javascript
{
  user: ObjectId (ref: "user", required),
  captain: ObjectId (ref: "captain"),
  pickup: String (required),
  destination: String (required),
  fare: Number (required),
  status: String (enum: ["pending", "accepted", "completed", "cancelled", "ongoing"]),
  duration: Number,
  distance: Number,
  paymentID: String,
  orderID: String,
  signature: String,
  otp: String (required, hidden)
}
```

### Rating Model
```javascript
{
  user: ObjectId (ref: "user", required),
  captain: ObjectId (ref: "captain", required),
  ride: ObjectId (ref: "ride", required, unique),
  rating: Number (required, 1-5),
  comment: String (max 500 chars),
  timestamps: true
}
```

### Blacklist Token Model
```javascript
{
  token: String (required, unique),
  createdAt: Date (expires after 24h)
}
```

## 🔧 Request/Response Examples

### Register Captain
```json
POST /api/captains/register
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.captain@example.com",
  "password": "securepassword123",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Create Ride Request
```json
POST /api/rides/create
{
  "pickup": "123 Main St, City",
  "destination": "456 Oak Ave, City",
  "vehicleType": "car"
}

Response:
{
  "_id": "ride_id",
  "user": "user_id",
  "pickup": "123 Main St, City",
  "destination": "456 Oak Ave, City",
  "fare": 120,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Fare Estimate
```json
GET /api/rides/get-fare?pickup=123 Main St&destination=456 Oak Ave

Response:
{
  "auto": 85,
  "car": 120,
  "motorcycle": 65
}
```

### Submit Rating
```json
POST /api/ratings/submit
{
  "rating": 5,
  "comment": "Excellent service, very professional driver!",
  "captainId": "captain_id_here",
  "rideId": "ride_id_here"
}

Response:
{
  "message": "Rating submitted successfully",
  "rating": {
    "_id": "rating_id",
    "user": "user_id",
    "captain": "captain_id",
    "ride": "ride_id",
    "rating": 5,
    "comment": "Excellent service, very professional driver!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔄 Real-time Events

### Socket Events
- `new-ride` - Notify captains of new ride requests
- `ride-confirmed` - Notify user when ride is accepted
- `ride-started` - Notify user when ride begins
- `ride-ended` - Notify user when ride is completed
- `earnings-updated` - Notify captain of earnings update

## 🚗 Vehicle Types

The application supports three vehicle types:
- **motorcycle**: Motorcycle/scooter rides (capacity varies)
- **auto**: Auto-rickshaw rides (typically 3-4 passengers)
- **car**: Standard car rides (typically 4-6 passengers)

Each vehicle type has different:
- Base fare rates
- Per-kilometer charges
- Per-minute charges
- Capacity limits (validated during registration)

## 💰 Pricing Model

Dynamic pricing based on:
- **Base Fare**: Fixed starting cost per vehicle type
  - Motorcycle: ₹20 base + ₹8/km + ₹1.5/min
  - Auto: ₹30 base + ₹10/km + ₹2/min
  - Car: ₹50 base + ₹15/km + ₹3/min
- **Distance**: Per-kilometer rate using Mapbox routing
- **Time**: Per-minute rate based on estimated duration
- **Real-time Calculation**: Fare calculated using actual route data

## 🔐 Security Features

- **JWT Authentication**: 24-hour token expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Token Blacklisting**: Automatic token invalidation on logout
- **Input Validation**: Comprehensive validation using express-validator
- **Route Protection**: Middleware-based authentication for protected routes
- **Data Sanitization**: Email normalization and input cleaning
- **Unique Constraints**: Prevent duplicate registrations
- **OTP Security**: 6-digit OTP for ride verification

## 📊 Captain Analytics

### Earnings Tracking
- **Total Earnings**: Lifetime earnings accumulation
- **Daily Earnings**: Reset daily for current day tracking
- **Automatic Updates**: Real-time earnings updates after ride completion

### Performance Metrics
- **Rating System**: Average rating calculation from user feedback
- **Total Rides**: Complete ride count tracking
- **Rating Analytics**: Total ratings and score aggregation
- **Status Management**: Active/inactive status for availability

## 🔄 Ride Lifecycle

1. **Ride Creation**: User creates ride request with pickup/destination
2. **Captain Notification**: Nearby captains receive ride notifications via socket
3. **Ride Confirmation**: Captain accepts ride, status changes to "accepted"
4. **OTP Generation**: System generates 6-digit OTP for ride verification
5. **Ride Start**: Captain verifies OTP, status changes to "ongoing"
6. **Ride Completion**: Captain ends ride, status changes to "completed"
7. **Payment Processing**: Automatic fare calculation and captain earnings update
8. **Rating**: User can rate the completed ride experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Push notifications (FCM)
- [ ] Loyalty program and rewards
- [ ] Admin panel for management
- [ ] API rate limiting and throttling
- [ ] Comprehensive testing suite
- [ ] Performance monitoring (New Relic)
- [ ] Ride sharing (multiple passengers)
- [ ] Emergency features and SOS
- [ ] Route optimization algorithms
- [ ] Dynamic pricing based on demand

