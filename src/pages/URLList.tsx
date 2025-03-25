
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserUrls } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CopyIcon, ExternalLink, Search, QrCode, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const URLList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  const navigate = useNavigate();
  const { isAuthenticated, getToken } = useAuth();
  
  // Fetch URLs directly when the component loads, not dependent on auth changes
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['userUrls', page, searchTerm],
    queryFn: () => getUserUrls(page * limit, limit, searchTerm || undefined),
    enabled: !!getToken(), // Only run when token exists
    retry: 1, // Reduce number of retries
    retryDelay: 1000,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to load URLs. Please try again.');
    }
  }, [error]);

  // Refetch on page changes
  useEffect(() => {
    if (getToken()) {
      refetch();
    }
  }, [page, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    refetch();
  };

  const handleReset = () => {
    setSearchTerm('');
    setPage(0);
    refetch();
  };

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`);
    toast.success('URL copied to clipboard!');
  };

  return (
    <DashboardLayout title="My URLs">
      <div className="space-y-6 animate-fade-in">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>My Shortened URLs</CardTitle>
            <CardDescription>
              View and manage all your shortened URLs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search URLs..."
                className="bg-secondary/50"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {searchTerm && (
                <Button type="button" variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </form>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
              </div>
            ) : !data || data.length === 0 ? (
              <div className="text-center py-12">
                <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No URLs found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm
                    ? "No results match your search criteria"
                    : "You haven't created any shortened URLs yet"}
                </p>
                {searchTerm ? (
                  <Button variant="outline" className="mt-4" onClick={handleReset}>
                    Clear Search
                  </Button>
                ) : (
                  <Button className="mt-4 gradient-button" onClick={() => navigate('/dashboard')}>
                    Create a URL
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {data.map((urlItem) => (
                    <div
                      key={urlItem.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/40 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="mb-3 md:mb-0 w-full md:w-auto">
                        <p className="text-sm text-muted-foreground truncate max-w-[300px] md:max-w-[400px]">
                          {urlItem.original_url}
                        </p>
                        <p className="font-medium">{`${window.location.origin}/${urlItem.short_code}`}</p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <span className="mr-3">{`${urlItem.clicks} clicks`}</span>
                          <span>{`${urlItem.scans} scans`}</span>
                          <span className="ml-3">{new Date(urlItem.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(urlItem.short_code)}
                        >
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/analytics/${urlItem.short_code}`)}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${urlItem.short_code}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/qrcodes/${urlItem.short_code}`)}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          QR Code
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data || data.length < limit}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default URLList;
