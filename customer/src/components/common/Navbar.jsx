import { Calendar, Home, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';

/**
 * @intent Paper Planner styled navigation bar with warm, tactile design
 */
const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/book', icon: Calendar, label: 'Book' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <nav className="bg-white border-b border-ink/10" style={{ boxShadow: '0 2px 0px rgba(45, 45, 45, 0.04)' }}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-terracotta rounded-planner flex items-center justify-center"
                            style={{ boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.1)' }}>
                            <Calendar className="text-white" size={20} />
                        </div>
                        <span className="font-serif text-xl text-ink hidden sm:block">Planner</span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2 rounded-planner text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-gold/40 text-ink'
                                        : 'text-ink/60 hover:text-ink hover:bg-paper'
                                    }
                `}
                            >
                                <link.icon size={18} />
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* User & Logout */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm text-ink/60">
                            {user?.name || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-ink/60 hover:text-error border border-ink/10 rounded-planner hover:border-error/30 transition-colors"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-ink/60"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-ink/10">
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-planner text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-gold/40 text-ink'
                                            : 'text-ink/60 hover:text-ink hover:bg-paper'
                                        }
                  `}
                                >
                                    <link.icon size={20} />
                                    {link.label}
                                </NavLink>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/5 rounded-planner transition-colors"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
