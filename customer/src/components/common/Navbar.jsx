import { Calendar, Home, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';

/**
 * @intent Main navigation bar with logout functionality
 */
const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold text-primary">
                        BookNow
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
                        >
                            <Home size={20} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        <Link
                            to="/book"
                            className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
                        >
                            <Calendar size={20} />
                            <span className="hidden sm:inline">Book</span>
                        </Link>

                        <Link
                            to="/profile"
                            className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
                        >
                            <User size={20} />
                            <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-error transition"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
