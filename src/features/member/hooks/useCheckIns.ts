import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import checkInService from '../services/checkIn.service';

export const useCheckIns = () => {
    return useQuery({
        queryKey: queryKeys.checkIns,
        queryFn: () => checkInService.getAllCheckIns(),
    });
}

export const useCheckInByMemberId = (memberId: string) => {
    return useQuery({
        queryKey: queryKeys.memberCheckIns(memberId),
        queryFn: () => checkInService.getCheckInByMemberId(memberId),
    });
}
