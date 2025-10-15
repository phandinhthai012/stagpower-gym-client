import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Exercise } from '../../types/exercise.types';
import { 
  X, 
  Dumbbell, 
  Target, 
  Clock, 
  Weight,
  Activity,
  Calendar,
  User
} from 'lucide-react';

interface ModalViewExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function ModalViewExercise({ isOpen, onClose, exercise }: ModalViewExerciseProps) {
  if (!isOpen || !exercise) return null;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Chest':
        return <Badge className="bg-red-100 text-red-800">Chest</Badge>;
      case 'Back':
        return <Badge className="bg-blue-100 text-blue-800">Back</Badge>;
      case 'Legs':
        return <Badge className="bg-green-100 text-green-800">Legs</Badge>;
      case 'Shoulders':
        return <Badge className="bg-yellow-100 text-yellow-800">Shoulders</Badge>;
      case 'Arms':
        return <Badge className="bg-purple-100 text-purple-800">Arms</Badge>;
      case 'Core':
        return <Badge className="bg-orange-100 text-orange-800">Core</Badge>;
      case 'Cardio':
        return <Badge className="bg-cyan-100 text-cyan-800">Cardio</Badge>;
      case 'FullBody':
        return <Badge className="bg-indigo-100 text-indigo-800">Full Body</Badge>;
      case 'Flexibility':
        return <Badge className="bg-pink-100 text-pink-800">Flexibility</Badge>;
      case 'Balance':
        return <Badge className="bg-teal-100 text-teal-800">Balance</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getDifficultyBadge = (difficultyLevel: string) => {
    switch (difficultyLevel) {
      case 'Beginner':
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>;
      case 'Intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>;
      case 'Advanced':
        return <Badge className="bg-red-100 text-red-800">Advanced</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40" 
        style={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
      />
      
      {/* Modal content */}
      <div className="relative flex items-center justify-center h-full p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white relative z-[10000]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-600" />
              Chi tiết bài tập
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Thông tin cơ bản
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tên bài tập</label>
                    <p className="text-lg font-semibold text-gray-900">{exercise.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Danh mục</label>
                    <div className="mt-1">
                      {getCategoryBadge(exercise.category)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Độ khó</label>
                    <div className="mt-1">
                      {getDifficultyBadge(exercise.difficultyLevel)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Thiết bị</label>
                    <p className="text-gray-900">{exercise.equipment}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                    <div className="mt-1">
                      {getStatusBadge(exercise.isActive)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mô tả</label>
                    <p className="text-gray-900 mt-1">{exercise.description}</p>
                  </div>

                  {exercise.duration && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời gian thực hiện</label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exercise.duration} phút
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Exercise Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Thông số bài tập
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Sets</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{exercise.sets}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">Reps</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{exercise.reps}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-500">Trọng lượng</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{exercise.weight} kg</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-500">Nghỉ</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{exercise.restTime} phút</p>
                </div>
              </div>
            </div>

            {/* Target Muscles */}
            {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Nhóm cơ tác động
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {exercise.targetMuscles.map((muscle, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hướng dẫn thực hiện
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-line">{exercise.instructions}</p>
              </div>
            </div>

            {/* Tips */}
            {exercise.tips && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Mẹo thực hiện
                </h3>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-line">{exercise.tips}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thông tin bổ sung
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                  <p className="text-gray-900">
                    {new Date(exercise.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                  <p className="text-gray-900">
                    {new Date(exercise.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
