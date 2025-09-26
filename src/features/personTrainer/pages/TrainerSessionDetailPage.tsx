// / TrainerSessionDetailPage.tsx
import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'; 
import { Card, CardHeader, CardContent, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ChevronLeft } from 'lucide-react';

export function TrainerSessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') === 'list' ? 'list' : 'calendar';

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

     
    </div>
  );
}

export default TrainerSessionDetailPage;