export interface Ticket {
  id: string;
  requesterName: string;
  branch: string; // การไฟฟ้าแต่ละสาขา
  deviceId: string;
  deviceType: 'Desktop' | 'Notebook' | 'Printer' | 'Network' | 'Other';
  issueDescription: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  updatedAt?: string;
  aiDiagnosis?: string; // คำแนะนำจาก AI
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

// สาขาทั้งหมด (ตัวอย่าง)
export const BRANCHES = [
  'กฟภ. สำนักงานใหญ่',
  'กฟภ. สาขารังสิต',
  'กฟภ. สาขาบางเขน',
  'กฟภ. สาขานนทบุรี',
  'กฟภ. สาขาปทุมธานี',
  'กฟภ. สาขาสมุทรปราการ',
  'กฟภ. สาขาพระนครศรีอยุธยา'
];

export const DEVICE_TYPES = [
  'Desktop',
  'Notebook',
  'Printer',
  'Network',
  'Other'
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];