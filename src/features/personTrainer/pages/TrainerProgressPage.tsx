import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { 
  TrendingUp, 
  Target,
  Activity,
  Award,
  Calendar,
  Users,
  BarChart3,
  Eye,
  Download,
  Filter
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { mockUsers, mockSchedules, mockSubscriptions, mockHealthInfo, getMockDataByTrainerId } from '../../../mockdata';

export function TrainerProgressPage() {
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filterGoal, setFilterGoal] = useState('all');

  // Get trainer's data from mockdata
  const trainerSchedules = getMockDataByTrainerId('schedules', user?.id || '');
  const trainerMemberIds = Array.from(new Set(trainerSchedules.map(s => s.member_id)));
  const trainerMembers = mockUsers.filter(u => 
    u.role === 'Member' && trainerMemberIds.includes(u.id)
  );

  // Enhance members with progress data
  const progressData = trainerMembers.map(member => {
    const memberSchedules = trainerSchedules.filter(s => s.member_id === member.id);
    const memberHealthInfo = mockHealthInfo.find(health => health.member_id === member.id);
    const memberSubscription = mockSubscriptions.find(sub => sub.member_id === member.id);
    
    const completedSessions = memberSchedules.filter(s => s.status === 'Completed').length;
    const totalSessions = memberSchedules.length;
    const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    
    // Get last and next session
    const lastSession = memberSchedules
      .filter(s => s.status === 'Completed')
      .sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime())[0];
    
    const nextSession = memberSchedules
      .filter(s => s.status === 'Confirmed' && new Date(s.date_time) > new Date())
      .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0];

    // Mock achievements based on progress
    const achievements = [];
    if (completedSessions >= 5) achievements.push('Hoàn thành 5 buổi tập');
    if (completedSessions >= 10) achievements.push('Hoàn thành 10 buổi tập');
    if (progress >= 50) achievements.push('Đạt 50% mục tiêu');
    if (progress >= 80) achievements.push('Đạt 80% mục tiêu');
    if (memberHealthInfo?.goal === 'WeightLoss' && completedSessions >= 8) {
      achievements.push('Giảm cân thành công');
    }
    if (memberHealthInfo?.goal === 'MuscleGain' && completedSessions >= 12) {
      achievements.push('Tăng cơ thành công');
    }

    return {
      id: member.id,
      clientName: member.fullName,
      avatar: member.fullName.split(' ').map(n => n[0]).join('').substring(0, 2),
      goal: memberHealthInfo?.goal || 'Health',
      startDate: member.join_date,
      currentProgress: progress,
      targetProgress: 100,
      sessionsCompleted: completedSessions,
      totalSessions: totalSessions,
      lastSession: lastSession ? new Date(lastSession.date_time).toLocaleDateString('vi-VN') : 'Chưa có',
      nextSession: nextSession ? new Date(nextSession.date_time).toLocaleDateString('vi-VN') : 'Chưa có',
      notes: member.member_info?.notes || 'Không có ghi chú',
      achievements: achievements,
      measurements: {
        weight: memberHealthInfo?.weight,
        bodyFat: Math.round((memberHealthInfo?.bmi || 20) * 0.8), // Mock body fat
        muscle: Math.round((memberHealthInfo?.bmi || 20) * 0.6) // Mock muscle
      }
    };
  });

  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'WeightLoss': return 'Giảm cân';
      case 'MuscleGain': return 'Tăng cơ';
      case 'Health': return 'Sức khỏe';
      default: return goal;
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'WeightLoss': return 'text-green-600 bg-green-100';
      case 'MuscleGain': return 'text-blue-600 bg-blue-100';
      case 'Health': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredData = progressData.filter(client => 
    filterGoal === 'all' || client.goal === filterGoal
  );

  const averageProgress = progressData.length > 0 
    ? Math.round(progressData.reduce((sum, client) => sum + client.currentProgress, 0) / progressData.length)
    : 0;

  const totalSessions = progressData.reduce((sum, client) => sum + client.sessionsCompleted, 0);
  const totalTargetSessions = progressData.reduce((sum, client) => sum + client.totalSessions, 0);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng Hội Viên</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{progressData.length}</div>
            <p className="text-xs text-gray-500 mt-1">Đang theo dõi tiến độ</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tiến Độ Trung Bình</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{averageProgress}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Cải thiện tốt
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Buổi Tập Hoàn Thành</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{totalSessions}</div>
            <p className="text-xs text-gray-500 mt-1">/ {totalTargetSessions} buổi mục tiêu</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Thành Tích</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {progressData.reduce((sum, client) => sum + client.achievements.length, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Thành tích đạt được</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              Theo Dõi Tiến Độ
            </CardTitle>
            <div className="flex gap-2">
              <select
                value={filterGoal}
                onChange={(e) => setFilterGoal(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả mục tiêu</option>
                <option value="WeightLoss">Giảm cân</option>
                <option value="MuscleGain">Tăng cơ</option>
                <option value="Health">Sức khỏe</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview - Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            Tổng Quan Tiến Độ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Hội viên</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Mục tiêu</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Hoàn thành</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Tổng buổi</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Tiến độ</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Thành tích</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Buổi cuối</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Buổi tiếp</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {client.clientName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{client.clientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getGoalColor(client.goal)}>{getGoalText(client.goal)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-orange-600 font-semibold">{client.sessionsCompleted}</td>
                    <td className="px-4 py-3 text-center text-blue-700 font-semibold">{client.totalSessions}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-green-600 mb-1">{client.currentProgress}%</span>
                        <Progress value={client.currentProgress} className="h-2 w-28" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-purple-700 font-semibold">{client.achievements.length}</td>
                    <td className="px-4 py-3 text-gray-700">{client.lastSession}</td>
                    <td className="px-4 py-3 text-gray-700">{client.nextSession}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Progress Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              Chi Tiết Tiến Độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((client) => (
                <div 
                  key={client.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedClient === client.id 
                      ? 'bg-blue-50 border-blue-300 shadow-md' 
                      : 'bg-white border-gray-200 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {client.clientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{client.clientName}</h4>
                        <p className="text-sm text-gray-600">{getGoalText(client.goal)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{client.currentProgress}%</p>
                      <p className="text-xs text-gray-500">
                        {client.sessionsCompleted}/{client.totalSessions} buổi
                      </p>
                    </div>
                  </div>
                  
                  {selectedClient === client.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú:</p>
                          <p className="text-sm text-gray-600">{client.notes}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Thành tích:</p>
                          <div className="flex flex-wrap gap-2">
                            {client.achievements.map((achievement, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Bắt đầu:</p>
                            <p className="text-gray-600">{new Date(client.startDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Buổi cuối:</p>
                            <p className="text-gray-600">{client.lastSession}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              Thành Tích Nổi Bật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((client) => (
                <div key={client.id} className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {client.clientName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{client.clientName}</h4>
                      <p className="text-sm text-gray-600">{getGoalText(client.goal)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {client.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700">{achievement}</span>
                      </div>
                    ))}
                    {client.achievements.length === 0 && (
                      <p className="text-sm text-gray-500 italic">Chưa có thành tích nào</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}