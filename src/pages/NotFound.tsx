
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-black px-4">
      <div className="text-center max-w-md glass-morphism p-8 rounded-xl animate-fade-in">
        <div className="w-24 h-24 bg-secondary/30 rounded-full mx-auto flex items-center justify-center mb-6">
          <span className="text-5xl">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gradient">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="gradient-button">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
