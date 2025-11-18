import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Plus, X } from 'lucide-react';
import { useScrollLock } from '../../../../hooks/useScrollLock';

interface ModalCreateBranchProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (branchData: any) => void;
}

interface ValidationErrors {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    openTime?: string;
    closeTime?: string;
}
export function ModalCreateBranch({ isOpen, onClose, onSubmit }: ModalCreateBranchProps) {
    // Lock scroll when modal is open
    useScrollLock(isOpen, {
        preserveScrollPosition: true
    });

    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        openTime: '',
        closeTime: '',
        status: 'Active' as 'Active' | 'Maintenance' | 'Closed'
    });
    const [errors, setErrors] = useState<ValidationErrors>({});

    const convertTo12Hour = (time24: string): string => {
        if (!time24) return '';

        const [hours, minutes] = time24.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';

        // Convert hour
        if (hour === 0) {
            hour = 12; // 00:00 -> 12:00 AM
        } else if (hour > 12) {
            hour = hour - 12; // 13:00 -> 1:00 PM
        }

        return `${hour}:${minutes} ${ampm}`;
    };

    const validateField = (fieldName: string, value: string): string | undefined => {
        switch (fieldName) {
            case 'name':
                if (!value || value.trim() === '') {
                    return 'Tên chi nhánh là bắt buộc';
                }
                if (value.length < 3) {
                    return 'Tên chi nhánh phải có ít nhất 3 ký tự';
                }
                if (value.length > 100) {
                    return 'Tên chi nhánh không được quá 100 ký tự';
                }
                break;

            case 'address':
                if (!value || value.trim() === '') {
                    return 'Địa chỉ là bắt buộc';
                }
                if (value.length > 200) {
                    return 'Địa chỉ không được quá 200 ký tự';
                }
                break;

            case 'phone': {
                if (!value || value.trim() === '') {
                    return 'Số điện thoại là bắt buộc';
                }
                const phoneRegex = /^(0|\+84|84)[0-9]{9}$/;
                if (!phoneRegex.test(value)) {
                    return 'Số điện thoại không hợp lệ (VD: 0123456789, +84123456789)';
                }
                break;
            }

            case 'email': {
                if (value && value.trim() !== '') {
                    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                    if (!emailRegex.test(value)) {
                        return 'Email không hợp lệ';
                    }
                }
                break;
            }

            // ✅ Bỏ validate required cho openTime và closeTime
            case 'openTime':
                // Không validate required nữa, sẽ dùng default
                break;

            case 'closeTime':
                // Không validate required nữa, sẽ dùng default
                break;
        }
        return undefined;
    };


    const validateBranchData = (branchData: any): { isValid: boolean; errors: ValidationErrors } => {
        const newErrors: ValidationErrors = {};

        // Validate tất cả các field bắt buộc
        const nameError = validateField('name', branchData.name);
        if (nameError) newErrors.name = nameError;

        const addressError = validateField('address', branchData.address);
        if (addressError) newErrors.address = addressError;

        const phoneError = validateField('phone', branchData.phone);
        if (phoneError) newErrors.phone = phoneError;

        const emailError = validateField('email', branchData.email);
        if (emailError) newErrors.email = emailError;

        // ✅ Validate logic: giờ đóng cửa phải sau giờ mở cửa (chỉ khi có cả 2)
        const openTime = branchData.openTime || '06:00';
        const closeTime = branchData.closeTime || '22:00';

        if (openTime && closeTime) {
            const [openHour, openMin] = openTime.split(':').map(Number);
            const [closeHour, closeMin] = closeTime.split(':').map(Number);

            const openMinutes = openHour * 60 + openMin;
            const closeMinutes = closeHour * 60 + closeMin;

            if (closeMinutes <= openMinutes) {
                newErrors.closeTime = 'Giờ đóng cửa phải sau giờ mở cửa';
            }
        }

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors
        };
    };

    const handleAddBranchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Áp dụng default values cho time nếu không có
        const branchDataWithDefaults = {
            ...newBranch,
            openTime: newBranch.openTime || '06:00',  // Mặc định 6h sáng
            closeTime: newBranch.closeTime || '22:00'  // Mặc định 10h tối
        };

        // Validate toàn bộ form
        const validation = validateBranchData(branchDataWithDefaults);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Convert time format trước khi gửi
        const branchDataToSubmit = {
            ...branchDataWithDefaults,
            openTime: convertTo12Hour(branchDataWithDefaults.openTime),
            closeTime: convertTo12Hour(branchDataWithDefaults.closeTime)
        };
        // Gọi callback onSubmit
        if (onSubmit) {
            onSubmit(branchDataToSubmit);
        }

        // Reset form và đóng modal
        setNewBranch({
            name: '',
            address: '',
            phone: '',
            email: '',
            openTime: '',
            closeTime: '',
            status: 'Active'
        });
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        // Reset form khi đóng
        setNewBranch({
            name: '',
            address: '',
            phone: '',
            email: '',
            openTime: '',
            closeTime: '',
            status: 'Active'
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Thêm Chi Nhánh Mới</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddBranchSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branchName">Tên chi nhánh <span className="text-red-500">*</span></Label>
                                <Input
                                    id="branchName"
                                    value={newBranch.name}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nhập tên chi nhánh..."
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="branchStatus">Trạng thái</Label>
                                <Select
                                    value={newBranch.status}
                                    onValueChange={(value) => setNewBranch(prev => ({ ...prev, status: value as 'Active' | 'Maintenance' | 'Closed' }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Đang hoạt động</SelectItem>
                                        <SelectItem value="Maintenance">Bảo trì</SelectItem>
                                        <SelectItem value="Closed">Tạm dừng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="branchAddress">Địa chỉ <span className="text-red-500">*</span></Label>
                            <Input
                                id="branchAddress"
                                value={newBranch.address}
                                onChange={(e) => setNewBranch(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Nhập địa chỉ chi nhánh..."
                                required
                            />
                            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branchPhone">Số điện thoại <span className="text-red-500">*</span></Label>
                                <Input
                                    id="branchPhone"
                                    value={newBranch.phone}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="VD: 0123456789"
                                    required
                                />
                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <Label htmlFor="branchEmail">Email</Label>
                                <Input
                                    id="branchEmail"
                                    type="email"
                                    value={newBranch.email}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Nhập email..."
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branchOpenTime">
                                    Giờ mở cửa
                                    {newBranch.openTime && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({convertTo12Hour(newBranch.openTime)})
                                        </span>
                                    )}
                                    {!newBranch.openTime && (
                                        <span className="text-xs text-gray-400 ml-2">
                                            (Mặc định: 6:00 AM)
                                        </span>
                                    )}
                                </Label>
                                <Input
                                    id="branchOpenTime"
                                    type="time"
                                    value={newBranch.openTime}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, openTime: e.target.value }))}
                                    placeholder="VD: 06:00"
                                />
                                {errors.openTime && <p className="text-xs text-red-500">{errors.openTime}</p>}
                            </div>
                            <div>
                                <Label htmlFor="branchCloseTime">
                                    Giờ đóng cửa
                                    {newBranch.closeTime && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({convertTo12Hour(newBranch.closeTime)})
                                        </span>
                                    )}
                                    {!newBranch.closeTime && (
                                        <span className="text-xs text-gray-400 ml-2">
                                            (Mặc định: 10:00 PM)
                                        </span>
                                    )}
                                </Label>
                                <Input
                                    id="branchCloseTime"
                                    type="time"
                                    value={newBranch.closeTime}
                                    onChange={(e) => setNewBranch(prev => ({ ...prev, closeTime: e.target.value }))}
                                    placeholder="VD: 23:00"
                                />
                                {errors.closeTime && <p className="text-xs text-red-500">{errors.closeTime}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm chi nhánh
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}