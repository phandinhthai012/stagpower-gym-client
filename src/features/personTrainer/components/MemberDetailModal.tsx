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
} from 'lucide-react';
import { useMemberDetail } from '../hooks/useTrainerMembers';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { HealthInfoSection } from '../../../features/admin/components/member-management/HealthInfoSection';

interface MemberDetailModalProps {
  memberId: string;
  onClose: () => void;
  onCreateSchedule?: (memberId: string) => void;
}

export function MemberDetailModal({ memberId, onClose, onCreateSchedule }: MemberDetailModalProps) {
  const { data, isLoading, error } = useMemberDetail(memberId);
  const [activeTab, setActiveTab] = useState<'info' | 'schedules' | 'health' | 'achievements'>('info');

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 bg">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        {/* Header */}
        <CardHeader className="border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {data.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <CardTitle className="text-2xl">{data.fullName}</CardTitle>
                <Badge className={getStatusColor(data.status)}>
                  {getStatusText(data.status)}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Thông tin
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'schedules'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lịch tập ({data.schedules?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'health'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sức khỏe
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'achievements'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Thành tích ({achievements.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{data.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Số điện thoại</div>
                    <div className="font-medium">{data.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Ngày tham gia</div>
                    <div className="font-medium">
                      {format(new Date(data.joinDate), 'dd/MM/yyyy', { locale: vi })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm text-gray-600">Loại thành viên</div>
                    <div className="font-medium">
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
                      <div key={sub._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-blue-900">{sub.type}</div>
                            <div className="text-sm text-blue-700">
                              {sub.type === 'PT' || sub.type === 'Combo' 
                                ? `${sub.ptsessionsRemaining || 0} buổi còn lại / ${(sub.ptsessionsUsed || 0) + (sub.ptsessionsRemaining || 0)} buổi`
                                : sub.membershipType}
                            </div>
                          </div>
                          <div className="text-sm text-blue-700">
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
                  <h3 className="text-lg font-semibold mb-3">Ghi chú</h3>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-gray-700">{data.memberInfo.notes}</p>
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
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-semibold">
                              {format(new Date(schedule.dateTime), 'EEEE, dd/MM/yyyy', { locale: vi })}
                            </div>
                            <div className="text-sm text-gray-600">
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
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
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
                healthInfo={data.healthInfo || null}
                isLoading={false}
              />
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {achievements.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Tổng quan tiến độ
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
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
        </CardContent>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            {onCreateSchedule && (
              <Button
                onClick={() => {
                  onCreateSchedule(memberId);
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tạo lịch tập mới
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

