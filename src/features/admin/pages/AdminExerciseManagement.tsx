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
  Eye,
  Clock
} from 'lucide-react';
import { useExercises, useDeleteExercise } from '../hooks/useExercises';
import { Exercise } from '../types/exercise.types';
import { ModalCreateExercise, ModalEditExercise, ModalViewExercise } from '../components/exercises-management';
import { DeleteConfirmationDialog } from '../../../components/common/DeleteConfirmationDialog';
import { useSortableTable } from '../../../hooks/useSortableTable';
import { SortableTableHeader, NonSortableHeader } from '../../../components/ui';

export function AdminExerciseManagement() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  // API hooks
  const { data: exercises = [], isLoading, error } = useExercises();
  const deleteExerciseMutation = useDeleteExercise();

  // Get statistics from API data
  const getExerciseStats = () => {
    const total = exercises.length;
    const byCategory = exercises.reduce((acc, exercise) => {
      acc[exercise.category] = (acc[exercise.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDifficulty = exercises.reduce((acc, exercise) => {
      acc[exercise.difficultyLevel] = (acc[exercise.difficultyLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byCategory,
      byDifficulty,
      active: exercises.filter(e => e.isActive).length,
      inactive: exercises.filter(e => !e.isActive).length
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
    setExerciseToDelete(exercise);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (exerciseToDelete) {
      deleteExerciseMutation.mutate(exerciseToDelete._id);
      setShowDeleteDialog(false);
      setExerciseToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setExerciseToDelete(null);
  };
  
  const handleViewExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowViewModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedExercise(null);
  };

  const handleSuccess = () => {
    // Data will be automatically refreshed by React Query
  };

  // Filter exercises based on search and filters
  const filteredExercises = React.useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.instructions.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || exercise.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || exercise.difficultyLevel === difficultyFilter;
      const matchesEquipment = equipmentFilter === 'all' || exercise.equipment === equipmentFilter;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
    });
  }, [exercises, searchTerm, categoryFilter, difficultyFilter, equipmentFilter]);

  // Sort exercises - Hook must be called before early returns
  const { sortedData, requestSort, getSortDirection } = useSortableTable({
    data: filteredExercises,
    initialSort: { key: 'name', direction: 'asc' }
  });

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, difficultyFilter, equipmentFilter]);

  // Paginate sorted data
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedData.slice(start, end);
  }, [sortedData, page, limit]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / limit);
  const filteredRecords = sortedData.length;

  // Reset selected exercises when filters or sort changes
  React.useEffect(() => {
    setSelectedExercises([]);
  }, [searchTerm, categoryFilter, difficultyFilter, equipmentFilter]);

  // Reset selected exercises when sort changes
  const handleSort = (key: string) => {
    setSelectedExercises([]);
    requestSort(key);
  };

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedExercises.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedExercises([]);
    } else {
      setSelectedExercises(paginatedData.map((exercise: Exercise) => exercise._id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </div>
    );
  }

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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
            </div>

            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent lockScroll={false}>
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

            <Select value={difficultyFilter} onValueChange={(value) => {
              setDifficultyFilter(value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent lockScroll={false}>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={equipmentFilter} onValueChange={(value) => {
              setEquipmentFilter(value);
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thiết bị" />
              </SelectTrigger>
              <SelectContent lockScroll={false}>
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

      {/* Bulk Actions */}
      {selectedExercises.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedExercises.length} bài tập
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Kích hoạt
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <NonSortableHeader className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedExercises.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </NonSortableHeader>
                  <SortableTableHeader
                    label="Tên bài tập"
                    sortKey="name"
                    currentSortKey={getSortDirection('name') ? 'name' : ''}
                    sortDirection={getSortDirection('name')}
                    onSort={handleSort}
                    align="left"
                    className="p-4"
                  />
                  <SortableTableHeader
                    label="Danh mục"
                    sortKey="category"
                    currentSortKey={getSortDirection('category') ? 'category' : ''}
                    sortDirection={getSortDirection('category')}
                    onSort={handleSort}
                    align="left"
                    className="p-4"
                  />
                  <SortableTableHeader
                    label="Độ khó"
                    sortKey="difficultyLevel"
                    currentSortKey={getSortDirection('difficultyLevel') ? 'difficultyLevel' : ''}
                    sortDirection={getSortDirection('difficultyLevel')}
                    onSort={handleSort}
                    align="left"
                    className="p-4"
                  />
                  <NonSortableHeader label="Nhóm cơ" align="left" className="p-4" />
                  <SortableTableHeader
                    label="Thiết bị"
                    sortKey="equipment"
                    currentSortKey={getSortDirection('equipment') ? 'equipment' : ''}
                    sortDirection={getSortDirection('equipment')}
                    onSort={handleSort}
                    align="left"
                    className="p-4"
                  />
                  <SortableTableHeader
                    label="Sets/Reps"
                    sortKey="sets"
                    currentSortKey={getSortDirection('sets') ? 'sets' : ''}
                    sortDirection={getSortDirection('sets')}
                    onSort={handleSort}
                    align="left"
                    className="p-4"
                  />
                  <SortableTableHeader
                    label="Trạng thái"
                    sortKey="isActive"
                    currentSortKey={getSortDirection('isActive') ? 'isActive' : ''}
                    sortDirection={getSortDirection('isActive')}
                    onSort={handleSort}
                    align="left"
                    className="p-4"
                  />
                  <NonSortableHeader label="Thao tác" align="left" className="p-4" />
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((exercise) => (
                  <tr key={exercise._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedExercises.includes(exercise._id)}
                        onChange={() => handleSelectExercise(exercise._id)}
                        className="rounded"
                      />
                    </td>
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
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{exercise.sets}x{exercise.reps} {exercise.weight > 0 && `${exercise.weight}kg`}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center align-middle">
                        {exercise.isActive ? (
                          <Badge className="bg-green-100 text-green-800 align-middle">Active</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 align-middle">Inactive</Badge>
                        )}
                      </div>
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

          {/* Pagination */}
          {filteredRecords > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  {totalPages > 1 
                    ? `Hiển thị ${((page - 1) * limit) + 1} - ${Math.min(page * limit, filteredRecords)} trong tổng số ${filteredRecords} kết quả`
                    : `Hiển thị ${filteredRecords} kết quả`
                  }
                </span>
              </div>
              {totalPages > 1 && (
                <div className="flex gap-1 flex-wrap justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1 || isLoading}
                    title="Trang đầu"
                  >
                    «
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                    title="Trang trước"
                  >
                    ‹
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        disabled={isLoading}
                        className={page === pageNum ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                    title="Trang sau"
                  >
                    ›
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages || isLoading}
                    title="Trang cuối"
                  >
                    »
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ModalCreateExercise
        isOpen={showAddModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <ModalEditExercise
        isOpen={showEditModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        exercise={selectedExercise}
      />

      <ModalViewExercise
        isOpen={showViewModal}
        onClose={handleModalClose}
        exercise={selectedExercise}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xóa bài tập"
        description="Bạn có chắc muốn xóa bài tập này?"
        itemName={exerciseToDelete?.name}
        isLoading={deleteExerciseMutation.isPending}
      />
    </div>
  );
}
