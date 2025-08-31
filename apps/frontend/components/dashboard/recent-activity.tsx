import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Upload,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const mockActivities = [
  {
    id: '1',
    type: 'DOCUMENT_UPLOAD',
    title: 'Document uploaded',
    description: 'John Smith uploaded passport copy',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    caseId: 'case-1',
  },
  {
    id: '2',
    type: 'PAYMENT_RECEIVED',
    title: 'Payment received',
    description: '£1,500 payment for INV-2025-001',
    user: 'System',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    caseId: 'case-1',
  },
  {
    id: '3',
    type: 'STATUS_CHANGE',
    title: 'Case status updated',
    description: 'Case moved to Documents stage',
    user: 'Visa Consultant',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    caseId: 'case-2',
  },
  {
    id: '4',
    type: 'EMAIL',
    title: 'Email sent',
    description: 'Welcome email sent to new client',
    user: 'Visa Consultant',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    caseId: 'case-2',
  },
  {
    id: '5',
    type: 'NOTE',
    title: 'Note added',
    description: 'Client confirmed travel dates',
    user: 'Visa Consultant',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    caseId: 'case-1',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'DOCUMENT_UPLOAD':
      return <Upload className="h-4 w-4" />;
    case 'PAYMENT_RECEIVED':
      return <DollarSign className="h-4 w-4" />;
    case 'STATUS_CHANGE':
      return <CheckCircle className="h-4 w-4" />;
    case 'EMAIL':
    case 'WHATSAPP':
      return <MessageSquare className="h-4 w-4" />;
    case 'NOTE':
    case 'CALL':
      return <FileText className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'DOCUMENT_UPLOAD':
      return 'text-blue-500';
    case 'PAYMENT_RECEIVED':
      return 'text-green-500';
    case 'STATUS_CHANGE':
      return 'text-purple-500';
    case 'EMAIL':
    case 'WHATSAPP':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {mockActivities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{activity.title}</p>
              <span className="text-xs text-muted-foreground">
                {format(activity.timestamp, 'HH:mm')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {activity.caseId}
              </Badge>
              <span className="text-xs text-muted-foreground">by {activity.user}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}