import React from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Dumbbell, UtensilsCrossed, Heart, Activity, Calendar, X, Target, Clock, TrendingUp, FileText, UserCheck } from 'lucide-react';
import { useAISuggestionsById } from '../hooks/useAISuggestions';

interface SuggestionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  AISuggestionID: string | null;
}

export function SuggestionDetailDialog({
  open,
  onClose,
  AISuggestionID
}: SuggestionDetailDialogProps) {
  const { data: suggestion, isLoading, isError } = useAISuggestionsById(AISuggestionID || '');
  console.log(suggestion);
  if (!open) return null;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      'Pending': { label: 'Chờ xử lý', variant: 'outline' },
      'Accepted': { label: 'Đã chấp nhận', variant: 'default' },
      'Completed': { label: 'Hoàn thành', variant: 'default' },
      'Cancelled': { label: 'Đã hủy', variant: 'destructive' },
      'Archived': { label: 'Đã lưu trữ', variant: 'secondary' },
    };
    return statusMap[status] || { label: status, variant: 'outline' };
  };

  const formatVNDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const getDifficultyLabel = (level?: string) => {
    if (!level) return '';
    return level === 'Beginner' ? 'Mới bắt đầu' :
           level === 'Intermediate' ? 'Trung bình' : 'Nâng cao';
  };

  const getHealthStatusLabel = (status?: string) => {
    if (!status) return '';
    const statusMap: Record<string, string> = {
      'excellent': 'Xuất sắc',
      'good': 'Tốt',
      'fair': 'Trung bình',
      'poor': 'Yếu',
      'critical': 'Nghiêm trọng'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center text-gray-500">Đang tải...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !suggestion) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center text-red-500">Không thể tải chi tiết gợi ý</div>
            <Button onClick={onClose} className="mt-4">Đóng</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusBadge(suggestion.status);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white rounded-lg shadow-lg">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-2xl font-bold">Chi tiết gợi ý</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Mục tiêu và Trạng thái */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Mục tiêu</h3>
            </div>
            <p className="text-gray-700 ml-7">{suggestion.goal}</p>
            <div className="flex items-center gap-3 ml-7">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatVNDate(suggestion.recommendationDate)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Đánh giá sức khỏe */}
          {suggestion.evaluation && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold">Đánh giá sức khỏe</h3>
                </div>
                <div className="ml-7 space-y-2">
                  {suggestion.evaluation.healthScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Điểm số:</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {suggestion.evaluation.healthScore}/100
                      </Badge>
                    </div>
                  )}
                  {suggestion.evaluation.healthStatus && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Tình trạng:</span>
                      <Badge variant="outline">
                        {getHealthStatusLabel(suggestion.evaluation.healthStatus)}
                      </Badge>
                    </div>
                  )}
                  {suggestion.evaluation.healthScoreDescription && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Phân tích:</p>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {suggestion.evaluation.healthScoreDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Bài tập */}
          {suggestion.exercises && suggestion.exercises.length > 0 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Bài tập ({suggestion.exercises.length} bài)</h3>
                </div>
                <div className="ml-7 space-y-4">
                  {suggestion.workoutDuration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Thời lượng: {suggestion.workoutDuration} phút/buổi</span>
                    </div>
                  )}
                  {suggestion.difficultyLevel && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Cấp độ: {getDifficultyLabel(suggestion.difficultyLevel)}</span>
                    </div>
                  )}
                  <div className="space-y-3 mt-4">
                    {suggestion.exercises.map((exercise, index) => (
                      <Card key={index} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-base">{index + 1}. {exercise.name}</h4>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                            <div>
                              <span className="font-medium">Sets:</span> {exercise.sets}
                            </div>
                            <div>
                              <span className="font-medium">Reps:</span> {exercise.reps}
                            </div>
                            <div>
                              <span className="font-medium">Nghỉ:</span> {exercise.restTime}s
                            </div>
                          </div>
                          {exercise.instructions && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-1">Hướng dẫn:</p>
                              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                {exercise.instructions}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Gợi ý dinh dưỡng (nutrition field) */}
          {suggestion.nutrition && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Gợi ý dinh dưỡng</h3>
                </div>
                <p className="text-gray-700 ml-7 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                  {suggestion.nutrition}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Kế hoạch dinh dưỡng (dietPlan) */}
          {suggestion.dietPlan && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Kế hoạch dinh dưỡng</h3>
                </div>
                <div className="ml-7 space-y-4">
                  {suggestion.dietPlan.dailyCalories && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Calo/ngày:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {suggestion.dietPlan.dailyCalories} kcal
                      </Badge>
                    </div>
                  )}
                  
                  {suggestion.dietPlan.macros && (
                    <div className="grid grid-cols-3 gap-3">
                      {suggestion.dietPlan.macros.protein !== undefined && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Protein</div>
                          <div className="font-semibold text-blue-700">{suggestion.dietPlan.macros.protein}g</div>
                        </div>
                      )}
                      {suggestion.dietPlan.macros.carbs !== undefined && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Carbs</div>
                          <div className="font-semibold text-yellow-700">{suggestion.dietPlan.macros.carbs}g</div>
                        </div>
                      )}
                      {suggestion.dietPlan.macros.fat !== undefined && (
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Fat</div>
                          <div className="font-semibold text-orange-700">{suggestion.dietPlan.macros.fat}g</div>
                        </div>
                      )}
                    </div>
                  )}

                  {suggestion.dietPlan.mealTimes && suggestion.dietPlan.mealTimes.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Lịch ăn:</p>
                      <div className="space-y-2">
                        {suggestion.dietPlan.mealTimes.map((meal, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{meal.mealName}</div>
                                  <div className="text-sm text-gray-600">{meal.time}</div>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  {meal.suggestedCalories} kcal
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestion.dietPlan.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Ghi chú dinh dưỡng:</p>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {suggestion.dietPlan.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Ghi chú chung */}
          {suggestion.notes && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Ghi chú</h3>
                </div>
                <p className="text-gray-700 ml-7 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                  {suggestion.notes}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Ghi chú từ huấn luyện viên */}
          {suggestion.trainerNotes && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Ghi chú từ huấn luyện viên</h3>
                </div>
                <p className="text-gray-700 ml-7 bg-purple-50 p-3 rounded-lg whitespace-pre-line border border-purple-100">
                  {suggestion.trainerNotes}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Tin nhắn */}
          {suggestion.message && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Tin nhắn</h3>
              </div>
              <p className="text-gray-700 ml-7 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                {suggestion.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </Card>
    </div>
  );
}