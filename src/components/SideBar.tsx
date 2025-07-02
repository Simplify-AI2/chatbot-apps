import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Cog8ToothIcon, PlusIcon, Squares2X2Icon} from "@heroicons/react/24/outline";
import {CloseSideBarIcon, iconProps, OpenSideBarIcon} from "../svg";
import {useTranslation} from 'react-i18next';
import Tooltip from "./Tooltip";
import UserSettingsModal from './UserSettingsModal';
import ChatShortcuts from './ChatShortcuts';
import ConversationList from "./ConversationList";
import { logout } from '../auth';

interface SidebarProps {
  className: string;
  isSidebarCollapsed: boolean;
  toggleSidebarCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({className, isSidebarCollapsed, toggleSidebarCollapse}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);

  const openSettingsDialog = () => {
    setSettingsModalVisible(true);
  }

  const handleNewChat = () => {
    navigate('/', {state: {reset: Date.now()}});
  }

  const handleOnClose = () => {
    setSettingsModalVisible(false);
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <div className={`${className} ${isSidebarCollapsed ? 'w-0' : 'w-auto'}`}>
      {isSidebarCollapsed && (
        <div className="absolute top-0 left-0 z-50">
          <Tooltip title={t('open-sidebar')} side="right" sideOffset={10}>
            <button
              className="flex px-3 min-h-[44px] py-1 gap-3 transition-colors duration-200 dark:text-white
              cursor-pointer text-sm rounded-md border dark:border-white/20 hover:bg-gray-300 dark:hover:bg-gray-600
              h-11 w-11 shrink-0 items-center justify-center bg-white dark:bg-transparent"
              onClick={toggleSidebarCollapse}>
              <OpenSideBarIcon/>
            </button>
          </Tooltip>
        </div>
      )}
      <UserSettingsModal
        isVisible={isSettingsModalVisible}
        onClose={handleOnClose}
      />
      {/* sidebar is always dark mode*/}
      <div
        className="sidebar duration-500 transition-all h-full shrink-0 overflow-x-hidden dark:bg-gray-900">
        <div className="h-full w-[260px]">
          <div className="flex h-full min-h-0 flex-col ">
            <div className="scrollbar-trigger relative h-full flex-1 items-start border-white/20">
              <h2 className="sr-only">Chat history</h2>
              <nav className="flex h-full flex-col p-2" aria-label="Chat history">
                <div className="flex flex-col items-center mb-4 mt-2">
  <img src="/UMBRA-logobig.png" alt="UMBRA Logo" className="w-24 h-auto mb-2" style={{maxWidth: '120px'}} />
</div>
<div className="mb-1 flex flex-row gap-2">
                  <button className="flex px-3 min-h-[44px] py-1 items-center gap-3
                       transition-colors duration-200 dark:text-white
                       cursor-pointer text-sm rounded-md border dark:border-white/20 hover:bg-gray-500/10 h-11
                       bg-white dark:bg-transparent grow overflow-hidden"
                          onClick={handleNewChat}
                          type="button"
                  >
                    <PlusIcon {...iconProps} />
                    <span className="truncate">{t('new-chat')}</span>
                  </button>
                  {/*
                  // Settings button (opens the user settings modal)
                  <Tooltip title={t('open-settings')} side="right" sideOffset={10}>
                    <button
                      type="button"
                      className="flex px-3 min-h-[44px] py-1 gap-3 transition-colors duration-200 dark:text-white
                      cursor-pointer text-sm rounded-md border dark:border-white/20 hover:bg-gray-500/10 h-11 w-11
                      shrink-0 items-center justify-center bg-white dark:bg-transparent"
                      onClick={openSettingsDialog}>
                      <Cog8ToothIcon/>
                    </button>
                  </Tooltip>
                  */}
                  {/*
                  // Close Sidebar button (collapses the sidebar)
                  <Tooltip title={t('close-sidebar')} side="right" sideOffset={10}>
                    <button
                      className="flex px-3 min-h-[44px] py-1 gap-3 transition-colors duration-200 dark:text-white
                      cursor-pointer text-sm rounded-md border dark:border-white/20 hover:bg-gray-500/10
                      h-11 w-11 shrink-0 items-center justify-center bg-white dark:bg-transparent"
                      onClick={toggleSidebarCollapse}
                      type="button"
                    >
                      <CloseSideBarIcon/>
                    </button>
                  </Tooltip>
                  */}
                </div>
                {/*
                // Obrolan Kustom (Custom Chats) option hidden as requested
                <Link to="/explore" className="flex items-center m-2 dark:bg-gray-900 dark:text-gray-100 text-gray-900">
                  <Squares2X2Icon  {...iconProps} className="mt-1 mr-2"/>
                  <span>{t('custom-chats-header')}</span>
                </Link>
                */}
                <ChatShortcuts/>
                <ConversationList/>

              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
