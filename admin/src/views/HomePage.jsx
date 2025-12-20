import { ArrowRight, Calendar, Clock, Users } from "lucide-react";

/**
 * @intent Paper Planner themed Customer Home Page with Hero and Service Grid
 */
function HomePage() {
    const services = [
        {
            id: 1,
            name: "General Consultation",
            duration: "30 min",
            description: "Comprehensive health assessment and advice",
            icon: Users,
        },
        {
            id: 2,
            name: "Follow-up",
            duration: "15 min",
            description: "Review progress and adjust treatment",
            icon: Calendar,
        },
        {
            id: 3,
            name: "Therapy Session",
            duration: "60 min",
            description: "In-depth therapeutic consultation",
            icon: Clock,
        },
    ];

    return (
        <div className="min-h-screen bg-paper">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-20 w-64 h-64 border-2 border-dashed border-terracotta/10 rounded-full" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 border-2 border-dashed border-sage/20 rounded-full" />
                    <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-ink/5 rotate-45" />
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left side - Content */}
                        <div className="relative z-10">
                            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-ink leading-tight mb-6">
                                Book your next appointment with ease.
                            </h1>
                            <p className="text-ink-light text-lg mb-8 max-w-md">
                                Real-time availability, zero stress. Schedule your appointments naturally and let us
                                handle the rest.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="btn-primary">
                                    Book Now <ArrowRight size={18} />
                                </button>
                                <button className="btn-outline">View Services</button>
                            </div>

                            {/* Decorative element */}
                            <div className="mt-8 flex items-center gap-3 text-ink-muted text-sm">
                                <span className="text-terracotta text-xl">~</span>
                                <span className="italic">Manage your time, naturally.</span>
                                <span className="text-terracotta text-xl">~</span>
                            </div>
                        </div>

                        {/* Right side - Illustration placeholder */}
                        <div className="relative hidden md:block">
                            <div className="card-paper aspect-square flex items-center justify-center">
                                <div className="text-center">
                                    <Calendar className="w-24 h-24 text-terracotta/50 mx-auto mb-4" />
                                    <p className="font-heading text-xl text-ink">Your Schedule</p>
                                    <p className="text-ink-muted text-sm mt-2">Organized & Simplified</p>
                                </div>
                            </div>
                            {/* Floating decorative cards */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage/20 rounded-lg border border-sage/30 rotate-12" />
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-terracotta/10 rounded-lg border border-terracotta/20 -rotate-6" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Grid Section */}
            <section className="py-16 md:py-20 bg-paper-cream">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-ink mb-3">Available Services</h2>
                        <p className="text-ink-light max-w-md mx-auto">
                            Choose from our range of professional services tailored to your needs.
                        </p>
                        <div className="mt-4 flex justify-center">
                            <span className="text-terracotta text-2xl opacity-60">~ ✦ ~</span>
                        </div>
                    </div>

                    {/* Service Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="card-paper group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center mb-4 group-hover:bg-terracotta/20 transition-colors">
                                    <service.icon className="w-6 h-6 text-terracotta" />
                                </div>

                                {/* Content */}
                                <h3 className="font-heading text-xl font-bold text-ink mb-2">{service.name}</h3>
                                <p className="text-ink-muted text-sm mb-4">{service.description}</p>

                                {/* Duration */}
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm text-ink-light bg-paper-warm px-3 py-1 rounded-md">
                                        {service.duration}
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-terracotta opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <button className="btn-outline">
                            View All Services <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer decorative element */}
            <div className="py-8 text-center bg-paper">
                <div className="flex justify-center items-center gap-4 text-ink-muted text-sm">
                    <span className="w-12 h-px bg-ink/10" />
                    <span className="italic">Plan naturally, live fully.</span>
                    <span className="w-12 h-px bg-ink/10" />
                </div>
            </div>
        </div>
    );
}

export { HomePage };

