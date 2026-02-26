import { useState } from 'react';
import ReactQuill from 'react-quill';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { X, Image as ImageIcon } from 'lucide-react';
import { JobTemplate, SectionCode } from '@/app/data/types';
import { toast } from 'sonner';

interface JobTemplateFormProps {
  template?: JobTemplate;
  onSave?: (template: JobTemplate) => void;
  onCancel?: () => void;
}

const sectionCodes: SectionCode[] = [
  '宴会',
  '朔風',
  'グランカフェ',
  'ルーム掃除',
  '調理補助',
  'フロント夜勤',
  'おせち',
  'フィエスタ ビアガーデン',
];

export default function JobTemplateForm({ template, onSave, onCancel }: JobTemplateFormProps) {
  const parseWorkingHours = (workingHours: string) => {
    const match = workingHours?.match(/(\d{1,2}:\d{2})～(\d{1,2}:\d{2})/);
    return {
      startTime: match ? match[1] : '',
      endTime: match ? match[2] : '',
    };
  };

  const initialTimes = parseWorkingHours(template?.workingHours || '');

  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || '',
    baseSalary: template?.baseSalary?.toString() || '',
    breakTime: template?.breakTime?.toString() || '',
    workingStartTime: initialTimes.startTime,
    workingEndTime: initialTimes.endTime,
    sectionCode: template?.sectionCode || '',
    precautions: template?.precautions || '',
    belongings: template?.belongings || '',
    workplaceAddress: template?.workplaceAddress || '',
    emergencyContact: template?.emergencyContact || '',
    overtimeAllowance: template?.overtimeAllowance?.toString() || '',
    lateNightAllowance: template?.lateNightAllowance?.toString() || '',
  });

  const [description, setDescription] = useState(template?.description || '');
  const [descriptionImages, setDescriptionImages] = useState<string[]>(template?.descriptionImages || []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, sectionCode: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 実際にはファイルをアップロードする処理を実装
      // ここではダミーのURLを追加
      const newImages = Array.from(files).map((file, index) => 
        URL.createObjectURL(file)
      );
      setDescriptionImages(prev => [...prev, ...newImages]);
      toast.success(`${files.length}枚の画像を追加しました`);
    }
  };

  const removeImage = (index: number) => {
    setDescriptionImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData: JobTemplate = {
      id: template?.id || `template-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      baseSalary: parseFloat(formData.baseSalary) || 0,
      breakTime: parseInt(formData.breakTime) || 0,
      description,
      descriptionImages,
      workingHours: formData.workingStartTime && formData.workingEndTime 
        ? `${formData.workingStartTime}～${formData.workingEndTime}` 
        : '',
      sectionCode: formData.sectionCode as SectionCode,
      precautions: formData.precautions,
      belongings: formData.belongings,
      workplaceAddress: formData.workplaceAddress,
      emergencyContact: formData.emergencyContact,
      overtimeAllowance: parseFloat(formData.overtimeAllowance) || undefined,
      lateNightAllowance: parseFloat(formData.lateNightAllowance) || undefined,
      createdAt: template?.createdAt || new Date().toISOString(),
    };

    onSave?.(templateData);
    toast.success(template ? 'テンプレートを更新しました' : 'テンプレートを作成しました');
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl">{template ? 'テンプレート編集' : '新規テンプレート作成'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">テンプレート名 *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="例: 宴会スタッフテンプレート"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">業務カテゴリ *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="例: 接客・サービス"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseSalary">基本給（時給） *</Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  placeholder="1200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breakTime">休憩時間（分） *</Label>
                <Input
                  id="breakTime"
                  name="breakTime"
                  type="number"
                  value={formData.breakTime}
                  onChange={handleInputChange}
                  placeholder="60"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingStartTime">勤務開始時間</Label>
                <Input
                  id="workingStartTime"
                  name="workingStartTime"
                  type="time"
                  value={formData.workingStartTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workingEndTime">勤務終了時間</Label>
                <Input
                  id="workingEndTime"
                  name="workingEndTime"
                  type="time"
                  value={formData.workingEndTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sectionCode">セクションコード</Label>
                <Select value={formData.sectionCode} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="セクションを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>説明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>詳細説明（リッチテキスト）</Label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={modules}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>説明用画像</Label>
              <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  画像を追加
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {descriptionImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {descriptionImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img} alt={`説明画像 ${index + 1}`} className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>詳細情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="precautions">注意事項</Label>
              <Textarea
                id="precautions"
                name="precautions"
                value={formData.precautions}
                onChange={handleInputChange}
                placeholder="業務上の注意事項を入力"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="belongings">持ち物</Label>
              <Textarea
                id="belongings"
                name="belongings"
                value={formData.belongings}
                onChange={handleInputChange}
                placeholder="必要な持ち物を入力"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplaceAddress">就業場所の住所</Label>
              <Input
                id="workplaceAddress"
                name="workplaceAddress"
                value={formData.workplaceAddress}
                onChange={handleInputChange}
                placeholder="例: 東京都千代田区..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">緊急連絡先</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="例: 03-1234-5678"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overtimeAllowance">法定時間外割増手当（%）</Label>
                <Input
                  id="overtimeAllowance"
                  name="overtimeAllowance"
                  type="number"
                  value={formData.overtimeAllowance}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateNightAllowance">深夜割増手当（%）</Label>
                <Input
                  id="lateNightAllowance"
                  name="lateNightAllowance"
                  type="number"
                  value={formData.lateNightAllowance}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">
            {template ? '更新する' : '作成する'}
          </Button>
        </div>
      </form>
    </div>
  );
}