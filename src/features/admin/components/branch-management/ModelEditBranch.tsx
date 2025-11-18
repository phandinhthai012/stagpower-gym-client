import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Edit, X } from 'lucide-react';
import { Branch } from "../../api/branch.api";
import { useScrollLock } from '../../../../hooks/useScrollLock';

interface ModalEditBranchProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (branchData: any) => void;
    branchData: Branch;  // ← Branch hiện tại cần edit
}
interface ValidationErrors {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    openTime?: string;
    closeTime?: string;
    status?: string;
}

export const ModelEditBranch = ({ isOpen, branchData, onClose, onSubmit }: ModalEditBranchProps) => {
    // Lock scroll when modal is open
    useScrollLock(isOpen, {
        preserveScrollPosition: true
    });

    const [editBranch, setEditBranch] = useState<Branch>({
        _id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
        managerId: '',
        status: 'Active',
        openTime: '',
        closeTime: '',
        createdAt: '',
        updatedAt: ''
    });
    const [errors, setErrors] = useState<ValidationErrors>({});

    const convertTo24Hour = (time12: string): string => {
        if (!time12) return '';

        // Format: "6:00 AM" hoặc "10:00 PM"
        const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return '';

        let hour = parseInt(match[1], 10);
        const minute = match[2];
        const period = match[3].toUpperCase();

        // Convert to 24h
        if (period === 'AM') {
            if (hour === 12) hour = 0;  // 12:00 AM → 00:00
        } else {
            if (hour !== 12) hour += 12;  // 1:00 PM → 13:00
        }

        return `${hour.toString().padStart(2, '0')}:${minute}`;
    };
    useEffect(() => {
        if (isOpen && branchData) {
            // Đảm bảo status có giá trị hợp lệ
            // const validStatuses: ('Active' | 'Maintenance' | 'Closed')[] = ['Active', 'Maintenance', 'Closed'];
            // const status = validStatuses.includes(branchData.status as any) 
            //     ? branchData.status as 'Active' | 'Maintenance' | 'Closed'
            //     : 'Active';
            
            // console.log("✅ Final status:", status);
            
            const newEditBranch = {
                _id: branchData._id || '',
                managerId: branchData.managerId || '',
                createdAt: branchData.createdAt || '',
                updatedAt: branchData.updatedAt || '',
                name: branchData.name || '',
                address: branchData.address || '',
                phone: branchData.phone || '',
                email: branchData.email || '',
                openTime: convertTo24Hour(branchData.openTime || ''),
                closeTime: convertTo24Hour(branchData.closeTime || ''),
                status: branchData.status || 'Active'
            };
            setEditBranch(newEditBranch);
            setErrors({});
        } else {
            console.log("❌ useEffect conditions not met - isOpen:", isOpen, "branchData exists:", !!branchData);
        }
    }, [isOpen, branchData]);

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

            case 'openTime':
                break;

            case 'closeTime':
                break;
        }
        return undefined;
    };

    const validateBranchData = (branchData: any): { isValid: boolean; errors: ValidationErrors } => {
        const newErrors: ValidationErrors = {};

        const nameError = validateField('name', branchData.name);
        if (nameError) newErrors.name = nameError;

        const addressError = validateField('address', branchData.address);
        if (addressError) newErrors.address = addressError;

        const phoneError = validateField('phone', branchData.phone);
        if (phoneError) newErrors.phone = phoneError;

        const emailError = validateField('email', branchData.email);
        if (emailError) newErrors.email = emailError;

        // Validate logic: giờ đóng cửa phải sau giờ mở cửa
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



    const handleEditBranchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationResult = validateBranchData(editBranch);
        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            return;
        }
        const data = {
            _id: editBranch._id,
            name: editBranch.name,
            address: editBranch.address,
            phone: editBranch.phone,
            email: editBranch.email,
            openTime: convertTo12Hour(editBranch.openTime),
            closeTime: convertTo12Hour(editBranch.closeTime),
            status: editBranch.status,
        }
        console.log(data);
        onSubmit?.(data);
        handleClose();
    };

    const handleClose = () => {
        setErrors({});
        setEditBranch({
            _id: '',
            name: '',
            address: '',
            phone: '',
            email: '',
            managerId: '',
            status: 'Active' as 'Active' | 'Maintenance' | 'Closed',
            openTime: '',
            closeTime: '',
            createdAt: '',
            updatedAt: ''
        });
        onClose();
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Chỉnh Sửa Chi Nhánh</CardTitle>
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
                    <form onSubmit={handleEditBranchSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branchName">Tên chi nhánh <span className="text-red-500">*</span></Label>
                                <Input
                                    id="branchName"
                                    value={editBranch.name}
                                    onChange={(e) => setEditBranch(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nhập tên chi nhánh..."
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="branchStatus">Trạng thái</Label>
                                <Select
                                    key={`status-select-${editBranch.status}`}
                                    value={editBranch.status}
                                    onValueChange={(value) => {
                                        
                                        if (value && ['Active', 'Maintenance', 'Closed'].includes(value)) {
                                            setEditBranch(prev => ({ ...prev, status: value as 'Active' | 'Maintenance' | 'Closed' }));
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active" onClick={() => console.log("🎯 Active clicked")}>Hoạt động</SelectItem>
                                        <SelectItem value="Maintenance" onClick={() => console.log("🎯 Maintenance clicked")}>Bảo trì</SelectItem>
                                        <SelectItem value="Closed" onClick={() => console.log("🎯 Closed clicked")}>Đóng cửa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="branchAddress">Địa chỉ <span className="text-red-500">*</span></Label>
                            <Input
                                id="branchAddress"
                                value={editBranch.address}
                                onChange={(e) => setEditBranch(prev => ({ ...prev, address: e.target.value }))}
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
                                    value={editBranch.phone}
                                    onChange={(e) => setEditBranch(prev => ({ ...prev, phone: e.target.value }))}
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
                                    value={editBranch.email}
                                    onChange={(e) => setEditBranch(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Nhập email..."
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branchOpenTime">
                                    Giờ mở cửa
                                    {/* {editBranch.openTime && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({convertTo24Hour(editBranch.openTime)})
                                        </span>
                                    )} */}
                                </Label>
                                <Input
                                    id="branchOpenTime"
                                    type="time"
                                    value={editBranch.openTime}
                                    onChange={(e) => setEditBranch(prev => ({ ...prev, openTime: e.target.value }))}
                                    placeholder="VD: 06:00"
                                />
                                {errors.openTime && <p className="text-xs text-red-500">{errors.openTime}</p>}
                            </div>
                            <div>
                                <Label htmlFor="branchCloseTime">
                                    Giờ đóng cửa
                                    {/* {editBranch.closeTime && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({convertTo24Hour(editBranch.closeTime)})
                                        </span>
                                    )} */}
                                </Label>
                                <Input
                                    id="branchCloseTime"
                                    type="time"
                                    value={editBranch.closeTime}
                                    onChange={(e) => setEditBranch(prev => ({ ...prev, closeTime: e.target.value }))}
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
                                <Edit className="w-4 h-4 mr-2" />
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

        </div>
    )
}