import { useState, useRef, useEffect, type JSX, type ReactNode, type FormEvent } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps { name: string; className?: string; }

interface ExperienceItem {
    id: number;
    jobTitle: string;
    company: string;
    type: string;
    period: string;
    location: string;
    description: string;
    skills: string[];
    initials: string;
    color: string;
}

interface EducationItem {
    id: number;
    degree: string;
    school: string;
    period: string;
    status: string;
    initials: string;
    color: string;
}

interface PersonalDetails {
    title: string;
    firstName: string;
    lastName: string;
    dob: string;
    bio: string;
    city: string;
    district: string;
}

interface ContactInfo {
    phone: string;
    phoneType: string;
    houseNo: string;
    street: string;
    city: string;
    district: string;
    birthday: string;
    websites: string[];
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

// ── Icon ──────────────────────────────────────────────────────────────────────
const Icon = ({ name, className = "" }: IconProps): JSX.Element => (
    <i className={`fas fa-${name} ${className}`} />
);

// ── Notification hook ─────────────────────────────────────────────────────────
function useNotifications() {
    const [notes, setNotes] = useState<Notification[]>([]);
    const push = (message: string, type: Notification["type"] = "success") => {
        const id = Date.now();
        setNotes(n => [...n, { id, message, type }]);
        setTimeout(() => setNotes(n => n.filter(x => x.id !== id)), 4500);
    };
    const dismiss = (id: number) => setNotes(n => n.filter(x => x.id !== id));
    return { notes, push, dismiss };
}

// ── Month/Year Picker ─────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MonthYearPicker({ value, onChange, label }: {
    value: string; onChange: (v: string) => void; label: string;
}) {
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const display = value ? (() => {
        const [y, m] = value.split("-");
        return `${MONTHS[parseInt(m) - 1]} ${y}`;
    })() : "Select Month";

    return (
        <div ref={ref} className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <button type="button" onClick={() => setOpen(v => !v)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm flex items-center justify-between bg-slate-50/50 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className={value ? "text-gray-900" : "text-gray-400"}>{display}</span>
                <Icon name="calendar-alt" className="text-gray-400" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50"
                    style={{ animation: "fadeDown .2s ease-out" }}>
                    <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={() => setYear(y => y - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Icon name="chevron-left" className="text-gray-500 text-xs" />
                        </button>
                        <span className="text-sm font-bold text-gray-900">{year}</span>
                        <button type="button" onClick={() => setYear(y => y + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Icon name="chevron-right" className="text-gray-500 text-xs" />
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        {MONTHS.map((m, i) => {
                            const v = `${year}-${(i + 1).toString().padStart(2, "0")}`;
                            return (
                                <button key={m} type="button"
                                    onClick={() => { onChange(v); setOpen(false); }}
                                    className={`py-1.5 rounded-lg text-xs font-medium transition-colors
                                        ${value === v ? "bg-blue-600 text-white" : "hover:bg-blue-50 text-gray-700"}`}>
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── SRI LANKA DISTRICTS ───────────────────────────────────────────────────────
const SL_DISTRICTS = ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha",
    "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
    "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam",
    "Ratnapura", "Trincomalee", "Vavuniya"];

const JOB_FIELDS = ["Information Technology", "Banking", "Education", "Healthcare", "Marketing",
    "Engineering", "Human Resources", "Sales", "Legal", "Customer Service", "Art & Design", "Other"];

const EMP_TYPES = ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship"];

const CERT_TYPES = ["PhD", "Masters", "Bachelor", "Higher Diploma", "Diploma", "Certificate"];

const STUDY_FIELDS = ["Information Technology", "Finance & Accounting", "Engineering", "Marketing & Sales",
    "Healthcare & Medical", "Human Resources", "Education & Training", "Customer Service",
    "Hospitality & Tourism", "Other"];

// ── Static initial data ───────────────────────────────────────────────────────
const INIT_PERSONAL: PersonalDetails = {
    title: "Mr", firstName: "Thesara", lastName: "Kariyawasam",
    dob: "", bio: "Software Engineer | Cardiff Metropolitan University",
    city: "Matara", district: "Matara",
};

const INIT_CONTACT: ContactInfo = {
    phone: "", phoneType: "Mobile", houseNo: "", street: "",
    city: "", district: "", birthday: "", websites: [],
};

const INIT_EXPERIENCE: ExperienceItem[] = [
    {
        id: 1, jobTitle: "Software Engineer", company: "Management Systems (Pvt) Ltd",
        type: "Full-time", period: "Jan 2023 - Present", location: "Colombo, Western Province, Sri Lanka",
        description: "Working on full-stack development using React, ASP.NET, and Oracle databases. Contributing to innovative software solutions and mobile development projects.",
        skills: ["React", "ASP.NET", "Oracle", "C#"], initials: "MS", color: "#0077b5"
    },
    {
        id: 2, jobTitle: "Junior Developer", company: "ICBT Campus",
        type: "Part-time", period: "Jun 2022 - Dec 2022", location: "Colombo, Western Province, Sri Lanka",
        description: "Assisted in web development projects and learned modern development practices.",
        skills: ["JavaScript", "HTML/CSS"], initials: "IC", color: "#7c3aed"
    },
    {
        id: 3, jobTitle: "Intern Developer", company: "Tech Solutions Ltd",
        type: "Internship", period: "Jan 2022 - May 2022", location: "Matara, Southern Province, Sri Lanka",
        description: "Gained hands-on experience in software development and team collaboration.",
        skills: ["Python", "Java"], initials: "TS", color: "#059669"
    },
];

const INIT_EDUCATION: EducationItem[] = [
    {
        id: 1, degree: "BSc (Hons) Software Engineering", school: "Cardiff Metropolitan University",
        period: "2021 - 2024", status: "Final Year Student", initials: "CM", color: "#dc2626"
    },
    {
        id: 2, degree: "Pearson BTEC Level 5 HND in Full-Stack Development",
        school: "Roehampton University (via Singapore Lithan EduClass)",
        period: "2019 - 2021", status: "Completed", initials: "RU", color: "#d97706"
    },
];

const INIT_SKILLS = ["React", "ASP.NET", "Oracle", "SQL", "Angular", "C#", "JavaScript", "Python", "Java", "Mobile Development"];

const INIT_ABOUT = `Junior Software Engineer | Final Year Software Engineering Student

I am a Junior Software Engineer at MSL Pvt Ltd, with 1.5 years of experience in full-stack development. Currently in the final year of my BSc (Hons) Software Engineering, I hold a Pearson BTEC Level 5 HND in Full-Stack Development from Roehampton University, completed through Singapore Lithan EduClass.

Skilled in React, ASP.NET, Oracle and SQL Databases, Angular, Mobile developing, and C#, I am passionate about building innovative and efficient software solutions.`;

const NAV = [
    { label: "Home", icon: "home", href: "/seeker-home" },
    { label: "Documents", icon: "file-alt", href: "/seeker-documents" },
    { label: "Profile", icon: "user", href: "/seeker-profile", active: true },
    { label: "My Applications", icon: "clipboard-list", href: "/seeker-applications" },
];

// ═════════════════════════════════════════════════════════════════════════════
export default function SeekerProfile(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();

    // ── Core state ────────────────────────────────────────────────────────────
    const [personal, setPersonal] = useState<PersonalDetails>(INIT_PERSONAL);
    const [personalDraft, setPersonalDraft] = useState<PersonalDetails>(INIT_PERSONAL);
    const [contact, setContact] = useState<ContactInfo>(INIT_CONTACT);
    const [contactDraft, setContactDraft] = useState<ContactInfo>(INIT_CONTACT);
    const [about, setAbout] = useState(INIT_ABOUT);
    const [aboutDraft, setAboutDraft] = useState(INIT_ABOUT);
    const [skills, setSkills] = useState<string[]>(INIT_SKILLS);
    const [skillsDraft, setSkillsDraft] = useState<string[]>(INIT_SKILLS);
    const [experiences, setExperiences] = useState<ExperienceItem[]>(INIT_EXPERIENCE);
    const [education, setEducation] = useState<EducationItem[]>(INIT_EDUCATION);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [profileOpen, setProfileOpen] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [aboutModal, setAboutModal] = useState(false);
    const [skillsModal, setSkillsModal] = useState(false);
    const [expModal, setExpModal] = useState(false);
    const [eduModal, setEduModal] = useState(false);

    // ── Experience form ───────────────────────────────────────────────────────
    const [expForm, setExpForm] = useState({
        field: "", jobTitle: "", company: "", empType: "",
        currentlyWorking: false, startDate: "", endDate: "",
        location: "", description: "", skills: [] as string[],
    });
    const [expSkillInput, setExpSkillInput] = useState("");

    // ── Education form ────────────────────────────────────────────────────────
    const [eduForm, setEduForm] = useState({
        school: "", certType: "", degree: "", field: "",
        startDate: "", endDate: "", grade: "", description: "",
    });

    // ── Skills edit ───────────────────────────────────────────────────────────
    const [skillInput, setSkillInput] = useState("");
    const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
    const [showWebsiteInput, setShowWebsiteInput] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const fullName = `${personal.firstName} ${personal.lastName}`;

    const addSkillToList = (s: string, list: string[], setList: (v: string[]) => void) => {
        const trimmed = s.trim();
        if (trimmed && !list.includes(trimmed)) setList([...list, trimmed]);
    };

    const removeSkillFromList = (s: string, list: string[], setList: (v: string[]) => void) =>
        setList(list.filter(x => x !== s));

    // ── Save handlers ─────────────────────────────────────────────────────────
    const savePersonal = () => { setPersonal(personalDraft); setContactModal(false); push("Personal details saved successfully!"); };
    const saveContact = () => { setContact(contactDraft); setContactModal(false); push("Contact information saved successfully!"); };
    const saveAbout = () => { setAbout(aboutDraft); setAboutModal(false); push("About section updated successfully!"); };
    const saveSkills = () => { setSkills(skillsDraft); setSkillsModal(false); push("Skills updated successfully!"); };

    const saveExperience = (e: FormEvent) => {
        e.preventDefault();
        const newExp: ExperienceItem = {
            id: Date.now(), jobTitle: expForm.jobTitle, company: expForm.company,
            type: expForm.empType, period: `${expForm.startDate} - ${expForm.currentlyWorking ? "Present" : expForm.endDate}`,
            location: expForm.location, description: expForm.description, skills: expForm.skills,
            initials: expForm.company.slice(0, 2).toUpperCase(), color: "#3b82f6",
        };
        setExperiences(prev => [newExp, ...prev]);
        setExpModal(false);
        setExpForm({ field: "", jobTitle: "", company: "", empType: "", currentlyWorking: false, startDate: "", endDate: "", location: "", description: "", skills: [] });
        push("Experience added successfully!");
    };

    const saveEducation = (e: FormEvent) => {
        e.preventDefault();
        const newEdu: EducationItem = {
            id: Date.now(), degree: eduForm.degree, school: eduForm.school,
            period: `${eduForm.startDate} - ${eduForm.endDate}`, status: "In Progress",
            initials: eduForm.school.slice(0, 2).toUpperCase(), color: "#8b5cf6",
        };
        setEducation(prev => [newEdu, ...prev]);
        setEduModal(false);
        setEduForm({ school: "", certType: "", degree: "", field: "", startDate: "", endDate: "", grade: "", description: "" });
        push("Education added successfully!");
    };

    const addWebsite = () => {
        if (!newWebsiteUrl.trim()) return;
        setContactDraft(d => ({ ...d, websites: [...d.websites, newWebsiteUrl.trim()] }));
        setNewWebsiteUrl("");
        setShowWebsiteInput(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <style>{`
                @keyframes fadeDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideIn  { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
                @keyframes fadeUp   { from{opacity:0;transform:translateY(20px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
            `}</style>

            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link to="/seeker-home"><img src={mslLogo} alt="MSL Logo" className="h-8 w-auto" /></Link>
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="text" placeholder="Title, skill or company"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-72" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/seeker-home" className="text-blue-600 font-semibold flex items-center gap-1 text-sm">
                                <Icon name="home" /><span className="hidden md:inline">Home</span>
                            </Link>
                            <Link to="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 text-sm">
                                <Icon name="briefcase" /><span className="hidden md:inline">Jobs</span>
                            </Link>
                            <button className="relative text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1"
                                onClick={() => push("3 new notifications", "info")}>
                                <Icon name="bell" /><span className="hidden md:inline">Notifications</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
                            </button>
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setProfileOpen(v => !v)}
                                    className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">TK</div>
                                    <Icon name="chevron-down" className="text-gray-500 text-xs" />
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
                                        style={{ animation: "fadeDown .15s ease-out" }}>
                                        {[{ icon: "user", label: "Profile" }, { icon: "cog", label: "Settings" }].map(({ icon, label }) => (
                                            <button key={label} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <Icon name={icon} className="text-gray-400 w-4" />{label}
                                            </button>
                                        ))}
                                        <div className="border-t border-gray-100 my-1" />
                                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <Icon name="sign-out-alt" className="text-red-400 w-4" />Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── BODY ────────────────────────────────────────────────────── */}
            <div className="flex pt-14 min-h-screen">

                {/* ── SIDEBAR ─────────────────────────────────────────────── */}
                <aside className="hidden lg:block w-72 shrink-0 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50 p-4 border-r border-gray-200">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-end p-3">
                            <span className="text-white text-xs font-medium opacity-90">Zero-cost Degrees</span>
                        </div>
                        <div className="px-4">
                            <div className="w-16 h-16 rounded-full border-4 border-white -mt-8 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow">TK</div>
                        </div>
                        <div className="px-4 pb-4 pt-2">
                            <h2 className="text-base font-bold text-gray-900">{fullName}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{personal.bio}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Icon name="map-marker-alt" className="text-[10px]" />{personal.city}, Southern Province
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-[8px] font-black">M</div>
                                <span className="text-xs text-gray-500">Management Systems (Pvt) Ltd</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                        <nav className="space-y-1">
                            {NAV.map(({ label, icon, href, active }) => (
                                <Link key={label} to={href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                                        ${active ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`}>
                                    <Icon name={icon} className={active ? "text-blue-600" : "text-gray-400"} />{label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4 text-[10px] text-gray-400 space-y-1">
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {["About", "Accessibility", "Help Center", "Privacy & Terms"].map(l => (
                                <Link key={l} to="#" className="hover:underline">{l}</Link>
                            ))}
                        </div>
                        <p>MSL Recruitment © 2025</p>
                    </div>
                </aside>

                {/* ── MAIN ────────────────────────────────────────────────── */}
                <main className="w-full lg:ml-72 p-4 lg:p-6 space-y-5">

                    {/* ── PROFILE HEADER CARD ───────────────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-44 bg-gradient-to-r from-blue-500 to-purple-600 relative" />
                        <div className="px-6 pb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white -mt-16 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-4xl shadow-lg">TK</div>
                            <div className="mt-4">
                                <h1 className="text-2xl font-black text-gray-900">{fullName}</h1>
                                <p className="text-base text-gray-600 mt-0.5">{personal.bio}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{personal.city}, Southern Province, Sri Lanka</p>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <button onClick={() => { setContactDraft(contact); setContactModal(true); }}
                                        className="text-blue-600 hover:underline font-medium">Contact info</button>
                                    <span className="text-gray-300">•</span>
                                    <a href="https://thrishnishon.wixsite.com/info" target="_blank" rel="noreferrer"
                                        className="text-blue-600 hover:underline">thrishnishon.wixsite.com/info</a>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">146 connections</p>
                            </div>
                        </div>
                    </div>

                    {/* ── PERSONAL DETAILS ─────────────────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-xs text-gray-400 mb-4">Indicates required *</p>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Title *", type: "select", key: "title", options: ["Mr", "Miss", "Mrs", "Dr"] },
                                    { label: "First name *", type: "text", key: "firstName", placeholder: "First name" },
                                    { label: "Last name *", type: "text", key: "lastName", placeholder: "Last name" },
                                ].map(({ label, type, key, options, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                                        {type === "select" ? (
                                            <select value={personalDraft[key as keyof PersonalDetails]}
                                                onChange={e => setPersonalDraft(d => ({ ...d, [key]: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                                {options?.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        ) : (
                                            <input type="text" placeholder={placeholder}
                                                value={personalDraft[key as keyof PersonalDetails]}
                                                onChange={e => setPersonalDraft(d => ({ ...d, [key]: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional name</label>
                                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of birth *</label>
                                    <input type="date" value={personalDraft.dob}
                                        onChange={e => setPersonalDraft(d => ({ ...d, dob: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                                    <textarea rows={5} value={personalDraft.bio}
                                        onChange={e => setPersonalDraft(d => ({ ...d, bio: e.target.value }))}
                                        placeholder="Write about yourself..."
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 text-sm">Location</h4>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                                        <input type="text" value={personalDraft.city}
                                            onChange={e => setPersonalDraft(d => ({ ...d, city: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">District *</label>
                                        <select value={personalDraft.district}
                                            onChange={e => setPersonalDraft(d => ({ ...d, district: e.target.value }))}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                            <option value="">Select District</option>
                                            {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5">
                                <h4 className="font-bold text-gray-800 text-sm">Contact info</h4>
                                <p className="text-xs text-gray-500 mt-1">Add or edit your profile URL, email, and more</p>
                                <button onClick={() => { setContactDraft(contact); setContactModal(true); }}
                                    className="text-blue-600 hover:underline text-sm font-semibold mt-2">
                                    Edit contact info
                                </button>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button onClick={savePersonal}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── ABOUT ─────────────────────────────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-gray-900">About</h3>
                            <button onClick={() => { setAboutDraft(about); setAboutModal(true); }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Icon name="pencil-alt" />
                            </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{about}</p>
                    </div>

                    {/* ── EXPERIENCE ────────────────────────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-black text-gray-900">Experience</h3>
                            <button onClick={() => setExpModal(true)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Icon name="plus" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {experiences.map((exp, i) => (
                                <div key={exp.id}>
                                    {i > 0 && <div className="border-t border-gray-100 pt-6" />}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                                            style={{ background: exp.color }}>{exp.initials}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{exp.jobTitle}</h4>
                                            <p className="text-sm text-gray-600">{exp.company}</p>
                                            <p className="text-xs text-gray-400">{exp.type}</p>
                                            <p className="text-xs text-gray-400">{exp.period}</p>
                                            <p className="text-xs text-gray-400">{exp.location}</p>
                                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">{exp.description}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {exp.skills.map(s => (
                                                    <span key={s} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── EDUCATION ─────────────────────────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-black text-gray-900">Education</h3>
                            <button onClick={() => setEduModal(true)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Icon name="plus" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {education.map((edu, i) => (
                                <div key={edu.id}>
                                    {i > 0 && <div className="border-t border-gray-100 pt-6" />}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                                            style={{ background: edu.color }}>{edu.initials}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                                            <p className="text-sm text-gray-600">{edu.school}</p>
                                            <p className="text-xs text-gray-400">{edu.period}</p>
                                            <p className="text-xs text-gray-400">{edu.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── SKILLS ────────────────────────────────────────────── */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-gray-900">Skills</h3>
                            <button onClick={() => { setSkillsDraft([...skills]); setSkillsModal(true); }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Icon name="pencil-alt" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span key={s} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">{s}</span>
                            ))}
                        </div>
                    </div>

                </main>
            </div>

            {/* ── CONTACT MODAL ───────────────────────────────────────────── */}
            {contactModal && (
                <Modal onClose={() => setContactModal(false)} title="Edit contact info" wide>
                    <div className="space-y-5">
                        <InfoRow icon="link" label="Profile URL" value="linkedin.com/in/thesara-kariyawasam" />
                        <InfoRow icon="envelope" label="Email" value="thesaranimeshika@gmail.com" />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Phone number">
                                <input type="tel" placeholder="+94 77 123 4567" value={contactDraft.phone}
                                    onChange={e => setContactDraft(d => ({ ...d, phone: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </FormField>
                            <FormField label="Phone type">
                                <select value={contactDraft.phoneType} onChange={e => setContactDraft(d => ({ ...d, phoneType: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                    {["Mobile", "Home", "Work"].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[["houseNo", "House / Building No", "No. 123"], ["street", "Street Name", "Main Street"], ["city", "City", "Colombo"]].map(([key, label, ph]) => (
                                <FormField key={key} label={label}>
                                    <input type="text" placeholder={ph} value={contactDraft[key as keyof ContactInfo] as string}
                                        onChange={e => setContactDraft(d => ({ ...d, [key]: e.target.value }))}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                </FormField>
                            ))}
                            <FormField label="District">
                                <select value={contactDraft.district} onChange={e => setContactDraft(d => ({ ...d, district: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                    <option value="">Select District</option>
                                    {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </FormField>
                        </div>
                        <FormField label="Birthday">
                            <input type="date" value={contactDraft.birthday} onChange={e => setContactDraft(d => ({ ...d, birthday: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                        </FormField>

                        {/* Websites */}
                        <div className="border-t border-gray-100 pt-5">
                            <h4 className="text-sm font-bold text-gray-800 mb-3">Website</h4>
                            <div className="space-y-2 mb-3">
                                {contactDraft.websites.map((w, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl border border-gray-200 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Icon name="globe" className="text-gray-400" />
                                            <a href={w} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{w}</a>
                                        </div>
                                        <button onClick={() => setContactDraft(d => ({ ...d, websites: d.websites.filter((_, j) => j !== i) }))}
                                            className="text-gray-300 hover:text-red-400 transition-colors ml-2">
                                            <Icon name="trash-alt" className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {showWebsiteInput ? (
                                <div className="space-y-2">
                                    <input type="url" value={newWebsiteUrl} onChange={e => setNewWebsiteUrl(e.target.value)}
                                        placeholder="https://portfolio.com"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setShowWebsiteInput(false); setNewWebsiteUrl(""); }}
                                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Cancel</button>
                                        <button onClick={addWebsite}
                                            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700">Save link</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setShowWebsiteInput(true)}
                                    className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
                                    <Icon name="plus" /> Add website
                                </button>
                            )}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-100">
                            <button onClick={saveContact}
                                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95">
                                Save
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── ABOUT MODAL ─────────────────────────────────────────────── */}
            {aboutModal && (
                <Modal onClose={() => setAboutModal(false)} title="Edit about" wide>
                    <p className="text-sm text-gray-500 mb-4">Write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences.</p>
                    <textarea rows={8} value={aboutDraft} onChange={e => setAboutDraft(e.target.value)}
                        placeholder="Write about yourself..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                    <div className="flex items-center justify-between mt-2 mb-4">
                        <span className="text-xs text-gray-400">{aboutDraft.length}/2,600</span>
                    </div>
                    <div className="flex justify-end border-t border-gray-100 pt-4">
                        <button onClick={saveAbout}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95">
                            Save
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── SKILLS MODAL ─────────────────────────────────────────────── */}
            {skillsModal && (
                <Modal onClose={() => setSkillsModal(false)} title="Edit skills" wide>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Skills</h4>
                    <p className="text-xs text-gray-500 mb-4">Show your top skills — add skills you want to be known for.</p>
                    <div className="flex flex-wrap gap-2 mb-4 min-h-[44px] p-3 bg-slate-50 rounded-xl border border-gray-100">
                        {skillsDraft.map(s => (
                            <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                                {s}
                                <button onClick={() => removeSkillFromList(s, skillsDraft, setSkillsDraft)}
                                    className="text-blue-400 hover:text-blue-700 transition-colors">
                                    <Icon name="times" className="text-[10px]" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 mb-6">
                        <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { addSkillToList(skillInput, skillsDraft, setSkillsDraft); setSkillInput(""); e.preventDefault(); } }}
                            placeholder="Type skill and press Enter…"
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                        <button onClick={() => { addSkillToList(skillInput, skillsDraft, setSkillsDraft); setSkillInput(""); }}
                            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                            Add
                        </button>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                        <h5 className="text-sm font-bold text-gray-700 mb-3">Suggested based on your profile</h5>
                        <div className="flex flex-wrap gap-2">
                            {["Python", "Java", "JavaScript", "C#", "Spring Framework", "TypeScript", "Docker"].filter(s => !skillsDraft.includes(s)).map(s => (
                                <button key={s} onClick={() => addSkillToList(s, skillsDraft, setSkillsDraft)}
                                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-1.5 font-medium">
                                    {s}<Icon name="plus" className="text-[10px]" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 border-t border-gray-100 pt-4">
                        <button onClick={saveSkills}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95">
                            Save
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── ADD EXPERIENCE MODAL ─────────────────────────────────────── */}
            {expModal && (
                <Modal onClose={() => setExpModal(false)} title="Add Experience" wide
                    icon={<div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Icon name="briefcase" className="text-sm" /></div>}>
                    <form onSubmit={saveExperience} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Job Field *" value={expForm.field} onChange={v => setExpForm(f => ({ ...f, field: v }))} options={JOB_FIELDS} placeholder="Please select" />
                            <TextField label="Job Title *" value={expForm.jobTitle} onChange={v => setExpForm(f => ({ ...f, jobTitle: v }))} placeholder="Ex: Retail Sales Manager" />
                            <TextField label="Company name *" value={expForm.company} onChange={v => setExpForm(f => ({ ...f, company: v }))} placeholder="Ex: Microsoft" />
                            <SelectField label="Employment type" value={expForm.empType} onChange={v => setExpForm(f => ({ ...f, empType: v }))} options={EMP_TYPES} placeholder="Please select" />
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer bg-blue-50 p-3 rounded-xl border border-blue-100 group">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${expForm.currentlyWorking ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
                                onClick={() => setExpForm(f => ({ ...f, currentlyWorking: !f.currentlyWorking }))}>
                                {expForm.currentlyWorking && <Icon name="check" className="text-white text-[10px]" />}
                            </div>
                            <span className="text-sm font-semibold text-blue-900">I am currently working in this role</span>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MonthYearPicker value={expForm.startDate} onChange={v => setExpForm(f => ({ ...f, startDate: v }))} label="Start date *" />
                            {!expForm.currentlyWorking && (
                                <MonthYearPicker value={expForm.endDate} onChange={v => setExpForm(f => ({ ...f, endDate: v }))} label="End date *" />
                            )}
                        </div>

                        <TextField label="Location" value={expForm.location} onChange={v => setExpForm(f => ({ ...f, location: v }))} placeholder="Ex: Colombo" />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Key Responsibilities</label>
                            <textarea rows={4} value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Describe your core duties and accomplishments..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills Used</label>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {expForm.skills.map(s => (
                                    <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        {s}
                                        <button type="button" onClick={() => setExpForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))}
                                            className="text-blue-400 hover:text-blue-700">&times;</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" value={expSkillInput} onChange={e => setExpSkillInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (expSkillInput.trim()) { setExpForm(f => ({ ...f, skills: [...f.skills, expSkillInput.trim()] })); setExpSkillInput(""); } } }}
                                    placeholder="Type skill and press Enter…"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                <button type="button" onClick={() => { if (expSkillInput.trim()) { setExpForm(f => ({ ...f, skills: [...f.skills, expSkillInput.trim()] })); setExpSkillInput(""); } }}
                                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 px-3 flex items-center gap-1">
                                    <Icon name="plus" /> Add
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-gray-100">
                            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg active:scale-95">
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── ADD EDUCATION MODAL ──────────────────────────────────────── */}
            {eduModal && (
                <Modal onClose={() => setEduModal(false)} title="Add Education" wide
                    icon={<div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Icon name="graduation-cap" className="text-sm" /></div>}>
                    <form onSubmit={saveEducation} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField label="School / University *" value={eduForm.school} onChange={v => setEduForm(f => ({ ...f, school: v }))} placeholder="Ex: Boston University" />
                            <SelectField label="Certificate Type *" value={eduForm.certType} onChange={v => setEduForm(f => ({ ...f, certType: v }))} options={CERT_TYPES} placeholder="Select Type" />
                            <TextField label="Certificate name *" value={eduForm.degree} onChange={v => setEduForm(f => ({ ...f, degree: v }))} placeholder="Ex: Bachelor's in CS" />
                            <SelectField label="Field of study *" value={eduForm.field} onChange={v => setEduForm(f => ({ ...f, field: v }))} options={STUDY_FIELDS} placeholder="Select Field" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MonthYearPicker value={eduForm.startDate} onChange={v => setEduForm(f => ({ ...f, startDate: v }))} label="Start date *" />
                            <MonthYearPicker value={eduForm.endDate} onChange={v => setEduForm(f => ({ ...f, endDate: v }))} label="End date (or expected) *" />
                        </div>
                        <TextField label="Grade" value={eduForm.grade} onChange={v => setEduForm(f => ({ ...f, grade: v }))} placeholder="Ex: GPA 3.8 / Merit" />
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea rows={4} value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Describe your achievements..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onClick={() => setEduModal(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 text-sm">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg active:scale-95">
                                Save Education
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── NOTIFICATIONS ───────────────────────────────────────────── */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {notes.map(({ id, message, type }) => {
                    const cfg = {
                        info: { bg: "bg-blue-600", icon: "info-circle" },
                        success: { bg: "bg-emerald-600", icon: "check-circle" },
                        warning: { bg: "bg-amber-500", icon: "exclamation-triangle" },
                        error: { bg: "bg-red-600", icon: "exclamation-circle" },
                    }[type];
                    return (
                        <div key={id} className={`${cfg.bg} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm pointer-events-auto`}
                            style={{ animation: "slideIn .25s ease-out" }}>
                            <Icon name={cfg.icon} />
                            <span>{message}</span>
                            <button onClick={() => dismiss(id)} className="ml-2 opacity-70 hover:opacity-100"><Icon name="times" /></button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ onClose, title, children, wide, icon }: {
    onClose: () => void; title: string; children: ReactNode; wide?: boolean; icon?: ReactNode;
}): JSX.Element {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 px-4 z-50 overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} mb-8`}
                style={{ animation: "fadeUp .2s ease-out" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {icon}
                        <h3 className="text-lg font-black text-gray-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="fas fa-times" />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

// ── Small form helpers ────────────────────────────────────────────────────────
function FormField({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-gray-200">
                <i className={`fas fa-${icon} text-gray-400`} />
                <span>{value}</span>
            </div>
        </div>
    );
}

function TextField({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
        </div>
    );
}

function SelectField({ label, value, onChange, options, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                <option value="">{placeholder || "Select"}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}