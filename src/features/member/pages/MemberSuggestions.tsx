import React, { useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Lightbulb, 
  Target, 
  Clock, 
  TrendingUp,
  Heart,
  Dumbbell,
  Apple,
  Calendar,
  RefreshCw,
  Download,
  Star
} from 'lucide-react';
import { 
  mockAISuggestions,
  getMockDataByMemberId 
} from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';

export function MemberSuggestions() {
  const { user } = useAuth();

  // Get member's AI suggestions
  const memberSuggestions = useMemo(() => {
    if (!user?.id) return [];
    return getMockDataByMemberId('aiSuggestions', user.id)
      .sort((a, b) => new Date(b.recommendation_date).getTime() - new Date(a.recommendation_date).getTime());
  }, [user?.id]);

  const latestSuggestion = memberSuggestions[0];

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'WeightLoss':
        return <TrendingUp className="h-5 w-5" />;
      case 'MuscleGain':
        return <Dumbbell className="h-5 w-5" />;
      case 'Health':
        return <Heart className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'WeightLoss':
        return 'bg-green-100 text-green-800';
      case 'MuscleGain':
        return 'bg-blue-100 text-blue-800';
      case 'Health':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-yellow-100 text-yellow-800';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gợi ý AI</h1>
          <p className="text-gray-600 mt-1">Nhận gợi ý tập luyện và dinh dưỡng từ AI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất kế hoạch
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tạo gợi ý mới
          </Button>
        </div>
      </div>

      {/* Latest Suggestion */}
      {latestSuggestion ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Star className="h-5 w-5" />
              <span>Gợi ý mới nhất</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Goal and Level */}
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getGoalColor(latestSuggestion.goal)}`}>
                  {getGoalIcon(latestSuggestion.goal)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Mục tiêu: {latestSuggestion.goal === 'WeightLoss' ? 'Giảm cân' : 
                               latestSuggestion.goal === 'MuscleGain' ? 'Tăng cơ' : 'Sức khỏe tổng thể'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getLevelColor(latestSuggestion.level)}>
                      {latestSuggestion.level === 'Beginner' ? 'Mới bắt đầu' :
                       latestSuggestion.level === 'Intermediate' ? 'Trung bình' : 'Nâng cao'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Cập nhật: {formatDate(latestSuggestion.recommendation_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Thời gian ước tính</span>
                  </div>
                  <p className="text-lg font-semibold">{latestSuggestion.estimated_time} tuần</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Dumbbell className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Thời gian tập/buổi</span>
                  </div>
                  <p className="text-lg font-semibold">{latestSuggestion.workout_duration} phút</p>
                </div>
              </div>

              {/* Note */}
              {latestSuggestion.note && (
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-medium mb-2">Ghi chú</h4>
                  <p className="text-sm text-gray-600">{latestSuggestion.note}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Chưa có gợi ý AI</h3>
                <p className="text-yellow-600">Tạo gợi ý AI để nhận kế hoạch tập luyện phù hợp</p>
              </div>
              <Button className="ml-auto">
                <Lightbulb className="h-4 w-4 mr-2" />
                Tạo gợi ý
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Plan */}
        {latestSuggestion && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5" />
                <span>Kế hoạch tập luyện</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Bài tập được gợi ý</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {latestSuggestion.exercises || 'Chưa có thông tin bài tập'}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Lịch tập</h4>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {latestSuggestion.schedule || 'Chưa có lịch tập'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nutrition Plan */}
        {latestSuggestion && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Apple className="h-5 w-5" />
                <span>Kế hoạch dinh dưỡng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Gợi ý dinh dưỡng</h4>
                <div className="text-sm text-gray-600 whitespace-pre-line">
                  {latestSuggestion.nutrition || 'Chưa có thông tin dinh dưỡng'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Suggestion History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Lịch sử gợi ý</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memberSuggestions.length > 0 ? (
            <div className="space-y-4">
              {memberSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getGoalColor(suggestion.goal)}`}>
                      {getGoalIcon(suggestion.goal)}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {suggestion.goal === 'WeightLoss' ? 'Giảm cân' : 
                         suggestion.goal === 'MuscleGain' ? 'Tăng cơ' : 'Sức khỏe tổng thể'}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getLevelColor(suggestion.level)}>
                          {suggestion.level}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {suggestion.estimated_time} tuần
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDate(suggestion.recommendation_date)}
                    </p>
                    <Button size="sm" variant="outline">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử gợi ý</h3>
              <p className="text-gray-500">Tạo gợi ý AI đầu tiên để bắt đầu</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
