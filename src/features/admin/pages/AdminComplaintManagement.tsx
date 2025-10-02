import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Users,
  MessageCircle,
  Flag,
  FileText,
  Send
} from 'lucide-react';
import { mockComplaints, getComplaintStats, type Complaint } from '../../../mockdata/complaints';

export function AdminComplaintManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newComplaint, setNewComplaint] = useState({
    member_name: '',
    member_email: '',
    branch_id: '',
    type: '',
    category: '',
    priority: '',
    subject: '',
    description: '',
    status: 'Open'
  });

  // Get statistics from mock data
  const stats = getComplaintStats();


  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Complaint':
        return <Badge className="bg-red-100 text-red-800">Khiếu nại</Badge>;
      case 'Feedback':
        return <Badge className="bg-blue-100 text-blue-800">Phản hồi</Badge>;
      case 'Suggestion':
        return <Badge className="bg-green-100 text-green-800">Góp ý</Badge>;
      case 'Technical Issue':
        return <Badge className="bg-purple-100 text-purple-800">Lỗi kỹ thuật</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge className="bg-red-100 text-red-800">Chưa xử lý</Badge>;
      case 'In Progress':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>;
      case 'Resolved':
        return <Badge className="bg-green-100 text-green-800">Đã giải quyết</Badge>;
      case 'Closed':
        return <Badge className="bg-gray-100 text-gray-800">Đã đóng</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Thấp</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>;
      case 'High':
        return <Badge className="bg-orange-100 text-orange-800">Cao</Badge>;
      case 'Urgent':
        return <Badge className="bg-red-100 text-red-800">Khẩn cấp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Service':
        return <Badge className="bg-blue-100 text-blue-800">Dịch vụ</Badge>;
      case 'Equipment':
        return <Badge className="bg-purple-100 text-purple-800">Thiết bị</Badge>;
      case 'Staff':
        return <Badge className="bg-green-100 text-green-800">Nhân viên</Badge>;
      case 'Facility':
        return <Badge className="bg-orange-100 text-orange-800">Cơ sở vật chất</Badge>;
      case 'Payment':
        return <Badge className="bg-yellow-100 text-yellow-800">Thanh toán</Badge>;
      case 'Other':
        return <Badge className="bg-gray-100 text-gray-800">Khác</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComplaint = () => {
    setShowAddModal(true);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowEditModal(true);
  };

  const handleDeleteComplaint = (complaint: Complaint) => {
    if (confirm(`Bạn có chắc muốn xóa phản hồi "${complaint.subject}"?`)) {
      alert(`Đã xóa phản hồi: ${complaint.subject}`);
    }
  };

  const handleViewComplaint = (complaint: Complaint) => {
    alert(`Xem chi tiết phản hồi: ${complaint.subject}`);
  };

  const handleAssignComplaint = (complaint: Complaint) => {
    alert(`Phân công xử lý phản hồi: ${complaint.subject}`);
  };

  const handleResolveComplaint = (complaint: Complaint) => {
    if (confirm(`Bạn có chắc muốn đánh dấu phản hồi "${complaint.subject}" là đã giải quyết?`)) {
      alert(`Đã đánh dấu phản hồi đã giải quyết: ${complaint.subject}`);
    }
  };

  const handleAddComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã thêm phản hồi mới thành công!');
    setShowAddModal(false);
    setNewComplaint({
      member_name: '',
      member_email: '',
      branch_id: '',
      type: '',
      category: '',
      priority: '',
      subject: '',
      description: '',
      status: 'Open'
    });
  };

  const handleEditComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã cập nhật phản hồi thành công!');
    setShowEditModal(false);
  };

  // Filter complaints based on search and filters
  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.member_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-6">

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleAddComplaint}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm phản hồi
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Báo cáo tổng hợp
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Phân công xử lý
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Thống kê
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm phản hồi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Complaint">Khiếu nại</SelectItem>
                <SelectItem value="Feedback">Phản hồi</SelectItem>
                <SelectItem value="Suggestion">Góp ý</SelectItem>
                <SelectItem value="Technical Issue">Lỗi kỹ thuật</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Open">Chưa xử lý</SelectItem>
                <SelectItem value="In Progress">Đang xử lý</SelectItem>
                <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                <SelectItem value="Closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Low">Thấp</SelectItem>
                <SelectItem value="Medium">Trung bình</SelectItem>
                <SelectItem value="High">Cao</SelectItem>
                <SelectItem value="Urgent">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Áp dụng
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Danh sách phản hồi & khiếu nại ({filteredComplaints.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Thông tin</th>
                  <th className="text-left p-4">Loại</th>
                  <th className="text-left p-4">Danh mục</th>
                  <th className="text-left p-4">Mức độ</th>
                  <th className="text-left p-4">Trạng thái</th>
                  <th className="text-left p-4">Thời gian</th>
                  <th className="text-left p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-semibold">{complaint.subject}</div>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{complaint.member_name}</span>
                          <span className="text-gray-400">•</span>
                          <Building2 className="w-4 h-4" />
                          <span>{complaint.branch_name}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {complaint.description.substring(0, 80)}...
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getTypeBadge(complaint.type)}</td>
                    <td className="p-4">{getCategoryBadge(complaint.category)}</td>
                    <td className="p-4">{getPriorityBadge(complaint.priority)}</td>
                    <td className="p-4">{getStatusBadge(complaint.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(complaint.created_at)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewComplaint(complaint)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditComplaint(complaint)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {complaint.status === 'Open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignComplaint(complaint)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                        {complaint.status === 'In Progress' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveComplaint(complaint)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteComplaint(complaint)}
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

      {/* Add Complaint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thêm Phản Hồi Mới</CardTitle>
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
              <form onSubmit={handleAddComplaintSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Tên hội viên *</Label>
                    <Input
                      id="memberName"
                      value={newComplaint.member_name}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, member_name: e.target.value }))}
                      placeholder="VD: Nguyễn Văn An"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberEmail">Email hội viên *</Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      value={newComplaint.member_email}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, member_email: e.target.value }))}
                      placeholder="nguyen.van.an@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complaintType">Loại phản hồi *</Label>
                    <Select 
                      value={newComplaint.type} 
                      onValueChange={(value) => setNewComplaint(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phản hồi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complaint">Khiếu nại</SelectItem>
                        <SelectItem value="Feedback">Phản hồi</SelectItem>
                        <SelectItem value="Suggestion">Góp ý</SelectItem>
                        <SelectItem value="Technical Issue">Lỗi kỹ thuật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="complaintCategory">Danh mục *</Label>
                    <Select 
                      value={newComplaint.category} 
                      onValueChange={(value) => setNewComplaint(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Service">Dịch vụ</SelectItem>
                        <SelectItem value="Equipment">Thiết bị</SelectItem>
                        <SelectItem value="Staff">Nhân viên</SelectItem>
                        <SelectItem value="Facility">Cơ sở vật chất</SelectItem>
                        <SelectItem value="Payment">Thanh toán</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complaintPriority">Mức độ ưu tiên *</Label>
                    <Select 
                      value={newComplaint.priority} 
                      onValueChange={(value) => setNewComplaint(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Thấp</SelectItem>
                        <SelectItem value="Medium">Trung bình</SelectItem>
                        <SelectItem value="High">Cao</SelectItem>
                        <SelectItem value="Urgent">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="complaintStatus">Trạng thái</Label>
                    <Select 
                      value={newComplaint.status} 
                      onValueChange={(value) => setNewComplaint(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Chưa xử lý</SelectItem>
                        <SelectItem value="In Progress">Đang xử lý</SelectItem>
                        <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                        <SelectItem value="Closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="complaintSubject">Tiêu đề *</Label>
                  <Input
                    id="complaintSubject"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="VD: Nhân viên phục vụ không nhiệt tình"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="complaintDescription">Mô tả chi tiết *</Label>
                  <textarea
                    id="complaintDescription"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Mô tả chi tiết vấn đề hoặc góp ý..."
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
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
                    Thêm phản hồi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Complaint Modal */}
      {showEditModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chỉnh Sửa Phản Hồi</CardTitle>
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
              <form onSubmit={handleEditComplaintSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editMemberName">Tên hội viên</Label>
                    <Input
                      id="editMemberName"
                      defaultValue={selectedComplaint.member_name}
                      placeholder="VD: Nguyễn Văn An"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editMemberEmail">Email hội viên</Label>
                    <Input
                      id="editMemberEmail"
                      type="email"
                      defaultValue={selectedComplaint.member_email}
                      placeholder="nguyen.van.an@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editComplaintType">Loại phản hồi</Label>
                    <Select defaultValue={selectedComplaint.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phản hồi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complaint">Khiếu nại</SelectItem>
                        <SelectItem value="Feedback">Phản hồi</SelectItem>
                        <SelectItem value="Suggestion">Góp ý</SelectItem>
                        <SelectItem value="Technical Issue">Lỗi kỹ thuật</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editComplaintCategory">Danh mục</Label>
                    <Select defaultValue={selectedComplaint.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Service">Dịch vụ</SelectItem>
                        <SelectItem value="Equipment">Thiết bị</SelectItem>
                        <SelectItem value="Staff">Nhân viên</SelectItem>
                        <SelectItem value="Facility">Cơ sở vật chất</SelectItem>
                        <SelectItem value="Payment">Thanh toán</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editComplaintPriority">Mức độ ưu tiên</Label>
                    <Select defaultValue={selectedComplaint.priority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Thấp</SelectItem>
                        <SelectItem value="Medium">Trung bình</SelectItem>
                        <SelectItem value="High">Cao</SelectItem>
                        <SelectItem value="Urgent">Khẩn cấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editComplaintStatus">Trạng thái</Label>
                    <Select defaultValue={selectedComplaint.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Chưa xử lý</SelectItem>
                        <SelectItem value="In Progress">Đang xử lý</SelectItem>
                        <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                        <SelectItem value="Closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="editComplaintSubject">Tiêu đề</Label>
                  <Input
                    id="editComplaintSubject"
                    defaultValue={selectedComplaint.subject}
                    placeholder="VD: Nhân viên phục vụ không nhiệt tình"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="editComplaintDescription">Mô tả chi tiết</Label>
                  <textarea
                    id="editComplaintDescription"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Mô tả chi tiết vấn đề hoặc góp ý..."
                    defaultValue={selectedComplaint.description}
                  />
                </div>

                <div>
                  <Label htmlFor="editResolution">Giải pháp (nếu có)</Label>
                  <textarea
                    id="editResolution"
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="Mô tả cách giải quyết vấn đề..."
                    defaultValue={selectedComplaint.resolution || ''}
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
