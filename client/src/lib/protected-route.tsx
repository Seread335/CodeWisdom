import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check for admin access if required
  if (adminOnly && user.role !== "admin") {
    return (
      <Route path={path}>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Quyền truy cập bị từ chối</h1>
          <p className="mb-6">Bạn không có quyền truy cập trang này. Chỉ quản trị viên mới có thể xem trang này.</p>
          <Redirect to="/" />
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
