# 🔗 TinyApp - Modern URL Shortener

> A sophisticated, full-stack web application for URL shortening with advanced analytics and modern UI/UX design.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.17+-blue.svg)](https://expressjs.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

TinyApp transforms long URLs into short, manageable links while providing comprehensive analytics, QR code generation, and a modern dark-themed interface. Built with enterprise-grade security and user experience in mind.

## ✨ Key Features

### 🎨 **Modern UI/UX**
- **Dark Theme Design** with gradient backgrounds and glass morphism effects
- **Responsive Bootstrap 5** interface optimized for all devices  
- **Smooth Animations** and interactive hover effects
- **Professional Typography** using Inter font family
- **Accessibility-Focused** with proper ARIA labels and keyboard navigation

### 📊 **Advanced Analytics Dashboard**
- **Real-time Click Tracking** with IP logging and timestamps
- **Performance Charts** powered by Chart.js
- **Top Performing URLs** ranking system
- **Recent Activity Feed** for monitoring engagement
- **Comprehensive Metrics** including click rates and URL performance

### 🔧 **Enhanced Functionality**
- **QR Code Generation** for easy mobile sharing
- **Copy-to-Clipboard** with visual feedback
- **URL Preview** with favicon loading
- **Toast Notifications** for better user feedback
- **Form Validation** with real-time error handling
- **Secure Authentication** with bcrypt password hashing

### 🛡️ **Security & Privacy**
- **Session-based Authentication** with encrypted cookies
- **Password Hashing** using bcrypt (10 salt rounds)
- **User Isolation** - users can only access their own URLs
- **Input Validation** to prevent malicious submissions
- **CSRF Protection** through proper form handling

## 🏗️ Architecture & Technical Implementation

### **Backend Architecture**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Express.js    │    │   EJS Templates  │    │  In-Memory DB   │
│   Server        │◄───┤   Rendering      │    │   (URLs/Users)  │
│   (Port 3000)   │    │   Engine         │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Middleware    │    │   Static Assets  │    │   Helper        │
│   - Sessions    │    │   - CSS/JS       │    │   Functions     │
│   - Body Parser │    │   - Fonts        │    │   - Auth Utils  │
│   - Static      │    │   - Libraries    │    │   - Generators  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Frontend Stack**
- **Bootstrap 5.3** - Modern responsive framework
- **Custom CSS** - Dark theme with CSS variables
- **Font Awesome 6.4** - Professional icon library  
- **Chart.js** - Interactive data visualization
- **QR Code.js** - Dynamic QR code generation
- **Vanilla JavaScript** - Modern ES6+ features

### **Data Models**

**User Object:**
```javascript
{
  id: "randomUserID",
  email: "user@example.com", 
  password: "$2b$10$hashedPassword..."
}
```

**URL Object:**
```javascript
{
  longURL: "https://example.com/very/long/url",
  userID: "randomUserID",
  clicks: 42,
  createdAt: "2025-01-15",
  clickHistory: [
    { timestamp: "2025-01-15T10:30:00Z", ip: "192.168.1.1" }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yislamovic/tinyapp.git
   cd tinyapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   node express_server.js
   ```

4. **Access the application**
   - Open your browser to `http://localhost:3000`
   - Use demo credentials: `demo@example.com` / `demo123`

### Available Scripts

- `npm start` - Start the development server with nodemon
- `npm test` - Run the test suite with Mocha
- `node express_server.js` - Start the server directly

## 📋 API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/` | Home page (redirects based on auth) | Optional |
| `GET` | `/login` | Login page | None |
| `POST` | `/login` | User authentication | None |
| `GET` | `/register` | Registration page | None |
| `POST` | `/register` | User registration | None |
| `GET` | `/urls` | User's URLs list | Required |
| `GET` | `/urls/new` | Create new URL form | Required |
| `POST` | `/urls` | Create new shortened URL | Required |
| `GET` | `/urls/:id` | Edit URL page | Required (Owner) |
| `POST` | `/urls/:id` | Update URL | Required (Owner) |
| `POST` | `/urls/:id/delete` | Delete URL | Required (Owner) |
| `GET` | `/u/:shortURL` | Redirect to long URL | None |
| `GET` | `/dashboard` | Analytics dashboard | Required |
| `POST` | `/logout` | User logout | Required |

## 🛠️ Dependencies

### Core Dependencies
```json
{
  "bcrypt": "^5.0.1",           // Password hashing
  "body-parser": "^1.19.0",    // Request body parsing  
  "cookie-session": "^1.4.0",  // Session management
  "ejs": "^3.1.6",             // Template engine
  "express": "^4.17.1"         // Web framework
}
```

### Development Dependencies
```json
{
  "chai": "^4.3.4",            // Testing assertions
  "mocha": "^9.0.3",           // Testing framework
  "nodemon": "^2.0.12"         // Development server
}
```

### Frontend Libraries (CDN)
- **Bootstrap 5.3** - CSS framework
- **Font Awesome 6.4** - Icons
- **Chart.js** - Data visualization  
- **QR Code.js** - QR code generation
- **Google Fonts (Inter)** - Typography

## 🎯 Portfolio Highlights

### **Technical Skills Demonstrated**
- **Full-Stack Development** with Node.js and Express
- **Modern Frontend Development** with responsive design
- **Database Design** and data modeling
- **User Authentication & Security** implementation
- **API Design** with RESTful principles
- **Real-time Features** with click tracking
- **Data Visualization** using Chart.js
- **Version Control** with Git and GitHub

### **Advanced Features**
- **Analytics Dashboard** with interactive charts
- **QR Code Integration** for mobile-friendly sharing
- **Copy-to-Clipboard API** utilization
- **Toast Notification System** for user feedback
- **Form Validation** with client-side and server-side checks
- **Responsive Design** across all device sizes

### **Code Quality & Best Practices**
- **Modular Architecture** with separation of concerns
- **Security Implementation** with password hashing and session management
- **Error Handling** throughout the application
- **Clean Code** with consistent formatting and commenting
- **Modern JavaScript** using ES6+ features

## 📸 Screenshots

### Dashboard Analytics
![Dashboard with real-time analytics and charts]

### Modern URL Management  
![Clean, card-based URL listing with actions]

### Professional Authentication
![Modern login/register pages with validation]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Yahya Islamovic**
- GitHub: [@yislamovic](https://github.com/yislamovic)
- Portfolio: [Your Portfolio URL]

---

*Built with ❤️ using Node.js, Express, and modern web technologies.*