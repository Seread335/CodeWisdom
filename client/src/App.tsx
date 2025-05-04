import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CoursesPage from "@/pages/courses-page";
import CourseDetailsPage from "@/pages/course-details-page";
import LessonPage from "@/pages/lesson-page";
import AboutPage from "@/pages/about-page";
import RoadmapPage from "@/pages/roadmap-page";
import SpecializationPage from "@/pages/specialization-page";
import SettingsPage from "@/pages/settings-page";
import CategoryPage from "@/pages/category-page";
import ProfilePage from "@/pages/profile-page";
import AdminPage from "@/pages/admin-page";
import Contact from "@/pages/Contact";
import Team from "@/pages/Team";
import CodePracticePage from "@/pages/code-practice-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/about" component={AboutPage} />
      <ProtectedRoute path="/roadmap" component={RoadmapPage} />
      <ProtectedRoute path="/specialization" component={SpecializationPage} />
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/courses/:id" component={CourseDetailsPage} />
      <ProtectedRoute path="/lessons/:id" component={LessonPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/categories/:category" component={CategoryPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
      <ProtectedRoute path="/contact" component={Contact} />
      <ProtectedRoute path="/team" component={Team} />
      <ProtectedRoute path="/code-practice" component={CodePracticePage} />
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
