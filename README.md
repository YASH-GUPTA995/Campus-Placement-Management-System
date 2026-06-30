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

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
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
