import React, { useState,useEffect } from 'react';
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
import { LoadingSpinner } from '../../../components/common';
import { useDeleteExercise, useExercises } from '../../../hooks/queries/useExercises';
import { ExerciseForm } from '../components/exercise-management/ExerciseForm';
import { ExerciseView } from '../components/exercise-management/ExerciseView';
import { useUpdateExercise, useCreateExercise } from '../../../hooks/queries/useExercises';
import { useToast } from '../../../hooks/useToast';
import { DeleteConfirmationDialog } from '../../../components/common/DeleteConfirmationDialog';

export function AdminExerciseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const { data: responseExercises, isLoading, isError,refetch } = useExercises();
  const toast = useToast();
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    exerciseId: null as string | null,
    exerciseName: '',
    isLoading: false
  });
  useEffect(() => {
    if (responseExercises?.success) {
      setExercises(responseExercises?.data as any);
    }
  }, [responseExercises]);

  if (isLoading) {
    return(
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError) {
    return(
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{responseExercises?.message}</div>
      </div>
    )
  }
  
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

  const handleOpenCreateExercise = () => {
    setModalType('create');
    setShowFormModal(true);
  };

  const handleOpenEditExercise = (exercise: Exercise) => {
    setSelectedExerciseId(exercise._id);
    setModalType('edit');
    setShowFormModal(true);
  };

  const handleSubmitCreateExercise = async (exercise: Exercise) => {
    try {
      await createExercise.mutateAsync(exercise);
      setShowFormModal(false);
      setSelectedExerciseId(null);
      setSelectedExercise(null);
      setModalType('create');
      toast.success('Thêm bài tập thành công');
    } catch (error) {
      console.error('Error creating exercise:', error);
      toast.error(`Thêm bài tập thấy bại. lỗi:${error.message || 'Lỗi không xác định'}`);
    }
  };
  const handleSubmitEditExercise = async(exercise: Exercise) => {
    try {
      await updateExercise.mutateAsync({
        id: selectedExerciseId!,
        exercise: exercise
      });
      setShowFormModal(false);
      setSelectedExerciseId(null);
      setSelectedExercise(null);
      setModalType('edit');
      toast.success('Cập nhật bài tập thành công');
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error(`Cập nhật bài tập thấy bại. lỗi:${error.message || 'Lỗi không xác định'}`);
    }
  };

  const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
    setDeleteDialog({
      isOpen: true,
      exerciseId: exerciseId,
      exerciseName: exerciseName,
      isLoading: false
    });
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      isOpen: false,
      exerciseId: null,
      exerciseName: '',
      isLoading: false
    });
  };
  const handleConfirmDelete = async() => {
    if (!deleteDialog.exerciseId) return;
    setDeleteDialog(prev => ({ ...prev, isLoading: true }));
    try {
      await deleteExercise.mutateAsync(deleteDialog.exerciseId);
      toast.success('Xóa bài tập thành công');
      handleCancelDelete();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error(`Xóa bài tập thấy bại. lỗi:${error.message || 'Lỗi không xác định'}`);
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  }

  const handleViewExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowViewModal(true);
  };

  // Filter exercises based on search and filters
  const filteredExercises = exercises.filter((exercise:any) => {
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
            <Button onClick={handleOpenCreateExercise}>
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
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[200px]">Tên bài tập</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">Danh mục</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[100px]">Độ khó</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[150px]">Nhóm cơ</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">Thiết bị</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">Sets/Reps</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[100px]">Trạng thái</th>
                  <th className="text-left p-4 font-semibold text-gray-700 min-w-[140px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredExercises.map((exercise) => (
                  <tr key={exercise.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-gray-900">{exercise.name}</div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {exercise.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getCategoryBadge(exercise.category)}</td>
                    <td className="p-4">{getDifficultyBadge(exercise.difficultyLevel)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.slice(0, 2).map((muscle: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                        {exercise.targetMuscles.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{exercise.targetMuscles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {exercise.equipment}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{exercise.sets}x{exercise.reps}</span>
                        {exercise.weight > 0 && (
                          <span className="text-gray-500">({exercise.weight}kg)</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {exercise.isActive ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 text-xs">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewExercise(exercise)}
                          className="h-8 w-8 p-0"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditExercise(exercise)}
                          className="h-8 w-8 p-0"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExercise(exercise._id, exercise.name)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Xóa"
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

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  {/* Header with name and status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{exercise.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      {exercise.isActive ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 text-xs">Inactive</Badge>
                      )}
                    </div>
                  </div>

                  {/* Category and Difficulty */}
                  <div className="flex flex-wrap gap-2">
                    {getCategoryBadge(exercise.category)}
                    {getDifficultyBadge(exercise.difficultyLevel)}
                  </div>

                  {/* Target Muscles */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Nhóm cơ:</div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetMuscles.slice(0, 3).map((muscle: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.targetMuscles.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{exercise.targetMuscles.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Equipment and Sets/Reps */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Thiết bị:</div>
                      <Badge variant="outline" className="text-xs">
                        {exercise.equipment}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Sets/Reps:</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{exercise.sets}x{exercise.reps}</span>
                        {exercise.weight > 0 && (
                          <span className="text-gray-500">({exercise.weight}kg)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewExercise(exercise)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditExercise(exercise)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExercise(exercise._id, exercise.name)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài tập nào</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all' || equipmentFilter !== 'all'
                  ? 'Thử thay đổi bộ lọc để tìm thấy bài tập phù hợp.'
                  : 'Chưa có bài tập nào trong hệ thống.'}
              </p>
              <Button onClick={handleOpenCreateExercise}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm bài tập đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ExerciseView
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedExercise(null);
        }}
        exercise={selectedExercise as Exercise}
      />
      <ExerciseForm
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSelectedExerciseId(null);
        }}
        onSubmit={modalType === 'create' ? handleSubmitCreateExercise : handleSubmitEditExercise}
        mode={modalType === 'create' ? 'create' : 'edit'}
        exerciseId={selectedExerciseId as string}
      />
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xóa bài tập"
        description="Bạn có chắc chắn muốn xóa bài tập này không?(Nếu xóa bài tập sẽ xóa khỏi hệ thống và không thể khôi phục)"
      />
    </div>
  );
}
