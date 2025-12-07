import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { useCreateDiscountType } from '../../hooks/useDiscountTypes';
import { CreateDiscountTypeData } from '../../types/discountType.types';
import { X, Tag } from 'lucide-react';

interface ModalCreateDiscountTypeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCreateDiscountType({ isOpen, onClose }: ModalCreateDiscountTypeProps) {
  const [formData, setFormData] = useState<CreateDiscountTypeData>({
    name: '',
    displayName: '',
    description: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createDiscountTypeMutation = useCreateDiscountType();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form when modal closes
      setFormData({
        name: '',
        displayName: '',
        description: '',
        status: 'Active',
      });
      setErrors({});
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: keyof CreateDiscountTypeData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên loại giảm giá là bắt buộc';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên loại giảm giá phải có ít nhất 2 ký tự';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Tên hiển thị là bắt buộc';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createDiscountTypeMutation.mutateAsync({
        name: formData.name.trim().toUpperCase(),
        displayName: formData.displayName.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status || 'Active',
      });
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tạo loại giảm giá mới
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: EARLY_BIRD, STUDENT, SENIOR"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500">
                Tên sẽ được tự động chuyển thành chữ hoa (VD: EARLY_BIRD)
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">
                Tên hiển thị <span className="text-red-500">*</span>
              </Label>
              <Input
                id="displayName"
                placeholder="VD: Early Bird, Học Sinh Sinh Viên"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về loại giảm giá này..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createDiscountTypeMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createDiscountTypeMutation.isPending}
              >
                {createDiscountTypeMutation.isPending ? 'Đang tạo...' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}