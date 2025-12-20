import { X, Calendar, User, Clock } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Calendar },
    { id: 'booking', label: 'Book Appointment', icon: Clock },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Desktop: right slide, Mobile: bottom slide */}
      <div
        className={`fixed z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out
          md:top-0 md:right-0 md:h-full md:w-80
          bottom-0 left-0 right-0 rounded-t-3xl md:rounded-none
          ${isOpen 
            ? 'translate-y-0 md:translate-x-0' 
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">John Smith</p>
                <p className="text-sm text-gray-600">john.smith@email.com</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${currentView === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;