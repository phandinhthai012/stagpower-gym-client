import apiClient from "../configs/AxiosConfig";
import { API_ENDPOINTS } from "../configs/Api";
import { ApiResult } from "../types/api.types";

interface Exercise {
    _id: string;
    name: string;
    description?: string;
    instructions: string;
    tips?: string;
    category: string; //Chest, Back, Legs, Shoulders, Arms, Core, Cardio, FullBody, Flexibility, Balance
    difficultyLevel: 'Beginner'|'Intermediate'|'Advanced';
    targetMuscles: string[];
    duration?: number;
    equipment?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    restTime?: number;
    isActive: boolean; 
}

const exerciseService = {
    getAllExercises: async (): Promise<ApiResult<any>> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.EXERCISE.GET_ALL_EXERCISES);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy danh sách bài tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    getExerciseById: async (id: string): Promise<ApiResult<any>> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.EXERCISE.GET_EXERCISE_BY_ID(id));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Lấy bài tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    createExercise: async (exercise: Exercise): Promise<ApiResult<any>> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.EXERCISE.CREATE_EXERCISE, exercise);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Tạo bài tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    updateExercise: async (id: string, exercise: Exercise): Promise<ApiResult<any>> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.EXERCISE.UPDATE_EXERCISE(id), exercise);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Cập nhật bài tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
    deleteExercise: async (id: string): Promise<ApiResult<any>> => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.EXERCISE.DELETE_EXERCISE(id));
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Xóa bài tập thất bại',
                error: error?.response?.data || error
            };
        }
    },
}


export default exerciseService;