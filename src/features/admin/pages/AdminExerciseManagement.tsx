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
import { mockExercises, getExerciseStats, type Exercise } from '../../../mockdata/exercises';

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
    category: '',
    difficulty: '',
    muscle_groups: [] as string[],
    equipment: '',
    duration_minutes: '',
    calories_per_minute: '',
    video_url: '',
    instructions: '',
    status: 'Active'
  });

  // Get statistics from mock data
  const stats = getExerciseStats();


  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Cardio':
        return <Badge className="bg-green-100 text-green-800">Cardio</Badge>;
      case 'Strength':
        return <Badge className="bg-blue-100 text-blue-800">Strength</Badge>;
      case 'Flexibility':
        return <Badge className="bg-purple-100 text-purple-800">Flexibility</Badge>;
      case 'Yoga':
        return <Badge className="bg-orange-100 text-orange-800">Yoga</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
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
      category: '',
      difficulty: '',
      muscle_groups: [],
      equipment: '',
      duration_minutes: '',
      calories_per_minute: '',
      video_url: '',
      instructions: '',
      status: 'Active'
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
                         exercise.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || exercise.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || exercise.difficulty === difficultyFilter;
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
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Flexibility">Flexibility</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
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
                  <th className="text-left p-4">Thời gian</th>
                  <th className="text-left p-4">Calo/phút</th>
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
                    <td className="p-4">{getDifficultyBadge(exercise.difficulty)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscle_groups.map((muscle, index) => (
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
                      {exercise.duration_minutes} phút
                    </td>
                    <td className="p-4 flex items-center gap-1">
                      <Activity className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-red-600">{exercise.calories_per_minute} kcal</span>
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
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseDifficulty">Độ khó *</Label>
                    <Select 
                      value={newExercise.difficulty} 
                      onValueChange={(value) => setNewExercise(prev => ({ ...prev, difficulty: value }))}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseDuration">Thời gian (phút)</Label>
                    <Input
                      id="exerciseDuration"
                      type="number"
                      value={newExercise.duration_minutes}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      placeholder="15"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caloriesBurn">Calo đốt cháy (kcal/phút)</Label>
                    <Input
                      id="caloriesBurn"
                      type="number"
                      value={newExercise.calories_per_minute}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, calories_per_minute: e.target.value }))}
                      placeholder="8"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="videoUrl">Link video demo</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={newExercise.video_url}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://youtube.com/..."
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
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="Strength">Strength</SelectItem>
                        <SelectItem value="Flexibility">Flexibility</SelectItem>
                        <SelectItem value="Yoga">Yoga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editExerciseDifficulty">Độ khó</Label>
                    <Select defaultValue={selectedExercise.difficulty}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editExerciseDuration">Thời gian (phút)</Label>
                    <Input
                      id="editExerciseDuration"
                      type="number"
                      defaultValue={selectedExercise.duration_minutes}
                      placeholder="15"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCaloriesBurn">Calo đốt cháy (kcal/phút)</Label>
                    <Input
                      id="editCaloriesBurn"
                      type="number"
                      defaultValue={selectedExercise.calories_per_minute}
                      placeholder="8"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editVideoUrl">Link video demo</Label>
                  <Input
                    id="editVideoUrl"
                    type="url"
                    defaultValue={selectedExercise.video_url || ''}
                    placeholder="https://youtube.com/..."
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
