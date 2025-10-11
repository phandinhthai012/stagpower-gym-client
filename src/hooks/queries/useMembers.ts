import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '../../constants/queryKeys';
import { userApi } from '../../features/member/api/user.api';
import memberService from '../../services/member.service';


export const useMembers = () => {
    return useQuery({
        queryKey: queryKeys.members,
        queryFn: memberService.getAllMembers,
    });
}

