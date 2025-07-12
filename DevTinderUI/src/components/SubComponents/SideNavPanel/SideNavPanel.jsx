import { useState } from 'react';
import { 
  AiOutlineHome, 
  AiOutlineMail, 
  AiOutlineTeam, 
  AiOutlineMenuFold, 
  AiOutlineMenuUnfold,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineSetting
} from 'react-icons/ai';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { BsDot } from 'react-icons/bs';

export const SideNavPanel = () => {
  const [activeItem, setActiveItem] = useState('feed');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    settings: false
  });
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: 'feed', label: 'Feed', icon: AiOutlineHome, section: 'main', tooltip: 'View your feed' },
    { id: 'requests', label: 'Requests', icon: AiOutlineMail, section: 'main', tooltip: 'Connection requests', badge: 3 },
    { id: 'connections', label: 'Active Connections', icon: AiOutlineTeam, section: 'main', tooltip: 'Your connections' }
  ];

  const settingsItems = [
    { id: 'profile', label: 'Profile Settings', icon: AiOutlineUser, section: 'settings', tooltip: 'Edit your profile' },
    { id: 'preferences', label: 'Preferences', icon: AiOutlineSetting, section: 'settings', tooltip: 'App preferences' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const Tooltip = ({ text, children }) => {
    return (
      <div className="relative group">
        {children}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-gray-700">
            {text}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-700"></div>
          </div>
        )}
      </div>
    );
  };

  const MenuButton = ({ item, isActive, onClick }) => {
    const Icon = item.icon;
    return (
      <Tooltip text={item.tooltip}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 group relative ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} text-xl flex-shrink-0`} />
          {!isCollapsed && (
            <>
              <span className="font-medium truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <BsDot className="ml-auto text-2xl" />
              )}
            </>
          )}
        </button>
      </Tooltip>
    );
  };

  const SectionHeader = ({ title, section, hasItems = true }) => {
    if (isCollapsed) return null;
    
    return (
      <div className="flex items-center justify-between px-4 py-2 text-gray-400">
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        {hasItems && (
          <button
            onClick={() => toggleSection(section)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            {expandedSections[section] ? 
              <FiChevronDown className="text-sm" /> : 
              <FiChevronRight className="text-sm" />
            }
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-gray-900 mt-15 text-white shadow-lg transition-all duration-300 fixed left-0 top-0 z-40 pt-16`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <p className="text-sm font-bold text-gray-400 mt-1">Navigation</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 flex-1">
        {/* Main Navigation */}
        <div className="px-2">
          <SectionHeader title="Main" section="main" hasItems={false} />
          <ul className="space-y-1 mt-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <MenuButton
                  item={item}
                  isActive={activeItem === item.id}
                  onClick={() => setActiveItem(item.id)}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        {/* <div className="px-2 mt-8">
          <SectionHeader title="Settings" section="settings" />
          {(expandedSections.settings || isCollapsed) && (
            <ul className="space-y-1 mt-2">
              {settingsItems.map((item) => (
                <li key={item.id}>
                  <MenuButton
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div> */}
      </nav>

      {/* Footer */}
      {/* <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <AiOutlineUser className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">John Doe</p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          )}
          <Tooltip text="Logout">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <AiOutlineLogout className="text-gray-400 hover:text-white" />
            </button>
          </Tooltip>
        </div>
      </div> */}
    </div>
  );
};
