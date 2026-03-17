import { useState, useEffect, useRef, type JSX } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps { name: string; className?: string; }

interface JobCard {
    id: number;
    title: string;
    location: string;
    type: "On-site" | "Remote" | "Hybrid";
    postedAgo: string;
    viewed?: boolean;
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
        setNotes((n) => [...n, { id, message, type }]);
        setTimeout(() => setNotes((n) => n.filter((x) => x.id !== id)), 4500);
    };
    const dismiss = (id: number) => setNotes((n) => n.filter((x) => x.id !== id));
    return { notes, push, dismiss };
}

// ── Static data ───────────────────────────────────────────────────────────────
const INITIAL_JOBS: JobCard[] = [
    { id: 1, title: "Software Engineer - React", location: "Colombo, Western Province, Sri Lanka", type: "On-site", postedAgo: "Viewed", viewed: true },
    { id: 2, title: "Full Stack Web Developer", location: "Colombo, Western Province, Sri Lanka", type: "On-site", postedAgo: "2 weeks ago" },
    { id: 3, title: "Associate Software Engineer", location: "Colombo, Western Province, Sri Lanka", type: "Hybrid", postedAgo: "1 month ago" },
    { id: 4, title: "Mobile Application Developer", location: "Matara, Southern Province, Sri Lanka", type: "Remote", postedAgo: "3 days ago" },
];

const SUGGESTED_SEARCHES = [
    "Junior Software Engineer",
    "Junior Developer",
    "Software Engineer",
    "Associate Software Engineer",
    "Full Stack Engineer",
    "Mobile Application Developer",
    "Software Engineer Team Lead",
];

const NAV = [
    { label: "Home", icon: "home", href: "/seeker-home", active: true },
    { label: "Documents", icon: "file-alt", href: "/seeker-documents" },
    { label: "Profile", icon: "user", href: "/seeker-profile" },
    { label: "My Applications", icon: "clipboard-list", href: "/seeker-applications" },
];

const TYPE_STYLES: Record<string, string> = {
    "On-site": "bg-blue-50 text-blue-700 border-blue-200",
    "Remote": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Hybrid": "bg-purple-50 text-purple-700 border-purple-200",
};

// ═════════════════════════════════════════════════════════════════════════════
export default function SeekerHome(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [jobs, setJobs] = useState<JobCard[]>(INITIAL_JOBS);
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

    const dismissJob = (id: number) => setJobs((prev) => prev.filter((j) => j.id !== id));

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        push(`Searching for "${term}"…`, "info");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <style>{`
                @keyframes fadeDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideIn  { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
                @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .card-enter { animation: fadeUp .3s ease-out; }
            `}</style>

            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">

                        {/* Logo + Search */}
                        <div className="flex items-center gap-4">
                            <Link to="/seeker-home">
                                <img src={mslLogo} alt="MSL Logo" className="h-8 w-auto" />
                            </Link>
                            <div className="relative group">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && searchQuery && handleSearch(searchQuery)}
                                    placeholder="Title, skill or company"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-72"
                                />
                            </div>
                        </div>

                        {/* Right nav */}
                        <div className="flex items-center gap-2 md:gap-5">
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

                            {/* Profile dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">TK</div>
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
                <aside className="hidden lg:block w-72 shrink-0 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50 p-4 border-r border-gray-200">

                    {/* User Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
                        {/* Banner */}
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-end p-3">
                            <span className="text-white text-xs font-medium opacity-90">Zero-cost Degrees</span>
                        </div>

                        {/* Avatar */}
                        <div className="px-4">
                            <div className="w-16 h-16 rounded-full border-4 border-white -mt-8 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow">
                                TK
                            </div>
                        </div>

                        {/* Info */}
                        <div className="px-4 pb-4 pt-2">
                            <h2 className="text-base font-bold text-gray-900 leading-tight">Thesara Kariyawasam</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Software Engineer at Cardiff Metropolitan University</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Icon name="map-marker-alt" className="text-[10px]" />
                                Matara, Southern Province
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-[8px] font-black">M</div>
                                <span className="text-xs text-gray-500">Management Systems (Pvt) Ltd</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Nav */}
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

                    {/* Footer */}
                    <div className="mt-4 text-[10px] text-gray-400 space-y-1">
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising"].map((l) => (
                                <Link key={l} to="#" className="hover:underline">{l}</Link>
                            ))}
                        </div>
                        <p>MSL Recruitment © 2025</p>
                    </div>
                </aside>

                {/* ── MAIN ────────────────────────────────────────────────── */}
                <main className="w-full lg:ml-72 p-4 lg:p-6 space-y-6">

                    {/* ── TOP JOB PICKS ─────────────────────────────────────── */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-enter">
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Top job picks for you</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Based on your profile, preferences, and activity like applies, searches, and saves</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {jobs.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <Icon name="briefcase" className="text-3xl mb-2 block mx-auto" />
                                    <p className="text-sm">No job picks right now. Check back soon!</p>
                                </div>
                            ) : jobs.map((job) => (
                                <JobPickCard key={job.id} job={job} onDismiss={() => dismissJob(job.id)} onApply={() => push(`Opening "${job.title}"…`, "info")} />
                            ))}
                        </div>

                        {jobs.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => push("Loading all job picks…", "info")}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-semibold group"
                                >
                                    Show all
                                    <Icon name="arrow-right" className="text-xs group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </section>

                    {/* ── SUGGESTED JOB SEARCHES ────────────────────────────── */}
                    <SuggestedSearches onSearch={handleSearch} />

                    {/* ── PREMIUM SECTION ───────────────────────────────────── */}
                    <PremiumSection />

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
                        <div key={id}
                            className={`${cfg.bg} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm pointer-events-auto`}
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

// ── JobPickCard ───────────────────────────────────────────────────────────────
function JobPickCard({ job, onDismiss, onApply }: {
    job: JobCard; onDismiss: () => void; onApply: () => void;
}): JSX.Element {
    return (
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group">
            {/* Left — icon + info */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Company placeholder icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-gray-200 flex items-center justify-center shrink-0">
                    <Icon name="building" className="text-slate-400 text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                    <button
                        onClick={onApply}
                        className="text-sm font-bold text-blue-600 hover:underline text-left leading-tight truncate block max-w-full"
                    >
                        {job.title}
                    </button>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{job.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${TYPE_STYLES[job.type]}`}>
                            {job.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right — timestamp + dismiss */}
            <div className="flex flex-col items-end gap-2 ml-3 shrink-0">
                <span className={`text-[10px] font-medium ${job.viewed ? "text-purple-500" : "text-gray-400"}`}>
                    {job.viewed ? (
                        <span className="flex items-center gap-1"><Icon name="eye" className="text-[9px]" />Viewed</span>
                    ) : job.postedAgo}
                </span>
                <button
                    onClick={onDismiss}
                    className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                    title="Dismiss"
                >
                    <Icon name="times" className="text-xs" />
                </button>
            </div>
        </div>
    );
}

// ── SuggestedSearches ─────────────────────────────────────────────────────────
function SuggestedSearches({ onSearch }: { onSearch: (term: string) => void }): JSX.Element {
    const [visible, setVisible] = useState(true);

    if (!visible) return <></>;

    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-enter">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900">Suggested job searches</h2>
                <button
                    onClick={() => setVisible(false)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Icon name="times" className="text-xs" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.map((term) => (
                    <button
                        key={term}
                        onClick={() => onSearch(term)}
                        className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-full text-sm hover:bg-blue-100 hover:border-blue-300 transition-all flex items-center gap-2 font-medium active:scale-95"
                    >
                        <Icon name="search" className="text-xs" />
                        {term}
                    </button>
                ))}
            </div>
        </section>
    );
}

// ── PremiumSection ────────────────────────────────────────────────────────────
function PremiumSection(): JSX.Element {
    return (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-enter">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-black mb-3 shadow-sm">
                <Icon name="star" className="text-[10px]" />
                PREMIUM
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-1">Jobs where you'd be a top applicant</h2>
            <p className="text-sm text-gray-500 mb-5">Based on your chances of hearing back</p>

            {/* Gradient card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 text-center border border-blue-100 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
                        <Icon name="user" className="text-white text-2xl" />
                    </div>
                    <p className="text-gray-800 font-bold text-base mb-1">Job search smarter with Premium.</p>
                    <p className="text-gray-500 text-sm mb-5">Your future is worth the investment.</p>
                    <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-black px-6 py-2.5 rounded-full text-sm hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md shadow-yellow-200 active:scale-95">
                        <Icon name="star" className="mr-2 text-xs" />
                        Try Premium Free
                    </button>
                </div>
            </div>
        </section>
    );
}