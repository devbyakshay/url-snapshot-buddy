
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getUserUrls, shortenUrl } from '../utils/api';
import { BarChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { CopyIcon, ExternalLink, Link2, QrCode, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, getToken } = useAuth();

  const { data: userUrls, isLoading, refetch, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: () => getUserUrls(0, 5),
    enabled: !!getToken(), // Only fetch when token exists
    retry: 1, // Reduce number of retries
    retryDelay: 1000,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to load URLs. Please try again.');
    }
  }, [error]);

  // Initial data fetch when token is available
  useEffect(() => {
    if (getToken()) {
      refetch();
    }
  }, [refetch]);

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

      toast.success('URL shortened successfully!');
      setUrl('');
      setCustomCode('');
      refetch();
    } catch (error) {
      toast.error('Failed to shorten URL. Please try again.');
      console.error('Error shortening URL:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
    toast.success('URL copied to clipboard!');
  };

  const mockChartData = [
    { name: 'Mon', clicks: 12 },
    { name: 'Tue', clicks: 19 },
    { name: 'Wed', clicks: 15 },
    { name: 'Thu', clicks: 22 },
    { name: 'Fri', clicks: 30 },
    { name: 'Sat', clicks: 18 },
    { name: 'Sun', clicks: 25 },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 animate-fade-in">
        <Card className="glass-morphism overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Shorten a URL</CardTitle>
            <CardDescription>
              Create a shorter, more shareable link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleShortenUrl} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your long URL here"
                  className="flex-1 bg-secondary/50"
                />
                <Input
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Custom code (optional)"
                  className="md:w-1/4 bg-secondary/50"
                />
                <Button type="submit" className="gradient-button" disabled={isSubmitting}>
                  <Link2 className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Shortening...' : 'Shorten'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Weekly click analytics</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }} />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Top URLs</CardTitle>
              <CardDescription>Your most clicked shortened URLs</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }} />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-morphism">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>Your recently created short URLs</CardDescription>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" onClick={() => navigate('/urls')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
              </div>
            ) : !userUrls || userUrls.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No URLs found. Create your first short URL above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userUrls.map((urlItem) => (
                  <div
                    key={urlItem.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/40"
                  >
                    <div className="mb-3 md:mb-0 w-full md:w-auto">
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {urlItem.original_url}
                      </p>
                      <p className="font-medium">{`${window.location.origin}/${urlItem.short_code}`}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <span className="mr-3">{`${urlItem.clicks} clicks`}</span>
                        <span>{`${urlItem.scans} scans`}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() => copyToClipboard(urlItem.short_code)}
                      >
                        <CopyIcon className="h-4 w-4" />
                        <span className="ml-1 hidden md:inline">Copy</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() => navigate(`/analytics/${urlItem.short_code}`)}
                      >
                        <Search className="h-4 w-4" />
                        <span className="ml-1 hidden md:inline">Analytics</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() => window.open(`/${urlItem.short_code}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="ml-1 hidden md:inline">Visit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none"
                        onClick={() => navigate(`/qrcodes/${urlItem.short_code}`)}
                      >
                        <QrCode className="h-4 w-4" />
                        <span className="ml-1 hidden md:inline">QR Code</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
