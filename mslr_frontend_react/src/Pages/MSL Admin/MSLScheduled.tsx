import { useState, useEffect, useRef, type JSX, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps { name: string; className?: string; }

interface Interview {
    id: number;
    jobTitle: string;
    company: string;
    seekerName: string;
    seekerSkills: string;
    interviewDate: string;
    interviewTime: string;
    interviewType: "phone" | "video" | "in-person";
    status: "scheduled" | "requested" | "accepted" | "rescheduled";
    resumeUrl: string;
    sector: string;
    notes?: string;
}

interface AvailableJob {
    id: number;
    jobTitle: string;
    company: string;
    postedDate: string;
    applicants: number;
    sector: string;
    description: string;
    requirements: string[];
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

interface ScheduleForm {
    job: string;
    seeker: string;
    date: string;
    time: string;
    type: string;
    notes: string;
}

interface RescheduleForm {
    newDate: string;
    newTime: string;
    reason: string;
}

// ── Icon helper ───────────────────────────────────────────────────────────────
const Icon = ({ name, className = "" }: IconProps): JSX.Element => (
    <i className={`fas fa-${name} ${className}`} />
);

// ── Notification hook ─────────────────────────────────────────────────────────
function useNotifications() {
    const [notes, setNotes] = useState<Notification[]>([]);
    const push = (message: string, type: Notification["type"] = "info") => {
        const id = Date.now();
        setNotes((n) => [...n, { id, message, type }]);
        setTimeout(() => setNotes((n) => n.filter((x) => x.id !== id)), 4500);
    };
    const dismiss = (id: number) => setNotes((n) => n.filter((x) => x.id !== id));
    return { notes, push, dismiss };
}

// ── Static data ───────────────────────────────────────────────────────────────
const INITIAL_INTERVIEWS: Interview[] = [
    {
        id: 1, jobTitle: "Senior Software Engineer", company: "Hayleys PLC",
        seekerName: "John Doe", seekerSkills: "React, Node.js, MongoDB",
        interviewDate: "2024-12-20", interviewTime: "10:00",
        interviewType: "video", status: "scheduled",
        resumeUrl: "resume1.pdf", sector: "IT",
    },
    {
        id: 2, jobTitle: "Marketing Manager", company: "John Keells",
        seekerName: "Jane Smith", seekerSkills: "Digital Marketing, Brand Management",
        interviewDate: "2024-12-20", interviewTime: "14:00",
        interviewType: "in-person", status: "requested",
        resumeUrl: "resume2.pdf", sector: "Marketing",
    },
    {
        id: 3, jobTitle: "Data Analyst", company: "Ceylon Tobacco",
        seekerName: "Mike Johnson", seekerSkills: "SQL, Python, Excel",
        interviewDate: "2024-12-20", interviewTime: "16:00",
        interviewType: "phone", status: "accepted",
        resumeUrl: "resume3.pdf", sector: "IT",
    },
];

const INITIAL_AVAILABLE: AvailableJob[] = [
    {
        id: 1, jobTitle: "Financial Controller", company: "Dialog Axiata",
        postedDate: "2024-12-15", applicants: 6, sector: "Finance",
        description: "Financial Controller to oversee financial operations and reporting.",
        requirements: ["5+ years experience", "CPA/ACCA", "Financial Reporting"],
    },
    {
        id: 2, jobTitle: "HR Manager", company: "Hayleys PLC",
        postedDate: "2024-12-18", applicants: 8, sector: "HR",
        description: "Experienced HR Manager to lead our human resources team.",
        requirements: ["3+ years experience", "HR Management", "Employee Relations"],
    },
    {
        id: 3, jobTitle: "Sales Executive", company: "John Keells",
        postedDate: "2024-12-19", applicants: 12, sector: "Sales",
        description: "Dynamic Sales Executive to drive revenue growth across key markets.",
        requirements: ["2+ years experience", "Sales Skills", "Customer Relations"],
    },
];

const NAV = [
    { label: "Home", icon: "home", href: "/msl-home" },
    { label: "Seekers", icon: "users", href: "/msl-seeker" },
    { label: "Clients", icon: "building", href: "/msl-client" },
    { label: "Posted", icon: "plus-circle", href: "/msl-posted" },
    { label: "Invoice", icon: "file-invoice", href: "/msl-invoice" },
    { label: "Scheduled", icon: "calendar-alt", href: "/msl-schedule", active: true },
    { label: "Analytics", icon: "chart-bar", href: "#" },
];

const SECTORS = ["IT", "Finance", "Healthcare", "Manufacturing", "Education", "Marketing", "HR", "Sales"];

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
    scheduled: { badge: "bg-blue-100   text-blue-700   border border-blue-200", dot: "bg-blue-500" },
    requested: { badge: "bg-amber-100  text-amber-700  border border-amber-200", dot: "bg-amber-500" },
    accepted: { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    rescheduled: { badge: "bg-purple-100 text-purple-700 border border-purple-200", dot: "bg-purple-500" },
};

const TYPE_STYLES: Record<string, { badge: string; icon: string; label: string }> = {
    phone: { badge: "bg-teal-50   text-teal-700   border border-teal-200", icon: "phone", label: "Phone" },
    video: { badge: "bg-indigo-50 text-indigo-700 border border-indigo-200", icon: "video", label: "Video" },
    "in-person": { badge: "bg-rose-50   text-rose-700   border border-rose-200", icon: "user-friends", label: "In-Person" },
};

const SKILL_COLORS = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-orange-50 text-orange-700 border-orange-200",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(d: string): string {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(t: string): string {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// ── Seeker Avatar ─────────────────────────────────────────────────────────────
function SeekerAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }): JSX.Element {
    const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const hue = ((name.charCodeAt(0) + (name.charCodeAt(1) || 0)) * 37) % 360;
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
    return (
        <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
            style={{ background: `hsl(${hue},60%,52%)` }}>
            {initials}
        </div>
    );
}

function CompanyAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }): JSX.Element {
    const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const hue = (name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 31) % 360;
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
    return (
        <div className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold text-white shrink-0`}
            style={{ background: `hsl(${hue},55%,50%)` }}>
            {initials}
        </div>
    );
}

const EMPTY_SCHEDULE: ScheduleForm = { job: "", seeker: "", date: "", time: "", type: "", notes: "" };
const EMPTY_RESCHEDULE: RescheduleForm = { newDate: "", newTime: "", reason: "" };

// ═════════════════════════════════════════════════════════════════════════════
export default function MSLSchedule(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
    const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>(INITIAL_AVAILABLE);
    const [activeTab, setActiveTab] = useState<"scheduled" | "schedule">("scheduled");
    const [search, setSearch] = useState("");
    const [sectorFilter, setSectorFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [rescheduleTarget, setRescheduleTarget] = useState<Interview | null>(null);
    const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(EMPTY_SCHEDULE);
    const [rescheduleForm, setRescheduleForm] = useState<RescheduleForm>(EMPTY_RESCHEDULE);
    const [showSectorDrop, setShowSectorDrop] = useState(false);
    const [showStatusDrop, setShowStatusDrop] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const filterBarRef = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            const t = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
            if (filterBarRef.current && !filterBarRef.current.contains(t)) {
                setShowSectorDrop(false);
                setShowStatusDrop(false);
            }
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // filtered lists
    const filteredInterviews = interviews.filter((inv) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            inv.jobTitle.toLowerCase().includes(q) ||
            inv.seekerName.toLowerCase().includes(q) ||
            inv.company.toLowerCase().includes(q);
        const matchSector = !sectorFilter || inv.sector === sectorFilter;
        const matchStatus = !statusFilter || inv.status === statusFilter;
        return matchSearch && matchSector && matchStatus;
    });

    const filteredAvailable = availableJobs.filter((job) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            job.jobTitle.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.description.toLowerCase().includes(q);
        const matchSector = !sectorFilter || job.sector === sectorFilter;
        return matchSearch && matchSector;
    });

    // ── Actions ───────────────────────────────────────────────────────────────
    const handleScheduleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newInterview: Interview = {
            id: Date.now(),
            jobTitle: "New Position",
            company: "Selected Company",
            seekerName: "Selected Seeker",
            seekerSkills: "Skills to be filled",
            interviewDate: scheduleForm.date,
            interviewTime: scheduleForm.time,
            interviewType: scheduleForm.type as Interview["interviewType"],
            status: "scheduled",
            resumeUrl: "resume.pdf",
            sector: "IT",
            notes: scheduleForm.notes,
        };
        setInterviews((prev) => [newInterview, ...prev]);
        push("Interview scheduled successfully!", "success");
        setShowScheduleModal(false);
        setScheduleForm(EMPTY_SCHEDULE);
        setActiveTab("scheduled");
    };

    const handleRescheduleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!rescheduleTarget) return;
        setInterviews((prev) => prev.map((inv) =>
            inv.id === rescheduleTarget.id ? { ...inv, status: "requested" as const } : inv
        ));
        push(`Reschedule request submitted for "${rescheduleTarget.jobTitle}"`, "success");
        setRescheduleTarget(null);
        setRescheduleForm(EMPTY_RESCHEDULE);
    };

    const scheduleJobDirectly = (job: AvailableJob) => {
        setScheduleForm((f) => ({ ...f, job: `${job.jobTitle} — ${job.company}` }));
        setShowScheduleModal(true);
        push(`Scheduling interview for "${job.jobTitle}"`, "info");
    };

    const sField = (key: keyof ScheduleForm) => ({
        value: scheduleForm[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setScheduleForm((f) => ({ ...f, [key]: e.target.value })),
    });

    const rField = (key: keyof RescheduleForm) => ({
        value: rescheduleForm[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setRescheduleForm((f) => ({ ...f, [key]: e.target.value })),
    });

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <style>{`
                @keyframes fadeDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideIn  { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
                @keyframes fadeUp   { from{opacity:0;transform:translateY(20px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
                .glass-dropdown { background:rgba(255,255,255,0.97); backdrop-filter:blur(10px); }
            `}</style>

            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link to="/msl-home">
                                <img src={mslLogo} alt="MSL Logo" className="h-8 w-auto" />
                            </Link>
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input type="text" placeholder="Title, skill or company"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-72" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/msl-home" className="text-blue-600 font-semibold flex items-center gap-1 text-sm">
                                <Icon name="home" /><span className="hidden md:inline">Home</span>
                            </Link>
                            <button className="relative text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1"
                                onClick={() => push("5 new notifications", "info")}>
                                <Icon name="bell" /><span className="hidden md:inline">Notifications</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">5</span>
                            </button>
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
                                    <Icon name="chevron-down" className="text-gray-500 text-xs" />
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
                                        style={{ animation: "fadeDown .15s ease-out" }}>
                                        {[{ icon: "user", label: "Profile" }, { icon: "cog", label: "Settings" }].map(({ icon, label }) => (
                                            <button key={label} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <Icon name={icon} className="text-gray-400 w-4" /> {label}
                                            </button>
                                        ))}
                                        <div className="border-t border-gray-100 my-1" />
                                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <Icon name="sign-out-alt" className="text-red-400 w-4" /> Logout
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
                <aside className="hidden lg:block w-72 shrink-0 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-slate-50 p-4 border-r border-gray-200">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-end p-3">
                            <span className="text-white text-xs font-medium opacity-90">Admin Dashboard</span>
                        </div>
                        <div className="px-4 pb-4">
                            <div className="w-14 h-14 rounded-full border-4 border-white -mt-7 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow">M</div>
                            <h2 className="text-sm font-bold text-gray-900 mt-2 leading-tight">Management Systems (Pvt) Ltd</h2>
                            <p className="text-xs text-gray-500 italic mt-1">Empowering businesses through innovative recruitment solutions.</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Icon name="map-marker-alt" className="mr-1.5" />No.10, Gothami Road, Colombo 08
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
                                    <Icon name={icon} className={active ? "text-blue-600" : "text-gray-400"} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button onClick={() => setShowScheduleModal(true)}
                                className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium">
                                <Icon name="plus" /> Schedule New Interview
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-[10px] text-gray-400 space-y-1">
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {["About", "Help Center", "Privacy & Terms", "Advertising"].map((l) => (
                                <Link key={l} to="#" className="hover:underline">{l}</Link>
                            ))}
                        </div>
                        <p>MSL Recruitment © 2025</p>
                    </div>
                </aside>

                {/* ── MAIN ────────────────────────────────────────────────── */}
                <main className="w-full lg:ml-72 p-4 lg:p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                        {/* Page header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Interview Schedule</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Manage scheduled interviews and schedule new ones</p>
                            </div>
                            <button onClick={() => setShowScheduleModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                                <Icon name="plus" /> Schedule Interview
                            </button>
                        </div>

                        {/* ── Status summary cards ───────────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {(["scheduled", "requested", "accepted", "rescheduled"] as const).map((s) => {
                                const count = interviews.filter((i) => i.status === s).length;
                                const style = STATUS_STYLES[s];
                                return (
                                    <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
                                        className={`rounded-xl p-3 border text-left transition-all hover:shadow-md ${statusFilter === s ? style.badge + " shadow-md" : "bg-slate-50 border-gray-100"}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-gray-500 capitalize">{s}</span>
                                            <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                                        </div>
                                        <p className="text-2xl font-black text-gray-900">{count}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search + filters */}
                        <div ref={filterBarRef} className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by title, seeker or company…"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400" />
                                </div>
                                <div className="flex gap-3 flex-wrap">

                                    {/* Sector dropdown */}
                                    <div className="relative">
                                        <div onClick={() => { setShowSectorDrop(!showSectorDrop); setShowStatusDrop(false); }}
                                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white min-w-[150px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <Icon name="layer-group" className={sectorFilter ? "text-blue-500" : "text-gray-400"} />
                                                <span className={sectorFilter ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}>
                                                    {sectorFilter || "All Sectors"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showSectorDrop ? "rotate-180" : ""}`} />
                                        </div>
                                        {showSectorDrop && (
                                            <div className="absolute top-full left-0 mt-3 w-52 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 border border-gray-100 max-h-64 overflow-y-auto"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16,1,0.3,1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1">
                                                    <Icon name="layer-group" className="mr-1 text-[8px]" /> Sector
                                                </div>
                                                <div onClick={() => { setSectorFilter(""); setShowSectorDrop(false); }}
                                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
                                                    <Icon name="border-all" className="text-gray-300 text-xs" /> All Sectors
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {SECTORS.map((s) => (
                                                    <div key={s} onClick={() => { setSectorFilter(s); setShowSectorDrop(false); }}
                                                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium group/item">
                                                        <span className={`w-2 h-2 rounded-full ${sectorFilter === s ? "bg-blue-500" : "bg-gray-200"} group-hover/item:bg-blue-400`} />
                                                        {s}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status dropdown */}
                                    <div className="relative">
                                        <div onClick={() => { setShowStatusDrop(!showStatusDrop); setShowSectorDrop(false); }}
                                            className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white min-w-[150px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex items-center gap-2">
                                                {statusFilter
                                                    ? <div className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLES[statusFilter]?.dot}`} />
                                                    : <Icon name="filter" className="text-gray-400 text-xs" />}
                                                <span className={statusFilter ? "text-gray-900 font-bold capitalize" : "text-gray-500 font-medium"}>
                                                    {statusFilter || "All Status"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showStatusDrop ? "rotate-180" : ""}`} />
                                        </div>
                                        {showStatusDrop && (
                                            <div className="absolute top-full right-0 mt-3 w-52 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16,1,0.3,1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1">
                                                    <Icon name="dot-circle" className="mr-1 text-[8px]" /> Status
                                                </div>
                                                <div onClick={() => { setStatusFilter(""); setShowStatusDrop(false); }}
                                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-200" /> All Status
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {(["scheduled", "requested", "accepted", "rescheduled"] as const).map((s) => (
                                                    <div key={s} onClick={() => { setStatusFilter(s); setShowStatusDrop(false); }}
                                                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium capitalize group/item">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLES[s].dot} group-hover/item:scale-125 transition-transform`} />
                                                        {s}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {(search || sectorFilter || statusFilter) && (
                                        <button onClick={() => { setSearch(""); setSectorFilter(""); setStatusFilter(""); }}
                                            className="px-5 py-3 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:bg-red-50 transition-all font-bold hover:border-red-100 flex items-center gap-2 group shadow-sm">
                                            <Icon name="times-circle" className="text-xs group-hover:rotate-90 transition-transform" /> Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── TABS ──────────────────────────────────────────── */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex gap-1">
                                {[
                                    { key: "scheduled", label: "Today's Scheduled Interviews", icon: "calendar-check" },
                                    { key: "schedule", label: "Jobs Available for Scheduling", icon: "calendar-plus" },
                                ].map(({ key, label, icon }) => (
                                    <button key={key}
                                        onClick={() => setActiveTab(key as "scheduled" | "schedule")}
                                        className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${activeTab === key
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            }`}>
                                        <Icon name={icon} />
                                        {label}
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === key ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {key === "scheduled" ? filteredInterviews.length : filteredAvailable.length}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* ── TAB: Scheduled Interviews ──────────────────────── */}
                        {activeTab === "scheduled" && (
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-800">Today's Interviews</h3>
                                    <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                                        {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                {["Interview Details", "Seeker", "Client Company", "Time", "Status", "Actions"].map((h) => (
                                                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {filteredInterviews.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                        <Icon name="calendar-alt" className="text-3xl mb-2 block mx-auto" />
                                                        No interviews match your filters.
                                                    </td>
                                                </tr>
                                            ) : filteredInterviews.map((inv) => (
                                                <ScheduledRow
                                                    key={inv.id}
                                                    interview={inv}
                                                    onResume={() => push(`Viewing resume for ${inv.seekerName}`, "info")}
                                                    onView={() => push(`Viewing details for "${inv.jobTitle}"`, "info")}
                                                    onReschedule={() => setRescheduleTarget(inv)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── TAB: Available Jobs ────────────────────────────── */}
                        {activeTab === "schedule" && (
                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-800">Jobs Needing Interviews</h3>
                                    <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                                        {filteredAvailable.length} job{filteredAvailable.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                {["Job Details", "Client Company", "Posted Date", "Applicants", "Actions"].map((h) => (
                                                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {filteredAvailable.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                        <Icon name="briefcase" className="text-3xl mb-2 block mx-auto" />
                                                        No jobs available for scheduling.
                                                    </td>
                                                </tr>
                                            ) : filteredAvailable.map((job) => (
                                                <AvailableJobRow
                                                    key={job.id}
                                                    job={job}
                                                    onSchedule={() => scheduleJobDirectly(job)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* ── SCHEDULE INTERVIEW MODAL ─────────────────────────────────── */}
            {showScheduleModal && (
                <Modal onClose={() => setShowScheduleModal(false)} title="Schedule New Interview" wide>
                    <form onSubmit={handleScheduleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Select Job</label>
                                <select required {...sField("job")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                    <option value="">Choose a job</option>
                                    {[...INITIAL_INTERVIEWS.map(i => `${i.jobTitle} — ${i.company}`),
                                    ...INITIAL_AVAILABLE.map(j => `${j.jobTitle} — ${j.company}`)].map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Select Seeker</label>
                                <select required {...sField("seeker")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                    <option value="">Choose a seeker</option>
                                    {["John Doe — Senior Developer", "Jane Smith — Marketing Specialist", "Mike Johnson — Data Analyst"].map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Interview Date</label>
                                <input type="date" required {...sField("date")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Interview Time</label>
                                <input type="time" required {...sField("time")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Interview Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(["phone", "video", "in-person"] as const).map((t) => {
                                    const ts = TYPE_STYLES[t];
                                    return (
                                        <button key={t} type="button"
                                            onClick={() => setScheduleForm((f) => ({ ...f, type: t }))}
                                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-semibold
                                                ${scheduleForm.type === t ? `${ts.badge} border-current shadow-md` : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                            <Icon name={ts.icon} className="text-lg" />
                                            {ts.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Notes</label>
                            <textarea rows={3} {...sField("notes")} placeholder="Any additional notes for the interview…"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onClick={() => setShowScheduleModal(false)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                                SCHEDULE INTERVIEW
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ── RESCHEDULE MODAL ─────────────────────────────────────────── */}
            {rescheduleTarget && (
                <Modal onClose={() => setRescheduleTarget(null)} title="Reschedule Interview">
                    <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 mb-0.5">Rescheduling</p>
                        <p className="text-sm font-bold text-gray-900">{rescheduleTarget.jobTitle}</p>
                        <p className="text-xs text-gray-500">{rescheduleTarget.company} · {rescheduleTarget.seekerName}</p>
                    </div>
                    <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">New Date</label>
                                <input type="date" required {...rField("newDate")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">New Time</label>
                                <input type="time" required {...rField("newTime")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Reason for Reschedule</label>
                            <textarea rows={3} required {...rField("reason")} placeholder="Please provide a reason for rescheduling…"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onClick={() => setRescheduleTarget(null)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-95">
                                REQUEST RESCHEDULE
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

// ── ScheduledRow ──────────────────────────────────────────────────────────────
function ScheduledRow({ interview, onResume, onView, onReschedule }: {
    interview: Interview; onResume: () => void; onView: () => void; onReschedule: () => void;
}): JSX.Element {
    const st = STATUS_STYLES[interview.status];
    const tt = TYPE_STYLES[interview.interviewType];
    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            {/* Interview Details */}
            <td className="px-5 py-4">
                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{interview.jobTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5">{interview.seekerSkills}</p>
                <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tt.badge}`}>
                    <Icon name={tt.icon} className="text-[9px]" />{tt.label}
                </span>
            </td>

            {/* Seeker */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <SeekerAvatar name={interview.seekerName} size="sm" />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{interview.seekerName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{interview.seekerSkills}</p>
                    </div>
                </div>
            </td>

            {/* Company */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                    <CompanyAvatar name={interview.company} size="sm" />
                    <span className="text-sm font-semibold text-gray-700">{interview.company}</span>
                </div>
            </td>

            {/* Time */}
            <td className="px-5 py-4 whitespace-nowrap">
                <p className="text-sm font-bold text-gray-900">{formatTime(interview.interviewTime)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(interview.interviewDate)}</p>
            </td>

            {/* Status */}
            <td className="px-5 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold capitalize ${st.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {interview.status}
                </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex gap-1.5">
                    <button onClick={onResume} title="View Resume"
                        className="px-2.5 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-xs flex items-center gap-1 font-medium">
                        <Icon name="file-alt" className="text-[10px]" /><span className="hidden xl:inline">Resume</span>
                    </button>
                    <button onClick={onView} title="View Details"
                        className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs flex items-center gap-1 font-medium">
                        <Icon name="eye" className="text-[10px]" /><span className="hidden xl:inline">View</span>
                    </button>
                    <button onClick={onReschedule} title="Reschedule"
                        className="px-2.5 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs flex items-center gap-1 font-medium">
                        <Icon name="calendar-alt" className="text-[10px]" /><span className="hidden xl:inline">Reschedule</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── AvailableJobRow ───────────────────────────────────────────────────────────
function AvailableJobRow({ job, onSchedule }: { job: AvailableJob; onSchedule: () => void }): JSX.Element {
    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-5 py-4 max-w-xs">
                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{job.jobTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{job.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {job.requirements.slice(0, 3).map((r, i) => (
                        <span key={r} className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>{r}</span>
                    ))}
                </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <CompanyAvatar name={job.company} size="sm" />
                    <span className="text-sm font-semibold text-gray-700">{job.company}</span>
                </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Icon name="calendar" className="text-slate-400 text-xs" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{formatDate(job.postedDate)}</span>
                </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon name="users" className="text-blue-400 text-xs" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{job.applicants}</p>
                        <p className="text-[10px] text-gray-400">applicants</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-4 whitespace-nowrap">
                <button onClick={onSchedule}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold flex items-center gap-1.5">
                    <Icon name="calendar-plus" /> Schedule
                </button>
            </td>
        </tr>
    );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ onClose, title, children, wide }: {
    onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}): JSX.Element {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 px-4 z-50 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} mb-8`}
                style={{ animation: "fadeUp .2s ease-out" }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Icon name="times" />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}