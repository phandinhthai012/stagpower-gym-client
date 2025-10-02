export interface Complaint {
  id: string;
  member_id: string;
  member_name: string;
  member_email: string;
  branch_id: string;
  branch_name: string;
  type: 'Complaint' | 'Feedback' | 'Suggestion' | 'Technical Issue';
  category: 'Service' | 'Equipment' | 'Staff' | 'Facility' | 'Payment' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assigned_to?: string;
  assigned_to_name?: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export const mockComplaints: Complaint[] = [
  {
    id: '507f1f77bcf86cd799439201',
    member_id: '507f1f77bcf86cd799439011',
    member_name: 'Nguyễn Văn An',
    member_email: 'nguyen.van.an@gmail.com',
    branch_id: '507f1f77bcf86cd799439041',
    branch_name: 'StagPower Gym Quận 1',
    type: 'Complaint',
    category: 'Service',
    priority: 'Medium',
    subject: 'Nhân viên phục vụ không nhiệt tình',
    description: 'Tôi đã đến phòng gym hôm qua và nhận thấy nhân viên tại quầy lễ tân không nhiệt tình, thái độ phục vụ kém. Mong được cải thiện dịch vụ.',
    status: 'Open',
    created_at: '2024-01-15T08:30:00Z',
    updated_at: '2024-01-15T08:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439202',
    member_id: '507f1f77bcf86cd799439012',
    member_name: 'Trần Thị Bình',
    member_email: 'tran.thi.binh@gmail.com',
    branch_id: '507f1f77bcf86cd799439042',
    branch_name: 'StagPower Gym Quận 3',
    type: 'Feedback',
    category: 'Equipment',
    priority: 'Low',
    subject: 'Máy chạy bộ bị hỏng',
    description: 'Máy chạy bộ số 3 tại chi nhánh Quận 3 đã bị hỏng được 2 ngày. Mong được sửa chữa sớm để phục vụ hội viên.',
    status: 'In Progress',
    assigned_to: '507f1f77bcf86cd799439021',
    assigned_to_name: 'Lê Văn Cường',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z'
  },
  {
    id: '507f1f77bcf86cd799439203',
    member_id: '507f1f77bcf86cd799439013',
    member_name: 'Phạm Văn Cường',
    member_email: 'pham.van.cuong@gmail.com',
    branch_id: '507f1f77bcf86cd799439043',
    branch_name: 'StagPower Gym Quận 7',
    type: 'Complaint',
    category: 'Payment',
    priority: 'High',
    subject: 'Thanh toán bị trừ sai tiền',
    description: 'Tôi đã thanh toán gói 3 tháng nhưng hệ thống trừ tiền 2 lần. Số tiền bị trừ sai: 500,000 VNĐ. Yêu cầu hoàn tiền ngay.',
    status: 'Resolved',
    assigned_to: '507f1f77bcf86cd799439022',
    assigned_to_name: 'Nguyễn Thị Dung',
    resolution: 'Đã kiểm tra và hoàn tiền 500,000 VNĐ vào tài khoản của khách hàng. Lỗi do hệ thống thanh toán.',
    created_at: '2024-01-13T10:45:00Z',
    updated_at: '2024-01-15T16:30:00Z',
    resolved_at: '2024-01-15T16:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439204',
    member_id: '507f1f77bcf86cd799439014',
    member_name: 'Hoàng Thị Dung',
    member_email: 'hoang.thi.dung@gmail.com',
    branch_id: '507f1f77bcf86cd799439044',
    branch_name: 'StagPower Gym Quận 10',
    type: 'Suggestion',
    category: 'Facility',
    priority: 'Low',
    subject: 'Mong có thêm máy điều hòa',
    description: 'Khu vực tập cardio rất nóng, mong được lắp thêm máy điều hòa để tạo môi trường tập luyện thoải mái hơn.',
    status: 'Open',
    created_at: '2024-01-12T19:30:00Z',
    updated_at: '2024-01-12T19:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439205',
    member_id: '507f1f77bcf86cd799439015',
    member_name: 'Vũ Văn Em',
    member_email: 'vu.van.em@gmail.com',
    branch_id: '507f1f77bcf86cd799439045',
    branch_name: 'StagPower Gym Quận Bình Thạnh',
    type: 'Technical Issue',
    category: 'Other',
    priority: 'Medium',
    subject: 'App không hoạt động',
    description: 'Ứng dụng StagPower trên điện thoại không thể đăng nhập được. Lỗi "Connection timeout" liên tục.',
    status: 'In Progress',
    assigned_to: '507f1f77bcf86cd799439023',
    assigned_to_name: 'Trần Văn Phúc',
    created_at: '2024-01-11T15:20:00Z',
    updated_at: '2024-01-16T11:45:00Z'
  },
  {
    id: '507f1f77bcf86cd799439206',
    member_id: '507f1f77bcf86cd799439016',
    member_name: 'Đỗ Thị Phúc',
    member_email: 'do.thi.phuc@gmail.com',
    branch_id: '507f1f77bcf86cd799439047',
    branch_name: 'StagPower Gym Quận Gò Vấp',
    type: 'Complaint',
    category: 'Staff',
    priority: 'High',
    subject: 'PT không chuyên nghiệp',
    description: 'Personal Trainer được phân công không chuyên nghiệp, thường xuyên đi muộn và không hướng dẫn kỹ thuật đúng.',
    status: 'Resolved',
    assigned_to: '507f1f77bcf86cd799439024',
    assigned_to_name: 'Lý Văn Quang',
    resolution: 'Đã thay đổi PT mới cho khách hàng và nhắc nhở PT cũ về tác phong làm việc.',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    resolved_at: '2024-01-14T14:20:00Z'
  },
  {
    id: '507f1f77bcf86cd799439207',
    member_id: '507f1f77bcf86cd799439017',
    member_name: 'Bùi Văn Quang',
    member_email: 'bui.van.quang@gmail.com',
    branch_id: '507f1f77bcf86cd799439048',
    branch_name: 'StagPower Gym Quận Phú Nhuận',
    type: 'Feedback',
    category: 'Service',
    priority: 'Low',
    subject: 'Dịch vụ rất tốt',
    description: 'Cảm ơn StagPower đã có dịch vụ tốt. Nhân viên nhiệt tình, cơ sở vật chất hiện đại.',
    status: 'Closed',
    assigned_to: '507f1f77bcf86cd799439025',
    assigned_to_name: 'Phan Thị Hương',
    resolution: 'Cảm ơn feedback tích cực từ khách hàng. Sẽ tiếp tục duy trì chất lượng dịch vụ.',
    created_at: '2024-01-09T16:45:00Z',
    updated_at: '2024-01-10T10:30:00Z',
    resolved_at: '2024-01-10T10:30:00Z'
  },
  {
    id: '507f1f77bcf86cd799439208',
    member_id: '507f1f77bcf86cd799439018',
    member_name: 'Lê Thị Hương',
    member_email: 'le.thi.huong@gmail.com',
    branch_id: '507f1f77bcf86cd799439041',
    branch_name: 'StagPower Gym Quận 1',
    type: 'Complaint',
    category: 'Equipment',
    priority: 'Urgent',
    subject: 'Máy nâng tạ bị sập',
    description: 'Máy nâng tạ số 5 bị sập trong lúc tôi đang tập, rất nguy hiểm. Yêu cầu kiểm tra và sửa chữa ngay lập tức.',
    status: 'In Progress',
    assigned_to: '507f1f77bcf86cd799439026',
    assigned_to_name: 'Võ Văn Ích',
    created_at: '2024-01-16T11:30:00Z',
    updated_at: '2024-01-16T13:45:00Z'
  }
];

// Statistics helper functions
export const getComplaintStats = () => {
  const total = mockComplaints.length;
  const byStatus = mockComplaints.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byType = mockComplaints.reduce((acc, complaint) => {
    acc[complaint.type] = (acc[complaint.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byPriority = mockComplaints.reduce((acc, complaint) => {
    acc[complaint.priority] = (acc[complaint.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byCategory = mockComplaints.reduce((acc, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    byStatus,
    byType,
    byPriority,
    byCategory,
    open: mockComplaints.filter(c => c.status === 'Open').length,
    inProgress: mockComplaints.filter(c => c.status === 'In Progress').length,
    resolved: mockComplaints.filter(c => c.status === 'Resolved').length,
    closed: mockComplaints.filter(c => c.status === 'Closed').length,
    urgent: mockComplaints.filter(c => c.priority === 'Urgent').length
  };
};
