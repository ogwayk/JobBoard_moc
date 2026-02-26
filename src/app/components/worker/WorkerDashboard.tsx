import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { mockJobs, mockWorkers, mockWorkHistory, mockMessages } from '@/app/data/mockData';
import { Job } from '@/app/data/types';
import { LogOut, Calendar as CalendarIcon, Briefcase, History, Mail, User, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

moment.locale('ja');
const localizer = momentLocalizer(moment);

const messages = {
  allDay: '終日',
  previous: '前',
  next: '次',
  today: '今日',
  month: '月',
  week: '週',
  day: '日',
  agenda: '予定',
  date: '日付',
  time: '時間',
  event: 'イベント',
};

interface WorkerDashboardProps {
  userId: string;
  onLogout: () => void;
}

export default function WorkerDashboard({ userId, onLogout }: WorkerDashboardProps) {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const worker = mockWorkers.find(w => w.id === userId);
  const availableJobs = mockJobs.filter(j => 
    j.status === '募集中' && (
      j.visibilityLevel === '全体' || 
      j.visibilityLevel === worker?.level
    )
  );
  const appliedJobs = mockJobs.filter(j => 
    j.applications.some(a => a.workerId === userId)
  );
  const workerHistory = mockWorkHistory.filter(h => h.workerId === userId);
  const workerMessages = mockMessages.filter(m => m.to === userId || m.from === userId);

  const events = appliedJobs.map(job => ({
    id: job.id,
    title: job.title,
    start: new Date(job.date),
    end: new Date(job.date),
    resource: job,
  }));

  const handleApply = (jobId: string) => {
    toast.success('応募しました');
    setIsDetailOpen(false);
  };

  const handleCancel = (jobId: string) => {
    toast.success('応募をキャンセルしました');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">ワーカーダッシュボード</h1>
            <p className="text-sm text-muted-foreground">ようこそ、{worker?.name}さん</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 統計カード */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">総勤務時間</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{worker?.totalHours}時間</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">総報酬</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">¥{worker?.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">応募中</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{appliedJobs.length}件</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">未読メッセージ</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {workerMessages.filter(m => !m.read && m.to === userId).length}件
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              求人検索
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="w-4 h-4 mr-2" />
              カレンダー
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              勤務履歴
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" />
              メッセージ
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              プロフィール
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <h2 className="text-xl font-semibold">募集中の求人</h2>
            <div className="grid gap-4">
              {availableJobs.map((job) => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                  setSelectedJob(job);
                  setIsDetailOpen(true);
                }}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-medium">{job.title}</h3>
                          <Badge>{job.category}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{job.date.toLocaleDateString('ja-JP')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.startTime} - {job.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>¥{job.salary}/時</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="default" size="sm">
                        応募する
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardContent className="p-6">
                <div style={{ height: 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    messages={messages}
                    onSelectEvent={(event) => {
                      setSelectedJob(event.resource);
                      setIsDetailOpen(true);
                    }}
                    views={['month']}
                    defaultView="month"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h2 className="text-xl font-semibold">勤務履歴</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {workerHistory.map((history) => (
                    <div key={history.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{history.jobTitle}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {history.date} • {history.hours}時間
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">¥{history.earnings.toLocaleString()}</p>
                          <Badge variant="outline" className="mt-1">{history.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <h2 className="text-xl font-semibold">メッセージ</h2>
            {workerMessages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className={`w-5 h-5 mt-1 ${message.read ? 'text-muted-foreground' : 'text-blue-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{message.subject}</h4>
                        {!message.read && <Badge>未読</Badge>}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(message.timestamp).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-xl font-semibold">プロフィール</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">氏名</p>
                    <p className="font-medium">{worker?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">メールアドレス</p>
                    <p className="font-medium">{worker?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">電話番号</p>
                    <p className="font-medium">{worker?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">レベル</p>
                    <Badge>{worker?.level}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">グループ</p>
                    <p className="font-medium">{worker?.group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">登録日</p>
                    <p className="font-medium">{worker?.joinedDate}</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">プロフィールを編集</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>求人詳細</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
                <p className="text-muted-foreground">{selectedJob.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">日時</p>
                  <p className="font-medium">
                    {selectedJob.date.toLocaleDateString('ja-JP')} {selectedJob.startTime} - {selectedJob.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">場所</p>
                  <p className="font-medium">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">時給</p>
                  <p className="font-medium">¥{selectedJob.salary}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">募集状況</p>
                  <p className="font-medium">{selectedJob.currentWorkers}/{selectedJob.maxWorkers}名</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">詳細説明</p>
                <p className="text-sm">{selectedJob.description}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  閉じる
                </Button>
                <Button onClick={() => handleApply(selectedJob.id)}>
                  応募する
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}