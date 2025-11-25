import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Package,
  Award,
  BarChart3,
  Sparkles,
  Edit,
  UtensilsCrossed,
} from 'lucide-react';
import { useMemberDetail } from '../hooks/useTrainerMembers';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { HealthInfoSection } from '../../../features/admin/components/member-management/HealthInfoSection';
import { useAllHealthInfoByMemberId } from '../../../features/member/hooks/useHealthInfo';
import { useAISuggestions, useUpdateAISuggestion } from '../../../features/member/hooks/useAISuggestions';
import { AISuggestion } from '../../../features/member/api/aiSuggestion.api';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface MemberDetailModalProps {
  memberId: string;
  onClose: () => void;
  onCreateSchedule?: (memberId: string) => void;
}

export function MemberDetailModal({ memberId, onClose, onCreateSchedule }: MemberDetailModalProps) {
  const { data, isLoading, error } = useMemberDetail(memberId);
  const [activeTab, setActiveTab] = useState<'info' | 'schedules' | 'health' | 'achievements' | 'suggestions'>('info');
  const { data: aiSuggestions, isLoading: isLoadingSuggestions } = useAISuggestions(memberId);
  const updateSuggestion = useUpdateAISuggestion();
  const [editingSuggestion, setEditingSuggestion] = useState<AISuggestion | null>(null);
  const [editForm, setEditForm] = useState<Partial<AISuggestion>>({});
  
  // Fetch all health info records for navigation
  const { data: healthInfoList, isLoading: isLoadingHealthInfo } = useAllHealthInfoByMemberId(memberId);

  // Calculate achievements
  const achievements = useMemo(() => {
    if (!data) return [];
    const results = [];
    const completedSessions = data.schedules?.filter((s: any) => s.status === 'Completed').length || 0;
    const totalSessions = data.schedules?.length || 0;
    const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    if (completedSessions >= 5) results.push({ text: 'Hoàn thành 5 buổi tập', icon: '🎯' });
    if (completedSessions >= 10) results.push({ text: 'Hoàn thành 10 buổi tập', icon: '🏆' });
    if (completedSessions >= 20) results.push({ text: 'Hoàn thành 20 buổi tập', icon: '⭐' });
    if (progress >= 50) results.push({ text: 'Đạt 50% mục tiêu', icon: '📊' });
    if (progress >= 80) results.push({ text: 'Đạt 80% mục tiêu', icon: '🎖️' });
    if (data.healthInfo?.goal === 'WeightLoss' && completedSessions >= 8) {
      results.push({ text: 'Giảm cân thành công', icon: '💪' });
    }
    if (data.healthInfo?.goal === 'MuscleGain' && completedSessions >= 12) {
      results.push({ text: 'Tăng cơ thành công', icon: '💪' });
    }
    if (progress >= 100) results.push({ text: 'Hoàn thành mục tiêu', icon: '🎉' });
    
    return results;
  }, [data]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600">Không thể tải thông tin hội viên</p>
            <Button onClick={onClose} className="mt-4">Đóng</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'pending': return 'Chờ kích hoạt';
      case 'banned': return 'Đã khóa';
      default: return status;
    }
  };

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'NoShow': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col bg-white m-2 sm:m-0">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                {data.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-2xl truncate">{data.fullName}</CardTitle>
                <Badge className={getStatusColor(data.status)}>
                  {getStatusText(data.status)}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex-shrink-0 overflow-x-auto">
          <div className="flex min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Thông tin
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'schedules'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lịch tập ({data.schedules?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'health'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sức khỏe
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Thành tích ({achievements.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base font-medium transition-colors whitespace-nowrap ${
                activeTab === 'suggestions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gợi ý AI ({aiSuggestions?.length || 0})
            </button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
          <div className="overflow-y-auto p-4 sm:p-6" style={{ maxHeight: 'calc(95vh - 200px)' }}>
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-600">Email</div>
                    <div className="font-medium text-sm sm:text-base truncate">{data.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-600">Số điện thoại</div>
                    <div className="font-medium text-sm sm:text-base">{data.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-600">Ngày tham gia</div>
                    <div className="font-medium text-sm sm:text-base">
                      {format(new Date(data.joinDate), 'dd/MM/yyyy', { locale: vi })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm text-gray-600">Loại thành viên</div>
                    <div className="font-medium text-sm sm:text-base">
                      {data.memberInfo?.membership_level === 'vip' ? 'VIP' : 'Basic'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscriptions */}
              {data.activeSubscriptions && data.activeSubscriptions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Gói tập đang hoạt động
                  </h3>
                  <div className="space-y-3">
                    {data.activeSubscriptions.map((sub: any) => (
                      <div key={sub._id} className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm sm:text-base text-blue-900">{sub.type}</div>
                            <div className="text-xs sm:text-sm text-blue-700">
                              {sub.type === 'PT' || sub.type === 'Combo' 
                                ? `${sub.ptsessionsRemaining || 0} buổi còn lại / ${(sub.ptsessionsUsed || 0) + (sub.ptsessionsRemaining || 0)} buổi`
                                : sub.membershipType}
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm text-blue-700">
                            Hết hạn: {format(new Date(sub.endDate), 'dd/MM/yyyy', { locale: vi })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {data.memberInfo?.notes && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3">Ghi chú</h3>
                  <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm sm:text-base text-gray-700">{data.memberInfo.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schedules Tab */}
          {activeTab === 'schedules' && (
            <div className="space-y-4">
              {data.schedules && data.schedules.length > 0 ? (
                data.schedules
                  .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
                  .map((schedule: any) => (
                    <div
                      key={schedule._id}
                      className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm sm:text-base">
                              {format(new Date(schedule.dateTime), 'EEEE, dd/MM/yyyy', { locale: vi })}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {format(new Date(schedule.dateTime), 'HH:mm', { locale: vi })} - {schedule.durationMinutes} phút
                            </div>
                          </div>
                        </div>
                        <Badge className={getScheduleStatusColor(schedule.status)}>
                          {schedule.status === 'Completed' ? 'Hoàn thành' :
                           schedule.status === 'Confirmed' ? 'Đã xác nhận' :
                           schedule.status === 'Cancelled' ? 'Đã hủy' :
                           schedule.status === 'NoShow' ? 'Vắng mặt' : 'Chờ xác nhận'}
                        </Badge>
                      </div>
                      {schedule.notes && (
                        <div className="mt-2 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {schedule.notes}
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có buổi tập nào</p>
                </div>
              )}
            </div>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <HealthInfoSection 
                healthInfo={healthInfoList || []}
                isLoading={isLoadingHealthInfo}
              />
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {achievements.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {achievements.map((achievement, idx) => (
                      <div key={idx} className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{achievement.text}</p>
                            <p className="text-xs text-gray-600 mt-1">Đạt được trong quá trình tập luyện</p>
                          </div>
                          <Award className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Summary */}
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      Tổng quan tiến độ
                    </h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {data.schedules?.filter((s: any) => s.status === 'Completed').length || 0}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Buổi hoàn thành</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {data.schedules?.filter((s: any) => 
                            (s.status === 'Confirmed' || s.status === 'Pending') && 
                            new Date(s.dateTime) > new Date()
                          ).length || 0}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Buổi sắp tới</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{achievements.length}</div>
                        <div className="text-xs text-gray-600 mt-1">Thành tích</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa đạt thành tích nào</p>
                  <p className="text-sm mt-2">Tiếp tục tập luyện để unlock thành tích!</p>
                </div>
              )}
            </div>
          )}

          {/* AI Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {isLoadingSuggestions ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">Đang tải gợi ý...</p>
                </div>
              ) : aiSuggestions && aiSuggestions.length > 0 ? (
                aiSuggestions
                  .sort((a, b) => new Date(b.recommendationDate).getTime() - new Date(a.recommendationDate).getTime())
                  .map((suggestion: AISuggestion) => (
                    <Card key={suggestion._id} className="border border-gray-200">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                              <h3 className="font-semibold text-base sm:text-lg">{suggestion.goal}</h3>
                              <Badge variant="outline" className={suggestion.status === 'Accepted' ? 'bg-green-50 text-green-700' : ''}>
                                {suggestion.status === 'Pending' ? 'Chờ xử lý' :
                                 suggestion.status === 'Accepted' ? 'Đã chấp nhận' :
                                 suggestion.status === 'Completed' ? 'Hoàn thành' :
                                 suggestion.status === 'Cancelled' ? 'Đã hủy' : 'Đã lưu trữ'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span>{format(new Date(suggestion.recommendationDate), 'dd/MM/yyyy', { locale: vi })}</span>
                              </div>
                              {suggestion.workoutDuration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>{suggestion.workoutDuration} phút</span>
                                </div>
                              )}
                              {suggestion.exercises && suggestion.exercises.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>{suggestion.exercises.length} bài tập</span>
                                </div>
                              )}
                            </div>
                            {suggestion.trainerNotes && (
                              <div className="mt-2 p-2 bg-blue-50 rounded text-xs sm:text-sm text-gray-700">
                                <strong>Ghi chú của PT:</strong> {suggestion.trainerNotes}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSuggestion(suggestion);
                              setEditForm({
                                trainerNotes: suggestion.trainerNotes || '',
                                status: suggestion.status || 'Pending',
                              });
                            }}
                            className="w-full sm:w-auto flex-shrink-0"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                        </div>
                        {suggestion.exercises && suggestion.exercises.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <h4 className="font-medium text-sm text-gray-700">Bài tập:</h4>
                            <div className="space-y-1">
                              {suggestion.exercises.slice(0, 3).map((exercise, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  • {exercise.name} - {exercise.sets} sets x {exercise.reps} reps
                                </div>
                              ))}
                              {suggestion.exercises.length > 3 && (
                                <div className="text-sm text-gray-500">... và {suggestion.exercises.length - 3} bài tập khác</div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {suggestion.dietPlan && (
                          <div className="mt-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 flex-shrink-0" />
                              <h4 className="font-medium text-sm sm:text-base text-green-900">Kế hoạch dinh dưỡng</h4>
                            </div>
                            
                            {suggestion.dietPlan.dailyCalories && (
                              <div className="mb-3">
                                <div className="text-xs text-green-700 mb-1">Tổng calo/ngày:</div>
                                <div className="text-sm font-semibold text-green-900">{suggestion.dietPlan.dailyCalories} kcal</div>
                              </div>
                            )}
                            
                            {suggestion.dietPlan.macros && (
                              <div className="mb-3 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                                <div className="bg-white p-2 rounded">
                                  <div className="text-green-600">Protein</div>
                                  <div className="font-semibold">{suggestion.dietPlan.macros.protein || 0}g</div>
                                </div>
                                <div className="bg-white p-2 rounded">
                                  <div className="text-green-600">Carbs</div>
                                  <div className="font-semibold">{suggestion.dietPlan.macros.carbs || 0}g</div>
                                </div>
                                <div className="bg-white p-2 rounded">
                                  <div className="text-green-600">Fat</div>
                                  <div className="font-semibold">{suggestion.dietPlan.macros.fat || 0}g</div>
                                </div>
                              </div>
                            )}
                            
                            {suggestion.dietPlan.mealTimes && suggestion.dietPlan.mealTimes.length > 0 && (
                              <div className="space-y-1">
                                <div className="text-xs text-green-700 mb-2">Lịch ăn trong ngày:</div>
                                {suggestion.dietPlan.mealTimes.map((meal: any, idx: number) => (
                                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs bg-white p-2 rounded gap-1 sm:gap-0">
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-3 h-3 text-green-600 flex-shrink-0" />
                                      <span className="font-medium text-green-900">{meal.time}</span>
                                      <span className="text-gray-600">- {meal.mealName}</span>
                                    </div>
                                    {meal.suggestedCalories && (
                                      <span className="text-green-700 font-semibold sm:ml-auto">{meal.suggestedCalories} kcal</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {suggestion.dietPlan.notes && (
                              <div className="mt-3 pt-3 border-t border-green-200">
                                <div className="text-xs text-green-700 mb-1">Ghi chú:</div>
                                <div className="text-xs text-gray-700">{suggestion.dietPlan.notes}</div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {suggestion.nutrition && !suggestion.dietPlan && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <UtensilsCrossed className="w-4 h-4 text-green-700" />
                              <h4 className="font-medium text-sm text-green-900">Dinh dưỡng</h4>
                            </div>
                            <p className="text-sm text-gray-700">{suggestion.nutrition}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có gợi ý AI nào</p>
                </div>
              )}
            </div>
          )}
          </div>
        </CardContent>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Đóng
            </Button>
            {onCreateSchedule && (
              <Button
                onClick={() => {
                  onCreateSchedule(memberId);
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Tạo lịch tập mới</span>
                <span className="sm:hidden">Tạo lịch</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Edit Suggestion Dialog */}
      {editingSuggestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col bg-white m-2 sm:m-0">
            <CardHeader className="border-b border-gray-200 flex-shrink-0 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg sm:text-xl">Chỉnh sửa gợi ý AI</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingSuggestion(null);
                  setEditForm({});
                }} className="flex-shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Mục tiêu</Label>
                  <p className="text-gray-700 mt-1">{editingSuggestion.goal}</p>
                </div>

                <div>
                  <Label htmlFor="trainerNotes" className="text-sm font-medium">Ghi chú của PT</Label>
                  <Textarea
                    id="trainerNotes"
                    value={editForm.trainerNotes || ''}
                    onChange={(e) => setEditForm({ ...editForm, trainerNotes: e.target.value })}
                    placeholder="Nhập ghi chú của bạn về gợi ý này (tùy chọn)..."
                    className="mt-1 min-h-[100px]"
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(editForm.trainerNotes || '').length}/2000 ký tự
                  </p>
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                  <Select
                    value={editForm.status || editingSuggestion?.status || 'Pending'}
                    onValueChange={(value) => setEditForm({ ...editForm, status: value as any })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Chờ xử lý</SelectItem>
                      <SelectItem value="Accepted">Đã chấp nhận</SelectItem>
                      <SelectItem value="Completed">Hoàn thành</SelectItem>
                      <SelectItem value="Cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingSuggestion.exercises && editingSuggestion.exercises.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Bài tập ({editingSuggestion.exercises.length})</Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                      {editingSuggestion.exercises.map((exercise, idx) => (
                        <div key={idx} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                          <strong>{exercise.name}</strong> - {exercise.sets} sets x {exercise.reps} reps
                          {exercise.restTime > 0 && ` (nghỉ ${exercise.restTime}s)`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editingSuggestion.notes && (
                  <div>
                    <Label className="text-sm font-medium">Ghi chú gốc</Label>
                    <p className="text-gray-600 text-sm mt-1">{editingSuggestion.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSuggestion(null);
                    setEditForm({});
                  }}
                  className="w-full sm:w-auto"
                >
                  Hủy
                </Button>
                <Button
                  onClick={async () => {
                    if (!editingSuggestion) return;
                    try {
                      await updateSuggestion.mutateAsync({
                        id: editingSuggestion._id,
                        data: {
                          trainerNotes: editForm.trainerNotes || '',
                          status: editForm.status || editingSuggestion.status,
                        }
                      });
                      setEditingSuggestion(null);
                      setEditForm({});
                    } catch (error: any) {
                      console.error('Error updating suggestion:', error);
                      // Error is already handled by the hook's onError
                    }
                  }}
                  disabled={updateSuggestion.isPending}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  {updateSuggestion.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

