import { useState, useEffect, useRef, type JSX } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ──────────────────────────────────────────────────────────────
interface IconProps {
    name: string;
    className?: string;
}

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    posted: string;
    status: string;
    desc: string;
}

interface Stat {
    label: string;
    value: string;
    change: string;
    up: boolean;
    icon: string;
    color: "blue" | "green" | "purple" | "orange";
}

interface ActivityItem {
    icon: string;
    color: "blue" | "green" | "purple" | "orange";
    title: string;
    sub: string;
    time: string;
}

interface NavItem {
    label: string;
    icon: string;
    href: string;
    section?: string;
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "error" | "warning";
}

interface CalendarCell {
    day: number;
    other: boolean;
}

// ── tiny icon helpers (Font Awesome classes via CDN) ──────────────────────────
const Icon = ({ name, className = "" }: IconProps): JSX.Element => (
    <i className={`fas fa-${name} ${className}`} />
);

// ── notification hook ─────────────────────────────────────────────────────────
function useNotifications() {
    const [notes, setNotes] = useState<Notification[]>([]);
    const push = (message: string, type: Notification["type"] = "info") => {
        const id = Date.now();
        setNotes((n) => [...n, { id, message, type }]);
        setTimeout(() => setNotes((n) => n.filter((x) => x.id !== id)), 5000);
    };
    const dismiss = (id: number) => setNotes((n) => n.filter((x) => x.id !== id));
    return { notes, push, dismiss };
}

// ── calendar helpers ──────────────────────────────────────────────────────────
function buildCalendar(year: number, month: number): CalendarCell[] {
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const prev = new Date(year, month, 0).getDate();
    const cells: CalendarCell[] = [];
    for (let i = first - 1; i >= 0; i--)
        cells.push({ day: prev - i, other: true });
    for (let d = 1; d <= days; d++) cells.push({ day: d, other: false });
    while (cells.length % 7 !== 0) cells.push({ day: cells.length - (days + (first > 0 ? first : 0)) + 1, other: true });
    return cells;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ── sample data ───────────────────────────────────────────────────────────────
const INITIAL_JOBS: Job[] = [
    { id: 1, title: "Senior Software Engineer", company: "Hayleys PLC", location: "Colombo", posted: "2 days ago", status: "Active", desc: "Looking for an experienced software engineer with 5+ years in full-stack development…" },
    { id: 2, title: "Frontend Developer", company: "Dialog Axiata", location: "Colombo", posted: "5 days ago", status: "Active", desc: "Seeking a talented frontend developer proficient in React, Vue.js, and modern CSS frameworks…" },
    { id: 3, title: "Data Analyst", company: "John Keells Holdings", location: "Colombo", posted: "1 week ago", status: "Pending", desc: "Looking for a data analyst with experience in Python, SQL, and data visualisation tools…" },
];

const STATS: Stat[] = [
    { label: "Total Clients", value: "128", change: "+12%", up: true, icon: "building", color: "blue" },
    { label: "Active Jobs", value: "45", change: "+8%", up: true, icon: "briefcase", color: "green" },
    { label: "Job Seekers", value: "1,234", change: "+15%", up: true, icon: "users", color: "purple" },
    { label: "Interviews Scheduled", value: "23", change: "-3%", up: false, icon: "calendar-check", color: "orange" },
];

const ACTIVITY: ActivityItem[] = [
    { icon: "user-plus", color: "blue", title: "New client registered", sub: "Dialog Axiata PLC joined the platform", time: "2 hours ago" },
    { icon: "briefcase", color: "green", title: "Job posted", sub: "Senior Software Engineer at Hayleys PLC", time: "5 hours ago" },
    { icon: "check-circle", color: "purple", title: "Interview completed", sub: "Frontend Developer position at Dialog", time: "1 day ago" },
];

const NAV: NavItem[] = [
    { label: "Home", icon: "home", href: "/msl-home", section: "home" },
    { label: "Seekers", icon: "users", href: "/msl-seeker" },
    { label: "Clients", icon: "building", href: "/msl-client" },
    { label: "Posted", icon: "briefcase", href: "/msl-posted" },
    { label: "Invoice", icon: "file-invoice", href: "/msl-invoice" },
    { label: "Scheduled", icon: "calendar", href: "/msl-schedule" },
    { label: "Analytics", icon: "chart-bar", href: "#", section: "analytics" },
];

const COLOR_MAP: Record<string, { bg: string; text: string; light: string }> = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", light: "bg-blue-50" },
    green: { bg: "bg-green-100", text: "text-green-600", light: "bg-green-50" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", light: "bg-purple-50" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", light: "bg-orange-50" },
};

// ══════════════════════════════════════════════════════════════════════════════
export default function MSLHome(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [profileOpen, setProfileOpen] = useState(false);
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const profileRef = useRef<HTMLDivElement>(null);

    // close profile dropdown on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // keyboard shortcuts
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "n") { e.preventDefault(); push("Opening new job form…", "info"); }
            if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); push("Saving changes…", "info"); }
            if (e.key === "Escape") setProfileOpen(false);
        };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [push]); // push is stable from hook but good to include

    const deleteJob = (id: number, title: string) => {
        if (window.confirm(`Delete "${title}"?`)) {
            setJobs((j) => j.filter((x) => x.id !== id));
            push(`"${title}" deleted`, "success");
        }
    };

    const cells = buildCalendar(calYear, calMonth);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Font Awesome */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">

                        {/* Logo + Search */}
                        <div className="flex items-center gap-4">
                            <Link to="/msl-home" className="flex items-center gap-2">
                                <img src={mslLogo} alt="MSL Logo" className="h-8 w-auto" />
                            </Link>
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Title, skill or company"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-72"
                                />
                            </div>
                        </div>

                        {/* Right nav */}
                        <div className="flex items-center gap-2 md:gap-5">
                            <Link to="/msl-home" className="text-blue-600 font-semibold flex items-center gap-1 text-sm">
                                <Icon name="home" /> <span className="hidden md:inline">Home</span>
                            </Link>
                            <button className="relative text-gray-600 hover:text-blue-600 flex items-center gap-1 text-sm" onClick={() => push("5 new notifications", "info")}>
                                <Icon name="bell" />
                                <span className="hidden md:inline">Notifications</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">5</span>
                            </button>

                            {/* Profile */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
                                    <Icon name="chevron-down" className="text-gray-500 text-xs" />
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in">
                                        {[
                                            { icon: "user", label: "Profile" },
                                            { icon: "cog", label: "Settings" },
                                        ].map(({ icon, label }) => (
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

            {/* ── BODY ───────────────────────────────────────────────────────── */}
            <div className="flex pt-14 min-h-screen">

                {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
                <aside className="hidden lg:block w-80 shrink-0 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50 p-4 border-r border-gray-200">

                    {/* Profile card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-end p-3">
                            <span className="text-white text-xs font-medium opacity-90">Admin Dashboard</span>
                        </div>
                        <div className="px-4 pb-4">
                            <div className="w-14 h-14 rounded-full border-4 border-white -mt-7 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow">
                                M
                            </div>
                            <h2 className="text-base font-bold text-gray-900 mt-2 leading-tight">Management Systems (Pvt) Ltd</h2>
                            <p className="text-xs text-gray-500 italic mt-1">Empowering businesses through innovative recruitment solutions.</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Icon name="map-marker-alt" className="mr-1.5 text-xs" />
                                No.10, Gothami Road, Colombo 08
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 text-sm">Calendar</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="text-gray-500 hover:text-blue-600 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100">
                                    <Icon name="chevron-left" className="text-xs" />
                                </button>
                                <span className="text-xs font-medium text-gray-700 w-28 text-center">{MONTH_NAMES[calMonth]} {calYear}</span>
                                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="text-gray-500 hover:text-blue-600 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100">
                                    <Icon name="chevron-right" className="text-xs" />
                                </button>
                            </div>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 mb-1">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-0.5">
                            {cells.map((c, i) => {
                                const isToday = !c.other && c.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                                const isSelected = selectedDay === c.day && !c.other;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { if (!c.other) { setSelectedDay(c.day); push(`Selected ${MONTH_NAMES[calMonth]} ${c.day}`, "info"); } }}
                                        className={`text-center text-xs py-1.5 rounded-md transition-colors
                    ${c.other ? "text-gray-300 cursor-default" : "text-gray-700 hover:bg-blue-50 cursor-pointer"}
                    ${isToday ? "bg-blue-600 text-white font-bold hover:bg-blue-700" : ""}
                    ${isSelected && !isToday ? "bg-blue-100 text-blue-700 font-semibold" : ""}
                  `}
                                    >
                                        {c.day}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Today's events */}
                        <div className="border-t border-gray-100 pt-3 mt-3">
                            <h4 className="text-xs font-semibold text-gray-800 mb-2">Today's Events</h4>
                            <div className="space-y-1.5">
                                {[
                                    { color: "blue", title: "Senior Developer Interview", time: "10:00 AM", client: "Hayleys PLC" },
                                    { color: "green", title: "Client Meeting", time: "2:00 PM", client: "Dialog" },
                                    { color: "orange", title: "Job Posting Review", time: "4:00 PM", client: "Internal" },
                                ].map((ev) => {
                                    const colorCfg = COLOR_MAP[ev.color];
                                    return (
                                        <div key={ev.title} className={`flex items-center gap-2 p-2 rounded-lg ${colorCfg.light}`}>
                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorCfg.bg.replace("100", "500")}`} style={{ background: ev.color === "blue" ? "#3b82f6" : ev.color === "green" ? "#22c55e" : "#f97316" }} />
                                            <div>
                                                <p className="text-xs font-medium text-gray-800 leading-tight">{ev.title}</p>
                                                <p className="text-[10px] text-gray-500">{ev.time} · {ev.client}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Quick nav */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                        <nav className="space-y-1">
                            {NAV.map(({ label, icon, href }) => (
                                <Link
                                    key={label}
                                    to={href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${label === "Home"
                                            ? "text-blue-600 bg-blue-50 font-medium"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`}
                                >
                                    <Icon name={icon} className={label === "Home" ? "text-blue-600" : "text-gray-400"} />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-[10px] text-gray-400 space-y-1.5">
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {["About", "Help Center", "Privacy & Terms", "Advertising"].map(l => (
                                <a key={l} href="#" className="hover:underline">{l}</a>
                            ))}
                        </div>
                        <p>MSL Recruitment © 2025</p>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
                <main className="w-full lg:ml-80 p-4 lg:p-6">

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        {STATS.map(({ label, value, change, up, icon, color }) => (
                            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                                        <p className="text-2xl font-black text-gray-900 mt-1 leading-none">{value}</p>
                                        <p className={`text-xs mt-1.5 font-medium ${up ? "text-green-600" : "text-red-500"}`}>
                                            <Icon name={up ? "arrow-up" : "arrow-down"} className="mr-0.5" /> {change} from last month
                                        </p>
                                    </div>
                                    <div className={`${COLOR_MAP[color].bg} rounded-xl p-3`}>
                                        <Icon name={icon} className={`${COLOR_MAP[color].text} text-xl`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent activity + Quick actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                        {/* Recent activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                                <button onClick={() => push("Loading all activity…", "info")} className="text-sm text-blue-600 hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {ACTIVITY.map(({ icon, color, title, sub, time }) => (
                                    <div key={title} className="flex items-start gap-3">
                                        <div className={`${COLOR_MAP[color].bg} rounded-full p-2 shrink-0`}>
                                            <Icon name={icon} className={COLOR_MAP[color].text} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{title}</p>
                                            <p className="text-xs text-gray-500">{sub}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick action tiles */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { href: "/msl-client", icon: "building", color: "blue", label: "Manage Clients" },
                                    { href: "/msl-posted", icon: "briefcase", color: "green", label: "Post Job" },
                                    { href: "/msl-schedule", icon: "calendar", color: "purple", label: "Schedule" },
                                    { href: "/msl-invoice", icon: "file-invoice", color: "orange", label: "Invoices" },
                                ].map(({ href, icon, color, label }) => {
                                    const colorCfg = COLOR_MAP[color];
                                    return (
                                        <Link
                                            key={label}
                                            to={href as string}
                                            className={`flex flex-col items-center justify-center p-5 border border-gray-200 rounded-xl
                    hover:${colorCfg.light} hover:border-${color}-300 transition-all group`}
                                        >
                                            <Icon name={icon} className={`text-2xl ${colorCfg.text} mb-2 group-hover:scale-110 transition-transform`} />
                                            <span className="text-sm font-medium text-gray-700">{label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Job listings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Manage and monitor active job listings</p>
                            </div>
                            <button
                                onClick={() => push("Opening new job form…", "info")}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                            >
                                <Icon name="plus" /> Post New Job
                            </button>
                        </div>

                        <div className="space-y-3">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onEdit={() => push(`Opening edit form for ${job.title}`, "info")}
                                    onDelete={() => deleteJob(job.id, job.title)}
                                    onView={() => push(`Opening details for ${job.title}`, "info")}
                                />
                            ))}
                            {jobs.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    <Icon name="briefcase" className="text-4xl mb-3" />
                                    <p className="text-sm">No job postings yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* ── NOTIFICATIONS ──────────────────────────────────────────────── */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {notes.map(({ id, message, type }) => {
                    const cfg = {
                        info: { bg: "bg-blue-600", icon: "info-circle" },
                        success: { bg: "bg-green-600", icon: "check-circle" },
                        error: { bg: "bg-red-600", icon: "exclamation-circle" },
                        warning: { bg: "bg-yellow-500", icon: "exclamation-triangle" },
                    }[type];
                    return (
                        <div key={id} className={`${cfg.bg} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm pointer-events-auto animate-slide-in`}>
                            <Icon name={cfg.icon} />
                            <span>{message}</span>
                            <button onClick={() => dismiss(id)} className="ml-2 opacity-80 hover:opacity-100">
                                <Icon name="times" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* inline animation keyframes */}
            <style>{`
      @keyframes slideIn { from { transform: translateX(120%); opacity:0; } to { transform: translateX(0); opacity:1; } }
      .animate-slide-in { animation: slideIn .25s ease-out; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      .animate-fade-in { animation: fadeIn .15s ease-out; }
    `}</style>
        </div>
    );
}

// ── Job Card subcomponent ─────────────────────────────────────────────────────
interface JobCardProps {
    job: Job;
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}

function JobCard({ job, onEdit, onDelete, onView }: JobCardProps): JSX.Element {
    const isActive = job.status === "Active";
    return (
        <div
            onClick={onView}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {job.status}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Icon name="building" />{job.company}</span>
                    <span className="flex items-center gap-1"><Icon name="map-marker-alt" />{job.location}</span>
                    <span className="flex items-center gap-1"><Icon name="clock" />Posted {job.posted}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{job.desc}</p>
            </div>
            <div className="flex items-center gap-1 mt-3 sm:mt-0 sm:ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={onEdit} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Icon name="edit" />
                </button>
                <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Icon name="trash" />
                </button>
            </div>
        </div>
    );
}
