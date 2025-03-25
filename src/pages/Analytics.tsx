
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDailyAnalytics, getGeoAnalytics, getMonthlyAnalytics, getTotalAnalytics } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [activeTab, setActiveTab] = useState('daily');

  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ['dailyAnalytics', shortCode],
    queryFn: () => shortCode ? getDailyAnalytics(shortCode) : Promise.resolve({ labels: [], data: [] }),
    enabled: !!shortCode && activeTab === 'daily',
  });

  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['monthlyAnalytics', shortCode],
    queryFn: () => shortCode ? getMonthlyAnalytics(shortCode) : Promise.resolve({ labels: [], data: [] }),
    enabled: !!shortCode && activeTab === 'monthly',
  });

  const { data: totalClicks, isLoading: isTotalLoading } = useQuery({
    queryKey: ['totalAnalytics', shortCode],
    queryFn: () => shortCode ? getTotalAnalytics(shortCode) : Promise.resolve(0),
    enabled: !!shortCode,
  });

  const { data: geoData, isLoading: isGeoLoading } = useQuery({
    queryKey: ['geoAnalytics', shortCode],
    queryFn: () => shortCode ? getGeoAnalytics(shortCode) : Promise.resolve([]),
    enabled: !!shortCode,
  });

  // Transform data for recharts
  const transformTimeData = (data: any) => {
    if (!data || !data.labels || !data.data) return [];
    return data.labels.map((label: string, index: number) => ({
      name: label,
      clicks: data.data[index],
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#6B66FF'];

  const dailyChartData = transformTimeData(dailyData);
  const monthlyChartData = transformTimeData(monthlyData);

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6 animate-fade-in">
        {!shortCode ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No URL specified</h3>
            <p className="text-muted-foreground mt-1">
              Please select a URL to view its analytics
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-morphism">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  {isTotalLoading ? (
                    <div className="h-16 flex items-center justify-center">
                      <div className="animate-pulse text-muted-foreground">Loading...</div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-gradient">{totalClicks}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">URL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium truncate">{`${window.location.origin}/${shortCode}`}</div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Short Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gradient">{shortCode}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-secondary/50">
                <TabsTrigger value="daily">Daily Analytics</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Analytics</TabsTrigger>
                <TabsTrigger value="geo">Geographic Data</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-6">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Daily Clicks</CardTitle>
                    <CardDescription>
                      Click distribution over the last few days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                    {isDailyLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">Loading...</div>
                      </div>
                    ) : dailyChartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }} />
                          <Bar dataKey="clicks" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monthly" className="space-y-6">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Monthly Clicks</CardTitle>
                    <CardDescription>
                      Click distribution over the last few months
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                    {isMonthlyLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">Loading...</div>
                      </div>
                    ) : monthlyChartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }} />
                          <Bar dataKey="clicks" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="geo" className="space-y-6">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>
                      Clicks by country
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                    {isGeoLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">Loading...</div>
                      </div>
                    ) : !geoData || geoData.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No geographic data available</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="h-full flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={geoData}
                                dataKey="count"
                                nameKey="country"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={(entry) => entry.country}
                              >
                                {geoData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="overflow-auto h-full">
                          <table className="w-full text-left">
                            <thead className="bg-secondary/50 text-xs uppercase font-medium">
                              <tr>
                                <th className="px-4 py-3">Country</th>
                                <th className="px-4 py-3">Clicks</th>
                                <th className="px-4 py-3">Percentage</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {geoData.map((item, index) => {
                                const totalCount = geoData.reduce((sum, geo) => sum + geo.count, 0);
                                const percentage = ((item.count / totalCount) * 100).toFixed(1);
                                
                                return (
                                  <tr key={index} className="hover:bg-secondary/30 transition-colors">
                                    <td className="px-4 py-3">{item.country}</td>
                                    <td className="px-4 py-3">{item.count}</td>
                                    <td className="px-4 py-3">{percentage}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
