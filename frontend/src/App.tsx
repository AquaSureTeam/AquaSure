import { useState } from "react";
import { LoginView, UserRole } from "./components/LoginView";
import { RegisterView} from "./components/RegisterView";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./pages/Header";
import { DashboardView } from "./pages/MainDashboard";
import { WaterQualityView } from "./pages/WaterQualityView";
import { SensorsView } from "./pages/SensorsView";
import { AnalyticsView } from "./pages/AnalyticsView";
import { AlertsView } from "./pages/AlertsView";
import { SettingsView } from "./pages/SettingsView";
import { OfficerDashboard } from "./pages/OfficerDashboard";
import { OperatorDashboard } from "./pages/OperatorDashboard";
import { TechnicianDashboard } from "./pages/TechnicianDashboard";
import { ResearcherDashboard } from "./pages/ResearcherDashboard";
import { UserManagementView } from "./pages/UserManagementView";
import { motion } from "framer-motion";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [activeView, setActiveView] = useState("dashboard");
  const [notificationCount, setNotificationCount] = useState(3);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

const handleLogin = (userName: string, email: string, password: string, role: UserRole) => {
  if (userName && email && password) {
    setUserName(userName);  
    setUserRole(role);      
    setActiveView("dashboard");
    setIsAuthenticated(true);
  }
};

  const handleSignup = (data: { name: string; email: string; password: string; organization: string; role: UserRole }) => {
    console.log("Signing up as:", data.role); // 🔍 debug
    if (data.name && data.email && data.password && data.organization) {
      setAuthView("login");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("Admin");
    setUserRole("admin");
    setActiveView("dashboard");
    setAuthView("login");
  };

  const handleNotificationClick = () => {
    setActiveView("alerts");
    setNotificationCount(0);
  };

  const renderView = () => {
    if (activeView === "dashboard") {
      switch (userRole) {
        case "officer":
          return <OfficerDashboard />;
        case "operator":
          return <OperatorDashboard />;
        case "technician":
          return <TechnicianDashboard />;
        case "researcher":
          return <ResearcherDashboard />;
        case "admin":
          return <DashboardView />;
        default:
          return <DashboardView />;
      }
    }

    // Admin has access to all views
    if (userRole === "admin") {
      switch (activeView) {
        case "water-quality":
          return <WaterQualityView />;
        case "sensors":
          return <SensorsView />;
        case "analytics":
          return <AnalyticsView />;
        case "alerts":
          return <AlertsView />;
        case "settings":
          return <SettingsView />;
        case "user-management":
          return <UserManagementView/>;
        default:
          return <DashboardView />;
      }
    }

    // Other roles: redirect to dashboard if they try to access restricted views
    switch (userRole) {
      case "officer":
        return <OfficerDashboard />;
      case "operator":
        return <OperatorDashboard />;
      case "technician":
        return <TechnicianDashboard />;
      case "researcher":
        return <ResearcherDashboard />;
      default:
        return <DashboardView />;
    }
  };

  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <LoginView
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView("signup")}
        />
      );
    } else {
      return (
        <RegisterView
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView("login")}
        />
      );
    }
  }

  return (
    <div className="flex h-screen bg-[#F0F7FF] overflow-hidden relative">
      {/* Decorative elements - Deep Blue / Water theme */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed -top-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
        className="fixed -bottom-48 -right-48 w-[30rem] h-[30rem] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" 
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-200/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onLogout={handleLogout}
        userName={userName}
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {activeView !== "dashboard" && (
          <Header 
            onNotificationClick={handleNotificationClick}
            notificationCount={notificationCount}
            userName={userName}
            userRole={userRole}
          />
        )}

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );

}

export default App;