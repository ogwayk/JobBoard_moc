import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Download } from 'lucide-react';
import { mockWorkers, mockWorkHistory } from '@/app/data/mockData';
import { toast } from 'sonner';

export default function PaymentManagement() {
  const [selectedMonth, setSelectedMonth] = useState('2026-01');

  const exportCSV = () => {
    toast.success('CSVファイルをダウンロードしました');
  };

  // ワーカーごとの集計
  const workerSummary = mockWorkers.map(worker => {
    const history = mockWorkHistory.filter(h => h.workerId === worker.id);
    const totalHours = history.reduce((sum, h) => sum + h.hours, 0);
    const totalEarnings = history.reduce((sum, h) => sum + h.earnings, 0);
    return {
      ...worker,
      monthlyHours: totalHours,
      monthlyEarnings: totalEarnings,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">報酬管理</h2>
        <div className="flex space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-01">2026年1月</SelectItem>
              <SelectItem value="2025-12">2025年12月</SelectItem>
              <SelectItem value="2025-11">2025年11月</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV出力
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">総勤務時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workerSummary.reduce((sum, w) => sum + w.monthlyHours, 0)}時間
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">総支払額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{workerSummary.reduce((sum, w) => sum + w.monthlyEarnings, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">平均時給</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥1,200</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ワーカー別報酬一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ワーカー名</TableHead>
                <TableHead>レベル</TableHead>
                <TableHead>勤務日数</TableHead>
                <TableHead>総勤務時間</TableHead>
                <TableHead>総報酬</TableHead>
                <TableHead>平均時給</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workerSummary.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.level}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{worker.monthlyHours}時間</TableCell>
                  <TableCell>¥{worker.monthlyEarnings.toLocaleString()}</TableCell>
                  <TableCell>
                    ¥{worker.monthlyHours > 0 ? Math.round(worker.monthlyEarnings / worker.monthlyHours) : 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>勤務履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日付</TableHead>
                <TableHead>ワーカー名</TableHead>
                <TableHead>案件名</TableHead>
                <TableHead>勤務時間</TableHead>
                <TableHead>報酬</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkHistory.map((history) => {
                const worker = mockWorkers.find(w => w.id === history.workerId);
                return (
                  <TableRow key={history.id}>
                    <TableCell>{history.date}</TableCell>
                    <TableCell>{worker?.name}</TableCell>
                    <TableCell>{history.jobTitle}</TableCell>
                    <TableCell>{history.hours}時間</TableCell>
                    <TableCell>¥{history.earnings.toLocaleString()}</TableCell>
                    <TableCell>{history.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
