import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';

import { useAdminCheckIn } from '../../hooks/useAdminCheckIn';
import { useBranches } from '../../hooks/useBranches';
import { useMembersWithActiveSubscriptions } from '../../hooks/useMember';
import { useScrollLock } from '../../../../hooks/useScrollLock';
import { CheckInResultModal, CheckInResultData } from './CheckInResultModal';
interface ModalManualCheckInProps {
    isOpen: boolean;
    onClose: () => void;
    defaultBranchId?: string | null; // For backward compatibility
    selectedBranchId?: string; // Shared branch selection from parent
    embedded?: boolean; // If true, render without overlay
}

export function ModalManualCheckIn({ isOpen, onClose, defaultBranchId, selectedBranchId: propSelectedBranchId, embedded = false }: ModalManualCheckInProps) {
    // Lock scroll when modal is open (only if not embedded)
    useScrollLock(isOpen && !embedded, {
        preserveScrollPosition: true
    });

    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [internalBranchId, setInternalBranchId] = useState('');
    const [notes, setNotes] = useState('');
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
    const [validationMessage, setValidationMessage] = useState('');
    const [memberSearchTerm, setMemberSearchTerm] = useState('');

    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [checkInResult, setCheckInResult] = useState<CheckInResultData | null>(null);

    const { adminCheckIn, isCheckingIn } = useAdminCheckIn();
    const { data: branchesData } = useBranches();
    const { data: membersWithActiveSubscriptionsData } = useMembersWithActiveSubscriptions();

    const branches = branchesData || [];
    const membersWithActiveSubscriptions = membersWithActiveSubscriptionsData || [];

    // Use propSelectedBranchId if provided (shared selection), otherwise use internal state
    const selectedBranchId = propSelectedBranchId || internalBranchId;

    // Auto-select branch when modal opens and defaultBranchId is provided (for backward compatibility)
    useEffect(() => {
        if (isOpen && defaultBranchId && !propSelectedBranchId) {
            setInternalBranchId(defaultBranchId);
        }
    }, [isOpen, defaultBranchId, propSelectedBranchId]);

    // Sync internal state with prop when prop changes
    useEffect(() => {
        if (propSelectedBranchId) {
            setInternalBranchId(propSelectedBranchId);
        }
    }, [propSelectedBranchId]);

    // Handle branch change (only if not using shared selection)
    const handleBranchChange = (value: string) => {
        if (!propSelectedBranchId) {
            setInternalBranchId(value);
        }
    };

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

    const findBranchById = (branchId: string | { _id?: string }) => {
        const id = typeof branchId === 'string' ? branchId : branchId?._id;
        if (!id) return undefined;
        return branches?.find(b => b._id === id);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await adminCheckIn({
                memberId: selectedMember._id,
                branchId: selectedBranchId,
                notes
            });
            const checkInData = response?.data || null;
            const branch = checkInData?.branchId
                ? findBranchById(checkInData.branchId) || (typeof checkInData.branchId === 'object' ? checkInData.branchId : undefined)
                : undefined;
            setCheckInResult({
                success: true,
                message: response?.message || 'Check-in thành công!',
                member: {
                    _id: selectedMember._id,
                    fullName: selectedMember.fullName || '',
                    email: selectedMember.email,
                    phone: selectedMember.phone
                },
                branch: branch,
                checkInTime: checkInData?.checkInTime || undefined,
                error: undefined
            });
            setResultModalOpen(true);
            setCheckInStatus('success');
            setValidationMessage('Check-in thành công!');
            setSelectedMember(null);
            setNotes('');
            setMemberSearchTerm('');
            // console.log("response", response);
            // onClose();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Lỗi khi check-in';
            
            // Set error result
            const branch = branches.find(b => b._id === selectedBranchId);
            setCheckInResult({
                success: false,
                message: 'Check-in thất bại',
                error: errorMessage,
                member: {
                    _id: selectedMember._id,
                    fullName: selectedMember.fullName || '',
                    email: selectedMember.email,
                    phone: selectedMember.phone
                },
                branch: branch ? {
                    _id: branch._id,
                    name: branch.name,
                    address: branch.address
                } : undefined
            });
            setResultModalOpen(true);
            setCheckInStatus('error');
            setValidationMessage(errorMessage);
        } finally {
            // setCheckInStatus('idle');
            // setValidationMessage('');
            // setSelectedMember(null);
            // // Don't reset selectedBranchId, keep it for next time
            // setNotes('');
            // setMemberSearchTerm('');
        }
    };

    const handleClose = () => {
        setSelectedMember(null);
        // Don't reset selectedBranchId, let it be managed by prop or internal state
        setNotes('');
        setCheckInStatus('idle');
        setValidationMessage('');
        setMemberSearchTerm('');
        onClose();
    };

    if (!isOpen) return null;

    if (embedded) {
        return (
            <>
            <div className="w-full flex flex-col h-full">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {/* Member Selection with Autocomplete */}
                    <div className="space-y-2 relative">
                        <Label htmlFor="member-search">Tìm kiếm Hội Viên</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                            <Input
                                id="member-search"
                                placeholder="Tìm theo tên, email, số điện thoại..."
                                value={memberSearchTerm}
                                onChange={(e) => setMemberSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {/* Autocomplete Results - Show when typing */}
                        {memberSearchTerm && filteredMembers.length > 0 && (
                            <div className="border rounded-lg max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white shadow-lg absolute z-20 w-full mt-1">
                                {filteredMembers.map((member) => (
                                    <div
                                        key={member._id}
                                        onClick={() => {
                                            setSelectedMember(member);
                                            setMemberSearchTerm('');
                                        }}
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
                            <div className="text-sm text-gray-500 p-2">Không tìm thấy hội viên</div>
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
            <CheckInResultModal
                isOpen={resultModalOpen}
                onClose={() => setResultModalOpen(false)}
                result={checkInResult}
            />
            </>
        );
    }

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
                    {/* Branch Selection - Only show if not using shared selection */}
                    {!propSelectedBranchId && (
                        <div className="space-y-2">
                            <Label htmlFor="branch">Chọn Chi Nhánh *</Label>
                            <Select value={selectedBranchId} onValueChange={handleBranchChange}>
                                <SelectTrigger className="h-auto min-h-[2.5rem] [&>span]:line-clamp-none">
                                    <SelectValue placeholder="Chọn chi nhánh..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {branches.filter((branch) => branch.status === 'Active').map((branch) => (
                                        <SelectItem key={branch._id} value={branch._id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{branch.name}</span>
                                                <span className="text-sm text-gray-500">•</span>
                                                <span className="text-sm text-gray-500">{branch.address}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Member Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="member-search">Tìm kiếm Hội Viên</Label>
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
            <CheckInResultModal
                isOpen={resultModalOpen}
                onClose={() => setResultModalOpen(false)}
                result={checkInResult}
            />
        </div>
    )
}