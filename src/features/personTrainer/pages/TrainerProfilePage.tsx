import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { 
  User, 
  Briefcase, 
  Award,
  Clock,
  Trophy,
  Edit,
  Save,
  X,
  Plus,
  Medal,
  FileText,
  Star,
  Users,
  Heart,
  CalendarCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useMyProfile, useMyStats, useUpdateProfile } from '../hooks';
import { AddCertificateModal } from '../components';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function TrainerProfilePage() {
  const { user } = useAuth();
  
  // Fetch profile data
  const { data: profile, isLoading, error } = useMyProfile();
  const { data: stats } = useMyStats();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    cccd: '',
    specialty: '',
    experience_years: 0,
  });
  const [editingSections, setEditingSections] = useState<{
    personal: boolean;
    professional: boolean;
  }>({
    personal: false,
    professional: false,
  });
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    index: number | null;
    certificateName: string;
  }>({
    isOpen: false,
    index: null,
    certificateName: '',
  });

  // Sync form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
        cccd: profile.cccd || '',
        specialty: profile.trainerInfo?.specialty || '',
        experience_years: profile.trainerInfo?.experience_years || 0,
      });
    }
  }, [profile]);

  const toggleEdit = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = async (section: keyof typeof editingSections) => {
    const updateData: any = {};

    if (section === 'personal') {
      updateData.fullName = formData.fullName;
      updateData.phone = formData.phone;
      updateData.gender = formData.gender;
      updateData.dateOfBirth = formData.dateOfBirth;
      updateData.cccd = formData.cccd;
    } else if (section === 'professional') {
      updateData['trainerInfo.specialty'] = formData.specialty;
      updateData['trainerInfo.experience_years'] = formData.experience_years;
    }

    try {
      await updateMutation.mutateAsync(updateData);
      toggleEdit(section);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleAddCertificate = async (certificateName: string) => {
    const currentCerts = profile?.trainerInfo?.certificate || [];
    const updatedCerts = [...currentCerts, certificateName];

    try {
      await updateMutation.mutateAsync({
        'trainerInfo.certificate': updatedCerts,
      });
    } catch (error) {
      console.error('Add certificate error:', error);
    }
  };

  const handleRemoveCertificate = async () => {
    if (confirmDelete.index === null) return;

    const currentCerts = profile?.trainerInfo?.certificate || [];
    const updatedCerts = currentCerts.filter((_, idx) => idx !== confirmDelete.index);

    try {
      await updateMutation.mutateAsync({
        'trainerInfo.certificate': updatedCerts,
      });
      setConfirmDelete({ isOpen: false, index: null, certificateName: '' });
    } catch (error) {
      console.error('Remove certificate error:', error);
    }
  };

  const openDeleteConfirm = (index: number, certificateName: string) => {
    setConfirmDelete({
      isOpen: true,
      index,
      certificateName,
    });
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      case 'other': return 'Khác';
      default: return gender;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'pending': return 'Chờ kích hoạt';
      case 'banned': return 'Đã khóa';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'medal': return <Medal className="w-5 h-5" />;
      case 'certificate': return <FileText className="w-5 h-5" />;
      case 'trophy': return <Trophy className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'calendar-check': return <CalendarCheck className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const hasUnsavedChanges = Object.values(editingSections).some(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải thông tin cá nhân...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-red-600">
          Có lỗi xảy ra khi tải thông tin cá nhân. Vui lòng thử lại sau.
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Thông Tin Cá Nhân</h1>
      
      {/* Profile Header */}
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg sm:text-2xl">
                  {profile.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'PT'}
                </span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left w-full">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {profile.fullName}
              </h2>
              <p className="text-sm sm:text-lg text-gray-600 mb-2">
                Personal Trainer - {profile.trainerInfo?.specialty || 'Chuyên gia Fitness'}
              </p>
              <div className="flex justify-center sm:justify-start">
                <Badge className={getStatusColor(profile.status)}>
                  {getStatusText(profile.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-8 mt-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats?.totalMembers || 0}</div>
                  <div className="text-sm sm:text-sm text-gray-500">Hội viên</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats?.averageRating || 0}</div>
                  <div className="text-sm sm:text-sm text-gray-500">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {profile.trainerInfo?.experience_years || 0}
                  </div>
                  <div className="text-sm sm:text-sm text-gray-500">Năm KN</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <CardTitle className="flex items-center text-lg sm:text-lg">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  Thông tin cá nhân
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEdit('personal')}
                  className={`text-sm w-full sm:w-auto ${editingSections.personal ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                  disabled={editingSections.professional}
                >
                  {editingSections.personal ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Hủy
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm sm:text-sm font-medium text-gray-700">Họ và tên:</label>
                  {editingSections.personal ? (
                    <Input 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{profile.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm sm:text-sm font-medium text-gray-700">Email:</label>
                  <p className="text-gray-900 font-medium text-sm sm:text-base">{profile.email}</p>
                  <p className="text-sm sm:text-xs text-gray-500">Email không thể thay đổi</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại:</label>
                  {editingSections.personal ? (
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{profile.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ngày sinh:</label>
                  {editingSections.personal ? (
                    <Input 
                      type="date"
                      value={formData.dateOfBirth} 
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      {profile.dateOfBirth 
                        ? format(new Date(profile.dateOfBirth), 'dd/MM/yyyy', { locale: vi })
                        : 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                  {editingSections.personal ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{getGenderText(profile.gender)}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CCCD:</label>
                  {editingSections.personal ? (
                    <Input 
                      value={formData.cccd} 
                      onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                      placeholder="12 chữ số"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">{profile.cccd || 'Chưa cập nhật'}</p>
                  )}
                </div>
              </div>
              {editingSections.personal && (
                <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                  <Button variant="outline" onClick={() => toggleEdit('personal')} className="text-sm w-full sm:w-auto">
                    Hủy
                  </Button>
                  <Button onClick={() => handleSave('personal')} disabled={updateMutation.isPending} className="text-sm w-full sm:w-auto">
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <CardTitle className="flex items-center text-lg sm:text-lg">
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg mr-2 sm:mr-3">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  Thông tin nghề nghiệp
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEdit('professional')}
                  className={`text-sm w-full sm:w-auto ${editingSections.professional ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                  disabled={editingSections.personal}
                >
                  {editingSections.professional ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Hủy
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Chuyên môn:</label>
                  {editingSections.professional ? (
                    <Input 
                      value={formData.specialty} 
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      placeholder="Ví dụ: Fitness, Yoga, Boxing"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      {profile.trainerInfo?.specialty || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Kinh nghiệm:</label>
                  {editingSections.professional ? (
                    <Input 
                      type="number"
                      value={formData.experience_years} 
                      onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                      placeholder="Số năm"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm sm:text-base">
                      {profile.trainerInfo?.experience_years || 0} năm
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ngày tham gia:</label>
                  <p className="text-gray-900 font-medium text-sm sm:text-base">
                    {format(new Date(profile.joinDate), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                  <Badge className={getStatusColor(profile.status)}>
                    {getStatusText(profile.status)}
                  </Badge>
                </div>
              </div>
              {editingSections.professional && (
                <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                  <Button variant="outline" onClick={() => toggleEdit('professional')} className="text-sm w-full sm:w-auto">
                    Hủy
                  </Button>
                  <Button onClick={() => handleSave('professional')} disabled={updateMutation.isPending} className="text-sm w-full sm:w-auto">
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <CardTitle className="flex items-center text-lg sm:text-lg">
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mr-2 sm:mr-3">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  Chứng chỉ & Bằng cấp
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddCertModal(true)}
                  className="text-sm w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {profile.trainerInfo?.certificate && profile.trainerInfo.certificate.length > 0 ? (
                <div className="space-y-3">
                  {profile.trainerInfo.certificate.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 group">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                          <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{cert}</h4>
                          <p className="text-sm sm:text-sm text-gray-600">Chứng chỉ nghề nghiệp</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteConfirm(idx, cert)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Xóa chứng chỉ"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có chứng chỉ nào</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddCertModal(true)}
                    className="mt-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chứng chỉ đầu tiên
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Working Hours */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-lg sm:text-lg">
                <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg mr-2 sm:mr-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                Lịch làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {profile.trainerInfo?.working_hour && profile.trainerInfo.working_hour.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {profile.trainerInfo.working_hour.map((slot, index) => (
                    <div key={index} className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                      <Badge className="bg-orange-100 text-orange-800 text-sm sm:text-sm">
                        {slot}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">Chưa thiết lập lịch làm việc</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-lg sm:text-lg">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg mr-2 sm:mr-3">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
                Thành tích
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {stats?.achievements && stats.achievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {stats.achievements.map((achievement) => (
                    <div key={achievement.id} className="text-center p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        {getIcon(achievement.icon)}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-sm">{achievement.title}</h4>
                      <p className="text-xs sm:text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm sm:text-base">Chưa có thành tích nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Certificate Modal */}
      <AddCertificateModal
        isOpen={showAddCertModal}
        onClose={() => setShowAddCertModal(false)}
        onAdd={handleAddCertificate}
        existingCertificates={profile?.trainerInfo?.certificate || []}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, index: null, certificateName: '' })}
        onConfirm={handleRemoveCertificate}
        title="Xác nhận gỡ chứng chỉ"
        message={`Bạn có chắc chắn muốn gỡ chứng chỉ "${confirmDelete.certificateName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa chứng chỉ"
        cancelText="Hủy"
        variant="danger"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
