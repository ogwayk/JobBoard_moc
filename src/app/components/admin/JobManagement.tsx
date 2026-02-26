import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockJobs } from '@/app/data/mockData';
import { Job } from '@/app/data/types';
import { Plus, MapPin, Clock, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';
import JobForm from './JobForm';

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

export default function JobManagement() {
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const events = jobs.map(job => ({
    id: job.id,
    title: job.title,
    start: new Date(job.date),
    end: new Date(job.date),
    resource: job,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedJob(event.resource);
    setIsDetailOpen(true);
  };

  const handleApprove = (applicationId: string) => {
    toast.success('応募を承認しました');
  };

  const handleReject = (applicationId: string) => {
    toast.success('応募を辞退しました');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      '募集中': 'default',
      '締切': 'secondary',
      '完了': 'outline',
      'キャンセル': 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const handleCreateNew = () => {
    setEditingJob(undefined);
    setIsFormOpen(true);
  };

  const handleSaveJob = (job: Job) => {
    if (editingJob) {
      setJobs(jobs.map((j) => (j.id === job.id ? job : j)));
    } else {
      setJobs([...jobs, job]);
    }
    setIsFormOpen(false);
    setEditingJob(undefined);
  };

  if (isFormOpen) {
    return (
      <JobForm
        job={editingJob}
        onSave={handleSaveJob}
        onCancel={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">求人管理</h2>
        <div className="flex space-x-2">
          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
            <TabsList>
              <TabsTrigger value="calendar">カレンダー</TabsTrigger>
              <TabsTrigger value="list">リスト</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            新規求人
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <Card>
          <CardContent className="p-6">
            <div style={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                onSelectEvent={handleSelectEvent}
                views={['month', 'week', 'day']}
                defaultView="month"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              setSelectedJob(job);
              setIsDetailOpen(true);
            }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
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
                        <Users className="w-4 h-4" />
                        <span>{job.currentWorkers}/{job.maxWorkers}名</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>求人詳細</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
                  <p className="text-muted-foreground">{selectedJob.category}</p>
                </div>
                {getStatusBadge(selectedJob.status)}
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
                  <p className="text-muted-foreground">募集人数</p>
                  <p className="font-medium">{selectedJob.currentWorkers}/{selectedJob.maxWorkers}名</p>
                </div>
                <div>
                  <p className="text-muted-foreground">公開範囲</p>
                  <p className="font-medium">{selectedJob.visibilityLevel}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-1">詳細説明</p>
                <p className="text-sm">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">応募一覧 ({selectedJob.applications.length}件)</h4>
                <div className="space-y-2">
                  {selectedJob.applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">まだ応募がありません</p>
                  ) : (
                    selectedJob.applications.map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{app.workerName}</p>
                          <p className="text-sm text-muted-foreground">
                            応募日時: {new Date(app.appliedAt).toLocaleString('ja-JP')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>{app.status}</Badge>
                          {app.status === '応募済み' && (
                            <>
                              <Button size="sm" onClick={() => handleApprove(app.id)}>
                                承認
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(app.id)}>
                                辞退
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}