// ModalEditPackage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { usePackageById, useUpdatePackage } from '../../hooks/usePackages';
import { useToast } from '../../../../hooks/useToast';
import {
    X,
    Package,
    DollarSign,
    Calendar,
    Users,
    Dumbbell,
    Building2,
    FileText,
    Save
} from 'lucide-react';
// Debounce utility
const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};


interface ModalEditPackageProps {
    isOpen: boolean;
    onClose: () => void;
    packageId: string | null;
    onSuccess?: () => void;
}

export function ModalEditPackage({ isOpen, onClose, packageId, onSuccess }: ModalEditPackageProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        packageCategory: '',
        durationMonths: '',
        membershipType: '',
        price: '',
        ptSessions: '',
        ptSessionDuration: '',
        branchAccess: '',
        isTrial: false,
        maxTrialDays: '',
        description: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    // ✅ Fetch package data
    const { data: response, isLoading } = usePackageById(packageId, {
        enabled: isOpen && !!packageId
    });

    const updatePackageMutation = useUpdatePackage();
    // ✅ Populate form when data loads
    useEffect(() => {
        if ((response as any)?.success && (response as any).data) {
            const pkg = (response as any).data;
            setFormData({
                name: pkg.name || '',
                type: pkg.type || '',
                packageCategory: pkg.packageCategory || '',
                durationMonths: pkg.durationMonths?.toString() || '',
                membershipType: pkg.membershipType || '',
                price: pkg.price?.toString() || '',
                ptSessions: pkg.ptSessions?.toString() || '',
                ptSessionDuration: pkg.ptSessionDuration?.toString() || '',
                branchAccess: pkg.branchAccess || '',
                isTrial: pkg.isTrial || false,
                maxTrialDays: pkg.maxTrialDays?.toString() || '',
                description: pkg.description || ''
            });
        }
    }, [(response as any)?.success, (response as any)?.data]);

    useScrollLock(isOpen, { preserveScrollPosition: true });

    const handleInputChange = useCallback((field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Xóa lỗi ngay lập tức để UI phản hồi nhanh
        setErrors(prev => {
            if (prev[field]) {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            }
            return prev;
        });
    }, []);



    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Tên gói tập là bắt buộc';
        if (!formData.type) newErrors.type = 'Loại gói là bắt buộc';
        if (!formData.packageCategory) newErrors.packageCategory = 'Phân loại là bắt buộc';
        if (!formData.durationMonths) newErrors.durationMonths = 'Thời hạn là bắt buộc';
        if (!formData.price) newErrors.price = 'Giá là bắt buộc';
        if (!formData.description.trim()) newErrors.description = 'Mô tả là bắt buộc';

        // Conditional validations
        if ((formData.type === 'Membership' || formData.type === 'Combo') && !formData.membershipType) {
            newErrors.membershipType = 'Loại membership là bắt buộc';
        }

        if ((formData.type === 'PT' || formData.type === 'Combo') && !formData.ptSessions) {
            newErrors.ptSessions = 'Số buổi PT là bắt buộc';
        }

        if (formData.isTrial && !formData.maxTrialDays) {
            newErrors.maxTrialDays = 'Số ngày thử là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const submitData: any = {
            name: formData.name,
            type: formData.type,
            packageCategory: formData.packageCategory,
            durationMonths: parseInt(formData.durationMonths),
            price: parseInt(formData.price),
            branchAccess: formData.branchAccess,
            isTrial: formData.isTrial,
            description: formData.description
        };
        if (formData.type === 'Membership' || formData.type === 'Combo') {
            submitData.membershipType = formData.membershipType;
        }
        if (formData.type === 'PT' || formData.type === 'Combo') {
            submitData.ptSessions = parseInt(formData.ptSessions);
            submitData.ptSessionDuration = parseInt(formData.ptSessionDuration);
        }
        if (formData.isTrial) {
            submitData.maxTrialDays = parseInt(formData.maxTrialDays);
        }
        try {
            await updatePackageMutation.mutateAsync({
                packageId: packageId as string,
                data: submitData
            });

            onSuccess?.();
            onClose();
            toast.success('Cập nhật gói tập thành công');
        } catch (error) {
            console.error('Error updating package:', error);
            toast.error('Cập nhật gói tập thất bại');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, onSuccess, onClose]);

    if (!isOpen || !packageId) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="relative bg-white rounded-lg p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Chỉnh sửa gói tập
                            </h2>
                            <p className="text-sm text-gray-500">Cập nhật thông tin gói tập</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <span>Thông tin cơ bản</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Tên gói tập *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder="Nhập tên gói tập"
                                    />
                                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="type">Loại gói *</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                        <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn loại gói" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Membership">Membership</SelectItem>
                                            <SelectItem value="Combo">Combo</SelectItem>
                                            <SelectItem value="PT">PT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="packageCategory">Phân loại *</Label>
                                    <Select value={formData.packageCategory} onValueChange={(value) => handleInputChange('packageCategory', value)}>
                                        <SelectTrigger className={errors.packageCategory ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn phân loại" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ShortTerm">Ngắn hạn</SelectItem>
                                            <SelectItem value="MediumTerm">Trung hạn</SelectItem>
                                            <SelectItem value="LongTerm">Dài hạn</SelectItem>
                                            <SelectItem value="Trial">Gói thử</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.packageCategory && <p className="text-sm text-red-500 mt-1">{errors.packageCategory}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="durationMonths">Thời hạn (tháng) *</Label>
                                    <Input
                                        id="durationMonths"
                                        type="number"
                                        value={formData.durationMonths}
                                        onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                                        className={errors.durationMonths ? 'border-red-500' : ''}
                                        placeholder="Nhập số tháng"
                                        min="1"
                                    />
                                    {errors.durationMonths && <p className="text-sm text-red-500 mt-1">{errors.durationMonths}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Mô tả *</Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                    rows={3}
                                    placeholder="Mô tả chi tiết về gói tập..."
                                />
                                {/* <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className={errors.description ? 'border-red-500' : ''}
                                    placeholder="Nhập mô tả gói tập"
                                    rows={3}
                                /> */}
                                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span>Giá cả</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Giá gói (VND) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        className={errors.price ? 'border-red-500' : ''}
                                        placeholder="Nhập giá gói"
                                        min="0"
                                    />
                                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="branchAccess">Quyền truy cập</Label>
                                    <Select value={formData.branchAccess} onValueChange={(value) => handleInputChange('branchAccess', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn quyền truy cập" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Chi nhánh đơn</SelectItem>
                                            <SelectItem value="All">Tất cả chi nhánh</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Membership Type (for Membership/Combo) */}
                    {(formData.type === 'Membership' || formData.type === 'Combo') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    <span>Loại Membership</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="membershipType">Loại Membership *</Label>
                                    <Select value={formData.membershipType} onValueChange={(value) => handleInputChange('membershipType', value)}>
                                        <SelectTrigger className={errors.membershipType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Chọn loại membership" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Basic">Basic</SelectItem>
                                            <SelectItem value="VIP">VIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.membershipType && <p className="text-sm text-red-500 mt-1">{errors.membershipType}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* PT Sessions (for PT/Combo) */}
                    {(formData.type === 'PT' || formData.type === 'Combo') && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Dumbbell className="w-5 h-5 text-orange-600" />
                                    <span>Buổi tập PT</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="ptSessions">Số buổi PT *</Label>
                                        <Input
                                            id="ptSessions"
                                            type="number"
                                            value={formData.ptSessions}
                                            onChange={(e) => handleInputChange('ptSessions', e.target.value)}
                                            className={errors.ptSessions ? 'border-red-500' : ''}
                                            placeholder="Nhập số buổi PT"
                                            min="0"
                                        />
                                        {errors.ptSessions && <p className="text-sm text-red-500 mt-1">{errors.ptSessions}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="ptSessionDuration">Thời gian/buổi (phút)</Label>
                                        <Input
                                            id="ptSessionDuration"
                                            type="number"
                                            value={formData.ptSessionDuration}
                                            onChange={(e) => handleInputChange('ptSessionDuration', e.target.value)}
                                            placeholder="Nhập thời gian buổi tập"
                                            min="30"
                                            max="150"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Trial Package */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                                <span>Gói thử</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isTrial"
                                    checked={formData.isTrial}
                                    onChange={(e) => handleInputChange('isTrial', e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="isTrial">Đây là gói thử</Label>
                            </div>

                            {formData.isTrial && (
                                <div>
                                    <Label htmlFor="maxTrialDays">Số ngày thử tối đa *</Label>
                                    <Input
                                        id="maxTrialDays"
                                        type="number"
                                        value={formData.maxTrialDays}
                                        onChange={(e) => handleInputChange('maxTrialDays', e.target.value)}
                                        className={errors.maxTrialDays ? 'border-red-500' : ''}
                                        placeholder="Nhập số ngày thử (1-7)"
                                        min="1"
                                        max="7"
                                    />
                                    {errors.maxTrialDays && <p className="text-sm text-red-500 mt-1">{errors.maxTrialDays}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex items-center space-x-2">
                            <Save className="w-4 h-4" />
                            <span>{isSubmitting || updatePackageMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật gói tập'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}