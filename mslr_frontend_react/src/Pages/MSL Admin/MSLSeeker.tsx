import { useState, useEffect, useRef, type JSX, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ──────────────────────────────────────────────────────────────
interface IconProps {
    name: string;
    className?: string;
}

interface Resume {
    id: number;
    name: string;
    version: string;
    active: boolean;
    uploadDate: string;
}

interface Seeker {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    experience: string;
    skills: string[];
    location: string;
    sector: string;
    status: "active" | "inactive" | "blacklisted";
    about: string;
    currentPosition: string;
    education: string;
    resumes: Resume[];
}

interface NavItem {
    label: string;
    icon: string;
    href: string;
    active?: boolean;
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

interface AddForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    seekField: string[];
    receiveEmails: boolean;
}

// ── Icon helper ───────────────────────────────────────────────────────────────
const Icon = ({ name, className = "" }: IconProps): JSX.Element => (
    <i className={`fas fa-${name} ${className}`} />
);

// ── Notification hook (same as MSLHome) ──────────────────────────────────────
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
const INITIAL_SEEKERS: Seeker[] = [
    {
        id: 1, firstName: "John", lastName: "Doe",
        email: "john.doe@email.com", phone: "+94 71 234 5678",
        experience: "senior",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        location: "Colombo, Sri Lanka",
        sector: "Technology",
        status: "active",
        about: "Experienced full-stack developer with 5+ years in web development.",
        currentPosition: "Senior Developer at TechCorp",
        education: "BSc Computer Science, University of Colombo",
        resumes: [
            { id: 1, name: "John_Doe_Resume_2024.pdf", version: "v1.0", active: true, uploadDate: "Dec 15, 2024" },
            { id: 2, name: "John_Doe_Resume_2023.pdf", version: "v2.0", active: false, uploadDate: "Dec 10, 2023" },
        ],
    },
    {
        id: 2, firstName: "Jane", lastName: "Smith",
        email: "jane.smith@email.com", phone: "+94 72 345 6789",
        experience: "mid",
        skills: ["Python", "Django", "PostgreSQL", "AWS"],
        location: "Kandy, Sri Lanka",
        sector: "Technology",
        status: "active",
        about: "Python developer passionate about building scalable applications.",
        currentPosition: "Python Developer at DataTech",
        education: "BSc Software Engineering, University of Peradeniya",
        resumes: [
            { id: 3, name: "Jane_Smith_Resume_2024.pdf", version: "v1.0", active: true, uploadDate: "Dec 12, 2024" },
        ],
    },
    {
        id: 3, firstName: "Mike", lastName: "Johnson",
        email: "mike.johnson@email.com", phone: "+94 73 456 7890",
        experience: "entry",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        location: "Galle, Sri Lanka",
        sector: "Technology",
        status: "inactive",
        about: "Frontend developer looking for opportunities to grow and learn.",
        currentPosition: "Junior Developer at WebStart",
        education: "Diploma in Web Development, SLIIT",
        resumes: [
            { id: 4, name: "Mike_Johnson_Resume_2024.pdf", version: "v1.0", active: true, uploadDate: "Dec 08, 2024" },
        ],
    },
    {
        id: 4, firstName: "Sarah", lastName: "Wilson",
        email: "sarah.wilson@email.com", phone: "+94 74 567 8901",
        experience: "executive",
        skills: ["Java", "Spring Boot", "Microservices", "Kubernetes"],
        location: "Jaffna, Sri Lanka",
        sector: "Technology",
        status: "active",
        about: "Senior software architect with expertise in enterprise solutions.",
        currentPosition: "Software Architect at EnterpriseTech",
        education: "MSc Computer Science, University of Jaffna",
        resumes: [
            { id: 5, name: "Sarah_Wilson_Resume_2024.pdf", version: "v1.0", active: true, uploadDate: "Dec 20, 2024" },
            { id: 6, name: "Sarah_Wilson_Resume_2023.pdf", version: "v2.0", active: false, uploadDate: "Dec 15, 2023" },
            { id: 7, name: "Sarah_Wilson_Resume_2022.pdf", version: "v3.0", active: false, uploadDate: "Dec 10, 2022" },
        ],
    },
];

const NAV: NavItem[] = [
    { label: "Home", icon: "home", href: "/msl-home" },
    { label: "Seekers", icon: "users", href: "/msl-seeker", active: true },
    { label: "Clients", icon: "building", href: "/msl-client" },
    { label: "Posted", icon: "plus-circle", href: "/msl-posted" },
    { label: "Invoice", icon: "file-invoice", href: "/msl-invoice" },
    { label: "Scheduled", icon: "calendar-alt", href: "/msl-schedule" },
    { label: "Analytics", icon: "chart-bar", href: "#" },
];

const STATUS_STYLES: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    inactive: "bg-gray-100 text-gray-600 border border-gray-200",
    blacklisted: "bg-red-100 text-red-700 border border-red-200",
};

const EXP_STYLES: Record<string, string> = {
    entry: "bg-sky-100 text-sky-700",
    mid: "bg-violet-100 text-violet-700",
    senior: "bg-amber-100 text-amber-700",
    executive: "bg-rose-100 text-rose-700",
};

const SKILL_COLORS = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-orange-50 text-orange-700 border-orange-200",
];

// ── Avatar initials helper ────────────────────────────────────────────────────
function Avatar({ firstName, lastName, size = "md" }: { firstName: string; lastName: string; size?: "sm" | "md" | "lg" }): JSX.Element {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    const hue = ((firstName.charCodeAt(0) + lastName.charCodeAt(0)) * 37) % 360;
    const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
    return (
        <div
            className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
            style={{ background: `hsl(${hue},60%,52%)` }}
        >
            {initials}
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function MSLSeeker(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [seekers, setSeekers] = useState<Seeker[]>(INITIAL_SEEKERS);
    const [search, setSearch] = useState("");
    const [sectorFilter, setSectorFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [detailSeeker, setDetailSeeker] = useState<Seeker | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<AddForm>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        seekField: [],
        receiveEmails: false
    });
    const [categoriesData, setCategoriesData] = useState<{ id: string; label: string; icon: string; subcategories: { id: string; label: string }[] }[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [showFieldDropdown, setShowFieldDropdown] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [showSectorFilterDropdown, setShowSectorFilterDropdown] = useState(false);
    const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const API_URL = 'http://localhost:5194/api';
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

    const toggleExpand = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setExpandedCategories(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const findSelectedLabel = () => {
        if (addForm.seekField.length === 0) return null;
        if (addForm.seekField.length === 1) {
            const id = addForm.seekField[0];
            for (const cat of categoriesData) {
                if (cat.id === id) return { label: cat.label, icon: cat.icon };
                const sub = cat.subcategories.find(s => s.id === id);
                if (sub) return { label: sub.label, icon: cat.icon };
            }
        }
        return { label: `${addForm.seekField.length} fields selected`, icon: '📁' };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    // close dropdowns on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            const target = e.target as Node;
            if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);

            // Close filter dropdowns if clicking outside the filter area
            const filterBar = document.getElementById('seeker-filter-bar');
            if (filterBar && !filterBar.contains(target)) {
                setShowSectorFilterDropdown(false);
                setShowStatusFilterDropdown(false);
            }
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // filtered list
    const filtered = seekers.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            s.firstName.toLowerCase().includes(q) ||
            s.lastName.toLowerCase().includes(q) ||
            s.skills.some(sk => sk.toLowerCase().includes(q)) ||
            s.location.toLowerCase().includes(q);
        const matchesSector = sectorFilter ? s.sector === sectorFilter : true;
        const matchesStatus = statusFilter ? s.status === statusFilter : true;
        return matchSearch && matchesSector && matchesStatus;
    });

    const changeStatus = (id: number, newStatus: Seeker["status"]) => {
        setSeekers((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
        const s = seekers.find((x) => x.id === id);
        if (s) push(`${s.firstName} ${s.lastName} marked as ${newStatus}`, newStatus === "active" ? "success" : "warning");
    };

    const setActiveResume = (seekerId: number, resumeId: number) => {
        setSeekers((prev) => prev.map((s) =>
            s.id === seekerId
                ? { ...s, resumes: s.resumes.map((r) => ({ ...r, active: r.id === resumeId })) }
                : s
        ));
        // update detailSeeker view
        setDetailSeeker((d) => d ? { ...d, resumes: d.resumes.map((r) => ({ ...r, active: r.id === resumeId })) } : d);
        push("Active resume updated", "success");
    };

    const handleAddSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Validation (simplified for admin context)
        if (addForm.password !== addForm.confirmPassword) {
            push("Passwords do not match", "error");
            return;
        }

        const newSeeker: Seeker = {
            id: Date.now(),
            firstName: addForm.firstName,
            lastName: addForm.lastName,
            email: addForm.email,
            phone: "", // Not in registration but in Seeker interface
            experience: "Intermediate",
            skills: ["Skill 1", "Skill 2"], // Mock
            location: "Colombo, Sri Lanka", // Mock
            sector: findSelectedLabel()?.label || "General",
            status: "active",
            about: "Bio...",
            currentPosition: "Seeking opportunities",
            education: "Not specified",
            resumes: [], // Admin doesn't upload file here yet?
            // Registration has CV upload. I can mock it or leave as empty resumes.
        };
        setSeekers((prev) => [newSeeker, ...prev]);
        push(`${addForm.firstName} ${addForm.lastName} added successfully`, "success");
        setShowAddModal(false);
        setCvFile(null);
        setAddForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
            seekField: [],
            receiveEmails: false
        });
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <style>{`
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .glass-dropdown {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
            `}</style>

            <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-4">
                            <Link to="/msl-home" className="flex items-center gap-2">
                                <img src={mslLogo} alt="MSL Logo" className="h-8 w-auto" />
                            </Link>
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text" placeholder="Title, skill or company"
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-72"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/msl-home" className="text-blue-600 font-semibold flex items-center gap-1 text-sm">
                                <Icon name="home" /><span className="hidden md:inline">Home</span>
                            </Link>
                            <button className="relative text-gray-600 hover:text-blue-600 text-sm flex items-center gap-1" onClick={() => push("5 new notifications", "info")}>
                                <Icon name="bell" /><span className="hidden md:inline">Notifications</span>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">5</span>
                            </button>
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
                                    <Icon name="chevron-down" className="text-gray-500 text-xs" />
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in shadow-gray-200/50">
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
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Icon name="plus" /> Add New Seeker
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
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Seeker Management</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all registered job seekers</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                            >
                                <Icon name="plus" /> Add Seeker
                            </button>
                        </div>

                        {/* Search + filters */}
                        <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-gray-100 shadow-sm" id="seeker-filter-bar">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name, skills or location…"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="flex gap-3 flex-wrap relative">
                                    {/* Custom Sector Filter Dropdown */}
                                    <div className="relative">
                                        <div className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none ring-blue-500 bg-white min-w-[160px] flex items-center justify-between cursor-pointer hover:border-blue-500 transition-all"
                                            onClick={() => { setShowSectorFilterDropdown(!showSectorFilterDropdown); setShowStatusFilterDropdown(false); }}>
                                            <span className={sectorFilter ? "text-gray-900 font-medium" : "text-gray-500"}>
                                                {sectorFilter || "All Sectors"}
                                            </span>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform ${showSectorFilterDropdown ? 'rotate-180' : ''}`} />
                                        </div>

                                        {showSectorFilterDropdown && (
                                            <div className="absolute top-full left-0 mt-3 w-72 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 max-h-[400px] overflow-y-auto border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1 flex items-center gap-2">
                                                    <Icon name="layer-group" className="text-[8px]" /> Industry Sector
                                                </div>
                                                <div className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors font-medium"
                                                    onClick={() => { setSectorFilter(""); setShowSectorFilterDropdown(false); }}>
                                                    <Icon name="border-all" className="text-gray-300 text-xs" /> All Sectors
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {categoriesData.map(cat => (
                                                    <div key={cat.label} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group/cat"
                                                        onClick={() => { setSectorFilter(cat.label); setShowSectorFilterDropdown(false); }}>
                                                        <span className="text-base group-hover/cat:scale-125 transition-transform">{cat.icon}</span>
                                                        <span className="font-medium">{cat.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Custom Status Filter Dropdown */}
                                    <div className="relative">
                                        <div className="border border-gray-200 rounded-xl px-5 py-3 text-sm ring-blue-500 bg-white min-w-[150px] flex items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group shadow-sm"
                                            onClick={() => { setShowStatusFilterDropdown(!showStatusFilterDropdown); setShowSectorFilterDropdown(false); }}>
                                            <div className="flex items-center gap-2.5">
                                                {statusFilter ? (
                                                    <div className={`w-2.5 h-2.5 rounded-full ${statusFilter === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : statusFilter === 'inactive' ? 'bg-gray-400' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
                                                ) : (
                                                    <Icon name="filter" className="text-gray-400 text-xs" />
                                                )}
                                                <span className={statusFilter ? "text-gray-900 font-bold capitalize" : "text-gray-500 font-medium"}>
                                                    {statusFilter || "Status"}
                                                </span>
                                            </div>
                                            <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform duration-300 ${showStatusFilterDropdown ? 'rotate-180' : ''}`} />
                                        </div>

                                        {showStatusFilterDropdown && (
                                            <div className="absolute top-full right-0 mt-3 w-52 glass-dropdown rounded-2xl shadow-2xl z-30 p-2 overflow-hidden border border-gray-100"
                                                style={{ animation: "fadeDown .25s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                                                <div className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] border-b border-gray-50 mb-1 flex items-center gap-2">
                                                    <Icon name="dot-circle" className="text-[8px]" /> Filter by Status
                                                </div>
                                                <div className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group/item font-medium"
                                                    onClick={() => { setStatusFilter(""); setShowStatusFilterDropdown(false); }}>
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-200 group-hover/item:border-blue-300" />
                                                    <span>All Status</span>
                                                </div>
                                                <div className="h-px bg-gray-50 my-1 mx-2" />
                                                {[
                                                    { id: "active", label: "Active", color: "bg-emerald-500" },
                                                    { id: "inactive", label: "Inactive", color: "bg-gray-400" },
                                                    { id: "blacklisted", label: "Blacklisted", color: "bg-red-500" }
                                                ].map(st => (
                                                    <div key={st.id} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl cursor-pointer flex items-center gap-3 transition-colors group/item font-medium"
                                                        onClick={() => { setStatusFilter(st.id as Seeker["status"]); setShowStatusFilterDropdown(false); }}>
                                                        <div className={`w-2.5 h-2.5 rounded-full ${st.color} shadow-sm group-hover/item:scale-125 transition-transform`} />
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
                                <h3 className="text-sm font-semibold text-gray-800">Seekers List</h3>
                                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full font-medium">
                                    {filtered.length} seeker{filtered.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            {["Seeker", "Experience", "Skills", "Location", "Status", "Actions"].map((h) => (
                                                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                    <Icon name="users" className="text-3xl mb-2 block mx-auto" />
                                                    No seekers match your filters.
                                                </td>
                                            </tr>
                                        ) : filtered.map((s) => (
                                            <SeekerRow
                                                key={s.id}
                                                seeker={s}
                                                onView={() => setDetailSeeker(s)}
                                                onBlacklist={() => changeStatus(s.id, "blacklisted")}
                                                onActivate={() => changeStatus(s.id, "active")}
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
            {detailSeeker && (
                <Modal onClose={() => setDetailSeeker(null)} title="Seeker Profile" wide>
                    <SeekerDetail
                        seeker={detailSeeker}
                        onSetActiveResume={(rid) => setActiveResume(detailSeeker.id, rid)}
                        onStatusChange={(newStatus) => {
                            if (detailSeeker) {
                                changeStatus(detailSeeker.id, newStatus);
                                setDetailSeeker((d) => (d ? { ...d, status: newStatus } : null));
                            }
                        }}
                    />
                </Modal>
            )}

            {/* ── ADD SEEKER MODAL ────────────────────────────────────────── */}
            {showAddModal && (
                <Modal onClose={() => setShowAddModal(false)} title="Add New Seeker" wide>
                    <form onSubmit={handleAddSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">First Name</label>
                                <input type="text" required value={addForm.firstName}
                                    onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Last Name</label>
                                <input type="text" required value={addForm.lastName}
                                    onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                            <input type="email" required value={addForm.email}
                                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" placeholder="john.doe@example.com" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                                <input type="password" required value={addForm.password}
                                    onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Confirm Password</label>
                                <input type="password" required value={addForm.confirmPassword}
                                    onChange={(e) => setAddForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Gender</label>
                                <div className="flex gap-6 mt-1">
                                    {['Male', 'Female'].map((g) => (
                                        <label key={g} className="flex items-center cursor-pointer group gap-2.5">
                                            <input type="radio" name="gender" value={g} required
                                                onChange={(e) => setAddForm(f => ({ ...f, gender: e.target.value }))}
                                                checked={addForm.gender === g} className="sr-only" />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${addForm.gender === g ? 'border-blue-600' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full bg-blue-600 transition-all ${addForm.gender === g ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                                            </div>
                                            <span className={`text-sm font-medium ${addForm.gender === g ? 'text-gray-900' : 'text-gray-500'}`}>{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Seek Field</label>
                                <div className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm flex items-center justify-between cursor-pointer bg-slate-50/50 hover:border-blue-500 transition-all"
                                    onClick={() => setShowFieldDropdown(!showFieldDropdown)}>
                                    <span className={addForm.seekField.length > 0 ? "text-gray-900" : "text-gray-400"}>
                                        {addForm.seekField.length > 0 ? (
                                            <span className="flex items-center gap-2">
                                                <span>{findSelectedLabel()?.icon}</span>
                                                <span className="truncate max-w-[120px]">{findSelectedLabel()?.label}</span>
                                            </span>
                                        ) : 'Select Industry'}
                                    </span>
                                    <Icon name="chevron-down" className={`text-gray-400 text-xs transition-transform ${showFieldDropdown ? 'rotate-180' : ''}`} />
                                </div>

                                {showFieldDropdown && (
                                    <div className="absolute bottom-full mb-2 left-0 w-full bg-white rounded-xl border border-gray-200 shadow-xl z-[60] p-2 max-h-[300px] overflow-y-auto">
                                        {categoriesData.map(cat => (
                                            <div key={cat.label} className="mb-1">
                                                <div className="flex items-center px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer group"
                                                    onClick={() => toggleExpand(cat.label)}>
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2.5 transition-all ${cat.id && addForm.seekField.includes(cat.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const subIds = cat.subcategories.map(s => s.id);
                                                            const allIds = cat.id ? [cat.id, ...subIds] : subIds;
                                                            const isAllSelected = allIds.every(id => addForm.seekField.includes(id));
                                                            setAddForm(prev => ({
                                                                ...prev,
                                                                seekField: isAllSelected ? prev.seekField.filter(id => !allIds.includes(id)) : Array.from(new Set([...prev.seekField, ...allIds]))
                                                            }));
                                                        }}>
                                                        {((cat.id && addForm.seekField.includes(cat.id)) || (cat.subcategories.length > 0 && cat.subcategories.every(s => addForm.seekField.includes(s.id)))) && <Icon name="check" className="text-[8px] text-white" />}
                                                    </div>
                                                    <span className="mr-2">{cat.icon}</span>
                                                    <span className="text-sm flex-1 font-medium text-gray-700">{cat.label}</span>
                                                    {cat.subcategories.length > 0 && <Icon name="chevron-down" className={`text-[10px] text-gray-400 transition-transform ${expandedCategories.includes(cat.label) ? 'rotate-180' : ''}`} />}
                                                </div>

                                                {expandedCategories.includes(cat.label) && cat.subcategories.map(sub => (
                                                    <div key={sub.id} className="ml-8 flex items-center px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"
                                                        onClick={() => setAddForm(prev => ({
                                                            ...prev,
                                                            seekField: prev.seekField.includes(sub.id) ? prev.seekField.filter(x => x !== sub.id) : [...prev.seekField, sub.id]
                                                        }))}>
                                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center mr-2.5 transition-all ${addForm.seekField.includes(sub.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                            {addForm.seekField.includes(sub.id) && <Icon name="check" className="text-[7px] text-white" />}
                                                        </div>
                                                        <span className="text-xs text-gray-600">{sub.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-1">
                            <input type="checkbox" id="receiveEmails" checked={addForm.receiveEmails}
                                onChange={(e) => setAddForm(f => ({ ...f, receiveEmails: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="receiveEmails" className="text-sm text-gray-600 cursor-pointer">Receive jobs by email</label>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">CV / Resume</label>
                            <div className="relative group">
                                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                        <Icon name="cloud-upload-alt" className="text-lg" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {cvFile ? cvFile.name : 'Upload CV / Resume'}
                                        </p>
                                        <p className="text-[10px] text-gray-500">PDF, DOC or DOCX (Max 5MB)</p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold">BROWSE</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                            <button type="button" onClick={() => setShowAddModal(false)}
                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                                REGISTER SEEKER
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

            <style>{`
          @keyframes slideIn { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }
          @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        `}</style>
        </div>
    );
}

// ── SeekerRow ─────────────────────────────────────────────────────────────────
function SeekerRow({ seeker, onView, onBlacklist, onActivate }: { seeker: Seeker; onView: () => void; onBlacklist: () => void; onActivate: () => void }): JSX.Element {
    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-5 py-3.5">
                <button onClick={onView} className="flex items-center gap-3 text-left group/name">
                    <Avatar firstName={seeker.firstName} lastName={seeker.lastName} />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover/name:text-blue-700 transition-colors">
                            {seeker.firstName} {seeker.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{seeker.email}</p>
                    </div>
                </button>
            </td>
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${EXP_STYLES[seeker.experience] || "bg-gray-100 text-gray-700"}`}>
                    {seeker.experience}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1">
                    {seeker.skills.slice(0, 3).map((sk, i) => (
                        <span key={sk} className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                            {sk}
                        </span>
                    ))}
                    {seeker.skills.length > 3 && (
                        <span className="text-xs text-gray-400 flex items-center">+{seeker.skills.length - 3}</span>
                    )}
                </div>
            </td>
            <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                <Icon name="map-marker-alt" className="text-gray-400 mr-1.5 text-xs" />
                {seeker.location}
            </td>
            <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[seeker.status]}`}>
                    {seeker.status}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-1">
                    <button onClick={onView} title="View Details"
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Icon name="eye" />
                    </button>
                    {seeker.status === "active" ? (
                        <button onClick={onBlacklist} title="Blacklist"
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                            <Icon name="ban" />
                        </button>
                    ) : (
                        <button onClick={onActivate} title="Activate"
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Icon name="check" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ onClose, title, children, wide }: { onClose: () => void; title: string; children: ReactNode; wide?: boolean }): JSX.Element {
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

// ── Seeker Detail view ────────────────────────────────────────────────────────
function SeekerDetail({ seeker, onSetActiveResume, onStatusChange }: { seeker: Seeker; onSetActiveResume: (rid: number) => void; onStatusChange: (newStatus: Seeker["status"]) => void }): JSX.Element {
    return (
        <div className="space-y-5">
            {/* Profile header */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <Avatar firstName={seeker.firstName} lastName={seeker.lastName} size="lg" />
                <div className="flex-1">
                    <h4 className="text-xl font-black text-gray-900">{seeker.firstName} {seeker.lastName}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{seeker.currentPosition}</p>
                    <p className="text-xs text-gray-400 mt-0.5"><Icon name="map-marker-alt" className="mr-1" />{seeker.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[seeker.status]}`}>
                            {seeker.status}
                        </span>
                        {seeker.status === "active" ? (
                            <button onClick={() => onStatusChange("blacklisted")}
                                className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2.5 py-1 rounded-full hover:bg-red-50 transition-colors">
                                <Icon name="ban" className="mr-1" />Blacklist
                            </button>
                        ) : (
                            <button onClick={() => onStatusChange("active")}
                                className="text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-50 transition-colors">
                                <Icon name="check" className="mr-1" />Activate
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: "envelope", label: "Email", value: seeker.email },
                    { icon: "phone", label: "Phone", value: seeker.phone },
                    { icon: "briefcase", label: "Experience", value: seeker.experience, cap: true },
                    { icon: "graduation-cap", label: "Education", value: seeker.education },
                ].map(({ icon, label, value, cap }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1"><Icon name={icon} className="mr-1" />{label}</p>
                        <p className={`text-sm text-gray-800 font-medium ${cap ? "capitalize" : ""}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* About */}
            <div>
                <h5 className="text-sm font-bold text-gray-800 mb-1.5">About</h5>
                <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-gray-100">{seeker.about}</p>
            </div>

            {/* Skills */}
            <div>
                <h5 className="text-sm font-bold text-gray-800 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                    {seeker.skills.map((sk, i) => (
                        <span key={sk} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                            {sk}
                        </span>
                    ))}
                </div>
            </div>

            {/* Resumes */}
            {seeker.resumes.length > 0 && (
                <div>
                    <h5 className="text-sm font-bold text-gray-800 mb-2">Resumes</h5>
                    <div className="space-y-2">
                        {seeker.resumes.map((r) => (
                            <div key={r.id}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-colors
                  ${r.active ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.active ? "bg-blue-600" : "bg-gray-200"}`}>
                                        <Icon name="file-pdf" className={r.active ? "text-white text-sm" : "text-gray-500 text-sm"} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{r.name}</p>
                                        <p className="text-xs text-gray-400">{r.version} · {r.uploadDate}</p>
                                    </div>
                                </div>
                                {r.active ? (
                                    <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">Active</span>
                                ) : (
                                    <button onClick={() => onSetActiveResume(r.id)}
                                        className="text-xs text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-2.5 py-1 rounded-full transition-colors">
                                        Set Active
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}