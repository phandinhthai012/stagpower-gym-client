import pdfMake from 'pdfmake/build/pdfmake';

// Initialize pdfMake - fonts will be loaded dynamically
let fontsInitialized = false;

const initializePdfMake = async () => {
  if (fontsInitialized) return;
  
  try {
    // Try to load fonts from vfs_fonts
    const pdfFontsModule = require('pdfmake/build/vfs_fonts');
    
    if (pdfFontsModule && pdfFontsModule.pdfMake && pdfFontsModule.pdfMake.vfs) {
      (pdfMake as any).vfs = pdfFontsModule.pdfMake.vfs;
      fontsInitialized = true;
      return;
    }
  } catch (error) {
    console.warn('Failed to load pdfmake fonts from vfs_fonts:', error);
  }
  
  // Fallback: Initialize without vfs (will use default fonts)
  // pdfmake will work but may have limited font support
  fontsInitialized = true;
};

export interface InvoiceData {
  invoiceNumber: string;
  transactionId?: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentType?: string;
  packageName?: string;
  amount: number;
  originalAmount?: number;
  discountAmount?: number;
  memberName: string;
  memberEmail?: string;
  memberPhone?: string;
  notes?: string;
}

export const generateInvoicePDF = async (invoiceData: InvoiceData): Promise<void> => {
  // Ensure fonts are initialized
  await initializePdfMake();
  // Get status text
  const statusText = invoiceData.paymentStatus === 'completed' || invoiceData.paymentStatus === 'success' 
    ? 'Hoàn thành' 
    : invoiceData.paymentStatus === 'pending' 
    ? 'Đang chờ' 
    : invoiceData.paymentStatus === 'failed' 
    ? 'Thất bại' 
    : invoiceData.paymentStatus || 'N/A';

  // Get payment type label
  const typeLabel = invoiceData.paymentType === 'NEW_SUBSCRIPTION' 
    ? 'Đăng ký gói mới'
    : invoiceData.paymentType === 'RENEWAL'
    ? 'Gia hạn gói tập'
    : invoiceData.paymentType === 'PT_PURCHASE'
    ? 'Mua buổi tập PT'
    : 'Thanh toán';

  // Get payment method label
  const methodLabel = invoiceData.paymentMethod === 'momo' 
    ? 'Ví MoMo'
    : invoiceData.paymentMethod === 'zalopay'
    ? 'Ví ZaloPay'
    : invoiceData.paymentMethod === 'cash'
    ? 'Tiền mặt'
    : invoiceData.paymentMethod === 'card'
    ? 'Thẻ'
    : invoiceData.paymentMethod === 'banktransfer' || invoiceData.paymentMethod === 'bank_transfer'
    ? 'Chuyển khoản'
    : invoiceData.paymentMethod || 'Khác';

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Format date and time
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Format current date and time for footer
  const formatCurrentDateTime = (): string => {
    return `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}`;
  };

  // Build table data
  const tableBody: any[] = [];
  
  if (invoiceData.paymentType) {
    tableBody.push([
      { text: 'Loại thanh toán', bold: true },
      { text: typeLabel }
    ]);
  }
  
  if (invoiceData.packageName) {
    tableBody.push([
      { text: 'Gói tập', bold: true },
      { text: invoiceData.packageName }
    ]);
  }
  
  tableBody.push([
    { text: 'Phương thức thanh toán', bold: true },
    { text: methodLabel }
  ]);

  // PDF document definition
  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
    },
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#ffffff',
        alignment: 'center',
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 12,
        color: '#ffffff',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        color: '#164e63',
        margin: [0, 15, 0, 10]
      },
      label: {
        fontSize: 10,
        bold: true,
        color: '#374151',
        margin: [0, 5, 0, 2]
      },
      value: {
        fontSize: 10,
        color: '#1a1a1a',
        margin: [0, 0, 0, 8]
      },
      totalLabel: {
        fontSize: 14,
        bold: true,
        color: '#164e63'
      },
      totalValue: {
        fontSize: 18,
        bold: true,
        color: '#164e63'
      },
      footer: {
        fontSize: 8,
        color: '#6b7280',
        italics: true,
        alignment: 'center',
        margin: [0, 20, 0, 0]
      }
    },
    content: [
      // Header
      {
        stack: [
          { text: '\n\nSTAGPOWER GYM', style: 'header' },
          { text: 'HÓA ĐƠN THANH TOÁN', style: 'subheader' }
        ],
        background: '#164e63',
        margin: [-40, -60, -40, 20],
        padding: [20, 0, 20, 20]
      },

      // Invoice Information
      {
        text: 'Thông tin hóa đơn',
        style: 'sectionTitle'
      },
      {
        columns: [
          {
            width: 100,
            text: 'Mã hóa đơn:',
            style: 'label'
          },
          {
            width: '*',
            text: invoiceData.invoiceNumber,
            style: 'value'
          }
        ]
      },
      ...(invoiceData.transactionId ? [{
        columns: [
          {
            width: 100,
            text: 'Mã giao dịch:',
            style: 'label'
          },
          {
            width: '*',
            text: invoiceData.transactionId,
            style: 'value'
          }
        ]
      }] : []),
      {
        columns: [
          {
            width: 100,
            text: 'Ngày giờ thanh toán:',
            style: 'label'
          },
          {
            width: '*',
            text: formatDateTime(invoiceData.paymentDate),
            style: 'value'
          }
        ]
      },
      {
        columns: [
          {
            width: 100,
            text: 'Trạng thái:',
            style: 'label'
          },
          {
            width: '*',
            text: statusText,
            style: 'value',
            color: statusText === 'Hoàn thành' ? '#059669' : 
                   statusText === 'Đang chờ' ? '#d97706' : 
                   statusText === 'Thất bại' ? '#dc2626' : '#6b7280'
          }
        ]
      },

      // Customer Information
      {
        text: 'Thông tin khách hàng',
        style: 'sectionTitle'
      },
      {
        columns: [
          {
            width: 100,
            text: 'Họ tên:',
            style: 'label'
          },
          {
            width: '*',
            text: invoiceData.memberName,
            style: 'value'
          }
        ]
      },
      ...(invoiceData.memberEmail ? [{
        columns: [
          {
            width: 100,
            text: 'Email:',
            style: 'label'
          },
          {
            width: '*',
            text: invoiceData.memberEmail,
            style: 'value'
          }
        ]
      }] : []),
      ...(invoiceData.memberPhone ? [{
        columns: [
          {
            width: 100,
            text: 'Số điện thoại:',
            style: 'label'
          },
          {
            width: '*',
            text: invoiceData.memberPhone,
            style: 'value'
          }
        ]
      }] : []),

      // Payment Details Table
      {
        text: 'Chi tiết thanh toán',
        style: 'sectionTitle'
      },
      {
        table: {
          headerRows: 1,
          widths: [80, '*'],
          body: [
            [
              { text: 'Mô tả', style: 'tableHeader', fillColor: '#164e63', color: '#ffffff', bold: true },
              { text: 'Chi tiết', style: 'tableHeader', fillColor: '#164e63', color: '#ffffff', bold: true }
            ],
            ...tableBody
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex % 2 === 0 ? '#f9fafb' : '#ffffff';
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 8,
          paddingBottom: () => 8
        }
      },

      // Amount Details
      {
        text: 'Chi tiết số tiền',
        style: 'sectionTitle',
        margin: [0, 20, 0, 10]
      },
      ...(invoiceData.originalAmount && invoiceData.originalAmount !== invoiceData.amount ? [
        {
          columns: [
            {
              width: '*',
              text: 'Giá gốc:',
              style: 'label'
            },
            {
              width: 120,
              text: formatCurrency(invoiceData.originalAmount),
              style: 'value',
              decoration: 'lineThrough',
              color: '#6b7280'
            }
          ]
        },
        {
          columns: [
            {
              width: '*',
              text: 'Giảm giá:',
              style: 'label'
            },
            {
              width: 120,
              text: `-${formatCurrency(invoiceData.discountAmount || (invoiceData.originalAmount - invoiceData.amount))}`,
              style: 'value',
              color: '#059669',
              bold: true
            }
          ]
        }
      ] : []),
      {
        columns: [
          {
            width: '*',
            text: 'Tổng thanh toán:',
            style: 'totalLabel'
          },
          {
            width: 120,
            text: formatCurrency(invoiceData.amount),
            style: 'totalValue',
            alignment: 'right'
          }
        ],
        margin: [0, 10, 0, 0]
      },

      // Notes
      ...(invoiceData.notes ? [{
        text: 'Ghi chú',
        style: 'sectionTitle',
        margin: [0, 20, 0, 10]
      }, {
        text: invoiceData.notes,
        style: 'value',
        background: '#eff6ff',
        border: [false, false, false, true],
        borderColor: '#3b82f6',
        borderWidth: 4,
        padding: [15, 15, 15, 15],
        color: '#1e40af'
      }] : []),

      // Footer
      {
        text: [
          'Cảm ơn bạn đã sử dụng dịch vụ của StagPower Gym!\n',
          { text: `Ngày xuất: ${formatCurrentDateTime()}`, fontSize: 8 }
        ],
        style: 'footer'
      }
    ]
  };

  // Generate and download PDF
  try {
    pdfMake.createPdf(docDefinition).download(
      `HoaDon-${invoiceData.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
