import { API_ENDPOINTS } from '../../../configs/Api';
import apiClient from '../../../configs/AxiosConfig';
import { Exercise, CreateExerciseData, UpdateExerciseData, ExerciseSearchParams } from '../types/exercise.types';

export const exerciseApi = {
  // Get all exercises
  getAllExercises: async (): Promise<Exercise[]> => {
    const response = await apiClient.get(API_ENDPOINTS.EXERCISE.GET_ALL_EXERCISES);
    return response.data.data;
  },

  // Get exercise by ID
  getExerciseById: async (exerciseId: string): Promise<Exercise> => {
    const response = await apiClient.get(API_ENDPOINTS.EXERCISE.GET_EXERCISE_BY_ID(exerciseId));
    return response.data.data;
  },

  // Create new exercise
  createExercise: async (exerciseData: CreateExerciseData): Promise<Exercise> => {
    const response = await apiClient.post(API_ENDPOINTS.EXERCISE.CREATE_EXERCISE, exerciseData);
    return response.data.data;
  },

  // Update exercise
  updateExercise: async (exerciseId: string, exerciseData: UpdateExerciseData): Promise<Exercise> => {
    const response = await apiClient.put(API_ENDPOINTS.EXERCISE.UPDATE_EXERCISE(exerciseId), exerciseData);
    return response.data.data;
  },

  // Delete exercise
  deleteExercise: async (exerciseId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EXERCISE.DELETE_EXERCISE(exerciseId));
  },

  // Search exercises
  searchExercises: async (searchTerm: string): Promise<Exercise[]> => {
    const response = await apiClient.get(API_ENDPOINTS.EXERCISE.SEARCH_EXERCISES, {
      params: { q: searchTerm }
    });
    return response.data.data;
  },

  // Get exercises by difficulty level
  getExercisesByLevel: async (level: string): Promise<Exercise[]> => {
    const response = await apiClient.get(API_ENDPOINTS.EXERCISE.GET_EXERCISES_BY_LEVEL(level));
    return response.data.data;
  }
};
