# Final Project by Folios

## Overview
Folios Social is a comprehensive backend API for a social media platform, developed as a final project for the Web Application Development course. It empowers users to create accounts, share posts with images, publish temporary stories, engage through comments, and build social connections via likes and follows. Built with Node.js and Express.js, it leverages MongoDB for data persistence, Passport.js for secure authentication, and Multer for efficient file handling.

## Features
- User registration and authentication (using Passport.js)
- User profiles and management
- Posting system with image uploads
- Stories feature
- Comments on posts
- Social interactions (likes, follows, etc.)
- File upload handling with Multer
- Session-based authentication

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **File Uploads**: Multer
- **Session Management**: Express-Session
- **Password Hashing**: bcryptjs

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd final-project-by-folios
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB:
   - Ensure MongoDB is installed and running on your system
   - Update the database connection in `db.js` if needed

4. Start the server:
   ```
   npm start
   ```
   Or for development with auto-restart:
   ```
   npx nodemon server.js
   ```

The server will run on `http://localhost:3000`

## API Endpoints
- `/api/auth` - Authentication routes (login, register, logout)
- `/api/user` - User management (protected)
- `/api/posts` - Post operations (protected)
- `/api/social` - Social interactions (protected)
- `/api/stories` - Stories management (protected)

## Project Structure
- `server.js` - Main application entry point and server configuration
- `db.js` - MongoDB connection setup
- `models/` - Mongoose schemas for User, Post, Story, and Comment entities
- `routes/` - Express route handlers for authentication, user management, posts, social interactions, and stories
- `middleware/` - Custom middleware for authentication checks and file upload processing
- `config/` - Passport.js configuration for local authentication strategy
- `uploads/` - Directory for storing user-uploaded images and media files
- `Documentation/` - Project design documents and specifications
- `classDiagram/` - UML class diagrams illustrating the system architecture

## Future Plans
- Implement a realtime chat bot feature for user interactions
- Develop a frontend interface (React/Vue/Angular) to complement the backend API
- Add real-time notifications using WebSockets
- Enhance security features and API documentation

## Contributing
This is a university final project. For contributions or improvements, please refer to the project documentation in the `Documentation/` folder.

## License
ISC
