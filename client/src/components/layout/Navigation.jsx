import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Browse', icon: '📋' },
    { path: '/add', label: 'Add Load', icon: '➕' },
    { path: '/database', label: 'Database', icon: '🗄️' },
    { path: '/import', label: 'Import', icon: '📥' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg md:border-t-0 md:border-b fixed bottom-0 left-0 right-0 md:relative z-10">
      <div className="container mx-auto">
        <div className="flex justify-around md:justify-start md:space-x-4 md:px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col md:flex-row items-center justify-center py-3 px-4 md:px-6 flex-1 md:flex-none transition-colors ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl md:text-xl md:mr-2">{item.icon}</span>
                <span className="text-xs md:text-base font-medium mt-1 md:mt-0">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
