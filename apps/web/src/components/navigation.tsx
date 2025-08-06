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
    <div className="flex space-x-1 p-1 glass rounded-lg">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${
            currentView === item.id
              ? 'bg-orange-500 text-white shadow-lg'
              : 'text-light-700 dark:text-dark-300 hover:bg-light-200 dark:hover:bg-dark-700'
          }`}
        >
          <span className="text-sm">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation; 