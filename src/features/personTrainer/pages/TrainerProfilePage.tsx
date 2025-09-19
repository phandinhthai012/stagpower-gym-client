import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
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
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface ProfileData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
  };
  professionalInfo: {
    specialties: string;
    experience: string;
    salary: string;
    status: string;
  };
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    icon: string;
  }>;
  workingHours: Array<{
    day: string;
    slots: string[];
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

const mockProfileData: ProfileData = {
  personalInfo: {
    fullName: 'Nguyễn Văn PT',
    email: 'pt.nguyen@stagpower.com',
    phone: '0123456789',
    birthDate: '15/03/1990',
    gender: 'Nam',
    address: 'TP. Hồ Chí Minh'
  },
  professionalInfo: {
    specialties: 'Fitness, Yoga, Boxing',
    experience: '5 năm',
    salary: '15.000.000 VNĐ/tháng',
    status: 'Đang hoạt động'
  },
  certifications: [
    {
      id: '1',
      title: 'Chứng chỉ PT Quốc tế',
      issuer: 'ACSM - American College of Sports Medicine',
      icon: 'medal'
    },
    {
      id: '2',
      title: 'Chứng chỉ Yoga',
      issuer: 'RYT 200 - Yoga Alliance',
      icon: 'certificate'
    },
    {
      id: '3',
      title: 'Chứng chỉ Boxing',
      issuer: 'WBC - World Boxing Council',
      icon: 'trophy'
    }
  ],
  workingHours: [
    { day: 'Thứ 2', slots: ['06:00-10:00', '14:00-18:00', '19:00-22:00'] },
    { day: 'Thứ 3', slots: ['06:00-10:00', '14:00-18:00', '19:00-22:00'] },
    { day: 'Thứ 4', slots: ['06:00-10:00', '14:00-18:00', '19:00-22:00'] },
    { day: 'Thứ 5', slots: ['06:00-10:00', '14:00-18:00', '19:00-22:00'] },
    { day: 'Thứ 6', slots: ['06:00-10:00', '14:00-18:00', '19:00-22:00'] },
    { day: 'Thứ 7', slots: ['08:00-12:00', '14:00-18:00'] },
    { day: 'Chủ nhật', slots: ['Nghỉ'] }
  ],
  achievements: [
    {
      id: '1',
      title: 'PT xuất sắc',
      description: 'Tháng 12/2024',
      icon: 'star'
    },
    {
      id: '2',
      title: '100+ hội viên',
      description: 'Đã đào tạo',
      icon: 'users'
    },
    {
      id: '3',
      title: '4.8/5 sao',
      description: 'Đánh giá trung bình',
      icon: 'heart'
    },
    {
      id: '4',
      title: '5 năm',
      description: 'Kinh nghiệm',
      icon: 'calendar-check'
    }
  ]
};

export function TrainerProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData);
  const [editingSections, setEditingSections] = useState<{
    personal: boolean;
    professional: boolean;
    schedule: boolean;
  }>({
    personal: false,
    professional: false,
    schedule: false
  });

  const toggleEdit = (section: keyof typeof editingSections) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông Tin Cá Nhân</h1>
      
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-2xl">
                {user?.fullName?.charAt(0) || 'P'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {profileData.personalInfo.fullName}
              </h2>
              <p className="text-lg text-gray-600 mb-4">Personal Trainer - Chuyên gia Fitness</p>
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-500">Hội viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">4.8</div>
                  <div className="text-sm text-gray-500">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-500">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Thông tin cá nhân
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEdit('personal')}
                  className={editingSections.personal ? 'bg-red-50 text-red-600 border-red-200' : ''}
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
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Họ và tên:</label>
                  {editingSections.personal ? (
                    <Input value={profileData.personalInfo.fullName} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.personalInfo.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email:</label>
                  {editingSections.personal ? (
                    <Input value={profileData.personalInfo.email} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.personalInfo.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại:</label>
                  {editingSections.personal ? (
                    <Input value={profileData.personalInfo.phone} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.personalInfo.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ngày sinh:</label>
                  {editingSections.personal ? (
                    <Input value={profileData.personalInfo.birthDate} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.personalInfo.birthDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Giới tính:</label>
                  {editingSections.personal ? (
                    <Input value={profileData.personalInfo.gender} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.personalInfo.gender}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Địa chỉ:</label>
                  {editingSections.personal ? (
                    <Input value={profileData.personalInfo.address} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.personalInfo.address}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  Thông tin nghề nghiệp
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEdit('professional')}
                  className={editingSections.professional ? 'bg-red-50 text-red-600 border-red-200' : ''}
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
                    <Input value={profileData.professionalInfo.specialties} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.professionalInfo.specialties}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Kinh nghiệm:</label>
                  {editingSections.professional ? (
                    <Input value={profileData.professionalInfo.experience} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.professionalInfo.experience}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mức lương:</label>
                  {editingSections.professional ? (
                    <Input value={profileData.professionalInfo.salary} />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.professionalInfo.salary}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                  {editingSections.professional ? (
                    <Input value={profileData.professionalInfo.status} />
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      {profileData.professionalInfo.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  Chứng chỉ & Bằng cấp
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      {getIcon(cert.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Working Hours */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center text-lg">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  Lịch làm việc
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEdit('schedule')}
                  className={editingSections.schedule ? 'bg-red-50 text-red-600 border-red-200' : ''}
                >
                  {editingSections.schedule ? (
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
              <div className="space-y-3">
                {profileData.workingHours.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{day.day}</div>
                    <div className="flex flex-wrap gap-1">
                      {day.slots.map((slot, slotIndex) => (
                        <Badge
                          key={slotIndex}
                          variant={slot === 'Nghỉ' ? 'secondary' : 'default'}
                          className={slot === 'Nghỉ' ? 'bg-gray-200 text-gray-600' : 'bg-orange-100 text-orange-800'}
                        >
                          {slot}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                Thành tích
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {profileData.achievements.map((achievement) => (
                  <div key={achievement.id} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      {getIcon(achievement.icon)}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6">
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      )}
    </div>
  );
}
