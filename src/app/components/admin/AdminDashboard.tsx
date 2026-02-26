import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { LayoutDashboard, FileText, Calendar, Users, Mail, DollarSign, LogOut } from 'lucide-react';
import AdminOverview from './AdminOverview';
import JobTemplateManagement from './JobTemplateManagement';
import JobManagement from './JobManagement';
import WorkerManagement from './WorkerManagement';
import MessageManagement from './MessageManagement';
import PaymentManagement from './PaymentManagement';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl">管理者ダッシュボード</h1>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">概要</span>
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">テンプレート</span>
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">求人管理</span>
            </TabsTrigger>
            <TabsTrigger value="workers">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">ワーカー</span>
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">メッセージ</span>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">報酬管理</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="templates">
            <JobTemplateManagement />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>

          <TabsContent value="workers">
            <WorkerManagement />
          </TabsContent>

          <TabsContent value="messages">
            <MessageManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
