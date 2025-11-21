import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    restTime: number;
    instructions?: string;
}
export interface Evaluation {
    healthScore?: number;
    healthStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    healthScoreDescription?: string;
}
export interface MealTime {
    time: string;
    mealName: string;
    suggestedCalories: number;
}

export interface DietPlan {
    dailyCalories?: number;
    macros?: {
        protein?: number;
        carbs?: number;
        fat?: number;
    };
    mealTimes?: MealTime[];
    notes?: string;
}

export interface AISuggestion {
    _id: string;
    memberId: string;
    recommendationDate: string;
    goal: string;
    evaluation?: Evaluation;
    exercises?: Exercise[];
    workoutDuration?: number;
    difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    nutrition?: string;
    dietPlan?: DietPlan;
    notes?: string;
    status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled' | 'Archived';
    message?: string;
    trainerId?: string;
    trainerNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatWithAIRequest {
    memberId: string;
    message: string;
    conversationHistory?: Array<{ role: 'user'|'assistant'; content: string }>;
}

export interface ChatWithAIResponse {
    answer: string;
    suggestedActions?: string[];
    safetyWarning?: string;
}

export interface GenerateSuggestionRequest {
    memberId: string;
    message?: string;
}

export const aiSuggestionApi = {
    getAISuggestionsByMemberId: async (memberId: string): Promise<AISuggestion[]> => {
        const response = await apiClient.get(API_ENDPOINTS.AI_SUGGESTION.GET_AI_SUGGESTION_BY_MEMBERID(memberId));
        return response.data.data || [];
    },
    getSuggestionById: async (id: string): Promise<AISuggestion> => {
        const response = await apiClient.get(API_ENDPOINTS.AI_SUGGESTION.GET_AI_SUGGESTION_BY_ID(id));
        return response.data.data;
    },
    // Chat với AI
    chatWithAI: async (data: ChatWithAIRequest): Promise<ChatWithAIResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTION.CHAT_WITH_AI, data);
        return response.data.data;
    },

    // Generate complete suggestion (Evaluation + Workout + DietPlan)
    generateCompleteSuggestion: async (data: GenerateSuggestionRequest): Promise<AISuggestion> => {
        const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTION.GENERATE_COMPLETE_WORKOUT_SUGGESTION, data);
        return response.data.data;
    },

    // Generate workout only
    generateWorkoutSuggestion: async (data: GenerateSuggestionRequest): Promise<AISuggestion> => {
        const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTION.GENERATE_WORKOUT_ONLY, data);
        return response.data.data;
    },

    // Generate nutrition only
    generateNutritionSuggestion: async (data: GenerateSuggestionRequest): Promise<AISuggestion> => {
        const response = await apiClient.post(API_ENDPOINTS.AI_SUGGESTION.GENERATE_NUTRITION_ONLY, data);
        return response.data.data;
    },
    
    // Update AI Suggestion (for PT to edit)
    updateAISuggestion: async (id: string, data: Partial<AISuggestion>): Promise<AISuggestion> => {
        const response = await apiClient.put(API_ENDPOINTS.AI_SUGGESTION.UPDATE_AI_SUGGESTION(id), data);
        return response.data.data;
    },
}