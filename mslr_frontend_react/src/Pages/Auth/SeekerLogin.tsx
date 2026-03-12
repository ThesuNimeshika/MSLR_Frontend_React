import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast'; // unused imports, commented out
import { useTheme } from '../../context/ThemeContext';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const SeekerLogin: React.FC = () => {
    const { theme } = useTheme();
    const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
    const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showFieldDropdown, setShowFieldDropdown] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        seekField: [] as string[],
        receiveEmails: false
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const [categoriesData, setCategoriesData] = useState<{ id: string; label: string; icon: string; subcategories: { id: string; label: string }[] }[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);


    React.useEffect(() => {
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
        if (expandedCategories.includes(id)) {
            setExpandedCategories(expandedCategories.filter(item => item !== id));
        } else {
            setExpandedCategories([...expandedCategories, id]);
        }
    };

    const findSelectedLabel = () => {
        if (formData.seekField.length === 0) return null;
        if (formData.seekField.length === 1) {
            const id = formData.seekField[0];
            for (const cat of categoriesData) {
                if (cat.id === id) return { label: cat.label, icon: cat.icon };
                const sub = cat.subcategories.find(s => s.id === id);
                if (sub) return { label: sub.label, icon: cat.icon };
            }
        }
        return { label: `${formData.seekField.length} fields selected`, icon: '📁' };
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type, name } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        const fieldName = type === 'radio' ? name : id;

        setFormData((prev) => ({
            ...prev,
            [fieldName]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user changes field
        if (errors[fieldName]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[value.length - 1];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (authView === 'login') {
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

            if (!formData.password) newErrors.password = 'Password is required';
        } else if (authView === 'signup') {
            if (!formData.firstName) newErrors.firstName = 'First Name is required';
            if (!formData.lastName) newErrors.lastName = 'Last Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                newErrors.password = 'Password must meet security requirements';
            }

            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            else if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match';
            }

            if (!formData.gender) newErrors.gender = 'Please select your gender';
            if (formData.seekField.length === 0) newErrors.seekField = 'Please select your industry field';
        } else if (authView === 'forgot') {
            if (forgotStep === 'email') {
                if (!formData.email) newErrors.email = 'Email address is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
            } else if (forgotStep === 'reset') {
                if (!formData.password) newErrors.password = 'New Password is required';
                if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
                else if (formData.confirmPassword !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            if (authView === 'login') {
                try {
                    const formDataToSend = new FormData();
                    formDataToSend.append('email', formData.email);
                    formDataToSend.append('password', formData.password);

                    const response = await fetch(`${API_URL}/Auth/Login`, {
                        method: 'POST',
                        body: formDataToSend,
                    });

                    if (response.ok) {
                        const seekerData = await response.json();
                        alert(`Welcome back, ${seekerData.firstName}!`);
                        localStorage.setItem('seekerUser', JSON.stringify(seekerData));
                        // Redirect or update app state here
                        console.log('Login successful:', seekerData);
                    } else if (response.status === 401) {
                        alert('Invalid email or password. Please try again.');
                    } else {
                        const errorData = await response.json();
                        alert(`Login failed: ${errorData.detail || errorData.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    alert('An error occurred during login. Please try again later.');
                }
            } else if (authView === 'signup') {
                try {
                    const formDataToSend = new FormData();
                    formDataToSend.append('firstName', formData.firstName);
                    formDataToSend.append('lastName', formData.lastName);
                    formDataToSend.append('email', formData.email);
                    formDataToSend.append('password', formData.password);
                    formDataToSend.append('gender', formData.gender);
                    formDataToSend.append('seekField', formData.seekField.join(','));
                    formDataToSend.append('receiveEmails', formData.receiveEmails.toString());
                    if (cvFile) {
                        formDataToSend.append('cvFile', cvFile);
                    }
                    formDataToSend.append('confirmPassword', formData.confirmPassword);

                    const response = await fetch(`${API_URL}/Auth/Register`, {
                        method: 'POST',
                        body: formDataToSend,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        alert('Registration successful!');
                        setAuthView('login');
                        console.log('Success:', result);
                    } else {
                        const errorData = await response.json();
                        alert(`Registration failed: ${errorData.detail || errorData.error || 'Unknown error'}`);
                        console.error('Failure:', errorData);
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    alert('An error occurred during registration. Please try again later.');
                }
            } else if (authView === 'forgot') {
                if (forgotStep === 'email') {
                    // Simulate sending OTP
                    console.log('Sending OTP to:', formData.email);
                    setShowOtpPopup(true);
                } else if (forgotStep === 'reset') {
                    console.log('Resetting password for:', formData.email);
                    // Handle password reset logic here
                    setAuthView('login');
                    setForgotStep('email');
                }
            }
        }
    };

    const verifyOtp = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length === 6) {
            console.log('Verifying OTP:', fullOtp);
            // Simulate successful verification
            setShowOtpPopup(false);
            setForgotStep('reset');
        } else {
            console.log('Invalid OTP');
        }
    };


    return (
        <div className="min-h-screen bg-bg text-text selection:bg-primary/30">
            <Header />

            {/* OTP Popup Modal */}
            {showOtpPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm">
                    <div className="glass w-full max-w-md p-8 rounded-[2.5rem] border-primary/30 bg-gradient-to-br from-primary/10 to-transparent shadow-2xl animate-in zoom-in duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2 font-outfit">Verify Your Email</h2>
                            <p className="text-text-dim text-sm">We've sent a 6-digit code to <span className="text-primary font-semibold">{formData.email}</span></p>
                        </div>

                        <div className="flex justify-between gap-2 mb-8">
                            {otp.map((digit: string, idx: number) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all uppercase"
                                />
                            ))}
                        </div>

                        <button
                            onClick={verifyOtp}
                            disabled={otp.join('').length < 6}
                            className="w-full py-4 bg-gradient-to-r from-[#6366f1] to-[#f1ac29] hover:from-indigo-500 hover:to-[#e89c1f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                        >
                            VERIFY CODE
                        </button>

                        <button
                            onClick={() => setShowOtpPopup(false)}
                            className="w-full mt-4 text-sm text-text-dim hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <section className="pt-32 pb-20 px-5 flex items-center justify-center min-h-[90vh]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none"></div>

                <div className={`w-full ${authView === 'signup' ? 'max-w-2xl' : 'max-w-md'} relative z-10 transition-all duration-500`}>
                    <div className="glass p-8 md:p-10 rounded-[2.5rem] border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-outfit">
                                {authView === 'login' ? 'Welcome Back' : authView === 'signup' ? 'Join MSLR' : 'Lost Your password?'}
                            </h1>
                            <p className="text-text-dim">
                                {authView === 'login' ? 'Login to your job seeker account' :
                                    authView === 'signup' ? 'Register to find your dream job' :
                                        'Please enter your email address to reset it'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {authView === 'login' ? (
                                <>
                                    <div className="relative">
                                        <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="email">Email</label>
                                        <input
                                            type="text"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.email ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                            placeholder="Enter your registered email"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-2 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2 ml-1">
                                            <label className="text-sm font-semibold" htmlFor="password">Password</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAuthView('forgot');
                                                    setErrors({});
                                                }}
                                                className="text-xs font-bold text-primary hover:text-indigo-400 transition-colors"
                                            >
                                                FORGOT PASSWORD?
                                            </button>
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.password ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </>
                            ) : authView === 'signup' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="firstName">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.firstName ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="lastName">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.lastName ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.email ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="password">Password</label>
                                            {showTooltip && (
                                                <ValidationCloud
                                                    message="Your password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol."
                                                />
                                            )}
                                            <input
                                                type="password"
                                                id="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => setShowTooltip(true)}
                                                onBlur={() => setShowTooltip(false)}
                                                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.password ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-3 ml-1">Gender</label>
                                            <div className="flex gap-8 mt-2">
                                                {['Male', 'Female'].map((g) => (
                                                    <label key={g} className="flex items-center cursor-pointer group gap-3">
                                                        <div className="relative">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value={g}
                                                                onChange={handleChange}
                                                                checked={formData.gender === g}
                                                                className="sr-only"
                                                            />
                                                            <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${formData.gender === g ? 'border-primary' : errors.gender ? 'border-red-500/50' : 'border-white/20 group-hover:border-white/40'}`}>
                                                                <div className={`w-3 h-3 rounded-full bg-primary transition-all transform ${formData.gender === g ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}></div>
                                                            </div>
                                                        </div>
                                                        <span className={`text-sm font-medium transition-colors ${formData.gender === g ? 'text-text' : 'text-text-dim group-hover:text-text/70'}`}>
                                                            {g}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-2 ml-1">Seek Field</label>
                                            <div
                                                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.seekField ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all`}
                                                onClick={() => setShowFieldDropdown(!showFieldDropdown)}
                                            >
                                                <span className={formData.seekField.length > 0 ? 'text-text' : 'text-text-dim/50'}>
                                                    {formData.seekField.length > 0 ? (
                                                        <span className="flex items-center gap-2">
                                                            <span>{findSelectedLabel()?.icon}</span>
                                                            <span>{findSelectedLabel()?.label}</span>
                                                        </span>
                                                    ) : 'Select Industry Field'}
                                                </span>
                                                <span className={`text-text-dim text-xs transition-transform duration-300 ${showFieldDropdown ? 'rotate-180' : ''}`}>▼</span>
                                            </div>

                                            {showFieldDropdown && (
                                                <div className="absolute top-full left-0 w-full mt-2 glass rounded-[1.5rem] border-white/10 overflow-hidden shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[400px] overflow-y-auto">
                                                    <div className="flex justify-between items-center mb-3 px-1">
                                                        <span className="text-xs font-bold text-text-dim uppercase tracking-wider">Classification</span>
                                                        {formData.seekField.length > 0 && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFormData(prev => ({ ...prev, seekField: [] }));
                                                                }}
                                                                className="text-[10px] text-primary hover:underline font-bold"
                                                            >
                                                                Clear all
                                                            </button>
                                                        )}
                                                    </div>
                                                    {categoriesData.length === 0 ? (
                                                        <div className="text-center py-4 text-text-dim text-xs font-medium">Loading classifications...</div>
                                                    ) : (
                                                        categoriesData.map(cat => (
                                                            <div key={cat.label} className="mb-1">
                                                                <div
                                                                    className={`flex items-center px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-all group ${expandedCategories.includes(cat.label) ? 'bg-white/5' : ''}`}
                                                                    onClick={() => toggleExpand(cat.label)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-all ${cat.id && formData.seekField.includes(cat.id) ? 'bg-primary border-primary' : 'border-primary/50'}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const subIds = cat.subcategories.map(s => s.id);
                                                                            const allIds = cat.id ? [cat.id, ...subIds] : subIds;
                                                                            const isAllSelected = allIds.every(id => formData.seekField.includes(id));

                                                                            setFormData(prev => {
                                                                                let newFields;
                                                                                if (isAllSelected) {
                                                                                    newFields = prev.seekField.filter(id => !allIds.includes(id));
                                                                                } else {
                                                                                    newFields = Array.from(new Set([...prev.seekField, ...allIds]));
                                                                                }
                                                                                return { ...prev, seekField: newFields };
                                                                            });
                                                                        }}
                                                                    >
                                                                        {((cat.id && formData.seekField.includes(cat.id)) || (cat.subcategories.length > 0 && cat.subcategories.every(s => formData.seekField.includes(s.id)))) && <span className="text-[10px] text-white">✓</span>}
                                                                    </div>
                                                                    <span className="mr-2 text-base">{cat.icon}</span>
                                                                    <span className={`text-sm flex-1 text-left transition-colors group-hover:text-indigo-400 ${cat.id && formData.seekField.includes(cat.id) ? 'text-indigo-400 font-bold' : 'text-text-dim'}`}>{cat.label}</span>
                                                                    {cat.subcategories.length > 0 && (
                                                                        <span className="text-[10px] text-text-dim ml-2 transition-transform duration-300 group-hover:text-indigo-400" style={{ transform: expandedCategories.includes(cat.label) ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                                                                    )}
                                                                </div>

                                                                {expandedCategories.includes(cat.label) && cat.subcategories.length > 0 && (
                                                                    <div className="ml-9 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
                                                                        {cat.subcategories.map(sub => (
                                                                            <div
                                                                                key={sub.id}
                                                                                className="flex items-center justify-start text-left px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                                                                onClick={() => {
                                                                                    setFormData(prev => {
                                                                                        const newFields = prev.seekField.includes(sub.id)
                                                                                            ? prev.seekField.filter(id => id !== sub.id)
                                                                                            : [...prev.seekField, sub.id];
                                                                                        return { ...prev, seekField: newFields };
                                                                                    });
                                                                                }}
                                                                            >
                                                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center mr-3 transition-all ${formData.seekField.includes(sub.id) ? 'bg-primary border-primary' : 'border-primary/50'}`}>
                                                                                    {formData.seekField.includes(sub.id) && <span className="text-[8px] text-white">✓</span>}
                                                                                </div>
                                                                                <span className={`text-xs transition-colors group-hover:text-indigo-400 ${formData.seekField.includes(sub.id) ? 'text-indigo-400 font-medium' : 'text-text-dim hover:text-indigo-400'}`}>{sub.label}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-semibold mb-2 ml-1">Upload CV (Optional)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                id="cv"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                accept=".pdf,.doc,.docx"
                                            />
                                            <div className={`w-full px-5 py-4 rounded-2xl bg-white/5 border border-dashed ${theme === 'light' ? 'border-black' : 'border-white/20'} group-hover:border-primary/50 transition-all flex items-center justify-between`}>
                                                <span className="text-text-dim/70 truncate mr-2">
                                                    {cvFile ? cvFile.name : 'Choose your CV (PDF, DOC)'}
                                                </span>
                                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                                                    BROWSE
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-1">
                                        <input
                                            type="checkbox"
                                            id="receiveEmails"
                                            checked={formData.receiveEmails}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="receiveEmails" className="text-sm text-text-dim cursor-pointer">
                                            Receive jobs by email
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {forgotStep === 'email' ? (
                                        <div className="relative">
                                            <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.email ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                placeholder="Enter your registered email"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="password">New Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.password ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="block text-sm font-semibold mb-2 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : theme === 'light' ? 'border-black' : 'border-white/10'} text-text placeholder:text-text-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-[#6366f1] to-[#f1ac29] hover:from-indigo-500 hover:to-[#e89c1f] text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95 text-lg mt-4 uppercase"
                            >
                                {authView === 'login' ? 'LOGIN' : authView === 'signup' ? 'REGISTER' : forgotStep === 'email' ? 'SEND OTP' : 'RESET'}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-text-dim text-sm">
                                {authView === 'login' ? (
                                    <>
                                        Don't have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setAuthView('signup');
                                                setErrors({});
                                            }}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            SIGN UP HERE
                                        </button>
                                    </>
                                ) : authView === 'signup' ? (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setAuthView('login');
                                                setErrors({});
                                            }}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            LOGIN NOW
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Remember your password?{' '}
                                        <button
                                            onClick={() => {
                                                setAuthView('login');
                                                setForgotStep('email');
                                                setErrors({});
                                            }}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            BACK TO LOGIN
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const ValidationCloud = ({ message }: { message: string }) => (
    <div className="absolute bottom-full left-0 mb-4 w-full p-4 bg-primary text-white text-xs rounded-3xl shadow-2xl animate-bounce z-20">
        <div className="relative">
            <p className="font-bold leading-relaxed">{message}</p>
            <div className="absolute -bottom-6 left-6 w-4 h-4 bg-primary rotate-45 transform"></div>
        </div>
    </div>
);

export default SeekerLogin;
