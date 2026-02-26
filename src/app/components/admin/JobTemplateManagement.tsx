import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockJobTemplates } from '@/app/data/mockData';
import { toast } from 'sonner';
import { JobTemplate } from '@/app/data/types';
import JobTemplateForm from './JobTemplateForm';

export default function JobTemplateManagement() {
  const [templates, setTemplates] = useState(mockJobTemplates);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | undefined>(undefined);

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success('テンプレートを削除しました');
  };

  const handleEdit = (template: JobTemplate) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleSave = (template: JobTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates([...templates, template]);
    }
    setIsFormOpen(false);
    setEditingTemplate(undefined);
  };

  const handleCreateNew = () => {
    setEditingTemplate(undefined);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <JobTemplateForm 
        template={editingTemplate} 
        onSave={(template) => {
          handleSave(template);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">求人テンプレート管理</h2>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          新規テンプレート
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>テンプレート一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>テンプレート名</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>基本給</TableHead>
                <TableHead>休憩時間</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>¥{template.baseSalary}/時</TableCell>
                  <TableCell>{template.breakTime}分</TableCell>
                  <TableCell>{template.createdAt}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
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