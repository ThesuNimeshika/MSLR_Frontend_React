import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const DiscoverMeGuide: React.FC = () => {
    const services = [
        {
            title: 'Experience & Qualifications',
            desc: 'Showcase your global expertise and educational background through our optimized profile builder.',
            icon: '🎓'
        },
        {
            title: 'Direct to Top Companies',
            desc: 'We direct your profile and CV to the top-tier companies in Sri Lanka that match your specific skills.',
            icon: '🏢'
        },
        {
            title: 'Smart Alerts',
            desc: 'Stay informed with real-time updates and alerts on new vacancies that align with your career goals.',
            icon: '🔔'
        },
        {
            title: 'Expert Consultation',
            desc: 'Need guidance? Access our professional consultation facilities to navigate your career path in Sri Lanka.',
            icon: '🤝'
        }
    ];

    return (
        <div className="min-h-screen bg-bg text-text selection:bg-primary/30">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                        <span className="text-primary font-bold text-xs tracking-widest uppercase">🌍 For Overseas Candidates</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-outfit">
                        Discover Your Future in <span className="text-primary">SRI LANKA</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-text-dim text-lg mb-16 leading-relaxed">
                        Are you an overseas professional looking to bring your talents home? Discover matching vacancies in Sri Lanka's top companies and get the support you need to make your next big move.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-left">
                        {services.map((service, idx) => (
                            <div key={idx} className="glass p-8 rounded-3xl group hover:border-primary/50 transition-all duration-300">
                                <div className="text-4xl mb-6">{service.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-text group-hover:text-primary transition-colors">{service.title}</h3>
                                <p className="text-text-dim text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass p-10 rounded-[2.5rem] max-w-4xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                        <h2 className="text-3xl font-bold mb-4 font-outfit">Ready to start your journey?</h2>
                        <p className="text-text-dim mb-8">Join our network today and let us help you find the perfect role in Sri Lanka.</p>
                        <button className="px-10 py-4 bg-primary hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-xl">
                            JOIN AS
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default DiscoverMeGuide;
