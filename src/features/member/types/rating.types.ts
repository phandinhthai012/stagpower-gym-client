import { User } from './member.types';

export interface Rating {
  _id: string;
  memberId: string | User;
  trainerId: string | User;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  trainerId: string;
  rating: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  rating?: number;
  comment?: string;
}

export interface RateableTrainer extends User {
  hasRating: boolean;
}

