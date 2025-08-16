import React from 'react';

export type ViewType = 'songs' | 'artists' | 'albums';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'songs' as ViewType, label: 'Songs', icon: '🎵' },
    { id: 'artists' as ViewType, label: 'Artists', icon: '👤' },
    { id: 'albums' as ViewType, label: 'Albums', icon: '💿' },
  ];

  return (
    <div className="flex items-center space-x-6">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 font-medium ${
            currentView === item.id
              ? 'bg-orange-50 dark:bg-orange-900/20'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <span className="text-lg text-gray-500 dark:text-gray-400">{item.icon}</span>
          <span className={currentView === item.id ? 'text-orange-500' : ''}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;