import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const RecruiterGuide: React.FC = () => {
    const plansSource = [
        {
            name: 'Silver',
            price: '4000 LKR',
            subtitle: 'Up to 50 CVs',
            features: [
                '2 Job Ads',
                'Inbuilt Filtering System',
                'Application tracking system (ATS)',
                'Special application system for cv-less job recruitment',
                'Interview notes',
                'Statistics Dashboard',
                'Direct jobs listing to company careers page'
            ],
            color: '#94a3b8'
        },
        {
            name: 'Bronze',
            price: '8500 LKR',
            subtitle: 'Up to 100 CVs',
            mostPopular: true,
            features: [
                'Unlimited job posting',
                'Inbuilt Filtering System',
                'Application tracking system (ATS)',
                'Target based social media marketing',
                'Special application system for cv-less job recruitment',
                'Interview notes',
                'Statistics Dashboard',
                'Direct jobs listing to company careers page'
            ],
            color: '#cd7f32'
        },
        {
            name: 'Platinum',
            price: '15000 LKR',
            subtitle: 'Up to 250 CVs',
            features: [
                'Unlimited job posting',
                'Inbuilt Filtering System',
                'Application tracking system (ATS)',
                'Target based social media marketing',
                'Video job advert',
                'Special application system for cv-less job recruitment',
                'Interview notes',
                'Recruiter sub logins',
                'Statistics Dashboard',
                'Direct jobs listing to company careers page'
            ],
            color: '#e5e7eb'
        },
        {
            name: 'Gold',
            price: 'Quotation',
            subtitle: 'Bi-Annual/ Annual/ Group',
            features: [
                'Unlimited job posting',
                'Inbuilt Filtering System',
                'Application tracking system (ATS)',
                'Target based social media marketing',
                'Video job advert',
                'Special consultation over the phone to meet your recruitment targets',
                'Special application system for cv-less job recruitment',
                'One online quiz',
                'One free featured advert a month',
                'Assist tracking for Branch level recruitment and CV direction to branches',
                'Interview notes',
                'Recruiter sub logins',
                'Statistics Dashboard',
                'Direct jobs listing to company careers page',
                'Free one HR news article publication',
                'Unlimited CVs a month'
            ],
            color: '#fbbf24'
        },
        {
            name: 'Diamond',
            price: '28000 LKR',
            subtitle: 'Premium Choice',
            features: [
                'Unlimited job posting',
                'Inbuilt Filtering System',
                'Application tracking system (ATS)',
                'Target based social media marketing',
                'Video job advert',
                'Special consultation over the phone to meet your recruitment targets',
                'Special application system for cv-less job recruitment',
                'One online quiz',
                'One free featured advert a month',
                'Interview notes',
                'Recruiter sub logins',
                'Statistics Dashboard',
                'Direct jobs listing to company careers page'
            ],
            color: '#38bdf8'
        }
    ];

    return (
        <div className="min-h-screen bg-bg text-text selection:bg-primary/30">
            <Header />

            {/* Hero & Process Section */}
            <section className="pt-32 pb-20 px-5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                        <span className="text-primary font-bold text-xs tracking-widest uppercase">💼 For Employers & Recruiters</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-outfit">
                        Struggling to find the right <span className="text-primary">CANDIDATE? </span>Try us out!
                    </h1>
                    <p className="max-w-3xl mx-auto text-text-dim text-lg mb-16 leading-relaxed">
                        Join MSLR and streamline your hiring process. Post vacancies, track applications, and find the perfect talent for your business with our AI-powered portal.
                    </p>

                    {/* Simple Process Flow */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {[
                            { step: '01', title: 'Register with Us', desc: 'Create your company profile to get started with our network.' },
                            { step: '02', title: 'Agree & Join', desc: 'Accept our recruitment agreements to access advanced tools.' },
                            { step: '03', title: 'Start Posting', desc: 'Choose a plan that fits and post your first job advertisement.' }
                        ].map((item, idx) => (
                            <div key={idx} className="glass p-8 rounded-3xl relative group">
                                <span className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">{item.step}</span>
                                <h3 className="text-xl font-bold mb-3 mt-4 text-text">{item.title}</h3>
                                <p className="text-text-dim text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">Choose Your Plan</h2>
                        <p className="text-text-dim">Advertise as many vacancies as you want, pay only for the applications.</p>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        {plansSource.map((plan, idx) => (
                            <div key={idx} className={`glass p-8 rounded-3xl relative flex flex-col transition-all duration-300 hover:border-primary/50 group ${plan.mostPopular ? 'ring-2 ring-primary border-primary/30' : ''}`}>
                                {plan.mostPopular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg">MOST POPULAR</span>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: plan.color }}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold text-text">{plan.price === 'Quotation' ? 'Custom' : plan.price.split(' ')[0]}</span>
                                        <span className="text-text-dim text-sm">{plan.price === 'Quotation' ? '' : 'LKR'}</span>
                                    </div>
                                    <p className="text-primary font-semibold text-sm">{plan.subtitle}</p>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 text-sm text-text-dim">
                                            <span className="text-primary mt-1">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98] ${plan.mostPopular ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 border border-white/10 text-text hover:bg-white/10'}`}>
                                    {plan.price === 'Quotation' ? 'Get a Quotation' : 'Get Started'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default RecruiterGuide;
