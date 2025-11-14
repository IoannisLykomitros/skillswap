# SkillSwap - Peer-to-Peer Mentorship Platform

A full-stack web application that connects people who want to learn new skills with those who can teach them. Built with React, Node.js, Express, and PostgreSQL.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://skillswap-five-khaki.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/IoannisLykomitros/skillswap)

---

## Features

### User Management

- Secure user registration and authentication with JWT
- User profiles with bio and contact information
- Profile editing and customization

### Skills Management

- Browse 40+ predefined skills across 9 categories
- Add skills you can offer to teach
- Add skills you want to learn
- Manage your skill portfolio

### Mentorship System

- Send mentorship requests to other users
- Accept or decline incoming requests
- View dashboard of active mentorships
- Track learning progress

### User Experience

- Modern dark theme UI
- Responsive design for all devices
- Real-time updates
- Intuitive navigation

---

## Tech Stack

### Frontend

- _React_ 18.x - UI library
- _React Router_ 6.x - Client-side routing
- _Axios_ - HTTP client
- _CSS3_ - Modern styling with CSS variables

### Backend

- _Node.js_ 18.x - Runtime environment
- _Express_ 4.x - Web framework
- _PostgreSQL_ 15.x - Database
- _JWT_ - Authentication
- _bcrypt_ - Password hashing

### DevOps & Deployment

- _Vercel_ - Frontend hosting
- _Render_ - Backend & database hosting
- _GitHub_ - Version control
- _Git_ - Source control

---

## Project Structure

```
skillswap/
├── client/ # Frontend React application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   │   ├── Auth/
│   │   │   └── Layout/
│   │   │   └── Route/
│   │   ├── features/ # Feature-based modules
│   │   │   ├── dashboard/
│   │   │   ├── mentorship/
│   │   │   └── profile/
│   │   │   └── skills/
│   │   ├── pages/ # Page components
│   │   ├── context/ # React Context
│   │   ├── services/ # API services
│   │   ├── utils/ # Utility functions
│   │   ├── styles/ # Global styles
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env.production
│   └── package.json
│
├── server/ # Backend Node.js application
│   ├── config/
│   │   └── database.js # Database configuration
│   ├── controllers/ # Route controllers
│   ├── middleware/ # Express middleware
│   ├── routes/ # API routes
│   ├── db/ # Database files
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── server.js # Entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- _Node.js_ (v18 or higher)
- _npm_ or _yarn_
- _PostgreSQL_ (v15 or higher)
- _Git_

### Local Development Setup

#### 1. Clone the Repository

```
git clone https://github.com/IoannisLykomitros/skillswap.git
cd skillswap
```

#### 2. Set Up Database

_Create database_

```
createdb skillswap_db
```

_Run schema_

```
psql -d skillswap_db -f server/db/schema.sql
```

_Run seed data_

```
psql -d skillswap_db -f server/db/seed.sql
```

#### 3. Configure Backend

```
cd server
```

_Install dependencies_

```
npm install
```

_Create .env file_

```
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/skillswap_db
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000
EOF
```

_Start backend server_

```
npm run dev
```

#### 4. Configure Frontend

```
cd ../client
```

_Install dependencies_

```
npm install
```

_Create .env file_

```
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
EOF
```

_Start frontend_

```
npm start
```

#### 5. Open Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Add environment variables:
   - `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
   - `DISABLE_ESLINT_PLUGIN=true`
5. Deploy

### Backend Deployment (Render)

1. Create PostgreSQL database on Render
2. Run schema and seed data in database shell
3. Create Web Service
4. Set root directory to `server`
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL=[Render PostgreSQL URL]`
   - `JWT_SECRET=[Your secret key]`
   - `CLIENT_URL=[Your Vercel URL]`
6. Deploy

---

## Environment Variables

### Backend (.env)

```
NODE_ENV=development|production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_secret_key_min_32_characters
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Database Schema

### Tables

- _users_ - User accounts and profiles
- _skills_ - Available skills (40+ predefined)
- _user_skills_ - User-skill relationships (offer/want)
- _requests_ - Mentorship requests

### Relationships

users (1) ──── (N) user_skills (N) ──── (1) skills
users (1) ──── (N) requests ──── (1) users

---

## API Endpoints

| Group       | Method | Endpoint                       | Description                 | Auth |
| ----------- | :----: | ------------------------------ | --------------------------- | :--: |
| Auth        |  POST  | /api/auth/register             | Register new user           |  No  |
| Auth        |  POST  | /api/auth/login                | Login user                  |  No  |
| Auth        |  GET   | /api/auth/me                   | Get current user            | Yes  |
| Users       |  GET   | /api/users/:id                 | Get user profile            |  No  |
| Users       |  PUT   | /api/users/:id                 | Update user profile         | Yes  |
| Skills      |  GET   | /api/skills                    | Get all skills              |  No  |
| Skills      |  GET   | /api/skills/top?limit=8        | Get top skills              |  No  |
| Skills      |  GET   | /api/skills?include_users=true | Get skills with user counts |  No  |
| User Skills |  GET   | /api/user-skills/user/:userId  | Get user's skills           |  No  |
| User Skills |  POST  | /api/user-skills               | Add user skill              | Yes  |
| User Skills | DELETE | /api/user-skills/:id           | Remove user skill           | Yes  |
| Requests    |  GET   | /api/requests/received         | Get received requests       | Yes  |
| Requests    |  GET   | /api/requests/sent             | Get sent requests           | Yes  |
| Requests    |  POST  | /api/requests                  | Send mentorship request     | Yes  |
| Requests    |  PUT   | /api/requests/:id/accept       | Accept request              | Yes  |
| Requests    |  PUT   | /api/requests/:id/decline      | Decline request             | Yes  |

---

## Features Showcase

### Skill Categories

1. _Programming_ - JavaScript, Python, Java, C++, etc.
2. _Design_ - Graphic Design, UI/UX, etc.
3. _Languages_ - English, Spanish, French, etc.
4. _Music_ - Guitar, Piano, Singing, etc.
5. _Arts_ - Drawing, Photography, etc.
6. _Cooking_ - Baking, Vegetarian Cooking, etc.
7. _Fitness_ - Yoga, Running, etc.
8. _Business_ - Marketing, Public Speaking, etc.
9. _Lifestyle_ - Gardening, Meditation, etc.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

_Ioannis Lykomitros_

- GitHub: [@IoannisLykomitros](https://github.com/IoannisLykomitros)
- LinkedIn: [IoannisLykomitros](https://www.linkedin.com/in/ioannislykomitros/)

---
