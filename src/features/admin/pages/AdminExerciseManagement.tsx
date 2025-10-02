import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  Dumbbell, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Play,
  Eye,
  Calendar,
  Clock,
  Target,
  Users,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { mockExercises, type Exercise } from '../../../mockdata/exercises';

export function AdminExerciseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    category: '',
    difficultyLevel: '',
    targetMuscles: [] as string[],
    equipment: '',
    duration: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: '',
    instructions: '',
    tips: '',
    isActive: true
  });

  // Get statistics from mock data
  const getExerciseStats = () => {
    const total = mockExercises.length;
    const byCategory = mockExercises.reduce((acc, exercise) => {
      acc[exercise.category] = (acc[exercise.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byDifficulty = mockExercises.reduce((acc, exercise) => {
      acc[exercise.difficultyLevel] = (acc[exercise.difficultyLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byCategory,
      byDifficulty,
      active: mockExercises.filter(e => e.isActive).length,
      inactive: mockExercises.filter(e => !e.isActive).length
    };
  };
  
  const stats = getExerciseStats();


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

  const handleAddExercise = () => {
    setShowAddModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowEditModal(true);
  };

  const handleDeleteExercise = (exercise: Exercise) => {
    if (confirm(`Bạn có chắc muốn xóa bài tập ${exercise.name}?`)) {
      alert(`Đã xóa bài tập: ${exercise.name}`);
    }
  };

  const handleViewExercise = (exercise: Exercise) => {
    alert(`Xem chi tiết bài tập: ${exercise.name}`);
  };

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm bài tập mới thành công!');
    setShowAddModal(false);
    setNewExercise({
      name: '',
      description: '',
      category: '',
      difficultyLevel: '',
      targetMuscles: [],
      equipment: '',
      duration: '',
      sets: '',
      reps: '',
      weight: '',
      restTime: '',
      instructions: '',
      tips: '',
      isActive: true
    });
  };

  const handleEditExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật bài tập thành công!');
    setShowEditModal(false);
  };

  // Filter exercises based on search and filters
  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || exercise.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || exercise.difficultyLevel === difficultyFilter;
    const matchesEquipment = equipmentFilter === 'all' || exercise.equipment === equipmentFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
  });

  return (
    <div className="space-y-6">

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleAddExercise}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm bài tập mới
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Tạo lịch tập
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Quản lý nhóm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bài tập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
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

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thiết bị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                <SelectItem value="Barbell">Barbell</SelectItem>
                <SelectItem value="Machine">Machine</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Áp dụng bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-600" />
              Danh sách bài tập ({filteredExercises.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Tên bài tập</th>
                  <th className="text-left p-4">Danh mục</th>
                  <th className="text-left p-4">Độ khó</th>
                  <th className="text-left p-4">Nhóm cơ</th>
                  <th className="text-left p-4">Thiết bị</th>
                  <th className="text-left p-4">Sets/Reps</th>
                  <th className="text-left p-4">Trạng thái</th>
                  <th className="text-left p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredExercises.map((exercise) => (
                  <tr key={exercise.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{exercise.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {exercise.instructions.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getCategoryBadge(exercise.category)}</td>
                    <td className="p-4">{getDifficultyBadge(exercise.difficultyLevel)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.map((muscle: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{exercise.equipment}</Badge>
                    </td>
                    <td className="p-4 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {exercise.sets}x{exercise.reps} {exercise.weight > 0 && `${exercise.weight}kg`}
                    </td>
                    <td className="p-4 flex items-center gap-1">
                      {exercise.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewExercise(exercise)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditExercise(exercise)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExercise(exercise)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thêm Bài Tập Mới</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExerciseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseName">Tên bài tập *</Label>
                    <Input
                      id="exerciseName"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="VD: Push-up"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseCategory">Danh mục *</Label>
                    <Select 
                      value={newExercise.category} 
                      onValueChange={(value) => setNewExercise(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseDifficulty">Độ khó *</Label>
                    <Select 
                      value={newExercise.difficultyLevel} 
                      onValueChange={(value) => setNewExercise(prev => ({ ...prev, difficultyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exerciseEquipment">Thiết bị</Label>
                    <Select 
                      value={newExercise.equipment} 
                      onValueChange={(value) => setNewExercise(prev => ({ ...prev, equipment: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thiết bị" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                        <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                        <SelectItem value="Barbell">Barbell</SelectItem>
                        <SelectItem value="Kettlebell">Kettlebell</SelectItem>
                        <SelectItem value="Machine">Machine</SelectItem>
                        <SelectItem value="Resistance Band">Resistance Band</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="exerciseSets">Sets</Label>
                    <Input
                      id="exerciseSets"
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                      placeholder="3"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseReps">Reps</Label>
                    <Input
                      id="exerciseReps"
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                      placeholder="12"
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseWeight">Trọng lượng (kg)</Label>
                    <Input
                      id="exerciseWeight"
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="0"
                      min="0"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseRestTime">Nghỉ (phút)</Label>
                    <Input
                      id="exerciseRestTime"
                      type="number"
                      value={newExercise.restTime}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, restTime: e.target.value }))}
                      placeholder="2"
                      min="0"
                      max="10"
                      step="0.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="exerciseDescription">Mô tả bài tập *</Label>
                  <textarea
                    id="exerciseDescription"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Mô tả ngắn gọn về bài tập..."
                    value={newExercise.description}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="exerciseInstructions">Hướng dẫn thực hiện *</Label>
                  <textarea
                    id="exerciseInstructions"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Mô tả chi tiết cách thực hiện bài tập..."
                    value={newExercise.instructions}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="exerciseTips">Mẹo thực hiện</Label>
                  <textarea
                    id="exerciseTips"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Những lưu ý quan trọng khi thực hiện bài tập..."
                    value={newExercise.tips}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, tips: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bài tập
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {showEditModal && selectedExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chỉnh Sửa Bài Tập</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditExerciseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editExerciseName">Tên bài tập</Label>
                    <Input
                      id="editExerciseName"
                      defaultValue={selectedExercise.name}
                      placeholder="VD: Push-up"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editExerciseCategory">Danh mục</Label>
                    <Select defaultValue={selectedExercise.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
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
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editExerciseDifficulty">Độ khó</Label>
                    <Select defaultValue={selectedExercise.difficultyLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editExerciseEquipment">Thiết bị</Label>
                    <Select defaultValue={selectedExercise.equipment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thiết bị" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                        <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                        <SelectItem value="Barbell">Barbell</SelectItem>
                        <SelectItem value="Kettlebell">Kettlebell</SelectItem>
                        <SelectItem value="Machine">Machine</SelectItem>
                        <SelectItem value="Resistance Band">Resistance Band</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="editExerciseSets">Sets</Label>
                    <Input
                      id="editExerciseSets"
                      type="number"
                      defaultValue={selectedExercise.sets}
                      placeholder="3"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editExerciseReps">Reps</Label>
                    <Input
                      id="editExerciseReps"
                      type="number"
                      defaultValue={selectedExercise.reps}
                      placeholder="12"
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editExerciseWeight">Trọng lượng (kg)</Label>
                    <Input
                      id="editExerciseWeight"
                      type="number"
                      defaultValue={selectedExercise.weight}
                      placeholder="0"
                      min="0"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editExerciseRestTime">Nghỉ (phút)</Label>
                    <Input
                      id="editExerciseRestTime"
                      type="number"
                      defaultValue={selectedExercise.restTime}
                      placeholder="2"
                      min="0"
                      max="10"
                      step="0.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editExerciseDescription">Mô tả bài tập</Label>
                  <textarea
                    id="editExerciseDescription"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Mô tả ngắn gọn về bài tập..."
                    defaultValue={selectedExercise.description}
                  />
                </div>

                <div>
                  <Label htmlFor="editExerciseInstructions">Hướng dẫn thực hiện</Label>
                  <textarea
                    id="editExerciseInstructions"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Mô tả chi tiết cách thực hiện bài tập..."
                    defaultValue={selectedExercise.instructions}
                  />
                </div>

                <div>
                  <Label htmlFor="editExerciseTips">Mẹo thực hiện</Label>
                  <textarea
                    id="editExerciseTips"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Những lưu ý quan trọng khi thực hiện bài tập..."
                    defaultValue={selectedExercise.tips}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
