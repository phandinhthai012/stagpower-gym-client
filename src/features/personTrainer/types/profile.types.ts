export interface TrainerProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  photo?: string;
  cccd?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  trainerInfo?: {
    specialty: string;
    experience_years: number;
    certificate: string[];
    working_hour: string[];
  };
}

export interface UpdateTrainerProfileRequest {
  fullName?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  photo?: string;
  cccd?: string;
  'trainerInfo.specialty'?: string;
  'trainerInfo.experience_years'?: number;
  'trainerInfo.certificate'?: string[];
  'trainerInfo.working_hour'?: string[];
}

export interface TrainerStats {
  totalMembers: number;
  averageRating: number;
  totalSessions: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

