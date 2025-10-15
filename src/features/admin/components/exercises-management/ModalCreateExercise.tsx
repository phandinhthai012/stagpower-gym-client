import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useCreateExercise } from '../../hooks/useExercises';
import { CreateExerciseData } from '../../types/exercise.types';
import { 
  X, 
  Dumbbell, 
  Target, 
  Clock, 
  Weight,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

interface ModalCreateExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCreateExercise({ isOpen, onClose, onSuccess }: ModalCreateExerciseProps) {
  const [formData, setFormData] = useState<CreateExerciseData>({
    name: '',
    description: '',
    instructions: '',
    tips: '',
    category: '',
    difficultyLevel: 'Beginner',
    targetMuscles: [],
    equipment: 'Bodyweight',
    sets: 3,
    reps: 10,
    weight: 0,
    restTime: 2,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMuscle, setNewMuscle] = useState('');

  // Lock scroll when modal is open
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });

  const createExerciseMutation = useCreateExercise();

  const handleInputChange = (field: keyof CreateExerciseData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const addMuscle = () => {
    if (newMuscle.trim() && !formData.targetMuscles.includes(newMuscle.trim())) {
      handleInputChange('targetMuscles', [...formData.targetMuscles, newMuscle.trim()]);
      setNewMuscle('');
    }
  };

  const removeMuscle = (muscleToRemove: string) => {
    handleInputChange('targetMuscles', formData.targetMuscles.filter(muscle => muscle !== muscleToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Tên bài tập là bắt buộc';
    if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';
    if (!formData.instructions.trim()) newErrors.instructions = 'Hướng dẫn thực hiện là bắt buộc';
    if (!formData.category) newErrors.category = 'Danh mục là bắt buộc';
    if (!formData.difficultyLevel) newErrors.difficultyLevel = 'Độ khó là bắt buộc';
    if (!formData.equipment) newErrors.equipment = 'Thiết bị là bắt buộc';

    // Numeric validation
    if (formData.sets < 1 || formData.sets > 10) {
      newErrors.sets = 'Số sets phải từ 1-10';
    }
    if (formData.reps < 1 || formData.reps > 100) {
      newErrors.reps = 'Số reps phải từ 1-100';
    }
    if (formData.weight < 0 || formData.weight > 1000) {
      newErrors.weight = 'Trọng lượng phải từ 0-1000 kg';
    }
    if (formData.restTime < 0 || formData.restTime > 100) {
      newErrors.restTime = 'Thời gian nghỉ phải từ 0-100 phút';
    }
    if (formData.duration && (formData.duration < 0 || formData.duration > 120)) {
      newErrors.duration = 'Thời gian thực hiện phải từ 0-120 phút';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createExerciseMutation.mutateAsync(formData);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        instructions: '',
        tips: '',
        category: '',
        difficultyLevel: 'Beginner',
        targetMuscles: [],
        equipment: 'Bodyweight',
        sets: 3,
        reps: 10,
        weight: 0,
        restTime: 2,
        isActive: true
      });
      
    } catch (error) {
      console.error('Error creating exercise:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
              Thêm bài tập mới
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên bài tập <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="VD: Push-up"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectItem value="Chest">Chest</SelectItem>
                        <SelectItem value="Back">Back</SelectItem>
                        <SelectItem value="Legs">Legs</SelectItem>
                        <SelectItem value="Shoulders">Shoulders</SelectItem>
                        <SelectItem value="Arms">Arms</SelectItem>
                        <SelectItem value="Core">Core</SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="FullBody">Full Body</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Balance">Balance</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficultyLevel">Độ khó <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.difficultyLevel} 
                      onValueChange={(value) => handleInputChange('difficultyLevel', value)}
                    >
                      <SelectTrigger className={errors.difficultyLevel ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.difficultyLevel && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.difficultyLevel}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipment">Thiết bị <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.equipment} 
                      onValueChange={(value) => handleInputChange('equipment', value)}
                    >
                      <SelectTrigger className={errors.equipment ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Chọn thiết bị" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                        <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                        <SelectItem value="Barbell">Barbell</SelectItem>
                        <SelectItem value="Kettlebell">Kettlebell</SelectItem>
                        <SelectItem value="Machine">Machine</SelectItem>
                        <SelectItem value="Resistance Band">Resistance Band</SelectItem>
                        <SelectItem value="Yoga Mat">Yoga Mat</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.equipment && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.equipment}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả bài tập <span className="text-red-500">*</span></Label>
                  <textarea
                    id="description"
                    className={`w-full p-3 border rounded-md resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    rows={3}
                    placeholder="Mô tả ngắn gọn về bài tập..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Exercise Parameters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Thông số bài tập
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      value={formData.sets}
                      onChange={(e) => handleInputChange('sets', parseInt(e.target.value) || 0)}
                      placeholder="3"
                      min="1"
                      max="10"
                      className={errors.sets ? 'border-red-500' : ''}
                    />
                    {errors.sets && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.sets}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      value={formData.reps}
                      onChange={(e) => handleInputChange('reps', parseInt(e.target.value) || 0)}
                      placeholder="10"
                      min="1"
                      max="100"
                      className={errors.reps ? 'border-red-500' : ''}
                    />
                    {errors.reps && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.reps}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Trọng lượng (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      max="1000"
                      step="0.5"
                      className={errors.weight ? 'border-red-500' : ''}
                    />
                    {errors.weight && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.weight}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restTime">Nghỉ (phút)</Label>
                    <Input
                      id="restTime"
                      type="number"
                      value={formData.restTime}
                      onChange={(e) => handleInputChange('restTime', parseFloat(e.target.value) || 0)}
                      placeholder="2"
                      min="0"
                      max="100"
                      step="0.5"
                      className={errors.restTime ? 'border-red-500' : ''}
                    />
                    {errors.restTime && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.restTime}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Thời gian thực hiện (phút) - Tùy chọn</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => handleInputChange('duration', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="30"
                    min="0"
                    max="120"
                    step="0.5"
                    className={errors.duration ? 'border-red-500' : ''}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>

              {/* Target Muscles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Nhóm cơ tác động
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="newMuscle">Thêm nhóm cơ</Label>
                  <div className="flex gap-2">
                    <Input
                      id="newMuscle"
                      value={newMuscle}
                      onChange={(e) => setNewMuscle(e.target.value)}
                      placeholder="VD: Pectoralis Major"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMuscle())}
                    />
                    <Button type="button" onClick={addMuscle} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {formData.targetMuscles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.targetMuscles.map((muscle, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {muscle}
                        <button
                          type="button"
                          onClick={() => removeMuscle(muscle)}
                          className="ml-1 hover:text-red-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions and Tips */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Hướng dẫn và mẹo
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Hướng dẫn thực hiện <span className="text-red-500">*</span></Label>
                  <textarea
                    id="instructions"
                    className={`w-full p-3 border rounded-md resize-none ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
                    rows={4}
                    placeholder="Mô tả chi tiết cách thực hiện bài tập..."
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                  />
                  {errors.instructions && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.instructions}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tips">Mẹo thực hiện</Label>
                  <textarea
                    id="tips"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Những lưu ý quan trọng khi thực hiện bài tập..."
                    value={formData.tips}
                    onChange={(e) => handleInputChange('tips', e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang tạo...' : 'Tạo bài tập'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
