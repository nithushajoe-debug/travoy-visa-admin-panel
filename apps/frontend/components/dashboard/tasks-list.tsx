import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockTasks = [
  {
    id: '1',
    title: 'Review passport documents',
    caseId: 'case-1',
    clientName: 'John Smith',
    dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'PENDING',
  },
  {
    id: '2',
    title: 'Prepare cover letter',
    caseId: 'case-2',
    clientName: 'Sarah Johnson',
    dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
  },
  {
    id: '3',
    title: 'Schedule appointment',
    caseId: 'case-1',
    clientName: 'John Smith',
    dueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: 'URGENT',
    status: 'PENDING',
  },
];

export function TasksList() {
  const getStatusIcon = (status: string, dueAt: Date) => {
    const isOverdue = new Date() > dueAt;
    
    if (status === 'COMPLETED') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (isOverdue) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (status: string, dueAt: Date) => {
    const isOverdue = new Date() > dueAt;
    
    if (status === 'COMPLETED') {
      return <Badge variant="default">Completed</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (status === 'IN_PROGRESS') {
      return <Badge variant="secondary">In Progress</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="space-y-3">
      {mockTasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center space-x-3">
            {getStatusIcon(task.status, task.dueAt)}
            <div>
              <p className="font-medium text-sm">{task.title}</p>
              <p className="text-xs text-muted-foreground">
                {task.clientName} • Due {format(task.dueAt, 'MMM dd')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(task.status, task.dueAt)}
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        </div>
      ))}
      
      <Button variant="outline" className="w-full mt-4">
        View All Tasks
      </Button>
    </div>
  );
}