import { useState } from 'react';
import ReactQuill from 'react-quill';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ArrowLeft, Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Job, SectionCode, UserLevel } from '@/app/data/types';
import { toast } from 'sonner';

interface JobFormProps {
  job?: Job;
  onSave?: (job: Job) => void;
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

const visibilityLevels: UserLevel[] = [
  '全体',
  'お気に入り',
  '熟練者',
  '中級者',
  '初級者',
];

export default function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    category: job?.category || '',
    date: job?.date ? job.date.toISOString().split('T')[0] : '',
    startTime: job?.startTime || '',
    endTime: job?.endTime || '',
    location: job?.location || '',
    salary: job?.salary?.toString() || '',
    breakTime: job?.breakTime?.toString() || '',
    maxWorkers: job?.maxWorkers?.toString() || '',
    visibilityLevel: job?.visibilityLevel || '全体',
    // 新規追加項目
    implementationDate: job?.implementationDate ? job.implementationDate.toISOString().slice(0, 16) : '',
    applicationDeadline: job?.applicationDeadline ? job.applicationDeadline.toISOString().slice(0, 16) : '',
    recruitmentCount: job?.recruitmentCount?.toString() || '',
    workingHours: job?.workingHours || '',
    sectionCode: job?.sectionCode || '',
    precautions: job?.precautions || '',
    belongings: job?.belongings || '',
    workplaceAddress: job?.workplaceAddress || '',
    emergencyContact: job?.emergencyContact || '',
    overtimeAllowance: job?.overtimeAllowance?.toString() || '',
    lateNightAllowance: job?.lateNightAllowance?.toString() || '',
  });

  const [description, setDescription] = useState(job?.description || '');
  const [descriptionImages, setDescriptionImages] = useState<string[]>(job?.descriptionImages || []);
  const [documentFiles, setDocumentFiles] = useState<string[]>(job?.documentFiles || []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setDescriptionImages(prev => [...prev, ...newImages]);
      toast.success(`${files.length}枚の画像を追加しました`);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocs = Array.from(files).map((file) => file.name);
      setDocumentFiles(prev => [...prev, ...newDocs]);
      toast.success(`${files.length}件のファイルを追加しました`);
    }
  };

  const removeImage = (index: number) => {
    setDescriptionImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData: Job = {
      id: job?.id || `job-${Date.now()}`,
      templateId: job?.templateId || '',
      title: formData.title,
      category: formData.category,
      date: new Date(formData.date),
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      salary: parseFloat(formData.salary) || 0,
      breakTime: parseInt(formData.breakTime) || 0,
      maxWorkers: parseInt(formData.maxWorkers) || 0,
      currentWorkers: job?.currentWorkers || 0,
      status: job?.status || '募集中',
      visibilityLevel: formData.visibilityLevel as UserLevel,
      description,
      descriptionImages,
      applications: job?.applications || [],
      // 新規追加項目
      implementationDate: formData.implementationDate ? new Date(formData.implementationDate) : undefined,
      applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined,
      recruitmentCount: parseInt(formData.recruitmentCount) || undefined,
      workingHours: formData.workingHours,
      sectionCode: formData.sectionCode as SectionCode,
      precautions: formData.precautions,
      belongings: formData.belongings,
      workplaceAddress: formData.workplaceAddress,
      emergencyContact: formData.emergencyContact,
      documentFiles,
      overtimeAllowance: parseFloat(formData.overtimeAllowance) || undefined,
      lateNightAllowance: parseFloat(formData.lateNightAllowance) || undefined,
    };

    onSave?.(jobData);
    toast.success(job ? '求人情報を更新しました' : '求人情報を作成しました');
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
        <h2 className="text-2xl">{job ? '求人編集' : '新規求人作成'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">求人タイトル *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="例: 宴会スタッフ募集"
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

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">実施日（日付） *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">開始時刻 *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">終了時刻 *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">応募期限</Label>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="datetime-local"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">勤務地 *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="例: 東京本店"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">時給 *</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
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
                <Label htmlFor="maxWorkers">最大募集人数 *</Label>
                <Input
                  id="maxWorkers"
                  name="maxWorkers"
                  type="number"
                  value={formData.maxWorkers}
                  onChange={handleInputChange}
                  placeholder="10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruitmentCount">募集人数</Label>
                <Input
                  id="recruitmentCount"
                  name="recruitmentCount"
                  type="number"
                  value={formData.recruitmentCount}
                  onChange={handleInputChange}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibilityLevel">公開範囲 *</Label>
                <Select value={formData.visibilityLevel} onValueChange={handleSelectChange('visibilityLevel')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sectionCode">セクションコード</Label>
                <Select value={formData.sectionCode} onValueChange={handleSelectChange('sectionCode')}>
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
                <Button type="button" variant="outline" onClick={() => document.getElementById('job-image-upload')?.click()}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  画像を追加
                </Button>
                <input
                  id="job-image-upload"
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

            <div className="space-y-2">
              <Label>業務に関する書類</Label>
              <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" onClick={() => document.getElementById('job-document-upload')?.click()}>
                  <FileText className="w-4 h-4 mr-2" />
                  ファイルを追加
                </Button>
                <input
                  id="job-document-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
              </div>
              {documentFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {documentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
            {job ? '更新する' : '作成する'}
          </Button>
        </div>
      </form>
    </div>
  );
}