import { useState, useRef, useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps { name: string; className?: string; }

type StepStatus = "complete" | "active" | "pending" | "scheduled" | "not-started";

interface ProgressStep {
    label: string;
    description: string;
    status: StepStatus;
    detail?: string;
}

interface Application {
    id: number;
    jobTitle: string;
    company: string;
    location: string;
    appliedOn: string;
    overallStatus: "under-review" | "interview" | "completed" | "rejected";
    steps: ProgressStep[];
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
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
        setNotes(n => [...n, { id, message, type }]);
        setTimeout(() => setNotes(n => n.filter(x => x.id !== id)), 4500);
    };
    const dismiss = (id: number) => setNotes(n => n.filter(x => x.id !== id));
    return { notes, push, dismiss };
}

// ── Static data ───────────────────────────────────────────────────────────────
const INITIAL_APPLICATIONS: Application[] = [
    {
        id: 1,
        jobTitle: "Senior Software Engineer - React",
        company: "Hayleys PLC",
        location: "Colombo, Western Province",
        appliedOn: "Dec 15, 2024",
        overallStatus: "under-review",
        steps: [
            { label: "Open to seekers", description: "Job posted and accepting applications", status: "complete" },
            { label: "Under Review", description: "Application being reviewed by HR team", status: "active", detail: "Currently being evaluated" },
            { label: "1st Interview Scheduled", description: "Date and time to be confirmed", status: "not-started" },
            { label: "2nd Interview Scheduled", description: "Date and time to be confirmed", status: "not-started" },
        ],
    },
    {
        id: 2,
        jobTitle: "Financial Analyst",
        company: "Dialog Axiata",
        location: "Colombo, Western Province",
        appliedOn: "Dec 12, 2024",
        overallStatus: "interview",
        steps: [
            { label: "Open to seekers", description: "Job posted and accepting applications", status: "complete" },
            { label: "Under Review", description: "Application reviewed and approved", status: "complete" },
            { label: "1st Interview Scheduled", description: "Dec 20, 2024 at 10:00 AM (Virtual)", status: "scheduled", detail: "Virtual interview via Zoom" },
            { label: "2nd Interview Scheduled", description: "Date and time to be confirmed", status: "not-started" },
        ],
    },
    {
        id: 3,
        jobTitle: "UX/UI Designer",
        company: "WSO2",
        location: "Colombo, Western Province",
        appliedOn: "Dec 10, 2024",
        overallStatus: "completed",
        steps: [
            { label: "Open to seekers", description: "Job posted and accepting applications", status: "complete" },
            { label: "Under Review", description: "Application reviewed and approved", status: "complete" },
            { label: "1st Interview Scheduled", description: "Dec 18, 2024 at 2:00 PM (On-site)", status: "complete" },
            { label: "2nd Interview Scheduled", description: "Dec 22, 2024 at 11:00 AM (Virtual)", status: "complete" },
        ],
    },
];

const NAV = [
    { label: "Home", icon: "home", href: "/seeker-home" },
    { label: "Documents", icon: "file-alt", href: "/seeker-documents" },
    { label: "Profile", icon: "user", href: "/seeker-profile" },
    { label: "My Applications", icon: "clipboard-list", href: "/seeker-applications", active: true },
];

// ── Status config ─────────────────────────────────────────────────────────────
const OVERALL_STATUS_STYLES: Record<string, { badge: string; label: string }> = {
    "under-review": { badge: "bg-amber-100 text-amber-700", label: "Under Review" },
    "interview": { badge: "bg-blue-100  text-blue-700", label: "1st Interview" },
    "completed": { badge: "bg-emerald-100 text-emerald-700", label: "Completed" },
    "rejected": { badge: "bg-red-100   text-red-700", label: "Rejected" },
};

const STEP_CONFIG: Record<StepStatus, {
    bg: string; icon: string; iconColor: string;
    badge: string; badgeText: string; lineColor: string;
}> = {
    complete: { bg: "bg-emerald-500", icon: "check", iconColor: "text-white", badge: "bg-emerald-100 text-emerald-700", badgeText: "Complete", lineColor: "bg-emerald-400" },
    active: { bg: "bg-amber-500", icon: "clock", iconColor: "text-white", badge: "bg-amber-100   text-amber-700", badgeText: "In Progress", lineColor: "bg-gray-200" },
    scheduled: { bg: "bg-blue-500", icon: "calendar", iconColor: "text-white", badge: "bg-blue-100    text-blue-700", badgeText: "Scheduled", lineColor: "bg-gray-200" },
    pending: { bg: "bg-orange-400", icon: "hourglass-half", iconColor: "text-white", badge: "bg-orange-100 text-orange-700", badgeText: "Pending", lineColor: "bg-gray-200" },
    "not-started": { bg: "bg-gray-200", icon: "minus", iconColor: "text-gray-400", badge: "bg-gray-100 text-gray-500", badgeText: "Not Started", lineColor: "bg-gray-200" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function generateAppId(): string {
    return "APP-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// ═════════════════════════════════════════════════════════════════════════════
export default function SeekerMyApplication(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [applications] = useState<Application[]>(INITIAL_APPLICATIONS);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const profileRef = useRef<HTMLDivElement>(null);

    // close profile on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // filter
    const filtered = applications.filter(a => {
        const q = searchQuery.toLowerCase();
        return !q || a.jobTitle.toLowerCase().includes(q) || a.company.toLowerCase().includes(q);
    });

    const toggleExpand = (id: number) => {
        const isOpening = expanded !== id;
        setExpanded(isOpening ? id : null);
        if (isOpening) {
            const app = applications.find(a => a.id === id);
            if (app) push(`Viewing details for "${app.jobTitle}"`, "info");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <style>{`
                @keyframes fadeDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideIn  { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
                @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes stepIn   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
                .step-enter { animation: stepIn .25s ease-out both; }
            `}</style>

            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link to="/seeker-home">
                                <img src={mslLogo} alt="MSL Logo" className="h-8 w-auto" />
                            </Link>
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Title, skill or company"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-72"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/seeker-home" className="text-blue-600 font-semibold flex items-center gap-1 text-sm">
                                <Icon name="home" /><span className="hidden md:inline">Home</span>
                            </Link>
                            <Link to="#" className="text-gray-600 hover:text-blue-600 flex items-center gap-1 text-sm">
                                <Icon name="briefcase" /><span className="hidden md:inline">Jobs</span>
                            </Link>
                            <button
                                className="relative text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1"
                                onClick={() => push("3 new notifications", "info")}
                            >
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
                                            <button key={label} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <Icon name={icon} className="text-gray-400 w-4" />{label}
                                            </button>
                                        ))}
                                        <div className="border-t border-gray-100 my-1" />
                                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                    {/* Profile card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-end p-3">
                            <span className="text-white text-xs font-medium opacity-90">Zero-cost Degrees</span>
                        </div>
                        <div className="px-4">
                            <div className="w-16 h-16 rounded-full border-4 border-white -mt-8 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow">TK</div>
                        </div>
                        <div className="px-4 pb-4 pt-2">
                            <h2 className="text-base font-bold text-gray-900">Thesara Kariyawasam</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Software Engineer at Cardiff Metropolitan University</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Icon name="map-marker-alt" className="text-[10px]" />Matara, Southern Province
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-[8px] font-black">M</div>
                                <span className="text-xs text-gray-500">Management Systems (Pvt) Ltd</span>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
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
                <main className="w-full lg:ml-72 p-4 lg:p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                        {/* Page header */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Icon name="clipboard-list" className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Applications</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Track the progress of your job applications through the recruitment process.</p>
                            </div>
                        </div>

                        {/* ── Summary stats ─────────────────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                            {[
                                { label: "Total", count: applications.length, icon: "clipboard-list", bg: "bg-blue-50", text: "text-blue-600" },
                                { label: "Under Review", count: applications.filter(a => a.overallStatus === "under-review").length, icon: "clock", bg: "bg-amber-50", text: "text-amber-600" },
                                { label: "Interviewing", count: applications.filter(a => a.overallStatus === "interview").length, icon: "calendar-check", bg: "bg-indigo-50", text: "text-indigo-600" },
                                { label: "Completed", count: applications.filter(a => a.overallStatus === "completed").length, icon: "check-circle", bg: "bg-emerald-50", text: "text-emerald-600" },
                            ].map(({ label, count, icon, bg, text }) => (
                                <div key={label} className={`${bg} rounded-xl p-4 border border-transparent`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-500">{label}</span>
                                        <Icon name={icon} className={`${text} text-sm`} />
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">{count}</p>
                                </div>
                            ))}
                        </div>

                        {/* Search within applications */}
                        {searchQuery && (
                            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                                <Icon name="search" className="text-xs" />
                                Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "<span className="font-semibold text-gray-700">{searchQuery}</span>"
                                <button onClick={() => setSearchQuery("")} className="ml-1 text-blue-600 hover:text-blue-700 font-medium">Clear</button>
                            </div>
                        )}

                        {/* ── Application cards ──────────────────────────────── */}
                        <div className="space-y-4">
                            {filtered.length === 0 ? (
                                <div className="text-center py-14 text-gray-400">
                                    <Icon name="clipboard-list" className="text-4xl mb-3 block mx-auto" />
                                    <p className="text-sm">No applications match your search.</p>
                                </div>
                            ) : filtered.map((app, appIdx) => (
                                <ApplicationCard
                                    key={app.id}
                                    app={app}
                                    isExpanded={expanded === app.id}
                                    onToggle={() => toggleExpand(app.id)}
                                    onView={() => push(`Opening details for "${app.jobTitle}"`, "info")}
                                    onWithdraw={() => push(`Withdraw request sent for "${app.jobTitle}"`, "warning")}
                                    animDelay={appIdx * 80}
                                />
                            ))}
                        </div>

                    </div>
                </main>
            </div>

            {/* ── FOOTER ──────────────────────────────────────────────────── */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
                    © 2025 MSL Recruitment. All rights reserved.
                </div>
            </footer>

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
                            <button onClick={() => dismiss(id)} className="ml-2 opacity-70 hover:opacity-100">
                                <Icon name="times" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── ApplicationCard ───────────────────────────────────────────────────────────
function ApplicationCard({ app, isExpanded, onToggle, onView, onWithdraw, animDelay }: {
    app: Application;
    isExpanded: boolean;
    onToggle: () => void;
    onView: () => void;
    onWithdraw: () => void;
    animDelay: number;
}): JSX.Element {
    const overallCfg = OVERALL_STATUS_STYLES[app.overallStatus];
    const completedSteps = app.steps.filter(s => s.status === "complete").length;
    const progress = Math.round((completedSteps / app.steps.length) * 100);

    return (
        <div
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-blue-200 transition-all"
            style={{ animation: `fadeUp .4s ease-out ${animDelay}ms both` }}
        >
            {/* Card header — always visible */}
            <div className="p-5 cursor-pointer" onClick={onToggle}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                            {/* Company initials */}
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                                style={{ background: `hsl(${(app.company.charCodeAt(0) * 31) % 360},55%,50%)` }}>
                                {app.company.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-blue-600 leading-tight truncate">{app.jobTitle}</h3>
                                <p className="text-sm text-gray-600 mt-0.5">{app.company} · {app.location}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Applied on {app.appliedOn}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${overallCfg.badge}`}>
                            {overallCfg.label}
                        </span>
                        <button className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50">
                            <Icon name={isExpanded ? "chevron-up" : "chevron-down"} className="text-xs" />
                        </button>
                    </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-gray-400 font-medium">{completedSteps}/{app.steps.length} stages complete</span>
                        <span className="text-[10px] font-bold text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Expanded detail section */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-slate-50/50 px-5 py-5"
                    style={{ animation: "fadeUp .2s ease-out" }}>

                    {/* Progress tree */}
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Application Progress</h4>
                    <div className="relative pl-3">
                        {app.steps.map((step, i) => {
                            const cfg = STEP_CONFIG[step.status];
                            const isLast = i === app.steps.length - 1;
                            return (
                                <div key={step.label} className={`flex items-start gap-4 relative step-enter`}
                                    style={{ animationDelay: `${i * 60}ms` }}>
                                    {/* Vertical connector line */}
                                    {!isLast && (
                                        <div className={`absolute left-[11px] top-7 w-0.5 h-8 ${cfg.lineColor} transition-colors`} />
                                    )}
                                    {/* Step dot */}
                                    <div className={`w-6 h-6 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 shadow-sm z-10`}>
                                        <Icon name={cfg.icon} className={`${cfg.iconColor} text-[10px]`} />
                                    </div>
                                    {/* Step text */}
                                    <div className={`flex-1 flex items-start justify-between pb-8 ${isLast ? "pb-2" : ""}`}>
                                        <div>
                                            <p className={`text-sm font-bold leading-tight ${step.status === "not-started" ? "text-gray-400" : "text-gray-900"}`}>
                                                {step.label}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${step.status === "not-started" ? "text-gray-400" : "text-gray-500"}`}>
                                                {step.description}
                                            </p>
                                            {step.detail && (
                                                <p className="text-xs text-blue-600 font-medium mt-1">{step.detail}</p>
                                            )}
                                        </div>
                                        <span className={`ml-3 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${cfg.badge}`}>
                                            {cfg.badgeText}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Application detail card */}
                    <div className="mt-2 bg-white rounded-xl border border-gray-200 p-4">
                        <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Application Details</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: "briefcase", label: "Job Type", value: "Full-time" },
                                { icon: "map-marker-alt", label: "Location", value: app.location },
                                { icon: "wifi", label: "Work Mode", value: "Hybrid" },
                                { icon: "hashtag", label: "App ID", value: generateAppId() },
                            ].map(({ icon, label, value }) => (
                                <div key={label} className="bg-slate-50 rounded-xl p-3 border border-gray-100">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1 flex items-center gap-1">
                                        <Icon name={icon} className="text-[8px]" />{label}
                                    </p>
                                    <p className="text-xs font-bold text-gray-800">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                        <button onClick={onView}
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
                            <Icon name="eye" /> View Job Details
                        </button>
                        {app.overallStatus !== "completed" && (
                            <button onClick={onWithdraw}
                                className="px-4 py-2 border border-gray-300 text-gray-600 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center gap-1.5">
                                <Icon name="times-circle" /> Withdraw Application
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}