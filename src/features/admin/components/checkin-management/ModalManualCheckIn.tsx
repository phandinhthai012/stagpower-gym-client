import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';

import { useAdminCheckIn } from '../../hooks/useAdminCheckIn';
import { useBranches } from '../../hooks/useBranches';
import { useMembersWithActiveSubscriptions } from '../../hooks/useMember';

interface ModalManualCheckInProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ModalManualCheckIn({ isOpen, onClose }: ModalManualCheckInProps) {

    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [notes, setNotes] = useState('');
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
    const [validationMessage, setValidationMessage] = useState('');
    const [memberSearchTerm, setMemberSearchTerm] = useState('');

    const { adminCheckIn, isCheckingIn } = useAdminCheckIn();
    const { data: branchesData } = useBranches();
    const { data: membersWithActiveSubscriptionsData } = useMembersWithActiveSubscriptions();

    const branches = branchesData || [];
    const membersWithActiveSubscriptions = membersWithActiveSubscriptionsData || [];

    // Filter members based on search term
    const filteredMembers = useMemo(() => {
        if (!memberSearchTerm.trim()) {
            return membersWithActiveSubscriptions;
        }

        const searchLower = memberSearchTerm.toLowerCase();
        return membersWithActiveSubscriptions.filter((member) =>
            member.fullName.toLowerCase().includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower) ||
            member.phone?.includes(searchLower)
        );
    }, [membersWithActiveSubscriptions, memberSearchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await adminCheckIn({
                memberId: selectedMember._id,
                branchId: selectedBranchId,
                notes
            });
            console.log("response", response);
            onClose();
        } catch (error: any) {
            console.log(error);
            setValidationMessage(error?.response?.data?.message || 'Lỗi khi check-in');
            setCheckInStatus('error');
        }finally {
            setCheckInStatus('idle');
            setValidationMessage('');
            setSelectedMember(null);
            setSelectedBranchId('');
            setNotes('');
            setMemberSearchTerm('');
        }
    };

    const handleClose = () => {
        setSelectedMember('');
        setSelectedBranchId('');
        setNotes('');
        setCheckInStatus('idle');
        setValidationMessage('');
        setMemberSearchTerm('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Check-in Thủ Công
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {/* Member Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="member-search">Tìm kiếm Hội Viên</Label>
                        {/* <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn hội viên..." />
                            </SelectTrigger>
                            <SelectContent>
                                {membersWithActiveSubscriptions.map((member) => (
                                    <SelectItem key={member._id} value={member._id.toString()}>
                                        {member.fullName} - {member.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select> */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                id="member-search"
                                placeholder="Tìm theo tên, email, số điện thoại..."
                                value={memberSearchTerm}
                                onChange={(e) => setMemberSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {/* Member Selection */}
                        {memberSearchTerm && filteredMembers.length > 0 && (
                            <div className="border rounded-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {filteredMembers.map((member) => (
                                    <div
                                        key={member._id}
                                        onClick={() => setSelectedMember(member)}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-sm font-medium">
                                                    {member.fullName?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{member.fullName}</p>
                                                <p className="text-sm text-gray-500 truncate">{member.email}</p>
                                                <p className="text-xs text-gray-400 truncate">{member.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {memberSearchTerm && filteredMembers.length === 0 && (
                            <div className="text-sm text-gray-500">Không tìm thấy hội viên</div>
                        )}
                    </div>
                    {/* Selected Member Display */}
                    {selectedMember && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <Label htmlFor="selected-member" className="text-sm font-medium text-green-800">Hội Viên Đã Chọn</Label>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-medium">
                                        {selectedMember.fullName?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-green-900 truncate">{selectedMember.fullName}</p>
                                    <p className="text-sm text-green-700 truncate">{selectedMember.email}</p>
                                    <p className="text-xs text-green-600 truncate">{selectedMember.phone}</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMember(null)}
                                    className="flex-shrink-0"
                                >
                                    Thay đổi
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Branch Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="branch">Chọn Chi Nhánh</Label>
                        <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn chi nhánh..." />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.filter((branch) => branch.status === 'Active').map((branch) => (
                                    <SelectItem key={branch._id} value={branch._id.toString()}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi Chú (Tùy chọn)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Nhập ghi chú về việc check-in..."
                            rows={3}
                        />
                    </div>

                    {/* Status Message */}
                    {validationMessage && (
                        <div className={`flex items-center space-x-2 p-3 rounded-md ${checkInStatus === 'success' ? 'bg-green-50 text-green-700' :
                            checkInStatus === 'error' ? 'bg-red-50 text-red-700' :
                                checkInStatus === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                                    'bg-gray-50 text-gray-700'
                            }`}>
                            {checkInStatus === 'success' && <CheckCircle className="h-5 w-5" />}
                            {checkInStatus === 'error' && <XCircle className="h-5 w-5" />}
                            {checkInStatus === 'warning' && <AlertTriangle className="h-5 w-5" />}
                            <span className="text-sm">{validationMessage}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 h-10 sm:h-auto"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={!selectedMember || !selectedBranchId || isCheckingIn}
                            className="flex-1 h-10 sm:h-auto"
                        >
                            {isCheckingIn ? 'Đang xử lý...' : 'Check-in'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}