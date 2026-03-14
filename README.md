# IFAV Platform — Where Startups Are Built With Intelligence 

A full-stack startup ecosystem platform for **Founders, Investors & Developers** — combining startup management, AI-powered pitch analysis, events, and founder networking in one place.

---

# 📸 Screenshots


## Log in / Register
  
<img width="323" height="330" alt="Image" src="https://github.com/user-attachments/assets/71a631d2-3fba-478d-a7d9-fa0657efe2f5" />
<img width="279" height="330" alt="Image" src="https://github.com/user-attachments/assets/3cb67f0e-314f-407b-b9ab-ca62608f406a" />

## Dashboard 

<img width="1891" height="897" alt="Image" src="https://github.com/user-attachments/assets/c292d261-0686-4cd7-bbe5-bc57df61d905" />
<img width="1913" height="905" alt="Image" src="https://github.com/user-attachments/assets/651c3fe3-d416-4aae-83e9-2e00aaba4ec3" />


## Startups Registry
 
<img width="1898" height="715" alt="Image" src="https://github.com/user-attachments/assets/c8d8f57a-fae0-497c-8b77-779cfc3a76e9" />

## Smart AI Evaluation 

<img width="1577" height="772" alt="Image" src="https://github.com/user-attachments/assets/05a2ecc5-283e-4130-b98c-3ea46109a011" />


## AI Pitch Analyzer

<img width="1328" height="500" alt="Image" src="https://github.com/user-attachments/assets/c360eb56-69cc-4efd-bc4f-0d405c754bf1" />
<img width="1240" height="883" alt="Image" src="https://github.com/user-attachments/assets/e107e9e5-89b4-4c00-b0d4-62e0e70f29fd" />
<img width="1196" height="817" alt="Image" src="https://github.com/user-attachments/assets/4fe59373-8256-461e-9cc5-afacf913df53" />

## Events and Meetsups

<img width="1583" height="552" alt="Image" src="https://github.com/user-attachments/assets/a9b88869-01d6-4696-b711-13f2145c521f" />


## Founder Network
<img width="1148" height="555" alt="Image" src="https://github.com/user-attachments/assets/2404d653-5f23-42ed-9a0b-cfa64e75f64d" />

## Database - SQL

<img width="1670" height="650" alt="Image" src="https://github.com/user-attachments/assets/c8e25d8d-f4b5-4acb-8ad7-cb251b496d9e" />

---

## 🧠 AI Features

### 1. AI Pitch Deck Analyzer
Upload any PDF pitch deck and get a full report in 3 seconds
- Overall score out of 100
- 6 category scores — Problem, Solution, Market, Team, Traction, Financials
- Strengths, Weaknesses, Improvements with priority levels
- Tough investor questions to prepare for
- Investor readiness level — Not Ready to Investor Ready

### 2. AI Startup Evaluator
One click on any startup profile gives instant AI evaluation
- Score out of 100
- Invest / Watch / Pass recommendation
- Key strengths and risks identified
- 2-3 sentence investor-style feedback

**Powered by** Groq API + LLaMA 3.3 70B by Meta — Free and fast, results in 1 to 3 seconds

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and fast builds |
| TailwindCSS | Styling |
| React Router v6 | Navigation |
| Recharts | Dashboard charts |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |
| Framer Motion | Animations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MySQL via XAMPP | Database |
| JWT + bcryptjs | Authentication and password security |
| Multer | PDF file upload handling |
| pdf-parse | Extract text from PDF files |
| Groq SDK | AI inference with LLaMA 3.3 70B |

---

## 📦 Full Features

-  JWT Authentication — Register and Login with role selection
-  Startup CRUD — Create, Read, Update, Delete startup profiles
-  AI Pitch Deck Analyzer — Upload PDF and get full AI report
-  AI Startup Evaluator — One click scoring for any startup
-  Events — Create, register, and manage ecosystem events
-  Founder Networking — Browse profiles and send connect requests
-  Dashboard — Live stats and charts by industry and stage
-  Search and Filter — Filter by industry, stage, and keyword

---

## 👤 3 User Roles

### 🧑‍💼 Founder
Create and manage startup profile. Get AI score. Upload pitch deck for full analysis. Network with investors. Organize demo days and pitch events.

### 💰 Investor
Browse all startups with AI scores visible. Filter by industry and stage. Analyze pitch decks in seconds. Connect with founders. Organize investor events.

### 👨‍💻 Developer
Find early stage startups to join. List your skills and expertise. Connect with non-technical founders. Attend hackathons. Build your own startup on the platform.

---

## 🗄️ Database Design — 6 Tables

```
users            → accounts, roles, avatars
startups         → profiles, funding info, AI scores
events           → event details and virtual links
event_attendees  → who registered for which event
founder_profiles → bio, skills, linkedin, looking for
connections      → connection requests between users
pitch_analyses   → full AI analysis history with all scores
```

---

## 🌍 Real World Uses

**Startup Accelerator** — AI pre-screens hundreds of applicants automatically saving weeks of manual review

**Angel Investor Network** — Score-based deal flow so investors only meet startups scoring above their threshold

**University Entrepreneurship Program** — Students submit startup ideas and get instant professional AI feedback

**Government Innovation Hub** — Track, support and connect the entire startup ecosystem in one platform

---

## 🔌 APIs Used

| API | Purpose | Cost |
|---|---|---|
| Groq API | AI pitch analysis and startup scoring | Free |
| Google Fonts API | Plus Jakarta Sans and JetBrains Mono fonts | Free |
| Express REST API | All backend business logic | Self-hosted |
| MySQL API via mysql2 | All database operations | Self-hosted |

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js v18 or higher
- XAMPP with MySQL running
- Groq API key from https://console.groq.com

### 1. Clone the repository
```
git clone https://github.com/i7xmel/IFAVH-where-startups-are-built-with-intelligence.git
cd IFAVH-where-startups-are-built-with-intelligence
```

### 2. Backend Setup
```
cd backend
npm install
```

Create a file called `.env` inside the backend folder
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ifav_platform
JWT_SECRET=your_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend
```
node server.js
```

### 3. Frontend Setup
```
cd frontend
npm install
npm run dev
```

### 4. Database Setup
- Open XAMPP Control Panel
- Start MySQL and Apache
- Go to http://localhost/phpmyadmin
- Create database named `ifav_platform`
- Run the SQL schema to create all tables and seed data

---

## 🔐 Demo Login Accounts

| Email | Password | Role |
|---|---|---|
| admin@ifav.com | password | Admin |
| sarah@ifav.com | password | Founder |
| marcus@ifav.com | password | Investor |

---

## 📡 API Endpoints

```
AUTH
POST   /api/auth/register              Create new account
POST   /api/auth/login                 Login and get token
GET    /api/auth/me                    Get current user

STARTUPS
GET    /api/startups                   List all startups
GET    /api/startups/:id               Get single startup
POST   /api/startups                   Create startup
PUT    /api/startups/:id               Update startup
DELETE /api/startups/:id               Delete startup
GET    /api/startups/meta/stats        Dashboard statistics

AI
POST   /api/ai/analyze-pitch           Upload and analyze PDF
POST   /api/ai/evaluate-startup/:id    Score a startup with AI

EVENTS
GET    /api/events                     List all events
POST   /api/events                     Create event
POST   /api/events/:id/attend          Register for event
DELETE /api/events/:id                 Delete event

FOUNDERS
GET    /api/founders                   List all founders
POST   /api/founders/profile           Create or update profile
POST   /api/founders/connect           Send connection request
```

---

## 🤖 How the AI Works

```
User uploads PDF pitch deck
        ↓
Multer saves file to server
        ↓
pdf-parse extracts all text from every slide
        ↓
Text sent to Groq API with expert investor prompt
        ↓
LLaMA 3.3 70B reads and analyzes the content
        ↓
Returns structured JSON with scores and feedback
        ↓
Results saved to database
        ↓
Beautiful UI renders the full report
```

---

## 🔐 Security

- Passwords hashed with bcrypt salt rounds 10
- JWT tokens expire in 7 days
- File uploads restricted to PDF and PowerPoint only
- CORS restricted to frontend origin only
- All database queries use parameterized statements

---

*Built by ismaeeel.basheer@gmail.com as an MVP demonstrating AI integration, full-stack architecture, database design, and product thinking for a startup ecosystem platform.*
