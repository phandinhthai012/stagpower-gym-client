// ExerciseForm.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { X, Plus, Save, Dumbbell } from 'lucide-react';
import { useExerciseById } from '../../../../hooks/queries/useExercises';
import { validateExercise,ExerciseValidationErrors } from './utils/validation';

interface Exercise {
    _id?: string;
    name: string;
    description?: string;
    instructions: string;
    tips?: string;
    category: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    targetMuscles: string[];
    duration?: number;
    equipment?: string;
    sets?: number;
    reps?: number;
    weight?: number;
    restTime?: number;
    isActive: boolean;
}

interface ExerciseFormProps {
    exerciseId?: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (exerciseData: Exercise) => void;
    isLoading?: boolean;
    mode: 'create' | 'edit';
}

const EXERCISE_CATEGORIES = [
    'Chest', 'Back', 'Legs', 'Shoulders', 'Arms',
    'Core', 'Cardio', 'FullBody', 'Flexibility', 'Balance'
];

const DIFFICULTY_LEVELS = [
    'Beginner', 'Intermediate', 'Advanced'
];

const EQUIPMENT_OPTIONS = [
    'Bodyweight', 'Dumbbell', 'Barbell', 'Kettlebell',
    'Machine', 'Resistance Band', 'Cable', 'TRX'
];

const TARGET_MUSCLES = [
    'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
    'Forearms', 'Abs', 'Obliques', 'Quads', 'Hamstrings',
    'Glutes', 'Calves', 'Full Body'
];

export const ExerciseForm: React.FC<ExerciseFormProps> = ({
    exerciseId,
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    mode,

}) => {
    const { 
        data: responseExercise, 
        isLoading: isFetching, 
        isError, 
        error 
      } = useExerciseById(mode === 'edit' ? exerciseId : null);

    const [exercise, setExercise] = useState<Exercise | null>(null);

    const [formData, setFormData] = useState<Exercise>({
        _id: '',
        name: '',
        description: '',
        instructions: '',
        tips: '',
        category: '',
        difficultyLevel: 'Beginner',
        targetMuscles: [],
        duration: 0,
        equipment: '',
        sets: 0,
        reps: 0,
        weight: 0,
        restTime: 0,
        isActive: true
    });

    const [newMuscle, setNewMuscle] = useState('');
    const [errors, setErrors] = useState<ExerciseValidationErrors>({});

    useEffect(() => {
        if (mode === 'edit' && responseExercise?.success && responseExercise.data) {
          const exercise = responseExercise.data;
          setFormData({
            _id: exercise._id,
            name: exercise.name || '',
            description: exercise.description || '',
            instructions: exercise.instructions || '',
            tips: exercise.tips || '',
            category: exercise.category || '',
            difficultyLevel: exercise.difficultyLevel || 'Beginner',
            targetMuscles: exercise.targetMuscles || [],
            duration: exercise.duration || 0,
            equipment: exercise.equipment || '',
            sets: exercise.sets || 0,
            reps: exercise.reps || 0,
            weight: exercise.weight || 0,
            restTime: exercise.restTime || 0,
            isActive: exercise.isActive !== undefined ? exercise.isActive : true
          });
        } else if (mode === 'create') {
          // Reset form for create mode
          setFormData({
            name: '',
            description: '',
            instructions: '',
            tips: '',
            category: '',
            difficultyLevel: 'Beginner',
            targetMuscles: [],
            duration: 0,
            equipment: '',
            sets: 0,
            reps: 0,
            weight: 0,
            restTime: 0,
            isActive: true
          });
        }
      }, [mode, responseExercise]);


    const handleInputChange = (field: keyof Exercise, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field as keyof ExerciseValidationErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleAddMuscle = () => {
        if (newMuscle && !formData.targetMuscles.includes(newMuscle)) {
            setFormData(prev => ({
                ...prev,
                targetMuscles: [...prev.targetMuscles, newMuscle]
            }));
            setNewMuscle('');
        }
    };

    const handleRemoveMuscle = (muscle: string) => {
        setFormData(prev => ({
            ...prev,
            targetMuscles: prev.targetMuscles.filter(m => m !== muscle)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateExercise(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        onSubmit(formData);
    };

    const renderError = (field: keyof ExerciseValidationErrors) => {
        return errors[field] ? (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        ) : null;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5" />
                            {mode === 'create' ? (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Thêm Bài Tập Mới
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Chỉnh Sửa Bài Tập
                                </>
                            )}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Tên bài tập *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="VD: Push-up"
                                        required
                                    />
                                    {renderError('name')}
                                </div>
                                <div>
                                    <Label htmlFor="category">Danh mục *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EXERCISE_CATEGORIES.map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError('category')}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="difficultyLevel">Độ khó *</Label>
                                    <Select
                                        value={formData.difficultyLevel}
                                        onValueChange={(value) => handleInputChange('difficultyLevel', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn độ khó" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DIFFICULTY_LEVELS.map(level => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError('difficultyLevel')}
                                </div>
                                <div>
                                    <Label htmlFor="equipment">Thiết bị</Label>
                                    <Select
                                        value={formData.equipment}
                                        onValueChange={(value) => handleInputChange('equipment', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thiết bị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EQUIPMENT_OPTIONS.map(equipment => (
                                                <SelectItem key={equipment} value={equipment}>
                                                    {equipment}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {renderError('equipment')}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả bài tập</Label>
                                <textarea
                                    id="description"
                                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                    rows={3}
                                    placeholder="Mô tả ngắn gọn về bài tập..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                                {renderError('description')}
                            </div>
                        </div>

                        {/* Target Muscles */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Nhóm cơ mục tiêu</h3>

                            <div className="flex gap-2">
                                <Select value={newMuscle} onValueChange={setNewMuscle}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Chọn nhóm cơ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TARGET_MUSCLES.map(muscle => (
                                            <SelectItem key={muscle} value={muscle}>
                                                {muscle}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    onClick={handleAddMuscle}
                                    disabled={!newMuscle}
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.targetMuscles.map((muscle, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                        {muscle}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMuscle(muscle)}
                                            className="ml-1 hover:text-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Exercise Parameters */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Thông số bài tập</h3>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Label htmlFor="sets">Sets</Label>
                                    <Input
                                        id="sets"
                                        type="number"
                                        value={formData.sets}
                                        onChange={(e) => handleInputChange('sets', parseInt(e.target.value) || 0)}
                                        placeholder="3"
                                        min="0"
                                        max="20"
                                    />
                                    {renderError('sets')}
                                </div>
                                <div>
                                    <Label htmlFor="reps">Reps</Label>
                                    <Input
                                        id="reps"
                                        type="number"
                                        value={formData.reps}
                                        onChange={(e) => handleInputChange('reps', parseInt(e.target.value) || 0)}
                                        placeholder="12"
                                        min="0"
                                        max="100"
                                    />
                                    {renderError('reps')}
                                </div>
                                <div>
                                    <Label htmlFor="weight">Trọng lượng (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                        min="0"
                                        max="500"
                                        step="0.5"
                                    />
                                    {renderError('weight')}
                                </div>
                                <div>
                                    <Label htmlFor="restTime">Nghỉ (phút)</Label>
                                    <Input
                                        id="restTime"
                                        type="number"
                                        value={formData.restTime}
                                        onChange={(e) => handleInputChange('restTime', parseFloat(e.target.value) || 0)}
                                        placeholder="2"
                                        min="0"
                                        max="10"
                                        step="0.5"
                                    />
                                    {renderError('restTime')}
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn thực hiện</h3>

                            <div>
                                <Label htmlFor="instructions">Hướng dẫn chi tiết *</Label>
                                <textarea
                                    id="instructions"
                                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                    rows={4}
                                    placeholder="Mô tả chi tiết cách thực hiện bài tập..."
                                    value={formData.instructions}
                                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                                    required
                                />
                                {renderError('instructions')}
                            </div>

                            <div>
                                <Label htmlFor="tips">Mẹo thực hiện</Label>
                                <textarea
                                    id="tips"
                                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                    rows={3}
                                    placeholder="Những lưu ý quan trọng khi thực hiện bài tập..."
                                    value={formData.tips}
                                    onChange={(e) => handleInputChange('tips', e.target.value)}
                                />
                                {renderError('tips')}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Trạng thái</h3>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="isActive">Bài tập đang hoạt động</Label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="min-w-[120px]"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {mode === 'create' ? 'Thêm bài tập' : 'Cập nhật'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};