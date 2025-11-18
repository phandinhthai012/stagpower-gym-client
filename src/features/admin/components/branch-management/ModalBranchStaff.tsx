import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { X, Plus, Trash2, Users, Search, User, Phone, AtSign } from 'lucide-react';
import { Branch } from "../../api/branch.api";
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../../member/api/user.api';
import { LoadingSpinner } from '../../../../components/common';
import { toast } from 'sonner';
import { User as UserType } from '../../../member/api/user.api';

interface ModalBranchStaffProps {
    isOpen: boolean;
    onClose: () => void;
    branchData: Branch | null;
}

export const ModalBranchStaff = ({ isOpen, branchData, onClose }: ModalBranchStaffProps) => {
    // Lock scroll when modal is open
    useScrollLock(isOpen, {
        preserveScrollPosition: true
    });

    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaffId, setSelectedStaffId] = useState<string>('none');

    // Fetch staffs of this branch
    const { data: branchStaffs = [], isLoading: isLoadingBranchStaffs } = useQuery({
        queryKey: ['staffs', 'branch', branchData?._id],
        queryFn: () => userApi.getStaffsByBranchId(branchData!._id),
        enabled: isOpen && !!branchData?._id,
    });

    // Fetch staffs without branch
    const { data: availableStaffs = [], isLoading: isLoadingAvailableStaffs } = useQuery({
        queryKey: ['staffs', 'without-branch'],
        queryFn: userApi.getStaffsWithoutBranch,
        enabled: isOpen,
    });

    // Filter available staffs by search term
    const filteredAvailableStaffs = availableStaffs.filter((staff) =>
        staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mutation to assign staff to branch
    const assignStaffMutation = useMutation({
        mutationFn: async (staffId: string) => {
            const staff = availableStaffs.find(s => s._id === staffId);
            if (!staff) throw new Error('Staff not found');
            
            // Update staff's branchId
            return await userApi.updateUser(staffId, {
                'staffInfo.brand_id': branchData!._id,
                'staffInfo.position': staff.staffInfo?.position,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs', 'branch', branchData?._id] });
            queryClient.invalidateQueries({ queryKey: ['staffs', 'without-branch'] });
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            setSelectedStaffId('none');
            toast.success('Đã thêm nhân viên vào chi nhánh');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Không thể thêm nhân viên');
        },
    });

    // Mutation to remove staff from branch
    const removeStaffMutation = useMutation({
        mutationFn: async (staffId: string) => {
            const staff = branchStaffs.find(s => s._id === staffId);
            if (!staff) throw new Error('Staff not found');
            
            // Remove staff's branchId
            return await userApi.updateUser(staffId, {
                'staffInfo.brand_id': null,
                'staffInfo.position': staff.staffInfo?.position,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staffs', 'branch', branchData?._id] });
            queryClient.invalidateQueries({ queryKey: ['staffs', 'without-branch'] });
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            toast.success('Đã xóa nhân viên khỏi chi nhánh');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Không thể xóa nhân viên');
        },
    });

    const handleAddStaff = () => {
        if (selectedStaffId === 'none') {
            toast.error('Vui lòng chọn nhân viên');
            return;
        }
        assignStaffMutation.mutate(selectedStaffId);
    };

    const handleRemoveStaff = (staffId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này khỏi chi nhánh?')) {
            removeStaffMutation.mutate(staffId);
        }
    };

    const getPositionBadge = (position?: string) => {
        const positionMap: Record<string, { label: string; className: string }> = {
            'manager': { label: 'Quản lý', className: 'bg-purple-500 text-white' },
            'trainer': { label: 'Huấn luyện viên', className: 'bg-blue-500 text-white' },
            'staff': { label: 'Nhân viên', className: 'bg-green-500 text-white' },
            'receptionist': { label: 'Lễ tân', className: 'bg-orange-500 text-white' },
        };
        const pos = positionMap[position || ''];
        return pos ? (
            <Badge className={pos.className}>{pos.label}</Badge>
        ) : (
            <Badge>Chưa xác định</Badge>
        );
    };

    if (!isOpen || !branchData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-600" />
                            <CardTitle>Quản lý nhân viên - {branchData.name}</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Staff Section */}
                    <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Thêm nhân viên vào chi nhánh
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="searchStaff">Tìm kiếm nhân viên</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="searchStaff"
                                        placeholder="Tìm theo tên, email, số điện thoại..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="selectStaff">Chọn nhân viên</Label>
                                {isLoadingAvailableStaffs ? (
                                    <div className="flex items-center gap-2 p-2">
                                        <LoadingSpinner size="sm" />
                                        <span className="text-sm text-gray-500">Đang tải...</span>
                                    </div>
                                ) : (
                                    <Select
                                        value={selectedStaffId}
                                        onValueChange={setSelectedStaffId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn nhân viên" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Chọn nhân viên --</SelectItem>
                                            {filteredAvailableStaffs.map((staff) => (
                                                <SelectItem key={staff._id} value={staff._id}>
                                                    {staff.fullName} {staff.email ? `(${staff.email})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                        {filteredAvailableStaffs.length === 0 && !isLoadingAvailableStaffs && (
                            <p className="text-sm text-gray-500 text-center">
                                {searchTerm ? 'Không tìm thấy nhân viên phù hợp' : 'Không có nhân viên nào chưa được gán chi nhánh'}
                            </p>
                        )}
                        <Button
                            onClick={handleAddStaff}
                            disabled={selectedStaffId === 'none' || assignStaffMutation.isPending}
                            className="w-full"
                        >
                            {assignStaffMutation.isPending ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Đang thêm...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm nhân viên
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Current Staff List */}
                    <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Danh sách nhân viên ({branchStaffs.length})
                        </h3>
                        {isLoadingBranchStaffs ? (
                            <div className="flex justify-center items-center py-8">
                                <LoadingSpinner />
                            </div>
                        ) : branchStaffs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Chưa có nhân viên nào trong chi nhánh này</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {branchStaffs.map((staff) => (
                                    <div
                                        key={staff._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-semibold">{staff.fullName}</p>
                                                    {getPositionBadge(staff.staffInfo?.position)}
                                                    {staff.status === 'active' ? (
                                                        <Badge className="bg-green-500 text-white">Hoạt động</Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-500 text-white">Không hoạt động</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    {staff.email && (
                                                        <div className="flex items-center gap-1">
                                                            <AtSign className="w-3 h-3" />
                                                            <span>{staff.email}</span>
                                                        </div>
                                                    )}
                                                    {staff.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{staff.phone}</span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-400">
                                                        {staff.role === 'trainer' ? 'Huấn luyện viên' : 'Nhân viên'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleRemoveStaff(staff._id)}
                                            disabled={removeStaffMutation.isPending}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Xóa
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Đóng
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

