# Placement Nexus — Campus Placement Management System

A full-stack MERN-based Placement Portal built to streamline the campus recruitment process for Training & Placement Officers (TPOs), Students, and Recruiters. The platform provides secure role-based access, enabling efficient management of placement drives, student records, company profiles, applications, and result publication.

### 🔗 Live Demo

**[placement-nexus-phi.vercel.app](https://placement-nexus-phi.vercel.app/)**

---

## 🗂 Project Structure

```
Campus-Placement-Management-System/
├── backend/                  → Express.js REST API
├── frontend/                 → Student Portal (Vite + React)
├── tpo-dashboard/            → TPO Admin Panel (Vite + React)
├── company-portal/           → Recruiter / Company Workspace (Vite + React)
└── Placement-Nexus-Landing/  → Public landing page (Vite + React)
```

---

## ✨ Features

### 🎓 TPO Portal

<img width="1557" height="645" alt="TPO Dashboard" src="https://github.com/user-attachments/assets/0ced8517-6af4-44d1-8924-330d9ccef1dc" />

- Dashboard with placement statistics
- Student management
- Bulk student import using Excel
- Company management
- Placement drive creation and management
- Applicant tracking
- Export applicant data to Excel
- Create multiple TPO admin accounts
- Publish placement results

### 👨‍🎓 Student Portal

- Secure registration and login
- Profile management
- Resume upload
- Browse available placement drives
- Apply for eligible drives
- Track application status
- View published results

### 🏢 Recruiter Portal

<img width="1561" height="642" alt="Recruiter Dashboard" src="https://github.com/user-attachments/assets/4d7f47f9-c2ad-4bef-b615-8a78a506501a" />

- Company dashboard
- Company profile management
- View applicants
- Download applicant information
- Publish selection results

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express.js (ES Modules) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt + HTTP-only cookies |
| File Storage | Cloudinary |
| Excel | xlsx (SheetJS) — bulk import & export |
| File Uploads | Multer / express-fileupload |

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

## 🚀 Setup — Step by Step

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Campus-Placement-Management-System.git
cd Campus-Placement-Management-System
```

### 2. Configure Environment Variables

Open `backend/config/config.env` and fill in your own values:

```env
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET_KEY=<any random string, min 32 characters>
CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>
```

Also open `backend/seed.js` and set the first TPO admin's credentials:

```js
const TPO_EMAIL    = "your-tpo-email@example.com";
const TPO_PASSWORD = "your-secure-password";
```

### 3. Backend

```bash
cd backend
npm install
node seed.js      # creates the first TPO admin — run only once
npm run dev        # API running at http://localhost:4000
```

### 4. Student Portal

```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

### 5. TPO Dashboard

```bash
cd tpo-dashboard
npm install
npm run dev         # http://localhost:5174
```

### 6. Company / Recruiter Portal

```bash
cd company-portal
npm install
npm run dev         # http://localhost:5175
```

### 7. Landing Page (optional)

```bash
cd Placement-Nexus-Landing
npm install
npm run dev
```

---

## 📋 Usage Flow

### TPO Workflow
1. Log in to the TPO dashboard.
2. Go to **Import Excel** → upload the student master Excel file.
3. Go to **Companies** → **Add Company** (creates company login credentials).
4. Go to **Drives** → **Create Drive** → add roles with eligibility rules.
5. Open applications by setting a role's status to **Open**.
6. Export applicant data anytime from the **Export** page.

### Student Workflow
1. Register (Roll Number + College Email must exist in the master DB).
2. Browse open drives and check eligibility (green = eligible, red = not eligible with reasons).
3. Apply with a resume link (Google Drive, shared as "Anyone with the link").
4. Track application status and view results once published.

### Recruiter Workflow
1. Log in with credentials provided by the TPO.
2. View drives and applicant lists, search/filter applicants.
3. Download applicant data as Excel.
4. Select students and publish results — applicants are notified instantly.

---

## 📊 Excel Import Format

Bulk student registration is supported via Excel. Students are uniquely identified by **Roll Number**, so re-importing updates existing records without affecting applications or accounts.

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

### Optional Fields
Nationality, Permanent Address, 10th Year, 10th Board, 12th Year, 12th Board, Eligible for CTC, PWD status

---

## 📤 Export Module

TPOs can export applicant information in Excel format with filters:

**Filters:** Placement Drive · Job Role · Branch · Application Status

**Exportable Fields:** Student Information · Academic Details · Contact Information · Resume Link · Application Status · Application Date

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

## 🔐 Authentication & Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control (Student / TPO / Recruiter)
- Secure resume upload via Cloudinary

---

## 📁 API Base URL

```
http://localhost:4000/api/v1
```

All routes require a JWT (via HTTP-only cookie) except login/register.

---

## 🚀 Deployment

| Service | Platform |
|---------|---------|
| Backend | Render (Web Service) |
| Student Portal | Vercel |
| TPO Dashboard | Vercel |
| Company Portal | Vercel |
| Landing Page | Vercel |
| Database | MongoDB Atlas |
| Files | Cloudinary |

Update the `.env` file in each frontend with the deployed backend URL before building.

---

## 🔮 Future Improvements

- Email notifications
- Interview scheduling
- Resume parser / AI-based resume screening
- Student analytics dashboard
- Placement reports
- Advanced filtering and search
- Company feedback system

---

## 👤 Author

**Yash Gupta**
B.Tech, Electrical Engineering — National Institute of Technology Delhi

---

If you found this project useful, consider giving it a ⭐ on GitHub.
