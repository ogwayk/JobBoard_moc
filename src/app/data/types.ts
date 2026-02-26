// ユーザーとワーカーの型定義
export type UserLevel = '全体' | 'お気に入り' | '熟練者' | '中級者' | '初級者';

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: UserLevel;
  group: string;
  totalHours: number;
  totalEarnings: number;
  joinedDate: string;
}

export type SectionCode = '宴会' | '朔風' | 'グランカフェ' | 'ルーム掃除' | '調理補助' | 'フロント夜勤' | 'おせち' | 'フィエスタ ビアガーデン';

export interface JobTemplate {
  id: string;
  name: string;
  category: string;
  baseSalary: number;
  breakTime: number;
  description: string;
  descriptionImages?: string[]; // 説明用の画像
  createdAt: string;
  // 新規追加項目
  workingHours?: string; // 勤務時間
  sectionCode?: SectionCode; // セクションコード
  precautions?: string; // 注意事項
  belongings?: string; // 持ち物
  workplaceAddress?: string; // 就業場所の住所
  emergencyContact?: string; // 緊急連絡先
  overtimeAllowance?: number; // 法定時間外割増手当
  lateNightAllowance?: number; // 深夜割増手当
}

export type JobStatus = '募集中' | '締切' | '完了' | 'キャンセル';

export interface Job {
  id: string;
  templateId: string;
  title: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  salary: number;
  breakTime: number;
  maxWorkers: number;
  currentWorkers: number;
  status: JobStatus;
  visibilityLevel: UserLevel;
  description: string;
  descriptionImages?: string[]; // 説明用の画像
  applications: Application[];
  // 新規追加項目
  implementationDate?: Date; // 実施日（日付＋時刻）
  applicationDeadline?: Date; // 応募期限
  recruitmentCount?: number; // 募集人数
  workingHours?: string; // 勤務時間
  sectionCode?: SectionCode; // セクションコード
  precautions?: string; // 注意事項
  belongings?: string; // 持ち物
  workplaceAddress?: string; // 就業場所の住所
  emergencyContact?: string; // 緊急連絡先
  documentFiles?: string[]; // 業務に関する書類（ファイル名のリスト）
  overtimeAllowance?: number; // 法定時間外割増手当
  lateNightAllowance?: number; // 深夜割増手当
}

export type ApplicationStatus = '応募済み' | '承認' | '辞退' | 'キャンセル';

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  status: ApplicationStatus;
  appliedAt: string;
  approvedAt?: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
}

export interface WorkHistory {
  id: string;
  jobId: string;
  workerId: string;
  jobTitle: string;
  date: string;
  hours: number;
  earnings: number;
  status: '完了' | '未完了';
}