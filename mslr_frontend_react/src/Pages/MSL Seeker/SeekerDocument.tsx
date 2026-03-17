import { useState, useRef, useEffect, type JSX, type ReactNode } from "react";
import { Link } from "react-router-dom";
import mslLogo from "../../assets/mslLOGO.png";

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IconProps { name: string; className?: string; }

interface Document {
    id: string;
    name: string;
    uploaded: boolean;
    icon: string;
    fileName?: string;
    fileSize?: string;
    uploadedDate?: string;
}

interface ResumeVersion {
    id: number;
    fileName: string;
    uploadedDate: string;
    fileSize: string;
    active: boolean;
}

interface Notification {
    id: number;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

interface UploadForm {
    versionName: string;
    file: File | null;
    setAsActive: boolean;
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
const INITIAL_DOCUMENTS: Document[] = [
    { id: "birth", name: "Birth Certificate", uploaded: true, icon: "certificate", fileName: "Birth_Certificate.pdf", fileSize: "1.2 MB", uploadedDate: "Dec 10, 2024" },
    { id: "nic", name: "NIC Copy", uploaded: true, icon: "id-card", fileName: "NIC_Copy.pdf", fileSize: "0.8 MB", uploadedDate: "Dec 11, 2024" },
    { id: "driving", name: "Driving License", uploaded: false, icon: "id-badge" },
    { id: "cover", name: "Cover Letter", uploaded: true, icon: "envelope-open-text", fileName: "Cover_Letter.pdf", fileSize: "0.5 MB", uploadedDate: "Dec 12, 2024" },
    { id: "service", name: "Service Letters", uploaded: false, icon: "file-signature" },
];

const INITIAL_RESUMES: ResumeVersion[] = [
    { id: 1, fileName: "Resume_v1.pdf", uploadedDate: "Dec 15, 2024", fileSize: "2.3 MB", active: true },
    { id: 2, fileName: "Resume_v2.pdf", uploadedDate: "Dec 10, 2024", fileSize: "2.1 MB", active: false },
    { id: 3, fileName: "Resume_v3.pdf", uploadedDate: "Dec 05, 2024", fileSize: "2.4 MB", active: false },
];

const NAV = [
    { label: "Home", icon: "home", href: "/seeker-home" },
    { label: "Documents", icon: "file-alt", href: "/seeker-documents", active: true },
    { label: "Profile", icon: "user", href: "/seeker-profile" },
    { label: "My Applications", icon: "clipboard-list", href: "/seeker-applications" },
];

const EMPTY_UPLOAD: UploadForm = { versionName: "", file: null, setAsActive: false };

// ── Helpers ───────────────────────────────────────────────────────────────────
function todayLabel(): string {
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ═════════════════════════════════════════════════════════════════════════════
export default function SeekerDocument(): JSX.Element {
    const { notes, push, dismiss } = useNotifications();
    const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
    const [resumes, setResumes] = useState<ResumeVersion[]>(INITIAL_RESUMES);
    const [profileOpen, setProfileOpen] = useState(false);
    const [previewResume, setPreviewResume] = useState<ResumeVersion | null>(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadForm, setUploadForm] = useState<UploadForm>(EMPTY_UPLOAD);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // close profile on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node))
                setProfileOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // ── Stats ─────────────────────────────────────────────────────────────────
    const uploadedCount = documents.filter((d) => d.uploaded).length;
    const totalCount = documents.length;
    const progressPct = Math.round((uploadedCount / totalCount) * 100);

    // ── Document actions ──────────────────────────────────────────────────────
    const handleDocUpload = (id: string) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) { push("File must be under 5 MB", "error"); return; }
            setUploadingId(id);
            setTimeout(() => {
                setDocuments((prev) => prev.map((d) =>
                    d.id === id ? {
                        ...d, uploaded: true,
                        fileName: file.name,
                        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                        uploadedDate: todayLabel(),
                    } : d
                ));
                setUploadingId(null);
                const docName = documents.find((d) => d.id === id)?.name ?? "Document";
                push(`${docName} uploaded successfully!`, "success");
            }, 1800);
        };
        input.click();
    };

    // ── Resume actions ────────────────────────────────────────────────────────
    const setActiveResume = (id: number) => {
        setResumes((prev) => prev.map((r) => ({ ...r, active: r.id === id })));
        push("Resume set as active successfully!", "success");
    };

    const deleteResume = (id: number) => {
        const r = resumes.find((x) => x.id === id);
        if (!r) return;
        if (r.active) { push("Cannot delete active resume. Set another as active first.", "error"); return; }
        if (!window.confirm(`Delete ${r.fileName}?`)) return;
        setResumes((prev) => prev.filter((x) => x.id !== id));
        push(`${r.fileName} deleted successfully!`, "success");
    };

    const handleResumeUploadSubmit = () => {
        if (!uploadForm.versionName.trim()) { push("Please enter a version name", "error"); return; }
        if (!uploadForm.file) { push("Please select a file", "error"); return; }
        if (uploadForm.file.size > 5 * 1024 * 1024) { push("File must be under 5 MB", "error"); return; }

        const newResume: ResumeVersion = {
            id: Date.now(),
            fileName: `${uploadForm.versionName}.pdf`,
            uploadedDate: todayLabel(),
            fileSize: `${(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB`,
            active: uploadForm.setAsActive,
        };

        setResumes((prev) =>
            uploadForm.setAsActive
                ? [newResume, ...prev.map((r) => ({ ...r, active: false }))]
                : [newResume, ...prev]
        );
        push("Resume uploaded successfully!", "success");
        setShowUploadForm(false);
        setUploadForm(EMPTY_UPLOAD);
    };

    // ── Drag & drop ───────────────────────────────────────────────────────────
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setUploadForm((f) => ({ ...f, file }));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <style>{`
                /* ── Scrollbar ─────────────────────────────────────── */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
                ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

                /* ── Core animations ───────────────────────────────── */
                @keyframes fadeIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeDown  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideIn   { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
                @keyframes fadeUp    { from{opacity:0;transform:translateY(20px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes slideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
                @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes progressPulse { 0%,100%{opacity:1} 50%{opacity:.7} }
                @keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.4)} 70%{box-shadow:0 0 0 6px rgba(59,130,246,0)} }

                /* ── Utility classes ───────────────────────────────── */
                .fade-in      { animation: fadeIn .3s ease-in-out; }
                .slide-down   { animation: slideDown .3s ease-in-out; }
                .skeleton     { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }

                /* ── Document card ─────────────────────────────────── */
                .document-card { transition: all .2s ease-in-out; }
                .document-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.1); }
                .document-card:hover .document-icon { transform: scale(1.1); color: #3b82f6; }
                .document-card.resume { background: linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%); border: 2px solid #3b82f6; }

                /* ── Resume version card ───────────────────────────── */
                .resume-version-card { transition: all .3s ease-in-out; }
                .resume-version-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.1); }
                .resume-version-card.active { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); animation: pulse 2s infinite; }

                /* ── Resume action buttons ─────────────────────────── */
                .resume-action-btn { transition: all .2s ease-in-out; }
                .resume-action-btn:hover { transform: scale(1.1); }
                .resume-action-btn:active { transform: scale(.95); }

                /* ── Upload button ─────────────────────────────────── */
                .upload-btn { transition: all .2s ease-in-out; }
                .upload-btn:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(59,130,246,.3); }

                /* ── Progress bar ──────────────────────────────────── */
                .progress-bar { transition: width .5s ease-in-out; animation: progressPulse 2s infinite; }

                /* ── File upload area ──────────────────────────────── */
                .file-upload-area { border: 2px dashed #d1d5db; transition: all .2s ease-in-out; }
                .file-upload-area:hover { border-color: #3b82f6; background-color: #f8fafc; }
                .file-upload-area.dragover { border-color: #3b82f6; background-color: #eff6ff; transform: scale(1.02); }

                /* ── Drag-drop zone ────────────────────────────────── */
                .drag-drop-zone { border: 2px dashed #d1d5db; border-radius: .5rem; padding: 2rem; text-align: center; transition: all .2s ease-in-out; cursor: pointer; }
                .drag-drop-zone:hover { border-color: #3b82f6; background-color: #f8fafc; }
                .drag-drop-zone.dragover { border-color: #3b82f6; background-color: #eff6ff; transform: scale(1.02); }

                /* ── File icon ─────────────────────────────────────── */
                .file-icon { width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; border-radius:4px; background:#f3f4f6; color:#6b7280; transition: all .2s; }
                .file-icon:hover { background:#3b82f6; color:white; }

                /* ── Status badges ─────────────────────────────────── */
                .status-badge.uploaded   { background: linear-gradient(135deg,#10b981,#059669); }
                .status-badge.not-uploaded { background: linear-gradient(135deg,#6b7280,#4b5563); }

                /* ── Version indicator ─────────────────────────────── */
                .resume-version-indicator.active { background: linear-gradient(135deg,#3b82f6,#1d4ed8); color:white; animation: pulse 2s infinite; }

                /* ── Resume delete shake ───────────────────────────── */
                .resume-delete-confirmation { animation: shake .5s ease-in-out; }

                /* ── Loading overlay ───────────────────────────────── */
                .loading { opacity:.6; pointer-events:none; }

                /* ── Primary / secondary buttons ───────────────────── */
                .btn-primary { background:#3b82f6; color:white; padding:.5rem 1rem; border-radius:.375rem; font-weight:500; transition: all .2s; }
                .btn-primary:hover { background:#2563eb; transform:translateY(-1px); }
                .btn-secondary { background:white; color:#374151; border:1px solid #d1d5db; padding:.5rem 1rem; border-radius:.375rem; font-weight:500; transition: all .2s; }
                .btn-secondary:hover { background:#f9fafb; border-color:#9ca3af; }

                /* ── Skip option ───────────────────────────────────── */
                .skip-option { text-align:center; margin-top:1rem; padding:1rem; background:#f9fafb; border-radius:.5rem; border:1px solid #e5e7eb; }
                .skip-button { background:transparent; color:#6b7280; border:1px solid #d1d5db; padding:.5rem 1rem; border-radius:.375rem; font-size:.875rem; transition: all .2s; }
                .skip-button:hover { background:#f3f4f6; color:#374151; }

                /* ── Notification ──────────────────────────────────── */
                .notification { position:fixed; top:1rem; right:1rem; z-index:50; padding:1rem; border-radius:.5rem; box-shadow:0 4px 12px rgba(0,0,0,.15); transition: all .3s; transform:translateX(100%); }
                .notification.show { transform:translateX(0); }
                .notification.success { background:#10b981; color:white; }
                .notification.error   { background:#ef4444; color:white; }
                .notification.info    { background:#3b82f6; color:white; }

                /* ── Upload modal ──────────────────────────────────── */
                .upload-modal { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:100; opacity:0; visibility:hidden; transition: all .3s; }
                .upload-modal.show { opacity:1; visibility:visible; }
                .upload-modal-content { background:white; border-radius:.5rem; padding:2rem; max-width:500px; width:90%; transform:scale(.9); transition: all .3s; }
                .upload-modal.show .upload-modal-content { transform:scale(1); }

                /* ── Resume preview ────────────────────────────────── */
                .resume-preview-modal  { animation: fadeIn .2s ease-in-out; }
                .resume-preview-content { animation: slideUp .3s ease-in-out; }

                /* ── Document preview image ────────────────────────── */
                .document-preview { max-width:100%; height:auto; border-radius:.25rem; box-shadow:0 2px 4px rgba(0,0,0,.1); }

                /* ── Document management bg ────────────────────────── */
                .document-management { background: linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%); }

                /* ── Accessibility focus ───────────────────────────── */
                button:focus, a:focus, input:focus { outline:2px solid #3b82f6; outline-offset:2px; }
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
                                <button onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
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
                        <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-end p-3">
                            <span className="text-white text-xs font-medium opacity-90">Zero-cost Degrees</span>
                        </div>
                        <div className="px-4">
                            <div className="w-16 h-16 rounded-full border-4 border-white -mt-8 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow">TK</div>
                        </div>
                        <div className="px-4 pb-4 pt-2">
                            <h2 className="text-base font-bold text-gray-900 leading-tight">Thesara Kariyawasam</h2>
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
                            {["About", "Accessibility", "Help Center", "Privacy & Terms"].map((l) => (
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
                                <Icon name="file-alt" className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Document Management</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Upload and manage your important documents. These are optional — skip if you prefer.</p>
                            </div>
                        </div>

                        {/* ── Progress bar ───────────────────────────────────── */}
                        <div className="mt-5 mb-7 bg-slate-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Upload Progress</span>
                                <span className="text-sm font-bold text-blue-600">{uploadedCount}/{totalCount} documents</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="progress-bar h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">{progressPct}% complete</p>
                        </div>

                        {/* ── Document rows ──────────────────────────────────── */}
                        <div className="space-y-3 mb-6">
                            {documents.map((doc) => (
                                <DocumentRow
                                    key={doc.id}
                                    doc={doc}
                                    loading={uploadingId === doc.id}
                                    onUpload={() => handleDocUpload(doc.id)}
                                />
                            ))}
                        </div>

                        {/* ── Resume section ─────────────────────────────────── */}
                        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                            {/* Resume header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                        <Icon name="file-alt" className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Resume</h3>
                                        <p className="text-xs text-gray-500">Manage multiple versions</p>
                                    </div>
                                </div>
                                {!showUploadForm && (
                                    <button onClick={() => setShowUploadForm(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm">
                                        <Icon name="plus" /> Upload New Version
                                    </button>
                                )}
                            </div>

                            {/* Upload form */}
                            {showUploadForm && (
                                <div className="bg-white rounded-xl border border-blue-200 p-4 mb-4" style={{ animation: "fadeUp .2s ease-out" }}>
                                    <h4 className="font-bold text-gray-900 mb-4 text-sm">Upload New Resume Version</h4>
                                    <div className="space-y-4">
                                        {/* Version name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Version Name</label>
                                            <input type="text" value={uploadForm.versionName}
                                                onChange={(e) => setUploadForm((f) => ({ ...f, versionName: e.target.value }))}
                                                placeholder="e.g. Resume_v4"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50" />
                                        </div>

                                        {/* Drop zone */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">File</label>
                                            <div
                                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={handleDrop}
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                                    ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"}`}
                                            >
                                                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0];
                                                        if (f) setUploadForm((prev) => ({ ...prev, file: f }));
                                                    }} />
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${uploadForm.file ? "bg-blue-100" : "bg-gray-100"}`}>
                                                        <Icon name={uploadForm.file ? "file-pdf" : "cloud-upload-alt"} className={`text-2xl ${uploadForm.file ? "text-blue-600" : "text-gray-400"}`} />
                                                    </div>
                                                    {uploadForm.file ? (
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{uploadForm.file.name}</p>
                                                            <p className="text-xs text-gray-400">{(uploadForm.file.size / (1024 * 1024)).toFixed(1)} MB</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">PDF, DOC, DOCX up to 5MB</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Set as active checkbox */}
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${uploadForm.setAsActive ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}
                                                onClick={() => setUploadForm((f) => ({ ...f, setAsActive: !f.setAsActive }))}>
                                                {uploadForm.setAsActive && <Icon name="check" className="text-white text-[10px]" />}
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Set as active resume</span>
                                        </label>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-1">
                                            <button onClick={handleResumeUploadSubmit}
                                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                                                Upload Resume
                                            </button>
                                            <button onClick={() => { setShowUploadForm(false); setUploadForm(EMPTY_UPLOAD); }}
                                                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors text-sm border border-gray-200">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resume list */}
                            <div className="space-y-2.5">
                                {resumes.map((r) => (
                                    <ResumeCard
                                        key={r.id}
                                        resume={r}
                                        onSetActive={() => setActiveResume(r.id)}
                                        onPreview={() => setPreviewResume(r)}
                                        onDownload={() => push(`Downloading ${r.fileName}…`, "info")}
                                        onDelete={() => deleteResume(r.id)}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* ── RESUME PREVIEW MODAL ─────────────────────────────────────── */}
            {previewResume && (
                <Modal onClose={() => setPreviewResume(null)} title="Resume Preview" wide>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Icon name="file-pdf" className="text-blue-600 text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{previewResume.fileName}</h4>
                                <p className="text-xs text-gray-400">Uploaded: {previewResume.uploadedDate} · {previewResume.fileSize}</p>
                            </div>
                            {previewResume.active && (
                                <span className="ml-auto text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">Active</span>
                            )}
                        </div>

                        {/* Preview placeholder */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-10 text-center border-2 border-dashed border-gray-200">
                            <Icon name="file-pdf" className="text-6xl text-gray-300 mb-3 block mx-auto" />
                            <p className="text-base font-semibold text-gray-600 mb-1">Resume Preview</p>
                            <p className="text-sm text-gray-400">Download to view the full document</p>
                            <div className="flex items-center justify-center gap-3 mt-5">
                                <button onClick={() => push(`Downloading ${previewResume.fileName}…`, "info")}
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                                    <Icon name="download" /> Download
                                </button>
                                <button onClick={() => push("Printing…", "info")}
                                    className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <Icon name="print" /> Print
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

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

// ── DocumentRow ───────────────────────────────────────────────────────────────
function DocumentRow({ doc, loading, onUpload }: {
    doc: Document; loading: boolean; onUpload: () => void;
}): JSX.Element {
    return (
        <div className={`document-card flex items-center justify-between p-4 rounded-xl border
            ${doc.uploaded ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-gray-200"}`}>
            <div className="flex items-center gap-3">
                <div className={`document-icon w-10 h-10 rounded-xl flex items-center justify-center ${doc.uploaded ? "bg-emerald-100" : "bg-gray-100"}`}>
                    <Icon name={doc.uploaded ? "file-pdf" : doc.icon} className={doc.uploaded ? "text-emerald-600" : "text-gray-400"} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">{doc.name}</h3>
                    {doc.uploaded && doc.fileName ? (
                        <p className="text-xs text-gray-400">{doc.fileName} · {doc.fileSize} · {doc.uploadedDate}</p>
                    ) : (
                        <p className="text-xs text-gray-400">Not uploaded</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {doc.uploaded && (
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
                        <Icon name="check" className="text-[9px]" /> Uploaded
                    </span>
                )}
                <button
                    onClick={onUpload}
                    disabled={loading}
                    className="upload-btn bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                >
                    {loading ? (
                        <><Icon name="spinner fa-spin" /> Uploading…</>
                    ) : (
                        <><Icon name={doc.uploaded ? "sync-alt" : "upload"} /> {doc.uploaded ? "Replace" : "Upload"}</>
                    )}
                </button>
            </div>
        </div>
    );
}

// ── ResumeCard ────────────────────────────────────────────────────────────────
function ResumeCard({ resume, onSetActive, onPreview, onDownload, onDelete }: {
    resume: ResumeVersion;
    onSetActive: () => void; onPreview: () => void;
    onDownload: () => void; onDelete: () => void;
}): JSX.Element {
    return (
        <div className={`resume-version-card bg-white rounded-xl p-3.5 flex items-center justify-between
            ${resume.active ? "active border-2 border-blue-500 shadow-sm shadow-blue-100" : "border border-gray-200"}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${resume.active ? "bg-blue-600" : "bg-gray-100"}`}>
                    <Icon name="file-pdf" className={resume.active ? "text-white" : "text-gray-500"} />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">{resume.fileName}</p>
                    <p className="text-xs text-gray-400">Uploaded: {resume.uploadedDate} · {resume.fileSize}</p>
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                {resume.active ? (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">Active</span>
                ) : (
                    <button onClick={onSetActive} title="Set as Active"
                        className="resume-action-btn p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                        <Icon name="star" />
                    </button>
                )}
                <button onClick={onPreview} title="Preview"
                    className="resume-action-btn p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Icon name="eye" />
                </button>
                <button onClick={onDownload} title="Download"
                    className="resume-action-btn p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <Icon name="download" />
                </button>
                {!resume.active && (
                    <button onClick={onDelete} title="Delete"
                        className="resume-action-btn p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Icon name="trash" />
                    </button>
                )}
            </div>
        </div>
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