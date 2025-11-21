import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiSuggestionApi, ChatWithAIRequest,GenerateSuggestionRequest } from '../api/aiSuggestion.api';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

const queryKey = {
    MEMBER_SUGGESTIONS: (memberId: string) => ['member-suggestions', memberId],
    SUGGESTION_BY_ID: (id: string) => ['suggestion', id],
}

export const useAISuggestions = (memberId?: string) => {
    const { user } = useAuth();
    const actualMemberId = memberId || user?.id;

    return useQuery({
        queryKey: queryKey.MEMBER_SUGGESTIONS(actualMemberId!),
        queryFn: () => aiSuggestionApi.getAISuggestionsByMemberId(actualMemberId!),
        enabled: !!actualMemberId,
    });
};

export const useCreateAISuggestion = () => {
    const queryClient = useQueryClient();

    const chatWithAI = useMutation({
        mutationFn: async (data: ChatWithAIRequest) => {
            const response = await aiSuggestionApi.chatWithAI(data);
            return response;
        },
        onSuccess: (response) => {
            console.log('Chat with AI successful', response);
            // queryClient.invalidateQueries({ queryKey: queryKey.MEMBER_SUGGESTIONS() });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message);
        },
    });

    const createAISuggestionCompletion = useMutation({
        mutationFn: async (data: GenerateSuggestionRequest) => {
            const response = await aiSuggestionApi.generateCompleteSuggestion(data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: queryKey.MEMBER_SUGGESTIONS(response.memberId) });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message);
        },
    });

    const generateWorkoutSuggestion = useMutation({
        mutationFn: async (data: GenerateSuggestionRequest) => {
            const response = await aiSuggestionApi.generateWorkoutSuggestion(data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: queryKey.MEMBER_SUGGESTIONS(response.memberId) });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message);
        },
    });

    const generateNutritionSuggestion = useMutation({
        mutationFn: async (data: GenerateSuggestionRequest) => {
            const response = await aiSuggestionApi.generateNutritionSuggestion(data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: queryKey.MEMBER_SUGGESTIONS(response.memberId) });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message);
        },
    });


    return {
        chatWithAI: chatWithAI.mutateAsync,
        isChatWithAILoading: chatWithAI.isPending,

        createAISuggestionCompletion: createAISuggestionCompletion.mutateAsync,
        isCreateAISuggestionCompletionLoading: createAISuggestionCompletion.isPending,

        generateWorkoutSuggestion: generateWorkoutSuggestion.mutateAsync,
        isGenerateWorkoutSuggestionLoading: generateWorkoutSuggestion.isPending,

        generateNutritionSuggestion: generateNutritionSuggestion.mutateAsync,
        isGenerateNutritionSuggestionLoading: generateNutritionSuggestion.isPending,
    }
}

export const useAISuggestionsById = (AISuggestionID: string) => {
    return useQuery({
        queryKey: queryKey.SUGGESTION_BY_ID(AISuggestionID),
        queryFn: () => aiSuggestionApi.getSuggestionById(AISuggestionID),
        enabled: !!AISuggestionID,
    })
}

export const useUpdateAISuggestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<import('../api/aiSuggestion.api').AISuggestion> }) => {
            try {
                const response = await aiSuggestionApi.updateAISuggestion(id, data);
                return response;
            } catch (error: any) {
                console.error('API Error:', error);
                // Extract error message from response
                const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi cập nhật gợi ý';
                throw new Error(errorMessage);
            }
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: queryKey.MEMBER_SUGGESTIONS(response.memberId) });
            queryClient.invalidateQueries({ queryKey: queryKey.SUGGESTION_BY_ID(response._id) });
            toast.success('Cập nhật gợi ý thành công');
        },
        onError: (error: any) => {
            console.error('Update suggestion error:', error);
            const errorMessage = error?.message || error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật gợi ý';
            toast.error(errorMessage);
        },
    });
}