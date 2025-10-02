import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Mail,
  Phone,
  Calendar,
  Package,
  QrCode,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { mockUsers } from '../../../mockdata/users';
import { mockSubscriptions } from '../../../mockdata/subscriptions';
import { mockCheckIns } from '../../../mockdata/checkIns';

export function AdminMemberManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Filter members
  const members = mockUsers.filter(user => user.role === 'Member');
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    const matchesMembership = membershipFilter === 'all' || 
                             (membershipFilter === 'basic' && member.member_info?.membership_level === 'Basic') ||
                             (membershipFilter === 'vip' && member.member_info?.membership_level === 'VIP');

    return matchesSearch && matchesStatus && matchesMembership;
  });

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(member => member.status === 'Active').length;
  const vipMembers = members.filter(member => member.member_info?.membership_level === 'VIP').length;
  const hssvMembers = members.filter(member => member.member_info?.is_hssv).length;


  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const getMemberStatus = (member: any) => {
    const activeSub = mockSubscriptions.find(sub => 
      sub.member_id === member.id && sub.status === 'Active'
    );
    
    if (!activeSub) return { status: 'No Subscription', color: 'bg-red-100 text-red-800' };
    
    const now = new Date();
    const endDate = new Date(activeSub.end_date);
    
    if (now > endDate) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    
    if (activeSub.is_suspended) {
      return { status: 'Suspended', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { status: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const getLastCheckIn = (memberId: string) => {
    const lastCheckIn = mockCheckIns
      .filter(checkIn => checkIn.member_id === memberId)
      .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime())[0];
    
    return lastCheckIn ? new Date(lastCheckIn.check_in_time).toLocaleDateString('vi-VN') : 'Chưa có';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-6">

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm theo tên, email, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Không hoạt động</SelectItem>
                <SelectItem value="Suspended">Tạm ngưng</SelectItem>
              </SelectContent>
            </Select>

            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Loại membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hội viên
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedMembers.length} hội viên
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <UserX className="w-4 h-4 mr-2" />
                  Tạm ngưng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Danh sách hội viên ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-3 font-medium text-gray-600">Hội viên</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thông tin liên hệ</th>
                  <th className="text-left p-3 font-medium text-gray-600">Gói tập</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left p-3 font-medium text-gray-600">Lần check-in cuối</th>
                  <th className="text-left p-3 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const memberStatus = getMemberStatus(member);
                  const activeSub = mockSubscriptions.find(sub => 
                    sub.member_id === member.id && sub.status === 'Active'
                  );
                  
                  return (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {member.full_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.full_name}</p>
                            <p className="text-sm text-gray-500">ID: {member.id.slice(-8)}</p>
                            {member.member_info?.is_hssv && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">HSSV</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {activeSub ? (
                          <div className="space-y-1">
                            <Badge className="bg-blue-100 text-blue-800">
                              {activeSub.type}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {member.member_info?.membership_level}
                            </p>
                            <p className="text-xs text-gray-500">
                              Hết hạn: {new Date(activeSub.end_date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">Không có gói</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge className={memberStatus.color}>
                          {memberStatus.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600">
                          {getLastCheckIn(member.id)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Member Details Modal would go here */}
      {/* This would be a separate component for viewing/editing member details */}
    </div>
  );
}
