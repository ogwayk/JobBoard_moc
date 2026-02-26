import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Briefcase, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'worker', id: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = () => {
    onLogin('admin', 'admin001');
  };

  const handleWorkerLogin = () => {
    // デモ用: メールアドレスからワーカーIDを決定
    if (email.includes('tanaka')) {
      onLogin('worker', 'W001');
    } else if (email.includes('sato')) {
      onLogin('worker', 'W002');
    } else if (email.includes('suzuki')) {
      onLogin('worker', 'W003');
    } else {
      onLogin('worker', 'W001');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">求人管理システム</CardTitle>
          <CardDescription>ログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="worker" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="worker">
                <User className="w-4 h-4 mr-2" />
                ワーカー
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Briefcase className="w-4 h-4 mr-2" />
                管理者
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="worker" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="worker-email">メールアドレス</Label>
                <Input
                  id="worker-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="worker-password">パスワード</Label>
                <Input
                  id="worker-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleWorkerLogin}>
                ログイン
              </Button>
              <div className="text-sm text-muted-foreground mt-4 p-3 bg-blue-50 rounded">
                <p className="font-semibold mb-1">デモアカウント:</p>
                <p>tanaka@example.com</p>
                <p>sato@example.com</p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">メールアドレス</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">パスワード</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <Button className="w-full" onClick={handleAdminLogin}>
                ログイン
              </Button>
              <div className="text-sm text-muted-foreground mt-4 p-3 bg-blue-50 rounded">
                <p className="font-semibold mb-1">デモアカウント:</p>
                <p>admin@example.com / password</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
