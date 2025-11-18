import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { X, MapPin, Phone, AtSign, Clock, User, Building2 } from 'lucide-react';
import { Branch } from "../../api/branch.api";
import { useScrollLock } from '../../../../hooks/useScrollLock';

interface ModalBranchDetailProps {
    isOpen: boolean;
    onClose: () => void;
    branchData: Branch | null;
    onEdit?: () => void;
}

export const ModalBranchDetail = ({ isOpen, branchData, onClose, onEdit }: ModalBranchDetailProps) => {
    // Lock scroll when modal is open
    useScrollLock(isOpen, {
        preserveScrollPosition: true
    });

    if (!isOpen || !branchData) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return <Badge className="bg-green-500 text-white">Đang hoạt động</Badge>;
            case 'Maintenance':
                return <Badge className="bg-yellow-500 text-white">Bảo trì</Badge>;
            case 'Closed':
                return <Badge className="bg-red-500 text-white">Đóng cửa</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const convertTo12Hour = (time24: string): string => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour = hour - 12;
        }
        return `${hour}:${minutes} ${ampm}`;
    };

    const admin = typeof branchData.adminId === 'object' ? branchData.adminId : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-blue-600" />
                            <CardTitle>Chi Tiết Chi Nhánh</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            {onEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onEdit}
                                >
                                    Chỉnh sửa
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                            {getStatusBadge(branchData.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tên chi nhánh</label>
                                <p className="text-base font-semibold mt-1">{branchData.name}</p>
                            </div>

                            <div className="flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                                    <p className="text-base mt-1">{branchData.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {branchData.phone && (
                                <div className="flex items-start gap-2">
                                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                                        <p className="text-base mt-1">{branchData.phone}</p>
                                    </div>
                                </div>
                            )}
                            {branchData.email && (
                                <div className="flex items-start gap-2">
                                    <AtSign className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-base mt-1">{branchData.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operating Hours */}
                    {(branchData.openTime || branchData.closeTime) && (
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="text-lg font-semibold">Giờ làm việc</h3>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <div className="flex items-center gap-2">
                                    <span className="text-base">
                                        {branchData.openTime ? convertTo12Hour(branchData.openTime) : 'N/A'}
                                    </span>
                                    <span className="text-gray-400">-</span>
                                    <span className="text-base">
                                        {branchData.closeTime ? convertTo12Hour(branchData.closeTime) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Information */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Quản lý</h3>
                        {admin ? (
                            <div className="flex items-start gap-2">
                                <User className="w-5 h-5 text-gray-400 mt-1" />
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-500">Admin quản lý</label>
                                    <p className="text-base font-semibold mt-1">{admin.fullName}</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-600">
                                            <AtSign className="w-4 h-4 inline mr-1" />
                                            {admin.email}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <Phone className="w-4 h-4 inline mr-1" />
                                            {admin.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                                <User className="w-5 h-5" />
                                <p className="text-base">Chưa có admin quản lý</p>
                            </div>
                        )}
                    </div>

                    {/* Timestamps */}
                    <div className="space-y-2 border-t pt-4 text-sm text-gray-500">
                        <p>Ngày tạo: {new Date(branchData.createdAt).toLocaleString('vi-VN')}</p>
                        <p>Cập nhật lần cuối: {new Date(branchData.updatedAt).toLocaleString('vi-VN')}</p>
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
                        {onEdit && (
                            <Button
                                type="button"
                                onClick={onEdit}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

