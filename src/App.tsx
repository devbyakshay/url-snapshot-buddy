
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RouteGuard from "./components/RouteGuard";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import URLList from "./pages/URLList";
import QRCodeList from "./pages/QRCodeList";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                <RouteGuard requireAuth={false}>
                  <Login />
                </RouteGuard>
              } 
            />
            <Route 
              path="/register" 
              element={
                <RouteGuard requireAuth={false}>
                  <Register />
                </RouteGuard>
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <RouteGuard>
                  <Dashboard />
                </RouteGuard>
              } 
            />
            <Route 
              path="/urls" 
              element={
                <RouteGuard>
                  <URLList />
                </RouteGuard>
              } 
            />
            <Route 
              path="/qrcodes" 
              element={
                <RouteGuard>
                  <QRCodeList />
                </RouteGuard>
              } 
            />
            <Route 
              path="/analytics/:shortCode" 
              element={
                <RouteGuard>
                  <Analytics />
                </RouteGuard>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <RouteGuard>
                  <Analytics />
                </RouteGuard>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
