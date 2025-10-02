// / TrainerSessionDetailPage.tsx
import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { mockExercises } from '../../../mockdata/exercises';

export function TrainerSessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') === 'list' ? 'list' : 'calendar';

  const [isEdit, setIsEdit] = useState(false);
  const [isCancel, setIsCancel] = useState(true);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [exercises, setExercises] = useState(mockExercises);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);

  const handleAddExercise = () => {
    if (selectedExerciseId) {
      const exercise = exercises.find(ex => ex.id === selectedExerciseId);
      if (exercise && !selectedExercises.find(ex => ex.id === exercise.id)) {
        setSelectedExercises([...selectedExercises, exercise]);
        setSelectedExerciseId('');
      }
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="w-auto px-2" onClick={() => navigate(`/trainer/schedule?view=${view}`)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Quay lại
            </Button>
          </div>

        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto">Chỉnh sửa</Button>
          <Button variant="outline" className="w-full md:w-auto">Hủy buổi</Button>
          <Button variant="outline" className="w-full md:w-auto">Xác nhận buổi</Button>
          <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700">Đánh dấu hoàn thành</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* member, time, type, duration, status, note */}
          <div className="space-y-2">
            <div><span className="text-gray-500">Hội viên:</span> Nguyễn Văn A</div>
            <div><span className="text-gray-500">Thời gian:</span> 09:00 - 10:00, 20/09/2025</div>
            <div><span className="text-gray-500">Loại buổi:</span> PT cá nhân</div>
          </div>
          <div className="space-y-2">
            <div><span className="text-gray-500">Thời lượng:</span> 60 phút</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Trạng thái:</span>
              <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>
            </div>
            <div><span className="text-gray-500">Ghi chú:</span> Tập thân dưới, tránh gối trái</div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2">
        {isConfirm && (<Card>
          <CardHeader>Bổ sung bài tập (nếu có)</CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn bài tập</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                  ))}
                </select>
                <Button
                  onClick={handleAddExercise}
                  disabled={!selectedExerciseId}
                  className="bg-blue-600 hover:bg-blue-700">
                  Thêm
                </Button>
              </div>

              {/* Danh sách bài tập đã chọn */}
              {selectedExercises.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Bài tập đã chọn:</h4>
                  {selectedExercises.map((exercise) => (
                    <div key={exercise.id} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{exercise.name}</h5>
                          <p className="text-sm text-gray-600">{exercise.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>Loại: {exercise.category}</span>
                            <span>Độ khó: {exercise.difficultyLevel}</span>
                            <span>Sets: {exercise.sets}</span>
                            <span>Reps: {exercise.reps}</span>
                            {exercise.weight > 0 && <span>Tạ: {exercise.weight}kg</span>}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="text-red-600 hover:text-red-700">
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button className="mt-4">Xác nhận bài tập cho hội viên</Button>
          </CardContent>

        </Card>)}
        {isCancel && (
          <Card>
            <CardHeader>Lý do hủy buổi</CardHeader>
            <CardContent>
              <textarea className="w-full h-32 p-2 border border-gray-300 rounded-md"></textarea>
              <Button className="mt-4">Xác nhận hủy buổi</Button>
            </CardContent>
          </Card>
        )}
      </div>


    </div>
  );
}

export default TrainerSessionDetailPage;