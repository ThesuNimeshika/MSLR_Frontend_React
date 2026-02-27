import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const OverseasRegistration: React.FC = () => {
    const { theme } = useTheme();
    // Form States
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        seekField: '',
        receiveEmails: false
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const categories = [
        { id: 'tech', label: 'Technology', icon: '💻' },
        { id: 'logistics', label: 'Logistics', icon: '📦' },
        { id: 'design', label: 'Design', icon: '🖋️' },
        { id: 'finance', label: 'Finance', icon: '📊' },
        { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
        { id: 'marketing', label: 'Marketing', icon: '📢' },
    ];

    const [showFieldDropdown, setShowFieldDropdown] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type, name } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        const fieldName = type === 'radio' ? name : id;

        setFormData(prev => ({
            ...prev,
            [fieldName]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user changes field
        if (errors[fieldName]) {
            setErrors(prev => {
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

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
        if (!formData.seekField) newErrors.seekField = 'Please select your seek field';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Overseas Registration attempt:', { ...formData, cvFile });
            // Handle registration logic here
        }
    };

    const ValidationCloud = ({ message }: { message: string }) => (
        <div className="absolute bottom-full left-0 mb-4 w-full p-4 bg-primary text-white text-xs rounded-3xl shadow-2xl animate-bounce z-20">
            <div className="relative">
                <p className="font-bold leading-relaxed">{message}</p>
                <div className="absolute -bottom-6 left-6 w-4 h-4 bg-primary rotate-45 transform"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg text-text selection:bg-primary/30">
            <Header />

            <section className="pt-32 pb-20 px-5 flex items-center justify-center min-h-[90vh]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none"></div>

                <div className="w-full max-w-2xl relative z-10">
                    <div className="glass p-8 md:p-10 rounded-[2.5rem] border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-outfit uppercase">Overseas Registration</h1>
                            <p className="text-text-dim">Find matching vacancies in Sri Lanka's top companies</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        <span className={formData.seekField ? 'text-text' : 'text-text-dim/50'}>
                                            {formData.seekField ? (
                                                <span className="flex items-center gap-2">
                                                    <span>{categories.find(c => c.id === formData.seekField)?.icon}</span>
                                                    <span>{categories.find(c => c.id === formData.seekField)?.label}</span>
                                                </span>
                                            ) : 'Select Industry Field'}
                                        </span>
                                        <span className={`text-text-dim text-xs transition-transform duration-300 ${showFieldDropdown ? 'rotate-180' : ''}`}>▼</span>
                                    </div>

                                    {showFieldDropdown && (
                                        <div className="absolute top-full left-0 w-full mt-2 glass rounded-[1.5rem] border-white/10 overflow-hidden shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {categories.map(cat => (
                                                <div
                                                    key={cat.id}
                                                    className={`flex items-center px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all ${formData.seekField === cat.id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, seekField: cat.id }));
                                                        setShowFieldDropdown(false);
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.seekField;
                                                            return newErrors;
                                                        });
                                                    }}
                                                >
                                                    <span className="mr-3 text-xl">{cat.icon}</span>
                                                    <span className={`text-sm ${formData.seekField === cat.id ? 'text-primary font-bold' : 'text-text-dim hover:text-text'}`}>{cat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.seekField && (
                                        <p className="text-red-500 text-xs mt-2 ml-1">{errors.seekField}</p>
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

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 text-lg mt-4 uppercase"
                            >
                                REGISTER
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default OverseasRegistration;
