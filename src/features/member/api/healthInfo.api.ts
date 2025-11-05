import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

// Transform server response (lowercase enums) to client format (PascalCase)
const transformHealthInfoFromServer = (serverData: HealthInfoServerResponse): HealthInfo => {
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  return {
    ...serverData,
    experience: serverData.experience 
      ? capitalizeFirst(serverData.experience) as 'Beginner' | 'Intermediate' | 'Advanced'
      : undefined,
    fitnessLevel: serverData.fitnessLevel
      ? capitalizeFirst(serverData.fitnessLevel) as 'Low' | 'Medium' | 'High'
      : undefined,
    preferredTime: serverData.preferredTime
      ? capitalizeFirst(serverData.preferredTime) as 'Morning' | 'Afternoon' | 'Evening'
      : undefined,
  };
};

// Transform client format (PascalCase) to server format (lowercase) before sending
const transformHealthInfoToServer = (clientData: Partial<CreateHealthInfoRequest | HealthInfo>): Partial<CreateHealthInfoRequest> => {
  const lowercaseFirst = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toLowerCase() + str.slice(1);
  };
  
  const transformed: Partial<CreateHealthInfoRequest> = { ...clientData } as any;
  
  // Transform enum values from PascalCase to lowercase if they exist
  if (transformed.experience && typeof transformed.experience === 'string') {
    const exp = transformed.experience.toLowerCase();
    if (['beginner', 'intermediate', 'advanced'].includes(exp)) {
      transformed.experience = exp as 'beginner' | 'intermediate' | 'advanced';
    } else {
      transformed.experience = lowercaseFirst(transformed.experience) as 'beginner' | 'intermediate' | 'advanced';
    }
  }
  
  if (transformed.fitnessLevel && typeof transformed.fitnessLevel === 'string') {
    const level = transformed.fitnessLevel.toLowerCase();
    if (['low', 'medium', 'high'].includes(level)) {
      transformed.fitnessLevel = level as 'low' | 'medium' | 'high';
    } else {
      transformed.fitnessLevel = lowercaseFirst(transformed.fitnessLevel) as 'low' | 'medium' | 'high';
    }
  }
  
  if (transformed.preferredTime && typeof transformed.preferredTime === 'string') {
    const time = transformed.preferredTime.toLowerCase();
    if (['morning', 'afternoon', 'evening'].includes(time)) {
      transformed.preferredTime = time as 'morning' | 'afternoon' | 'evening';
    } else {
      transformed.preferredTime = lowercaseFirst(transformed.preferredTime) as 'morning' | 'afternoon' | 'evening';
    }
  }
  
  return transformed;
};

// Server returns lowercase enum values, but we want to use PascalCase in client
// This interface represents the transformed client-side format
export interface HealthInfo {
  _id?: string;
  memberId: string;
  
  // Basic info
  height?: number;
  weight?: number;
  bmi?: number; // Auto-calculated by server
  gender?: 'male' | 'female';
  age?: number;
  
  // Body composition
  bodyFatPercent?: number;
  bodyFatMass?: number; // kg - Khối lượng mỡ cơ thể
  muscleMass?: number; // kg
  visceralFatLevel?: number; // Cấp độ mỡ nội tạng (1-20)
  waterPercent?: number; // %
  boneMass?: number; // kg
  
  // InBody Analysis
  basalMetabolicRate?: number; // kcal - Tỷ lệ trao đổi chất cơ bản
  waistHipRatio?: number; // Tỷ lệ vòng eo/vòng hông
  inBodyScore?: number; // Điểm InBody (0-100)
  
  // Segmental Analysis
  segmentalLeanAnalysis?: {
    leftArm?: { mass?: number; percent?: number };
    rightArm?: { mass?: number; percent?: number };
    leftLeg?: { mass?: number; percent?: number };
    rightLeg?: { mass?: number; percent?: number };
  };
  segmentalFatAnalysis?: {
    leftArm?: { mass?: number; percent?: number };
    rightArm?: { mass?: number; percent?: number };
    trunk?: { mass?: number; percent?: number };
    leftLeg?: { mass?: number; percent?: number };
    rightLeg?: { mass?: number; percent?: number };
  };
  
  // Medical history
  medicalHistory?: string;
  allergies?: string;
  
  // Fitness goals and experience
  goal?: string; // WeightLoss, MuscleGain, Health, etc.
  experience?: 'Beginner' | 'Intermediate' | 'Advanced'; // Transformed from server lowercase
  fitnessLevel?: 'Low' | 'Medium' | 'High'; // Transformed from server lowercase
  preferredTime?: 'Morning' | 'Afternoon' | 'Evening'; // Transformed from server lowercase
  weeklySessions?: '1-2' | '3-4' | '5+';
  
  // Lifestyle
  dietType?: 'balanced' | 'high_protein' | 'low_carb' | 'vegetarian' | 'vegan' | 'other';
  dailyCalories?: number; // 800-5000
  sleepHours?: number; // 0-24
  stressLevel?: 'low' | 'medium' | 'high';
  alcohol?: 'none' | 'occasional' | 'frequent';
  smoking?: boolean;
  
  // Health score (auto-calculated by server)
  healthScore?: number; // 0-100
  healthScoreDescription?: string;
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  
  // Timestamps
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Raw server response format (with lowercase enums)
export interface HealthInfoServerResponse {
  _id?: string;
  memberId: string;
  height?: number;
  weight?: number;
  bmi?: number;
  gender?: 'male' | 'female';
  age?: number;
  bodyFatPercent?: number;
  bodyFatMass?: number;
  muscleMass?: number;
  visceralFatLevel?: number;
  waterPercent?: number;
  boneMass?: number;
  basalMetabolicRate?: number;
  waistHipRatio?: number;
  inBodyScore?: number;
  segmentalLeanAnalysis?: {
    leftArm?: { mass?: number; percent?: number };
    rightArm?: { mass?: number; percent?: number };
    leftLeg?: { mass?: number; percent?: number };
    rightLeg?: { mass?: number; percent?: number };
  };
  segmentalFatAnalysis?: {
    leftArm?: { mass?: number; percent?: number };
    rightArm?: { mass?: number; percent?: number };
    trunk?: { mass?: number; percent?: number };
    leftLeg?: { mass?: number; percent?: number };
    rightLeg?: { mass?: number; percent?: number };
  };
  medicalHistory?: string;
  allergies?: string;
  goal?: string;
  experience?: 'beginner' | 'intermediate' | 'advanced'; // lowercase from server
  fitnessLevel?: 'low' | 'medium' | 'high'; // lowercase from server
  preferredTime?: 'morning' | 'afternoon' | 'evening'; // lowercase from server
  weeklySessions?: '1-2' | '3-4' | '5+';
  dietType?: 'balanced' | 'high_protein' | 'low_carb' | 'vegetarian' | 'vegan' | 'other';
  dailyCalories?: number;
  sleepHours?: number;
  stressLevel?: 'low' | 'medium' | 'high';
  alcohol?: 'none' | 'occasional' | 'frequent';
  smoking?: boolean;
  healthScore?: number;
  healthScoreDescription?: string;
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHealthInfoRequest {
  height?: number;
  weight?: number;
  gender?: 'male' | 'female';
  age?: number;
  bodyFatPercent?: number;
  bodyFatMass?: number;
  muscleMass?: number;
  visceralFatLevel?: number;
  waterPercent?: number;
  boneMass?: number;
  basalMetabolicRate?: number;
  waistHipRatio?: number;
  inBodyScore?: number;
  segmentalLeanAnalysis?: {
    leftArm?: { mass?: number; percent?: number };
    rightArm?: { mass?: number; percent?: number };
    leftLeg?: { mass?: number; percent?: number };
    rightLeg?: { mass?: number; percent?: number };
  };
  segmentalFatAnalysis?: {
    leftArm?: { mass?: number; percent?: number };
    rightArm?: { mass?: number; percent?: number };
    trunk?: { mass?: number; percent?: number };
    leftLeg?: { mass?: number; percent?: number };
    rightLeg?: { mass?: number; percent?: number };
  };
  medicalHistory?: string;
  allergies?: string;
  goal?: string;
  experience?: 'beginner' | 'intermediate' | 'advanced'; // Send lowercase to server
  fitnessLevel?: 'low' | 'medium' | 'high'; // Send lowercase to server
  preferredTime?: 'morning' | 'afternoon' | 'evening'; // Send lowercase to server
  weeklySessions?: '1-2' | '3-4' | '5+';
  dietType?: 'balanced' | 'high_protein' | 'low_carb' | 'vegetarian' | 'vegan' | 'other';
  dailyCalories?: number;
  sleepHours?: number;
  stressLevel?: 'low' | 'medium' | 'high';
  alcohol?: 'none' | 'occasional' | 'frequent';
  smoking?: boolean;
}

export interface UpdateHealthInfoRequest extends Partial<CreateHealthInfoRequest> {}

// API Functions
export const healthInfoApi = {
  // Lấy thông tin sức khỏe của member hiện tại
  getMyHealthInfo: async (): Promise<HealthInfo> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_MY_HEALTH_INFO);
    return transformHealthInfoFromServer(response.data.data);
  },

  // Lấy thông tin sức khỏe theo member ID
  getHealthInfoByMemberId: async (memberId: string): Promise<HealthInfo> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_MEMBER_ID(memberId));
    return transformHealthInfoFromServer(response.data.data);
  },

  // Tạo thông tin sức khỏe mới
  createHealthInfo: async (memberId: string, data: CreateHealthInfoRequest): Promise<HealthInfo> => {
    const serverData = transformHealthInfoToServer(data);
    const response = await apiClient.post(API_ENDPOINTS.HEALTH_INFO.CREATE_HEALTH_INFO(memberId), serverData);
    return transformHealthInfoFromServer(response.data.data);
  },

  // Cập nhật thông tin sức khỏe
  updateHealthInfo: async (healthInfoId: string, data: UpdateHealthInfoRequest): Promise<HealthInfo> => {
    const serverData = transformHealthInfoToServer(data);
    const response = await apiClient.put(API_ENDPOINTS.HEALTH_INFO.UPDATE_HEALTH_INFO(healthInfoId), serverData);
    return transformHealthInfoFromServer(response.data.data);
  },

  // Lấy thông tin sức khỏe theo ID
  getHealthInfoById: async (healthInfoId: string): Promise<HealthInfo> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_HEALTH_INFO_BY_ID(healthInfoId));
    return transformHealthInfoFromServer(response.data.data);
  },

  // Lấy tất cả thông tin sức khỏe theo member ID (lịch sử)
  getAllHealthInfoByMemberId: async (memberId: string): Promise<HealthInfo[]> => {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH_INFO.GET_ALL_HEALTH_INFO_BY_MEMBER_ID(memberId));
    // Transform array of health info records
    const healthInfoList = response.data.data || [];
    return healthInfoList.map((item: HealthInfoServerResponse) => transformHealthInfoFromServer(item));
  },
};
