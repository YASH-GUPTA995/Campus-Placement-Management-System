<<<<<<< HEAD
# NIT Delhi — Campus Placement Portal
### Full-Stack MERN Application | Yash Gupta

A production-quality Campus Placement Portal for NIT Delhi's Training & Placement Office.
Three independent portals: **Student**, **Company**, **TPO Admin**.

---

## 🗂 Project Structure

```
placement-portal/
├── backend/           → Express.js REST API
├── frontend/          → Student Portal (Vite + React) — port 5173
├── tpo-dashboard/     → TPO Admin Panel (Vite + React) — port 5174
└── company-portal/    → Company Workspace (Vite + React) — port 5175
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

## 🚀 Setup — Step by Step

### Step 1 — Fill Environment Variables

Open `backend/config/config.env` and replace every `YASH_GUPTA_FILL_*` placeholder:

```env
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET_KEY=<any random string, min 32 characters>
CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>
```

Also open `backend/seed.js` and fill:
```js
const TPO_EMAIL    = "your-tpo-email@nitdelhi.ac.in";
const TPO_PASSWORD = "your-secure-password";
```

### Step 2 — Install Backend Dependencies
=======
# Campus-Placement-Management-System

A full-stack MERN-based Placement Portal developed to streamline the campus recruitment process for Training & Placement Officers (TPOs), Students, and Recruiters. The platform provides secure role-based access, enabling efficient management of placement drives, student records, company profiles, applications, and result publication.

## Features

### TPO Portal
<img width="1557" height="645" alt="image" src="https://github.com/user-attachments/assets/0ced8517-6af4-44d1-8924-330d9ccef1dc" />

- Dashboard with placement statistics
- Student management
- Bulk student import using Excel
- Company management
- Placement drive creation and management
- Applicant tracking
- Export applicant data to Excel
- Create multiple TPO admin accounts
- Publish placement results

### Student Portal


- Secure registration and login
- Profile management
- Resume upload
- Browse available placement drives
- Apply for eligible drives
- Track application status
- View published results

### Recruiter Portal
<img width="1561" height="642" alt="image" src="https://github.com/user-attachments/assets/4d7f47f9-c2ad-4bef-b615-8a78a506501a" />


- Company dashboard
- Company profile management
- View applicants
- Download applicant information
- Publish selection results

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Multer

### Database

- MongoDB
- Mongoose

### Other Tools

- XLSX (Excel Import/Export)
- Cloudinary
- REST APIs

## Key Features

- JWT-based Authentication
- Role-Based Authorization
- Resume Upload & Management
- Dashboard Analytics
- Bulk Excel Import
- Excel Export
- Applicant Filtering
- Company & Drive Management
- Placement Result Publishing

## Project Structure

```text
Placement-Portal
│
├── frontend
│   ├── src
│   ├── public
│   ├── components
│   ├── pages
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── database
│   ├── server.js
│   └── package.json
│
└── README.md
```

## User Roles

### Training & Placement Officer (TPO)

- Manage student records
- Import student data using Excel
- Register companies
- Create placement drives
- Monitor applicants
- Export applicant data
- Publish placement results
- Create additional TPO administrators

### Student

- Register and log in
- Complete profile information
- Upload resume
- Apply for placement drives
- Track application status
- View placement results

### Recruiter

- Manage company profile
- View eligible applicants
- Download applicant details
- Publish recruitment results

## Excel Import

The system supports bulk student registration using Excel.

### Required Fields

- Roll Number
- Full Name
- CGPA
- Branch
- Contact Number
- College Email
- Personal Email
- Gender
- Date of Birth
- 10th Percentage
- 12th Percentage
- Graduation Year
- Active Backlogs
- Resume Link

Student records are uniquely identified using **Roll Number**, allowing existing records to be updated without affecting applications.

## Export Module

The export module allows TPOs to download applicant information in Excel format with customizable filters.

### Filters

- Placement Drive
- Job Role
- Branch
- Application Status

### Exportable Fields

- Student Information
- Academic Details
- Contact Information
- Resume Link
- Application Status
- Application Date

## Authentication & Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Role-Based Access Control
- Secure Resume Upload

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/placement-portal.git
```

### Backend
>>>>>>> c96179b2fee3ea684d6a899552c6524f07ce9e2a

```bash
cd backend
npm install
<<<<<<< HEAD
```

### Step 3 — Seed First TPO Admin

```bash
cd backend
node seed.js
```

✅ This creates the first TPO admin account. Run only once.

### Step 4 — Start Backend

```bash
cd backend
npm run dev
# API running at http://localhost:4000
```

### Step 5 — Install & Start Student Portal
=======
npm start
```

### Frontend
>>>>>>> c96179b2fee3ea684d6a899552c6524f07ce9e2a

```bash
cd frontend
npm install
npm run dev
<<<<<<< HEAD
# Student portal at http://localhost:5173
```

### Step 6 — Install & Start TPO Dashboard

```bash
cd tpo-dashboard
npm install
npm run dev
# TPO dashboard at http://localhost:5174
```

### Step 7 — Install & Start Company Portal

```bash
cd company-portal
npm install
npm run dev
# Company portal at http://localhost:5175
```

---

## 🔐 Login URLs

| Portal | URL | Role |
|--------|-----|------|
| Student Registration | http://localhost:5173/register | Student |
| Student Login | http://localhost:5173/login | Student |
| TPO Admin | http://localhost:5174/login | TPO |
| Company Portal | http://localhost:5175/login | Company |

---

## 📋 Usage Flow

### 1. TPO Workflow
1. Login at TPO dashboard (http://localhost:5174)
2. Go to **Import Excel** → Upload student master Excel file
3. Go to **Companies** → **Add Company** (creates company login credentials)
4. Go to **Drives** → **Create Drive** → Add roles with eligibility rules
5. Open applications: Drives → Drive → Role → Set status to **Open**
6. Export applicant data anytime from **Export** page

### 2. Student Workflow
1. Register at http://localhost:5173/register (Roll Number + College Email must exist in master DB)
2. Browse open drives from Dashboard or Drives page
3. Check eligibility — green badge = eligible, red = not eligible with reasons
4. Apply: paste your Google Drive resume link (set sharing to "Anyone with link")
5. Track application status in **Applications** page
6. Get notified when results are published

### 3. Company Workflow
1. Login at http://localhost:5175 using credentials provided by TPO
2. View your drives and applicant list
3. Search/filter applicants, view their Google Drive resume links
4. Download applicant Excel from Applicants page
5. Publish Results: select students → click Publish → all applicants notified instantly

---

## 📊 Excel Import Format

The TPO Excel file must have these column headers:

| Column | Required |
|--------|----------|
| Roll Number | ✅ |
| College Email ID | ✅ |
| Full Name | ✅ |
| Branch | ✅ (CSE/ECE/EE/ME/CE/IT/PIE) |
| CGPA | — |
| Gender | — |
| Date of Birth | — |
| Personal Email ID | — |
| Contact Number | — |
| Nationality | — |
| Permanent Address | — |
| 10th Year | — |
| 10th Percentage | — |
| 10th Board | — |
| 12th Year | — |
| 12th Percentage | — |
| 12th Board | — |
| Active Backlog | — |
| Eligible for CTC | — (Yes/No) |
| PWD | — (Yes/No) |
| Graduation Year | — |

**Important:** Import uses `Roll Number` as unique key. Re-importing updates records without deleting student accounts or applications.

---

## 🔑 Key Features

- ✅ Master DB validation on student registration
- ✅ Dynamic eligibility engine — no hardcoding
- ✅ Resume via Google Drive link
- ✅ Company publishes results directly → students notified instantly
- ✅ TPO can unlock re-application per student
- ✅ Configurable Excel export with column selection + branch filter
- ✅ Duplicate application prevention (compound unique index)
- ✅ JWT + HTTP-only cookies + role-based access control
- ✅ Eligibility snapshot stored on each application for audit

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js (ES Modules) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt + HTTP-only cookies |
| File Storage | Cloudinary |
| Excel | xlsx (SheetJS) |

---

## 📁 API Base URL

```
http://localhost:4000/api/v1
```

All routes require JWT via HTTP-only cookie except login/register.

---

## 🚀 Deployment

| Service | Platform |
|---------|---------|
| Backend | Render (Web Service) |
| Student Portal | Vercel |
| TPO Dashboard | Vercel |
| Company Portal | Vercel |
| Database | MongoDB Atlas |
| Files | Cloudinary |

Update `.env` files in each frontend with the deployed backend URL before building.

---

## 👤 Developer

**Yash Gupta** — NIT Delhi
Flagship project for SDE Internship Applications

---

*Built with ❤️ using MERN Stack*
=======
```

## Future Improvements

- Email notifications
- Interview scheduling
- Resume parser
- AI-based resume screening
- Student analytics dashboard
- Placement reports
- Advanced filtering and search
- Company feedback system

## Author

**Yash Gupta**

B.Tech, Electrical Engineering  
National Institute of Technology Delhi

---

If you found this project useful, consider giving it a star on GitHub.
>>>>>>> c96179b2fee3ea684d6a899552c6524f07ce9e2a
