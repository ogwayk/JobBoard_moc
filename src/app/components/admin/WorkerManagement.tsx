import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import { mockWorkers } from '@/app/data/mockData';
import { toast } from 'sonner';

export default function WorkerManagement() {
  const [workers, setWorkers] = useState(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredWorkers = workers.filter(w => 
    w.name.includes(searchTerm) || w.email.includes(searchTerm)
  );

  const handleDelete = (id: string) => {
    setWorkers(workers.filter(w => w.id !== id));
    toast.success('ワーカーを削除しました');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">ワーカー管理</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              新規登録
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ワーカー情報登録</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>氏名</Label>
                  <Input placeholder="山田 太郎" />
                </div>
                <div className="space-y-2">
                  <Label>メールアドレス</Label>
                  <Input type="email" placeholder="yamada@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>電話番号</Label>
                  <Input placeholder="090-1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label>レベル</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="熟練者">熟練者</SelectItem>
                      <SelectItem value="中級者">中級者</SelectItem>
                      <SelectItem value="初級者">初級者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>グループ</Label>
                <Input placeholder="グループA" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={() => {
                  setIsDialogOpen(false);
                  toast.success('ワーカーを登録しました');
                }}>
                  登録
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ワーカー名またはメールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>氏名</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead>電話番号</TableHead>
                <TableHead>レベル</TableHead>
                <TableHead>グループ</TableHead>
                <TableHead>総勤務時間</TableHead>
                <TableHead>総報酬</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.email}</TableCell>
                  <TableCell>{worker.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{worker.level}</Badge>
                  </TableCell>
                  <TableCell>{worker.group}</TableCell>
                  <TableCell>{worker.totalHours}h</TableCell>
                  <TableCell>¥{worker.totalEarnings.toLocaleString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(worker.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
