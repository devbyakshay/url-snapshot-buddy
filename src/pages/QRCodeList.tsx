
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserQrCodes, getQrCodeImage } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyIcon, Download, ExternalLink, QrCode, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const QRCodeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userQrCodes', page, searchTerm],
    queryFn: () => getUserQrCodes(page * limit, limit, searchTerm || undefined),
  });

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

  const downloadQRCode = (shortCode: string) => {
    const link = document.createElement('a');
    link.href = getQrCodeImage(shortCode);
    link.download = `qrcode-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded successfully!');
  };

  return (
    <DashboardLayout title="My QR Codes">
      <div className="space-y-6 animate-fade-in">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>My QR Codes</CardTitle>
            <CardDescription>
              View and manage all your QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search QR codes..."
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
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No QR codes found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm
                    ? "No results match your search criteria"
                    : "You haven't created any QR codes yet"}
                </p>
                {searchTerm ? (
                  <Button variant="outline" className="mt-4" onClick={handleReset}>
                    Clear Search
                  </Button>
                ) : (
                  <Button className="mt-4 gradient-button" onClick={() => navigate('/dashboard')}>
                    Create a QR Code
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.map((qrItem) => (
                    <Card key={qrItem.id} className="overflow-hidden bg-secondary/30 border border-border/40 hover:bg-secondary/50 transition-colors">
                      <div className="p-4 flex justify-center bg-black/30">
                        <img
                          src={getQrCodeImage(qrItem.short_code)}
                          alt={`QR Code for ${qrItem.short_code}`}
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium truncate">{`${window.location.origin}/${qrItem.short_code}`}</p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <span>{`${qrItem.scans} scans`}</span>
                          <span className="ml-3">{new Date(qrItem.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(qrItem.short_code)}
                          >
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadQRCode(qrItem.short_code)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/analytics/${qrItem.short_code}`)}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/${qrItem.short_code}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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

export default QRCodeList;
