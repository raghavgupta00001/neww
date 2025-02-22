import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import TeacherDashboard from "@/pages/teacher-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import LandingPage from "@/pages/landing-page";
import AIDetectorPage from "@/pages/ai-detector";
import QRCodePage from "@/pages/qr-code";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/ai-detector" component={AIDetectorPage} />
      <ProtectedRoute 
        path="/qr-code" 
        component={QRCodePage}
      />
      <ProtectedRoute 
        path="/dashboard" 
        component={() => {
          const { user } = useAuth();
          return user?.isTeacher ? <TeacherDashboard /> : <StudentDashboard />
        }} 
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;