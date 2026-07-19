import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import {FaUserGraduate,FaBuilding,FaUserTie} from 'react-icons/fa';

function Card({icon,title,desc,link}){
return <a className="card" href={link} target="_blank">
<div className="icon">{icon}</div>
<h2>{title}</h2>
<p>{desc}</p>
<button>Open Portal →</button>
</a>
}
function App(){
return <div>
<section className="hero">
<h1>Placement Nexus</h1>
<p>Unified gateway for Student, Company and TPO dashboards.</p>
</section>
<div className="grid">
<Card icon={<FaUserGraduate/>} title="Student Portal" desc="Apply for jobs, manage profile and track applications." link="https://campus-placement-management-system-murex.vercel.app"/>
{/* <Card icon={<FaBuilding/>} title="Company Portal" desc="Post jobs, shortlist candidates and manage recruitment." link="https://tpo-portal-taupe.vercel.app/"/> */}
<Card icon={<FaBuilding/>} title="Company Portal" desc="Post jobs, shortlist candidates and manage recruitment." link="https://company-portal-orpin.vercel.app"/>
<Card icon={<FaUserTie/>} title="TPO Portal" desc="Manage drives, companies, students and analytics." link="https://tpo-portal-taupe.vercel.app"/>
</div>
<footer>Built with React • MERN Stack • Vercel • Render</footer>
</div>}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
