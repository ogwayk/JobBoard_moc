import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Briefcase, CheckCircle, DollarSign } from 'lucide-react';
import { mockWorkers, mockJobs, mockWorkHistory } from '@/app/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminOverview() {
  const totalWorkers = mockWorkers.length;
  const activeJobs = mockJobs.filter(j => j.status === '募集中').length;
  const completedJobs = mockJobs.filter(j => j.status === '完了').length;
  const totalEarnings = mockWorkHistory.reduce((sum, w) => sum + w.earnings, 0);

  // 月別データ
  const monthlyData = [
    { month: '10月', 求人数: 12, 応募数: 45, 完了数: 10 },
    { month: '11月', 求人数: 15, 応募数: 58, 完了数: 13 },
    { month: '12月', 求人数: 20, 応募数: 72, 完了数: 18 },
    { month: '1月', 求人数: 18, 応募数: 65, 完了数: 16 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">登録ワーカー</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalWorkers}人</div>
            <p className="text-xs text-muted-foreground">
              前月比 +2人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">募集中の求人</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{activeJobs}件</div>
            <p className="text-xs text-muted-foreground">
              今月の新規求人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">完了した求人</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedJobs}件</div>
            <p className="text-xs text-muted-foreground">
              今月の実績
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">総支払額</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">¥{totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              今月の総額
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>月別統計</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="求人数" fill="#3b82f6" />
              <Bar dataKey="応募数" fill="#10b981" />
              <Bar dataKey="完了数" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>最近の応募</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.currentWorkers}/{job.maxWorkers}名応募
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {job.date.toLocaleDateString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ワーカーランキング</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWorkers
                .sort((a, b) => b.totalHours - a.totalHours)
                .slice(0, 3)
                .map((worker, index) => (
                  <div key={worker.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{worker.name}</p>
                        <p className="text-xs text-muted-foreground">{worker.level}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {worker.totalHours}時間
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
