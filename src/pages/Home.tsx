
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { shortenUrl } from '../utils/api';
import { toast } from 'sonner';
import { CopyIcon, ChevronRight, Link2 } from 'lucide-react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState('');
  const navigate = useNavigate();

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await shortenUrl({
        original_url: url,
        custom_code: customCode || undefined,
      });

      setShortenedUrl(`${window.location.origin}/${response.short_code}`);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL. Please try again.');
      console.error('Error shortening URL:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black text-foreground">
      <header className="relative z-10 border-b border-border/40 backdrop-blur-lg bg-black/30">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gradient">SnapURL</h1>
          </Link>
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <Button variant="outline" className="text-sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="text-sm gradient-button">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Simplify Your Links,<br/>Amplify Your Reach
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Transform long, cumbersome URLs into short, memorable links with powerful analytics and QR code generation.
          </p>
          <Button onClick={() => navigate('/register')} className="gradient-button text-lg px-8 py-6 h-auto rounded-full">
            Get Started Free
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <Card className="glass-morphism max-w-3xl mx-auto backdrop-blur-2xl animate-fade-in">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleShortenUrl} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your long URL here"
                  className="flex-1 bg-secondary/50 h-12"
                />
                <Input
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Custom code (optional)"
                  className="md:w-1/3 bg-secondary/50 h-12"
                />
                <Button type="submit" className="gradient-button h-12 text-base" disabled={isSubmitting}>
                  <Link2 className="mr-2 h-5 w-5" />
                  {isSubmitting ? 'Shortening...' : 'Shorten'}
                </Button>
              </div>
            </form>

            {shortenedUrl && (
              <div className="mt-6 p-4 bg-black/30 rounded-lg border border-border/40 animate-scale-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground">Your shortened URL:</p>
                    <p className="font-medium truncate">{shortenedUrl}</p>
                  </div>
                  <Button className="gradient-button" onClick={copyToClipboard}>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy URL
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in">
          <div className="glass-morphism p-6 rounded-2xl border border-border/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Link2 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">URL Shortening</h3>
            <p className="text-muted-foreground">
              Convert long URLs into short, shareable links that are easy to remember and track.
            </p>
          </div>
          
          <div className="glass-morphism p-6 rounded-2xl border border-border/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-muted-foreground">
              Track clicks, analyze geographic data, and gain insights into your audience.
            </p>
          </div>
          
          <div className="glass-morphism p-6 rounded-2xl border border-border/20">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">QR Codes</h3>
            <p className="text-muted-foreground">
              Generate QR codes for your shortened URLs to enhance offline-to-online experiences.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-black/30 mt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gradient">SnapURL</h2>
              <p className="text-sm text-muted-foreground mt-1">
                © {new Date().getFullYear()} SnapURL. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Register
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
