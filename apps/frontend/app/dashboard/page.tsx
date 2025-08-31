import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  PlusCircle,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { PipelineChart } from '@/components/dashboard/pipeline-chart';
import { TasksList } from '@/components/dashboard/tasks-list';
import { RecentActivity } from '@/components/dashboard/recent-activity';

// Mock data - in real app, this would come from API
const mockKPIs = {
  totalCases: 156,
  activeCases: 89,
  completedThisMonth: 23,
  revenue: {
    thisMonth: 45600,
    lastMonth: 38200,
    growth: 19.4,
  },
  tasks: {
    pending: 12,
    overdue: 3,
    completed: 45,
  },
  pipeline: [
    { stage: 'New', count: 15 },
    { stage: 'Documents', count: 28 },
    { stage: 'Review', count: 18 },
    { stage: 'Submitted', count: 22 },
    { stage: 'Decision', count: 6 },
  ],
};

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Cases"
          value={mockKPIs.totalCases}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Cases"
          value={mockKPIs.activeCases}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Completed This Month"
          value={mockKPIs.completedThisMonth}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 15, isPositive: true }}
        />
        <KPICard
          title="Monthly Revenue"
          value={`£${mockKPIs.revenue.thisMonth.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: mockKPIs.revenue.growth, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Pipeline Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Case Pipeline</CardTitle>
            <CardDescription>
              Current distribution of cases across stages
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<div>Loading chart...</div>}>
              <PipelineChart data={mockKPIs.pipeline} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>
              Tasks assigned to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TasksList />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across all cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create Case
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium">3 tasks overdue</p>
                <p className="text-sm text-muted-foreground">Review and update task deadlines</p>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium">New document uploaded</p>
                <p className="text-sm text-muted-foreground">John Smith uploaded passport copy</p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-muted-foreground">£1,500 payment for INV-2025-001</p>
              </div>
              <Badge variant="default">Paid</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}