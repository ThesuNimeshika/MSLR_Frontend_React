import { useState, useEffect, useRef, type JSX, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps {
    name: string;
    className?: string;
}

interface Agreement {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    status: "Active" | "Expired" | "Suspended";
}

interface PostedJob {
    title: string;
    postedDate: string;
    applications: number;
    status: "Open" | "Closed" | "Suspended";
}

interface Client {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    sector: string;
    location: string;
    status: "active" | "inactive" | "suspended";
    about: string;
    agreements: Agreement[];
    postedJobs: PostedJob[];
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

interface AddClientForm {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    sector: string;
    location: string;
    about: string;
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
const INITIAL_CLIENTS: Client[] = [
    {
        id: 1, companyName: "Hayleys PLC", contactPerson: "Hemas Silva",
        email: "info@hayleys.com", phone: "+94 11 234 5678",
        sector: "Manufacturing", location: "Colombo, Sri Lanka", status: "active",
        about: "Leading conglomerate with diverse business interests across multiple sectors including textiles, agriculture, and consumer goods.",
        agreements: [
            { id: "AGR-2024-001", type: "Comprehensive Recruitment Services", startDate: "Jan 1, 2024", endDate: "Dec 31, 2024", status: "Active" },
            { id: "AGR-2024-002", type: "Executive Search", startDate: "Mar 1, 2024", endDate: "Feb 28, 2025", status: "Active" },
        ],
        postedJobs: [
            { title: "Senior Software Engineer", postedDate: "Dec 15, 2024", applications: 12, status: "Open" },
            { title: "Marketing Manager", postedDate: "Dec 10, 2024", applications: 8, status: "Open" },
            { title: "Data Analyst", postedDate: "Dec 05, 2024", applications: 15, status: "Closed" },
        ],
    },
    {
        id: 2, companyName: "Dialog Axiata", contactPerson: "Sarah Johnson",
        email: "hr@dialog.lk", phone: "+94 11 345 6789",
        sector: "IT", location: "Colombo, Sri Lanka", status: "active",
        about: "Leading telecommunications provider offering mobile, broadband, and digital services across Sri Lanka.",
        agreements: [
            { id: "AGR-2024-003", type: "IT Recruitment Services", startDate: "Feb 1, 2024", endDate: "Jan 31, 2025", status: "Active" },
        ],
        postedJobs: [
            { title: "Network Engineer", postedDate: "Dec 12, 2024", applications: 20, status: "Open" },
            { title: "UX Designer", postedDate: "Dec 08, 2024", applications: 14, status: "Open" },
        ],
    },
    {
        id: 3, companyName: "Commercial Bank", contactPerson: "Michael Chen",
        email: "careers@combank.lk", phone: "+94 11 456 7890",
        sector: "Finance", location: "Colombo, Sri Lanka", status: "active",
        about: "Premier commercial bank providing comprehensive financial services to individuals and businesses.",
        agreements: [
            { id: "AGR-2024-004", type: "Financial Services Recruitment", startDate: "Apr 1, 2024", endDate: "Mar 31, 2025", status: "Active" },
        ],
        postedJobs: [
            { title: "Financial Analyst", postedDate: "Dec 14, 2024", applications: 18, status: "Open" },
            { title: "Risk Manager", postedDate: "Dec 06, 2024", applications: 9, status: "Open" },
        ],
    },
    {
        id: 4, companyName: "Lanka Hospitals", contactPerson: "Dr. Emily Wilson",
        email: "hr@lankahospitals.lk", phone: "+94 11 567 8901",
        sector: "Healthcare", location: "Colombo, Sri Lanka", status: "active",
        about: "Leading private healthcare provider offering world-class medical services and facilities.",
        agreements: [
            { id: "AGR-2024-005", type: "Healthcare Recruitment", startDate: "May 1, 2024", endDate: "Apr 30, 2025", status: "Active" },
        ],
        postedJobs: [
            { title: "Medical Officer", postedDate: "Dec 13, 2024", applications: 25, status: "Open" },
            { title: "Nurse Manager", postedDate: "Dec 07, 2024", applications: 16, status: "Open" },
        ],
    },
    {
        id: 5, companyName: "MAS Holdings", contactPerson: "David Rodriguez",
        email: "careers@mas.lk", phone: "+94 11 678 9012",
        sector: "Manufacturing", location: "Colombo, Sri Lanka", status: "inactive",
        about: "Global apparel manufacturer specializing in intimate wear and sportswear for international brands.",
        agreements: [
            { id: "AGR-2024-006", type: "Manufacturing Recruitment", startDate: "Jun 1, 2024", endDate: "May 31, 2025", status: "Expired" },
        ],
        postedJobs: [
            { title: "Production Manager", postedDate: "Nov 30, 2024", applications: 11, status: "Closed" },
        ],
    },
    {
        id: 6, companyName: "Ceylon Tobacco", contactPerson: "Lisa Garcia",
        email: "hr@ctc.lk", phone: "+94 11 789 0123",
        sector: "Manufacturing", location: "Colombo, Sri Lanka", status: "suspended",
        about: "Leading tobacco manufacturer with strong focus on corporate social responsibility and sustainability.",
        agreements: [
            { id: "AGR-2024-007", type: "Corporate Recruitment", startDate: "Jul 1, 2024", endDate: "Jun 30, 2025", status: "Suspended" },
        ],
        postedJobs: [
            { title: "Sustainability Officer", postedDate: "Nov 25, 2024", applications: 7, status: "Suspended" },
        ],
    },
    {
        id: 7, companyName: "John Keells", contactPerson: "Robert Taylor",
        email: "careers@keells.com", phone: "+94 11 890 1234",
        sector: "Retail", location: "Colombo, Sri Lanka", status: "active",
        about: "Diversified conglomerate with interests in transportation, consumer goods, and leisure sectors.",
        agreements: [
            { id: "AGR-2024-008", type: "Multi-sector Recruitment", startDate: "Aug 1, 2024", endDate: "Jul 31, 2025", status: "Active" },
        ],
        postedJobs: [
            { title: "Supply Chain Manager", postedDate: "Dec 11, 2024", applications: 22, status: "Open" },
            { title: "Retail Operations Lead", postedDate: "Dec 04, 2024", applications: 13, status: "Open" },
        ],
    },
    {
        id: 8, companyName: "Sampath Bank", contactPerson: "Jennifer Martinez",
        email: "hr@sampath.lk", phone: "+94 11 901 2345",
        sector: "Finance", location: "Colombo, Sri Lanka", status: "active",
        about: "Innovative banking solutions provider committed to digital transformation and customer excellence.",
        agreements: [
            { id: "AGR-2024-009", type: "Banking Recruitment", startDate: "Sep 1, 2024", endDate: "Aug 31, 2025", status: "Active" },
        ],
        postedJobs: [
            { title: "Digital Banking Manager", postedDate: "Dec 09, 2024", applications: 19, status: "Open" },
            { title: "Compliance Officer", postedDate: "Dec 02, 2024", applications: 10, status: "Open" },
        ],
    },
];

const NAV = [
    { label: "Home", icon: "home", href: "/msl-home" },
    { label: "Seekers", icon: "users", href: "/msl-seeker" },
    { label: "Clients", icon: "building", href: "/msl-client", active: true },
    { label: "Posted", icon: "briefcase", href: "/msl-posted" },
    { label: "Invoice", icon: "file-invoice", href: "/msl-invoice" },
    { label: "Scheduled", icon: "calendar", href: "/msl-schedule" },
    { label: "Analytics", icon: "chart-bar", href: "#" },
];

const CATEGORY_MAP: { [key: string]: { icon: string; color: string } } = {
    'Accounting': { icon: '📂', color: '#4f46e5' },
    'Technology': { icon: '💻', color: '#6366f1' },
    'IT': { icon: '💻', color: '#6366f1' },
    'Logistics': { icon: '📦', color: '#10b981' },
    'Design': { icon: '🖋️', color: '#f43f5e' },
    'Finance': { icon: '📊', color: '#f59e0b' },
    'Healthcare': { icon: '🏥', color: '#3b82f6' },
    'Marketing': { icon: '📢', color: '#8b5cf6' },
};
const DEFAULT_CATEGORY = { icon: '🏢', color: '#8b5cf6' };

const STATUS_STYLES: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200",
    suspended: "bg-amber-100 text-amber-700 border border-amber-200",
};

const SECTOR_COLORS: Record<string, string> = {
    IT: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Finance: "bg-amber-50 text-amber-700 border-amber-200",
    Healthcare: "bg-blue-50 text-blue-700 border-blue-200",
    Manufacturing: "bg-orange-50 text-orange-700 border-orange-200",
    Retail: "bg-pink-50 text-pink-700 border-pink-200",
    Marketing: "bg-purple-50 text-purple-700 border-purple-200",
    Engineering: "bg-teal-50 text-teal-700 border-teal-200",
    Education: "bg-green-50 text-green-700 border-green-200",
};

const AGREEMENT_STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Expired: "bg-red-100 text-red-700",
    Suspended: "bg-amber-100 text-amber-700",
};

const JOB_STATUS_STYLES: Record<string, string> = {
    Open: "bg-emerald-100 text-emerald-700",
    Closed: "bg-red-100 text-red-700",
    Suspended: "bg-amber-100 text-amber-700",
};

// ── Company Avatar ────────────────────────────────────────────────────────────
function CompanyAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }): JSX.Element {
    const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const hue = (name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 360;
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
    return (
        <div
            className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold text-white shrink-0`}
            style={{ background: `hsl(${hue},55%,50%)` }}
        >
            {initials}
        </div>
    );
}

// ── Empty form ────────────────────────────────────────────────────────────────
const EMPTY_FORM: AddClientForm = {
    companyName: "", contactPerson: "", email: "",
    phone: "", sector: "", location: "", about: "",
};

// ═════════════════════════════════════════════════════════════════════════════
export default function MSLClient(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
    const [search, setSearch] = useState("");
    const [sectorFilter, setSectorFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [detailClient, setDetailClient] = useState<Client | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<AddClientForm>(EMPTY_FORM);
    const [categoriesData, setCategoriesData] = useState<{ id: string; label: string; icon: string; subcategories: { id: string; label: string }[] }[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [showSectorDropdown, setShowSectorDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const filterBarRef = useRef<HTMLDivElement>(null);

    const API_URL = 'http://localhost:5194/api';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/Sectors`);
                if (response.ok) {
                    const data: { sectorId: number, sectorName: string, subSectorName: string | null }[] = await response.json();
                    const groups: { [key: string]: { id: string; label: string; icon: string; subcategories: { id: string; label: string }[] } } = {};

                    data.forEach(s => {
                        if (!groups[s.sectorName]) {
                            groups[s.sectorName] = {
                                id: '',
                                label: s.sectorName,
                                icon: CATEGORY_MAP[s.sectorName]?.icon || DEFAULT_CATEGORY.icon,
                                subcategories: []
                            };
                        }
                        if (s.subSectorName) {
                            groups[s.sectorName].subcategories.push({
                                id: s.sectorId.toString(),
                                label: s.subSectorName
                            });
                        } else {
                            groups[s.sectorName].id = s.sectorId.toString();
                        }
                    });
                    setCategoriesData(Object.values(groups));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const toggleExpand = (label: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setExpandedCategories(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]);
    };

    // close dropdowns on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            const t = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false);
            if (filterBarRef.current && !filterBarRef.current.contains(t)) {
                setShowSectorDropdown(false);
                setShowStatusDropdown(false);
            }
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // filtered list
    const filtered = clients.filter((c) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            c.companyName.toLowerCase().includes(q) ||
            c.contactPerson.toLowerCase().includes(q) ||
            c.sector.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q);
        const matchSector = !sectorFilter || c.sector === sectorFilter;
        const matchStatus = !statusFilter || c.status === statusFilter;
        return matchSearch && matchSector && matchStatus;
    });

    const changeStatus = (id: number, newStatus: Client["status"]) => {
        setClients((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
        const c = clients.find((x) => x.id === id);
        if (c) {
            push(`${c.companyName} marked as ${newStatus}`,
                newStatus === "active" ? "success" : newStatus === "suspended" ? "warning" : "info");
        }
        // sync detail modal if open
        if (detailClient?.id === id) setDetailClient((d) => d ? { ...d, status: newStatus } : null);
    };

    const handleAddSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newClient: Client = {
            id: Date.now(),
            ...addForm,
            status: "active",
            agreements: [],
            postedJobs: [],
        };
        setClients((prev) => [newClient, ...prev]);
        push(`${addForm.companyName} added successfully`, "success");
        setShowAddModal(false);
        setAddForm(EMPTY_FORM);
    };

    const field = (key: keyof AddClientForm) => ({
        value: addForm[key] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setAddForm((f) => ({ ...f, [key]: e.target.value })),
    });

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <style>{`
                @keyframes fadeDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes slideIn { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }
                @keyframes fadeUp { from { opacity:0; transform:translateY(20px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
                .glass-dropdown { background:rgba(255,255,255,0.97); backdrop-filter:blur(10px); }
            `}</style>

            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link to="/msl-home" className="flex items-center gap-2">
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
                    {/* Profile card */}
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
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button onClick={() => setShowAddModal(true)}
                                className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium">
                                <Icon name="plus" /> Add New Client
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
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Client Management</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all registered client companies</p>
                            </div>
                            <button onClick={() => setShowAddModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                                <Icon name="plus" /> Add Client
                            </button>
                        </div>

                        {/* Search + filters */}
                        <div ref={filterBarRef} className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by company, contact, sector or location…"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400" />
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {/* Sector Filter */}
                                    <div className="relative">
                                        <div onClick={() => { setShowSectorDropdown(!showSectorDropdown); setShowStatusDropdown(false); }}
                                            className="border border-gray-200 rounded-xl px-5 py-3 text-sm bg-white min-w-[160px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shadow-sm group">
                                            <div className="flex items-center gap-2.5">
                                                <Icon name="building" className={sectorFilter ? "text-blue-500" : "text-gray-400"} />
                                                <span className={sectorFilter ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}>
                                                    {sectorFilter || "All Sectors"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showSectorDropdown ? "rotate-180" : ""}`} />
                                        </div>
                                        {showSectorDropdown && (
                                            <div className="absolute top-full left-0 mt-3 w-56 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16,1,0.3,1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1 flex items-center gap-2">
                                                    <Icon name="layer-group" className="text-[8px]" /> Industry Sector
                                                </div>
                                                <div onClick={() => { setSectorFilter(""); setShowSectorDropdown(false); }}
                                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
                                                    <Icon name="border-all" className="text-gray-300 text-xs" /> All Sectors
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {categoriesData.map((cat) => (
                                                        <div key={cat.label} className="mb-1">
                                                            <div className={`flex items-center px-4 py-2 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group/cat ${expandedCategories.includes(cat.label) ? "bg-blue-50/50" : ""}`}
                                                                onClick={() => toggleExpand(cat.label)}>
                                                                <span className="mr-2 text-base">{cat.icon}</span>
                                                                <span className="text-sm font-medium text-gray-600 flex-1 group-hover/cat:text-blue-600">{cat.label}</span>
                                                                {cat.subcategories.length > 0 && (
                                                                    <Icon name="chevron-down" className={`text-[8px] text-gray-400 transition-transform ${expandedCategories.includes(cat.label) ? "rotate-180" : ""}`} />
                                                                )}
                                                            </div>
                                                            {expandedCategories.includes(cat.label) && cat.subcategories.length > 0 && (
                                                                <div className="ml-8 mt-1 space-y-1">
                                                                    {cat.subcategories.map(sub => (
                                                                        <div key={sub.id} onClick={() => { setSectorFilter(sub.label); setShowSectorDropdown(false); }}
                                                                            className="px-3 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors font-medium">
                                                                            {sub.label}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {cat.subcategories.length === 0 && (
                                                                <div onClick={() => { setSectorFilter(cat.label); setShowSectorDropdown(false); }}
                                                                    className="hidden" /> // fallback handled by click on parent if no subs? 
                                                                // Actually in MSLSeeker it filters by label if sub is selected.
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Filter */}
                                    <div className="relative">
                                        <div onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowSectorDropdown(false); }}
                                            className="border border-gray-200 rounded-xl px-5 py-3 text-sm bg-white min-w-[150px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex items-center gap-2.5">
                                                {statusFilter ? (
                                                    <div className={`w-2.5 h-2.5 rounded-full ${statusFilter === "active" ? "bg-emerald-500" : statusFilter === "inactive" ? "bg-gray-400" : "bg-amber-500"}`} />
                                                ) : (
                                                    <Icon name="filter" className="text-gray-400 text-xs" />
                                                )}
                                                <span className={statusFilter ? "text-gray-900 font-bold capitalize" : "text-gray-500 font-medium"}>
                                                    {statusFilter || "Status"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showStatusDropdown ? "rotate-180" : ""}`} />
                                        </div>
                                        {showStatusDropdown && (
                                            <div className="absolute top-full right-0 mt-3 w-52 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16,1,0.3,1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1 flex items-center gap-2">
                                                    <Icon name="dot-circle" className="text-[8px]" /> Filter by Status
                                                </div>
                                                <div onClick={() => { setStatusFilter(""); setShowStatusDropdown(false); }}
                                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-200" /> All Status
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {[
                                                    { id: "active", label: "Active", color: "bg-emerald-500" },
                                                    { id: "inactive", label: "Inactive", color: "bg-gray-400" },
                                                    { id: "suspended", label: "Suspended", color: "bg-amber-500" },
                                                ].map((st) => (
                                                    <div key={st.id} onClick={() => { setStatusFilter(st.id as Client["status"]); setShowStatusDropdown(false); }}
                                                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium group/item">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${st.color} group-hover/item:scale-125 transition-transform`} />
                                                        <span>{st.label}</span>
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

                        {/* Table */}
                        <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800">Clients List</h3>
                                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                                    {filtered.length} client{filtered.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            {["Client", "Sector", "Location", "Status", "Actions"].map((h) => (
                                                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                    <Icon name="building" className="text-3xl mb-2 block mx-auto" />
                                                    No clients match your filters.
                                                </td>
                                            </tr>
                                        ) : filtered.map((c) => (
                                            <ClientRow
                                                key={c.id}
                                                client={c}
                                                onView={() => setDetailClient(c)}
                                                onSuspend={() => changeStatus(c.id, "suspended")}
                                                onActivate={() => changeStatus(c.id, "active")}
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
            {detailClient && (
                <Modal onClose={() => setDetailClient(null)} title="Client Company Profile" wide>
                    <ClientDetail
                        client={detailClient}
                        onSuspend={() => changeStatus(detailClient.id, "suspended")}
                        onActivate={() => changeStatus(detailClient.id, "active")}
                    />
                </Modal>
            )}

            {/* ── ADD CLIENT MODAL ─────────────────────────────────────────── */}
            {showAddModal && (
                <Modal onClose={() => setShowAddModal(false)} title="Add New Client" wide>
                    <form onSubmit={handleAddSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Company Name</label>
                                <input type="text" required {...field("companyName")} placeholder="Hayleys PLC"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Contact Person</label>
                                <input type="text" required {...field("contactPerson")} placeholder="John Silva"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                                <input type="email" required {...field("email")} placeholder="info@company.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Phone</label>
                                <input type="tel" required {...field("phone")} placeholder="+94 11 234 5678"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Sector</label>
                                <select required {...field("sector")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50">
                                    <option value="">Select Sector</option>
                                    {categoriesData.map(c => (
                                        <optgroup key={c.label} label={c.label}>
                                            {c.subcategories.length > 0 ? (
                                                c.subcategories.map(s => <option key={s.id} value={s.label}>{s.label}</option>)
                                            ) : (
                                                <option value={c.label}>{c.label}</option>
                                            )}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Location</label>
                                <input type="text" required {...field("location")} placeholder="Colombo, Sri Lanka"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">About Company</label>
                            <textarea rows={3} {...field("about")} placeholder="Brief description of the company…"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                            <button type="button" onClick={() => setShowAddModal(false)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                                ADD CLIENT
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

// ── ClientRow ─────────────────────────────────────────────────────────────────
function ClientRow({ client, onView, onSuspend, onActivate }: {
    client: Client; onView: () => void; onSuspend: () => void; onActivate: () => void;
}): JSX.Element {
    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-5 py-3.5">
                <button onClick={onView} className="flex items-center gap-3 text-left group/name">
                    <CompanyAvatar name={client.companyName} />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover/name:text-blue-700 transition-colors">
                            {client.companyName}
                        </p>
                        <p className="text-xs text-gray-500">{client.contactPerson}</p>
                    </div>
                </button>
            </td>
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${SECTOR_COLORS[client.sector] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                    {client.sector}
                </span>
            </td>
            <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                <Icon name="map-marker-alt" className="text-gray-400 mr-1.5 text-xs" />
                {client.location}
            </td>
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[client.status]}`}>
                    {client.status}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                    <button onClick={onView} title="View Details"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Icon name="eye" />
                    </button>
                    {client.status === "active" ? (
                        <button onClick={onSuspend} title="Suspend"
                            className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                            <Icon name="pause" />
                        </button>
                    ) : (
                        <button onClick={onActivate} title="Activate"
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Icon name="play" />
                        </button>
                    )}
                </div>
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
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} mb-8`}
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

// ── Client Detail view ────────────────────────────────────────────────────────
function ClientDetail({ client, onSuspend, onActivate }: {
    client: Client; onSuspend: () => void; onActivate: () => void;
}): JSX.Element {
    return (
        <div className="space-y-6">
            {/* Profile header */}
            <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
                <CompanyAvatar name={client.companyName} size="lg" />
                <div className="flex-1">
                    <h4 className="text-xl font-black text-gray-900">{client.companyName}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Premium Client</p>
                    <p className="text-xs text-gray-400 mt-0.5"><Icon name="map-marker-alt" className="mr-1" />{client.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[client.status]}`}>
                            {client.status}
                        </span>
                        {client.status === "active" ? (
                            <button onClick={onSuspend}
                                className="text-xs text-amber-600 hover:text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full hover:bg-amber-50 transition-colors">
                                <Icon name="pause" className="mr-1" />Suspend
                            </button>
                        ) : (
                            <button onClick={onActivate}
                                className="text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-50 transition-colors">
                                <Icon name="play" className="mr-1" />Activate
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: "envelope", label: "Email", value: client.email },
                    { icon: "phone", label: "Phone", value: client.phone },
                    { icon: "industry", label: "Sector", value: client.sector },
                    { icon: "map-marker-alt", label: "Location", value: client.location },
                ].map(({ icon, label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1"><Icon name={icon} className="mr-1" />{label}</p>
                        <p className="text-sm text-gray-800 font-medium">{value}</p>
                    </div>
                ))}
            </div>

            {/* About */}
            <div>
                <h5 className="text-sm font-bold text-gray-800 mb-1.5">About Company</h5>
                <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-gray-100">{client.about}</p>
            </div>

            {/* Agreements */}
            {client.agreements.length > 0 && (
                <div>
                    <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Icon name="file-contract" className="text-blue-400" /> Current Agreements
                    </h5>
                    <div className="space-y-2">
                        {client.agreements.map((agr) => (
                            <div key={agr.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 mb-0.5">{agr.id}</p>
                                    <p className="text-sm font-semibold text-gray-800">{agr.type}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{agr.startDate} → {agr.endDate}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${AGREEMENT_STATUS_STYLES[agr.status]}`}>
                                    {agr.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Posted Jobs */}
            {client.postedJobs.length > 0 && (
                <div>
                    <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Icon name="briefcase" className="text-purple-400" /> Current Posted Jobs
                    </h5>
                    <div className="space-y-2">
                        {client.postedJobs.map((job, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{job.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Posted: {job.postedDate} ·
                                        <span className="ml-1 font-medium text-gray-600">{job.applications} applications</span>
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${JOB_STATUS_STYLES[job.status]}`}>
                                    {job.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}