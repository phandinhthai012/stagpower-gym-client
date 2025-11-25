import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  Star,
  Edit,
  Trash2,
  Plus,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { useMyRatings, useRateableTrainers } from '../hooks';
import { Rating, RateableTrainer } from '../types/rating.types';
import { StarRating, ModalRatingForm, ModalDeleteRating } from '../components';

export function MemberTrainerRating() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<RateableTrainer | undefined>();
  const [editingRating, setEditingRating] = useState<Rating | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ratingToDelete, setRatingToDelete] = useState<string | null>(null);

  const { data: ratings, isLoading: isLoadingRatings, refetch } = useMyRatings();
  const { data: rateableTrainers, isLoading: isLoadingTrainers } = useRateableTrainers();

  const handleCreateRating = (trainer: RateableTrainer) => {
    setSelectedTrainer(trainer);
    setEditingRating(undefined);
    setFormOpen(true);
  };

  const handleEditRating = (rating: Rating) => {
    setEditingRating(rating);
    setSelectedTrainer(undefined);
    setFormOpen(true);
  };

  const handleDeleteClick = (ratingId: string) => {
    setRatingToDelete(ratingId);
    setDeleteDialogOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
    setFormOpen(false);
    setSelectedTrainer(undefined);
    setEditingRating(undefined);
  };

  const handleDeleteSuccess = () => {
    refetch();
    setDeleteDialogOpen(false);
    setRatingToDelete(null);
  };

  const getTrainerName = (rating: Rating) => {
    if (typeof rating.trainerId === 'object' && rating.trainerId?.fullName) {
      return rating.trainerId.fullName;
    }
    return 'PT';
  };

  const getTrainerInfo = (rating: Rating) => {
    if (typeof rating.trainerId === 'object' && rating.trainerId?.trainerInfo) {
      return rating.trainerId.trainerInfo;
    }
    return null;
  };

  if (isLoadingRatings || isLoadingTrainers) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Đánh giá PT</h1>
          <p className="text-base sm:text-sm text-gray-600 mt-1">
            Xem và quản lý đánh giá của bạn về các huấn luyện viên
          </p>
        </div>
        {rateableTrainers && rateableTrainers.filter(t => !t.hasRating).length > 0 && (
          <Button onClick={() => setFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Đánh giá mới
          </Button>
        )}
      </div>

      {/* Rateable Trainers (for creating new ratings) */}
      {rateableTrainers && rateableTrainers.filter(t => !t.hasRating).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Có thể đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rateableTrainers
                .filter(t => !t.hasRating)
                .map((trainer) => (
                  <div
                    key={trainer._id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {trainer.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{trainer.fullName}</h3>
                        {trainer.trainerInfo?.specialty && (
                          <p className="text-sm text-gray-600">
                            {Array.isArray(trainer.trainerInfo.specialty)
                              ? trainer.trainerInfo.specialty.join(', ')
                              : trainer.trainerInfo.specialty}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCreateRating(trainer)}
                      className="w-full"
                      size="sm"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Đánh giá
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đánh giá của tôi</CardTitle>
        </CardHeader>
        <CardContent>
          {ratings && ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating._id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Trainer Info & Rating */}
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {getTrainerName(rating).charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getTrainerName(rating)}
                          </h3>
                          {getTrainerInfo(rating)?.specialty && (
                            <p className="text-sm text-gray-600">
                              {Array.isArray(getTrainerInfo(rating)?.specialty)
                                ? getTrainerInfo(rating)?.specialty.join(', ')
                                : getTrainerInfo(rating)?.specialty}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <StarRating rating={rating.rating} readonly />
                      </div>

                      {rating.comment && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{rating.comment}</p>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(rating.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {rating.updatedAt !== rating.createdAt && ' (Đã chỉnh sửa)'}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRating(rating)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(rating._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đánh giá nào
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Bạn chỉ có thể đánh giá các huấn luyện viên mà bạn đã hoàn thành buổi tập
              </p>
              {rateableTrainers && rateableTrainers.length === 0 && (
                <p className="text-sm text-gray-500">
                  Hoàn thành buổi tập với PT để có thể đánh giá
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Form Dialog */}
      <ModalRatingForm
        open={formOpen}
        onOpenChange={setFormOpen}
        trainer={selectedTrainer}
        existingRating={editingRating}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <ModalDeleteRating
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        ratingId={ratingToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

