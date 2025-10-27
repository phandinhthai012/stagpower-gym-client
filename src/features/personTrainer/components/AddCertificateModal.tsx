import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { X, Award, Plus } from 'lucide-react';

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (certificate: string) => void;
  existingCertificates: string[];
}

export function AddCertificateModal({ 
  isOpen, 
  onClose, 
  onAdd,
  existingCertificates 
}: AddCertificateModalProps) {
  const [certificateName, setCertificateName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateName.trim()) {
      return;
    }

    onAdd(certificateName.trim());
    setCertificateName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Thêm Chứng Chỉ / Bằng Cấp
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên chứng chỉ / Bằng cấp <span className="text-red-500">*</span>
              </label>
              <Input
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="Ví dụ: Chứng chỉ PT Quốc tế, RYT 200 Yoga..."
                className="w-full"
                autoFocus
              />
              <p className="text-xs text-gray-500">
                Nhập tên đầy đủ của chứng chỉ hoặc bằng cấp
              </p>
            </div>

            {/* Current certificates preview */}
            {existingCertificates.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Chứng chỉ hiện có ({existingCertificates.length}):
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                  {existingCertificates.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!certificateName.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm chứng chỉ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

