// ExerciseView.tsx
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { X, Edit, Dumbbell, Clock, Target, Activity, Car } from 'lucide-react';

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

interface ExerciseViewProps {
    exercise: Exercise;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (exercise: Exercise) => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
    exercise,
    isOpen,
    onClose,
    onEdit
}) => {

    const modalRef = useRef<HTMLDivElement>(null);
    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);



    const getCategoryBadge = (category: string) => {
        const colors = {
            'Chest': 'bg-red-100 text-red-800',
            'Back': 'bg-blue-100 text-blue-800',
            'Legs': 'bg-green-100 text-green-800',
            'Shoulders': 'bg-yellow-100 text-yellow-800',
            'Arms': 'bg-purple-100 text-purple-800',
            'Core': 'bg-orange-100 text-orange-800',
            'Cardio': 'bg-cyan-100 text-cyan-800',
            'FullBody': 'bg-indigo-100 text-indigo-800',
            'Flexibility': 'bg-pink-100 text-pink-800',
            'Balance': 'bg-teal-100 text-teal-800'
        };
        return (
            <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
                {category}
            </Badge>
        );
    };

    const getDifficultyBadge = (difficultyLevel: string) => {
        const colors = {
            'Beginner': 'bg-green-100 text-green-800',
            'Intermediate': 'bg-yellow-100 text-yellow-800',
            'Advanced': 'bg-red-100 text-red-800'
        };
        return (
            <Badge className={colors[difficultyLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
                {difficultyLevel}
            </Badge>
        );
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card
                ref={modalRef}
                className="w-full h-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-none" >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-blue-600" />
                            {exercise.name}
                        </CardTitle>
                        <div className="flex gap-2">
                            {onEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(exercise)}
                                    className="mr-2"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {getCategoryBadge(exercise.category)}
                                {getDifficultyBadge(exercise.difficultyLevel)}
                                {exercise.isActive ? (
                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                                )}
                            </div>
                            {exercise.description && (
                                <p className="text-gray-600 mb-4">{exercise.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Target Muscles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Nhóm cơ mục tiêu
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {exercise.targetMuscles.map((muscle, index) => (
                                <Badge key={index} variant="outline">
                                    {muscle}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Exercise Parameters */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Thông số bài tập
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Thiết bị</div>
                                <div className="font-semibold">{exercise.equipment || 'Không cần'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Sets</div>
                                <div className="font-semibold">{exercise.sets || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Reps</div>
                                <div className="font-semibold">{exercise.reps || 'N/A'}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-600">Trọng lượng</div>
                                <div className="font-semibold">{exercise.weight ? `${exercise.weight}kg` : 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Hướng dẫn thực hiện
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="whitespace-pre-line">{exercise.instructions}</p>
                        </div>
                    </div>

                    {/* Tips */}
                    {exercise.tips && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mẹo thực hiện</h3>
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <p className="whitespace-pre-line">{exercise.tips}</p>
                            </div>
                        </div>
                    )}

                    {/* Rest Time */}
                    {exercise.restTime && exercise.restTime > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium">Thời gian nghỉ: {exercise.restTime} phút</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};