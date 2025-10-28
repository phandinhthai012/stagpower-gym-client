import React, { useState, useCallback } from 'react';

/**
 * Hook để xử lý click vào row trong bảng
 * Sử dụng cho các bảng cần click vào row để mở modal chi tiết hoặc navigate
 * 
 * @template T - Type của data được chọn
 * @param initialSelectedId - ID ban đầu được chọn (optional)
 * @returns Object chứa state và handlers
 * 
 * @example
 * ```tsx
 * const {
 *   isModalOpen,
 *   selectedId,
 *   selectedData,
 *   handleRowClick,
 *   handleButtonClick,
 *   closeModal,
 * } = useTableRowClick<PaymentType>();
 * 
 * <ClickableTableRow onClick={handleRowClick(item.id, item)}>
 *   <td>...</td>
 * </ClickableTableRow>
 * ```
 */
export function useTableRowClick<T = any>(initialSelectedId: string | null = null) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [selectedData, setSelectedData] = useState<T | null>(null);

  /**
   * Mở modal với data được chọn
   */
  const openModal = useCallback((id: string, data?: T) => {
    setSelectedId(id);
    if (data) {
      setSelectedData(data);
    }
    setIsModalOpen(true);
  }, []);

  /**
   * Đóng modal và reset state
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
    setSelectedData(null);
  }, []);

  /**
   * Handler để click vào row
   * Trả về một function để pass vào onClick của row
   */
  const handleRowClick = useCallback((id: string, data?: T) => {
    return () => {
      openModal(id, data);
    };
  }, [openModal]);

  /**
   * Handler để click vào button (dùng stopPropagation)
   * Trả về một function để pass vào onClick của button
   */
  const handleButtonClick = useCallback((id: string, data?: T) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent row click
      openModal(id, data);
    };
  }, [openModal]);

  return {
    // State
    isModalOpen,
    selectedId,
    selectedData,
    
    // Actions
    openModal,
    closeModal,
    handleRowClick,
    handleButtonClick,
    
    // Setters (nếu cần override)
    setSelectedId,
    setSelectedData,
    setIsModalOpen,
  };
}

