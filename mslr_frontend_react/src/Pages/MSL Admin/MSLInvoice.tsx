import { useState, useEffect, useRef, type JSX, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps { name: string; className?: string; }

interface Invoice {
    id: number;
    jobTitle: string;
    company: string;
    postedDate: string;
    invoiceStatus: "Complete" | "Pending" | "Not Yet";
    resumeStatus: "Sent" | "Held" | "Available";
    salary: string;
    contract: string;
    location: string;
    applicants: number;
    description: string;
    requirements: string[];
    sector: string;
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

interface CreateForm {
    job: string;
    amount: string;
    description: string;
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
const INITIAL_INVOICES: Invoice[] = [
    {
        id: 1, jobTitle: "Senior Software Engineer", company: "Hayleys PLC",
        postedDate: "2024-12-01", invoiceStatus: "Complete", resumeStatus: "Sent",
        salary: "LKR 150,000 – 200,000", contract: "Full-time",
        location: "Colombo, Sri Lanka", applicants: 15,
        description: "We are looking for a Senior Software Engineer to join our dynamic team and lead full-stack development initiatives.",
        requirements: ["5+ years experience", "React/Node.js", "MongoDB", "AWS"],
        sector: "IT",
    },
    {
        id: 2, jobTitle: "Marketing Manager", company: "John Keells",
        postedDate: "2024-12-05", invoiceStatus: "Pending", resumeStatus: "Held",
        salary: "LKR 120,000 – 160,000", contract: "Full-time",
        location: "Colombo, Sri Lanka", applicants: 8,
        description: "Experienced Marketing Manager needed to lead our marketing initiatives and drive brand growth.",
        requirements: ["3+ years experience", "Digital Marketing", "Brand Management", "Analytics"],
        sector: "Marketing",
    },
    {
        id: 3, jobTitle: "Data Analyst", company: "Ceylon Tobacco",
        postedDate: "2024-12-10", invoiceStatus: "Not Yet", resumeStatus: "Available",
        salary: "LKR 90,000 – 130,000", contract: "Contract",
        location: "Colombo, Sri Lanka", applicants: 12,
        description: "Data Analyst position for analyzing business metrics and trends to support strategic decisions.",
        requirements: ["2+ years experience", "SQL", "Python", "Excel", "Data Visualization"],
        sector: "IT",
    },
    {
        id: 4, jobTitle: "Financial Controller", company: "Dialog Axiata",
        postedDate: "2024-12-15", invoiceStatus: "Complete", resumeStatus: "Sent",
        salary: "LKR 180,000 – 220,000", contract: "Full-time",
        location: "Colombo, Sri Lanka", applicants: 6,
        description: "Financial Controller to oversee all financial operations, reporting, and compliance.",
        requirements: ["5+ years experience", "CPA/ACCA", "Financial Reporting", "Team Management"],
        sector: "Finance",
    },
];

const COMPANIES = ["Hayleys PLC", "John Keells", "Ceylon Tobacco", "Dialog Axiata"];

const NAV = [
    { label: "Home", icon: "home", href: "/msl-home" },
    { label: "Seekers", icon: "users", href: "/msl-seeker" },
    { label: "Clients", icon: "building", href: "/msl-client" },
    { label: "Posted", icon: "plus-circle", href: "/msl-posted" },
    { label: "Invoice", icon: "file-invoice", href: "/msl-invoice", active: true },
    { label: "Scheduled", icon: "calendar-alt", href: "/msl-schedule" },
    { label: "Analytics", icon: "chart-bar", href: "#" },
];

const INVOICE_STYLES: Record<string, { badge: string; dot: string }> = {
    Complete: { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    Pending: { badge: "bg-amber-100   text-amber-700   border border-amber-200", dot: "bg-amber-500" },
    "Not Yet": { badge: "bg-gray-100    text-gray-600    border border-gray-200", dot: "bg-gray-400" },
};

const RESUME_STYLES: Record<string, { badge: string; dot: string; icon: string }> = {
    Sent: { badge: "bg-blue-100   text-blue-700   border border-blue-200", dot: "bg-blue-500", icon: "paper-plane" },
    Held: { badge: "bg-orange-100 text-orange-700 border border-orange-200", dot: "bg-orange-500", icon: "pause-circle" },
    Available: { badge: "bg-teal-100   text-teal-700   border border-teal-200", dot: "bg-teal-500", icon: "check-circle" },
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

// ── Company Avatar ────────────────────────────────────────────────────────────
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

const EMPTY_FORM: CreateForm = { job: "", amount: "", description: "" };

// ═════════════════════════════════════════════════════════════════════════════
export default function MSLInvoice(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
    const [search, setSearch] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [invoiceFilter, setInvoiceFilter] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCompanyDrop, setShowCompanyDrop] = useState(false);
    const [showInvoiceDrop, setShowInvoiceDrop] = useState(false);
    const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_FORM);
    const profileRef = useRef<HTMLDivElement>(null);
    const filterBarRef = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            const t = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
            if (filterBarRef.current && !filterBarRef.current.contains(t)) {
                setShowCompanyDrop(false);
                setShowInvoiceDrop(false);
            }
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // filtered list
    const filtered = invoices.filter((inv) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            inv.jobTitle.toLowerCase().includes(q) ||
            inv.company.toLowerCase().includes(q) ||
            inv.description.toLowerCase().includes(q);
        const matchCompany = !companyFilter || inv.company === companyFilter;
        const matchStatus = !invoiceFilter || inv.invoiceStatus === invoiceFilter;
        return matchSearch && matchCompany && matchStatus;
    });

    // ── Actions ───────────────────────────────────────────────────────────────
    const updateResumeStatus = (id: number, status: Invoice["resumeStatus"]) => {
        setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, resumeStatus: status } : inv));
        const inv = invoices.find((x) => x.id === id);
        if (inv) push(`Resumes ${status.toLowerCase()} for "${inv.jobTitle}"`, "success");
        if (detailInvoice?.id === id) setDetailInvoice((d) => d ? { ...d, resumeStatus: status } : null);
    };

    const deleteInvoice = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        push("Invoice deleted successfully", "success");
        if (detailInvoice?.id === id) setDetailInvoice(null);
    };

    const handleCreateSubmit = (e: FormEvent) => {
        e.preventDefault();
        push("Invoice created successfully!", "success");
        setShowCreateModal(false);
        setCreateForm(EMPTY_FORM);
    };

    const field = (key: keyof CreateForm) => ({
        value: createForm[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setCreateForm((f) => ({ ...f, [key]: e.target.value })),
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
                            <button onClick={() => setShowCreateModal(true)}
                                className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium">
                                <Icon name="plus" /> Create New Invoice
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
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Job Invoices</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Manage invoices and control resume access for posted jobs</p>
                            </div>
                            <button onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                                <Icon name="plus" /> Create Invoice
                            </button>
                        </div>

                        {/* ── Summary cards ─────────────────────────────────── */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { label: "Complete", count: invoices.filter(i => i.invoiceStatus === "Complete").length, ...INVOICE_STYLES["Complete"], icon: "check-circle" },
                                { label: "Pending", count: invoices.filter(i => i.invoiceStatus === "Pending").length, ...INVOICE_STYLES["Pending"], icon: "clock" },
                                { label: "Not Yet", count: invoices.filter(i => i.invoiceStatus === "Not Yet").length, ...INVOICE_STYLES["Not Yet"], icon: "hourglass-half" },
                            ].map(({ label, count, badge, dot, icon }) => (
                                <button key={label}
                                    onClick={() => setInvoiceFilter(invoiceFilter === label ? "" : label)}
                                    className={`rounded-xl p-4 border text-left transition-all hover:shadow-md ${invoiceFilter === label ? badge + " shadow-md scale-[1.02]" : "bg-slate-50 border-gray-100 hover:border-gray-200"}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                                            <p className="text-2xl font-black text-gray-900">{count}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.split(" ").find(c => c.startsWith("bg-"))}`}>
                                            <Icon name={icon} className={`text-lg ${badge.split(" ").find(c => c.startsWith("text-"))}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                                        <span className="text-[10px] text-gray-400 font-medium">{invoiceFilter === label ? "Click to clear" : "Click to filter"}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Search + filters */}
                        <div ref={filterBarRef} className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by title, company or description…"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400" />
                                </div>
                                <div className="flex gap-3 flex-wrap">

                                    {/* Company dropdown */}
                                    <div className="relative">
                                        <div onClick={() => { setShowCompanyDrop(!showCompanyDrop); setShowInvoiceDrop(false); }}
                                            className="border border-gray-200 rounded-xl px-5 py-3 text-sm bg-white min-w-[160px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex items-center gap-2.5">
                                                <Icon name="building" className={companyFilter ? "text-blue-500" : "text-gray-400"} />
                                                <span className={companyFilter ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}>
                                                    {companyFilter || "All Companies"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showCompanyDrop ? "rotate-180" : ""}`} />
                                        </div>
                                        {showCompanyDrop && (
                                            <div className="absolute top-full left-0 mt-3 w-56 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16,1,0.3,1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1">
                                                    <Icon name="building" className="mr-1 text-[8px]" /> Client Company
                                                </div>
                                                <div onClick={() => { setCompanyFilter(""); setShowCompanyDrop(false); }}
                                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
                                                    <Icon name="border-all" className="text-gray-300 text-xs" /> All Companies
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {COMPANIES.map((c) => (
                                                    <div key={c} onClick={() => { setCompanyFilter(c); setShowCompanyDrop(false); }}
                                                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group/item">
                                                        <CompanyAvatar name={c} size="sm" />
                                                        <span className="font-medium">{c}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Invoice status dropdown */}
                                    <div className="relative">
                                        <div onClick={() => { setShowInvoiceDrop(!showInvoiceDrop); setShowCompanyDrop(false); }}
                                            className="border border-gray-200 rounded-xl px-5 py-3 text-sm bg-white min-w-[160px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex items-center gap-2.5">
                                                {invoiceFilter
                                                    ? <div className={`w-2.5 h-2.5 rounded-full ${INVOICE_STYLES[invoiceFilter]?.dot}`} />
                                                    : <Icon name="file-invoice" className="text-gray-400 text-xs" />}
                                                <span className={invoiceFilter ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}>
                                                    {invoiceFilter || "Invoice Status"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showInvoiceDrop ? "rotate-180" : ""}`} />
                                        </div>
                                        {showInvoiceDrop && (
                                            <div className="absolute top-full right-0 mt-3 w-52 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16,1,0.3,1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1">
                                                    <Icon name="dot-circle" className="mr-1 text-[8px]" /> Invoice Status
                                                </div>
                                                <div onClick={() => { setInvoiceFilter(""); setShowInvoiceDrop(false); }}
                                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-200" /> All Statuses
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {(["Complete", "Pending", "Not Yet"] as const).map((s) => (
                                                    <div key={s} onClick={() => { setInvoiceFilter(s); setShowInvoiceDrop(false); }}
                                                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium group/item">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${INVOICE_STYLES[s].dot} group-hover/item:scale-125 transition-transform`} />
                                                        <span>{s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {(search || companyFilter || invoiceFilter) && (
                                        <button onClick={() => { setSearch(""); setCompanyFilter(""); setInvoiceFilter(""); }}
                                            className="px-5 py-3 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:bg-red-50 transition-all font-bold hover:border-red-100 flex items-center gap-2 group shadow-sm">
                                            <Icon name="times-circle" className="text-xs group-hover:rotate-90 transition-transform" /> Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">Job Invoices List</h3>
                                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                                    {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            {["Job & Company", "Posted Date", "Invoice Status", "Resume Status", "Actions"].map((h) => (
                                                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                    <Icon name="file-invoice" className="text-3xl mb-2 block mx-auto" />
                                                    No invoices match your filters.
                                                </td>
                                            </tr>
                                        ) : filtered.map((inv) => (
                                            <InvoiceRow
                                                key={inv.id}
                                                invoice={inv}
                                                onView={() => setDetailInvoice(inv)}
                                                onHold={() => updateResumeStatus(inv.id, "Held")}
                                                onSend={() => updateResumeStatus(inv.id, "Sent")}
                                                onCreate={() => push(`Creating invoice for "${inv.jobTitle}"`, "info")}
                                                onRenew={() => push(`Renewing invoice for "${inv.jobTitle}"`, "info")}
                                                onDelete={() => deleteInvoice(inv.id)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* ── DETAIL MODAL ────────────────────────────────────────────── */}
            {detailInvoice && (
                <Modal onClose={() => setDetailInvoice(null)} title="Job Details & Invoice Status" wide>
                    <InvoiceDetail
                        invoice={detailInvoice}
                        onHold={() => updateResumeStatus(detailInvoice.id, "Held")}
                        onSend={() => updateResumeStatus(detailInvoice.id, "Sent")}
                        onDelete={() => deleteInvoice(detailInvoice.id)}
                    />
                </Modal>
            )}

            {/* ── CREATE INVOICE MODAL ─────────────────────────────────────── */}
            {showCreateModal && (
                <Modal onClose={() => setShowCreateModal(false)} title="Create New Invoice">
                    <form onSubmit={handleCreateSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Select Job</label>
                            <select required {...field("job")}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                <option value="">Choose a job</option>
                                {invoices.map((inv) => (
                                    <option key={inv.id} value={inv.id}>{inv.jobTitle} — {inv.company}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Invoice Amount (LKR)</label>
                            <input type="number" required {...field("amount")} placeholder="e.g. 50000"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Invoice Description</label>
                            <textarea rows={3} required {...field("description")} placeholder="Enter invoice description…"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                            <button type="button" onClick={() => setShowCreateModal(false)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                                CREATE INVOICE
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

// ── InvoiceRow ────────────────────────────────────────────────────────────────
function InvoiceRow({ invoice, onView, onHold, onSend, onCreate, onRenew, onDelete }: {
    invoice: Invoice;
    onView: () => void; onHold: () => void; onSend: () => void;
    onCreate: () => void; onRenew: () => void; onDelete: () => void;
}): JSX.Element {
    const inv = INVOICE_STYLES[invoice.invoiceStatus];
    const res = RESUME_STYLES[invoice.resumeStatus];
    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            {/* Job & Company */}
            <td className="px-5 py-4">
                <button onClick={onView} className="flex items-center gap-3 text-left group/name">
                    <CompanyAvatar name={invoice.company} />
                    <div>
                        <p className="text-sm font-bold text-gray-900 group-hover/name:text-blue-700 transition-colors leading-tight">{invoice.jobTitle}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{invoice.company}</p>
                        <p className="text-[10px] text-gray-400">{invoice.contract} · {invoice.location}</p>
                    </div>
                </button>
            </td>

            {/* Posted Date */}
            <td className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Icon name="calendar" className="text-slate-500 text-xs" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{formatDate(invoice.postedDate)}</span>
                </div>
            </td>

            {/* Invoice Status */}
            <td className="px-5 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${inv.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${inv.dot}`} />
                    {invoice.invoiceStatus}
                </span>
            </td>

            {/* Resume Status */}
            <td className="px-5 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${res.badge}`}>
                    <Icon name={res.icon} className="text-[10px]" />
                    {invoice.resumeStatus}
                </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                    <ActionBtn icon="plus" label="Create" color="blue" onClick={onCreate} />
                    <ActionBtn icon="eye" label="View" color="indigo" onClick={onView} />
                    <ActionBtn icon="redo" label="Renew" color="teal" onClick={onRenew} />
                    <ActionBtn icon="pause" label="Hold" color="orange" onClick={onHold} />
                    <ActionBtn icon="paper-plane" label="Send" color="emerald" onClick={onSend} />
                    <ActionBtn icon="trash" label="Delete" color="red" onClick={onDelete} />
                </div>
            </td>
        </tr>
    );
}

// ── Small action button ───────────────────────────────────────────────────────
const COLOR_BTN: Record<string, string> = {
    blue: "bg-blue-600    hover:bg-blue-700",
    indigo: "bg-indigo-600  hover:bg-indigo-700",
    teal: "bg-teal-600    hover:bg-teal-700",
    orange: "bg-orange-500  hover:bg-orange-600",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    red: "bg-red-500     hover:bg-red-600",
};

function ActionBtn({ icon, label, color, onClick }: {
    icon: string; label: string; color: string; onClick: () => void;
}): JSX.Element {
    return (
        <button onClick={onClick} title={label}
            className={`${COLOR_BTN[color]} text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors`}>
            <Icon name={icon} className="text-[10px]" />
            <span className="hidden xl:inline">{label}</span>
        </button>
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

// ── Invoice Detail view ───────────────────────────────────────────────────────
function InvoiceDetail({ invoice, onHold, onSend, onDelete }: {
    invoice: Invoice; onHold: () => void; onSend: () => void; onDelete: () => void;
}): JSX.Element {
    const inv = INVOICE_STYLES[invoice.invoiceStatus];
    const res = RESUME_STYLES[invoice.resumeStatus];
    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <CompanyAvatar name={invoice.company} size="lg" />
                <div className="flex-1">
                    <h4 className="text-xl font-black text-gray-900">{invoice.jobTitle}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{invoice.company}</p>
                    <p className="text-xs text-gray-400 mt-0.5"><Icon name="map-marker-alt" className="mr-1" />{invoice.location}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${inv.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${inv.dot}`} /> Invoice: {invoice.invoiceStatus}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${res.badge}`}>
                            <Icon name={res.icon} className="text-[10px]" /> Resume: {invoice.resumeStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: "money-bill-wave", label: "Salary", value: invoice.salary },
                    { icon: "briefcase", label: "Contract", value: invoice.contract },
                    { icon: "calendar", label: "Posted Date", value: formatDate(invoice.postedDate) },
                    { icon: "users", label: "Applicants", value: `${invoice.applicants} applicants` },
                    { icon: "industry", label: "Sector", value: invoice.sector },
                    { icon: "map-marker-alt", label: "Location", value: invoice.location },
                ].map(({ icon, label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1"><Icon name={icon} className="mr-1" />{label}</p>
                        <p className="text-sm text-gray-800 font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div>
                <h5 className="text-sm font-bold text-gray-800 mb-1.5">Description</h5>
                <p className="text-sm text-gray-600 bg-slate-50 rounded-xl p-3 border border-gray-100 leading-relaxed">{invoice.description}</p>
            </div>

            {/* Requirements */}
            <div>
                <h5 className="text-sm font-bold text-gray-800 mb-2">Requirements</h5>
                <div className="flex flex-wrap gap-1.5">
                    {invoice.requirements.map((r, i) => (
                        <span key={r} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>{r}</span>
                    ))}
                </div>
            </div>

            {/* Resume control actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2">
                    <button onClick={onHold}
                        className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center gap-2">
                        <Icon name="pause" /> Hold Resumes
                    </button>
                    <button onClick={onSend}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                        <Icon name="paper-plane" /> Send Resumes
                    </button>
                </div>
                <button onClick={onDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all flex items-center gap-2">
                    <Icon name="trash" /> Delete
                </button>
            </div>
        </div>
    );
}