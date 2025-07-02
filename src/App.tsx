import React, {useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';
import Sidebar from "./components/SideBar";
import MainPage from "./components/MainPage";
import LoginPage from "./pages/LoginPage";
import { isAuthenticated, supabase, logout } from './auth';
import './App.css';
import {ToastContainer} from "react-toastify";
import ExploreCustomChats from "./components/ExploreCustomChats";
import CustomChatEditor from './components/CustomChatEditor';

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  React.useEffect(() => {
    async function checkAuth() {
      const ok = await isAuthenticated();
      setLoggedIn(ok);
      setAuthChecked(true);
      // Listen to supabase auth changes (login/logout)
      supabase.auth.onAuthStateChange((_event, session) => {
        setLoggedIn(!!session?.user);
      });
    }
    checkAuth();
  }, []);

  interface MainPageProps {
    className: string;
    isSidebarCollapsed: boolean;
    toggleSidebarCollapse: () => void;
  }

  const MainPageWithProps: React.FC<Partial<MainPageProps>> = (props) => (
      <MainPage
          className={'main-content'}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebarCollapse={toggleSidebarCollapse}
          {...props}
      />
  );

  if (!authChecked) return null; // or a spinner
  // ProtectedRoute: Only render children if logged in, else redirect to /login
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!authChecked) return null; // or a spinner
    if (!loggedIn) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <div className="App dark:bg-gray-900 dark:text-gray-100">
          <ToastContainer/>
          <div className="flex overflow-hidden w-full h-full relative z-0">
            {loggedIn && (
              <Sidebar
                className="sidebar-container shrink-0"
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebarCollapse={toggleSidebarCollapse}
              />
            )}
            <div className="grow h-full overflow-hidden">
              <Routes>
                <Route path="/login" element={
                  loggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={() => setLoggedIn(true)} />
                } />
                <Route path="/" element={
                  <ProtectedRoute><MainPageWithProps /></ProtectedRoute>
                }/>
                <Route path="/c/:id" element={
                  <ProtectedRoute><MainPageWithProps /></ProtectedRoute>
                }/>
                <Route path="/explore" element={
                  <ProtectedRoute><ExploreCustomChats /></ProtectedRoute>
                }/>
                <Route path="/g/:gid" element={
                  <ProtectedRoute><MainPageWithProps /></ProtectedRoute>
                }/>
                <Route path="/g/:gid/c/:id" element={
                  <ProtectedRoute><MainPageWithProps /></ProtectedRoute>
                }/>
                <Route path="/custom/editor" element={
                  <ProtectedRoute><CustomChatEditor /></ProtectedRoute>
                }/>
                <Route path="/custom/editor/:id" element={
                  <ProtectedRoute><CustomChatEditor /></ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default App;
