import { useQuery } from '@tanstack/react-query';
import { useSubscriptions } from './useSubscriptions';
import { useMembers } from '../../member/hooks/useMembers';
import { useCheckIns } from './useCheckIns';
import { usePackages } from './usePackages';
import { usePayments, calculateMonthlyRevenue } from '../../member/hooks/usePayments';
import { useBranches } from './useBranches';

// Hook to get package statistics with real revenue from payments
export const usePackageStats = (branchId?: string, year?: number, month?: number | null) => {
  const { data: subscriptionsResponse } = useSubscriptions();
  const { data: packagesResponse } = usePackages();
  const { data: paymentsResponse } = usePayments();
  
  const subscriptions = subscriptionsResponse?.data || [];
  const packages = packagesResponse?.data || [];
  const payments = paymentsResponse?.data || [];

  return useQuery({
    queryKey: ['package-stats', subscriptions, packages, payments, branchId, year, month],
    queryFn: () => {
      // Filter subscriptions by branch
      let filteredSubscriptions = subscriptions;
      if (branchId && branchId !== 'all') {
        filteredSubscriptions = subscriptions.filter((sub: any) => {
          const subBranchId = sub.branchId?._id || sub.branchId;
          return String(subBranchId) === String(branchId);
        });
      }

      // Filter subscriptions by date (createdAt or startDate)
      if (year) {
        filteredSubscriptions = filteredSubscriptions.filter((sub: any) => {
          const subDate = new Date(sub.createdAt || sub.startDate || sub.startDate);
          if (month) {
            return subDate.getFullYear() === year && subDate.getMonth() === (month - 1);
          }
          return subDate.getFullYear() === year;
        });
      }

      // Filter payments by branch and date
      let filteredPayments = payments;
      if (branchId && branchId !== 'all') {
        filteredPayments = payments.filter((payment: any) => {
          const subId = payment.subscriptionId?._id || payment.subscriptionId;
          if (!subId) return false;
          const subscription = subscriptions.find((sub: any) => 
            String(sub._id) === String(subId)
          );
          if (subscription) {
            const paymentBranchId = subscription.branchId?._id || subscription.branchId;
            return String(paymentBranchId) === String(branchId);
          }
          return false;
        });
      }

      if (year) {
        filteredPayments = filteredPayments.filter((payment: any) => {
          const paymentDate = new Date(payment.paymentDate || payment.createdAt);
          if (month) {
            return paymentDate.getFullYear() === year && paymentDate.getMonth() === (month - 1);
          }
          return paymentDate.getFullYear() === year;
        });
      }
      // Count subscriptions by package and calculate real revenue
      const packageCounts: Record<string, any> = {};
      
      filteredSubscriptions.forEach((sub: any) => {
        const pkgId = sub.packageId?._id || sub.packageId;
        if (!pkgId) return;
        
        const pkgIdStr = String(pkgId);
        
        if (!packageCounts[pkgIdStr]) {
          packageCounts[pkgIdStr] = {
            packageId: pkgIdStr,
            packageName: sub.packageId?.name || 'Unknown',
            type: sub.type,
            count: 0,
            revenue: 0,
            activeCount: 0,
            expiredCount: 0,
            paidCount: 0, // Số lượng đã thanh toán
          };
        }
        
        packageCounts[pkgIdStr].count += 1;
        
        if (sub.status === 'Active') packageCounts[pkgIdStr].activeCount += 1;
        if (sub.status === 'Expired') packageCounts[pkgIdStr].expiredCount += 1;
      });

      // Add real revenue from payments and count paid subscriptions
      // Payment đã được populate với subscriptionId và packageId rồi, nên có thể dùng trực tiếp
      filteredPayments
        .filter((payment: any) => payment.paymentStatus === 'Completed')
        .forEach((payment: any) => {
          // Extract subscription ID (could be ObjectId string or populated object)
          const subId = payment.subscriptionId?._id || payment.subscriptionId;
          if (!subId) return;
          
          // Lấy packageId từ payment.subscriptionId.packageId (đã được populate)
          // Hoặc tìm từ subscription trong danh sách nếu chưa được populate
          let pkgId: string | null = null;
          
          if (payment.subscriptionId?.packageId) {
            // Payment đã được populate với packageId
            pkgId = String(payment.subscriptionId.packageId?._id || payment.subscriptionId.packageId);
          } else {
            // Fallback: tìm subscription trong danh sách
            const subscription = filteredSubscriptions.find((sub: any) => 
              String(sub._id) === String(subId)
            );
            if (subscription) {
              pkgId = String(subscription.packageId?._id || subscription.packageId);
            }
          }
          
          if (pkgId && packageCounts[pkgId]) {
            packageCounts[pkgId].revenue += payment.amount || 0;
          }
        });

      // Count paid subscriptions (unique subscriptions with completed payments)
      const paidSubscriptionsByPackage: Record<string, Set<string>> = {};
      filteredPayments
        .filter((payment: any) => payment.paymentStatus === 'Completed')
        .forEach((payment: any) => {
          const subId = payment.subscriptionId?._id || payment.subscriptionId;
          if (!subId) return;
          
          // Lấy packageId từ payment.subscriptionId.packageId (đã được populate)
          // Hoặc tìm từ subscription trong danh sách nếu chưa được populate
          let pkgId: string | null = null;
          
          if (payment.subscriptionId?.packageId) {
            // Payment đã được populate với packageId
            pkgId = String(payment.subscriptionId.packageId?._id || payment.subscriptionId.packageId);
          } else {
            // Fallback: tìm subscription trong danh sách
            const subscription = filteredSubscriptions.find((sub: any) => 
              String(sub._id) === String(subId)
            );
            if (subscription) {
              pkgId = String(subscription.packageId?._id || subscription.packageId);
            }
          }
          
          if (pkgId) {
            if (!paidSubscriptionsByPackage[pkgId]) {
              paidSubscriptionsByPackage[pkgId] = new Set();
            }
            paidSubscriptionsByPackage[pkgId].add(String(subId));
          }
        });

      // Update paidCount for each package
      Object.keys(paidSubscriptionsByPackage).forEach((pkgId) => {
        if (packageCounts[pkgId]) {
          packageCounts[pkgId].paidCount = paidSubscriptionsByPackage[pkgId].size;
        }
      });

      const stats = Object.values(packageCounts).sort((a: any, b: any) => b.count - a.count);
      
      // Calculate retention rate for each package
      // Retention rate = Tỷ lệ khách hàng đăng ký lại gói sau khi hết hạn
      stats.forEach((pkg: any) => {
        const pkgId = pkg.packageId;
        
        // Get all subscriptions for this package (use filtered subscriptions)
        const packageSubscriptions = filteredSubscriptions.filter((sub: any) => {
          const subPkgId = sub.packageId?._id || sub.packageId;
          return String(subPkgId) === String(pkgId);
        });
        
        // Group subscriptions by memberId
        const memberSubscriptions: Record<string, any[]> = {};
        packageSubscriptions.forEach((sub: any) => {
          const memberId = sub.memberId?._id || sub.memberId;
          if (!memberId) return;
          
          const memberIdStr = String(memberId);
          if (!memberSubscriptions[memberIdStr]) {
            memberSubscriptions[memberIdStr] = [];
          }
          memberSubscriptions[memberIdStr].push(sub);
        });
        
        // Count members who renewed (đăng ký lại)
        let totalMembers = 0; // Tổng số member đã từng đăng ký gói này
        let renewedMembers = 0; // Số member đăng ký lại sau khi hết hạn
        
        Object.values(memberSubscriptions).forEach((memberSubs: any[]) => {
          // Sort subscriptions by startDate or createdAt
          const sortedSubs = memberSubs.sort((a, b) => {
            const dateA = new Date(a.startDate || a.createdAt || 0).getTime();
            const dateB = new Date(b.startDate || b.createdAt || 0).getTime();
            return dateA - dateB;
          });
          
          // Get first subscription
          const firstSub = sortedSubs[0];
          if (!firstSub) return;
          
          totalMembers++;
          
          // Check if first subscription has expired
          const firstSubEndDate = firstSub.endDate ? new Date(firstSub.endDate) : null;
          const now = new Date();
          const isFirstSubExpired = firstSub.status === 'Expired' || 
            (firstSubEndDate && firstSubEndDate < now);
          
          // If first subscription expired, check if member renewed
          if (isFirstSubExpired && sortedSubs.length > 1) {
            // Check if there's a subscription after the first one's end date
            const hasRenewal = sortedSubs.some((sub, index) => {
              if (index === 0) return false; // Skip first subscription
              
              const subStartDate = sub.startDate ? new Date(sub.startDate) : 
                (sub.createdAt ? new Date(sub.createdAt) : null);
              
              if (!subStartDate || !firstSubEndDate) return false;
              
              // Renewal: new subscription starts after old one ends (or within a reasonable gap, e.g., 30 days)
              const daysGap = (subStartDate.getTime() - firstSubEndDate.getTime()) / (1000 * 60 * 60 * 24);
              return daysGap >= 0 && daysGap <= 30; // Allow up to 30 days gap
            });
            
            if (hasRenewal) {
              renewedMembers++;
            }
          } else if (!isFirstSubExpired) {
            // First subscription is still active, can't determine renewal yet
            // Don't count as renewed, but count as total member
          }
        });
        
        // Calculate retention rate
        pkg.retentionRate = totalMembers > 0 
          ? ((renewedMembers / totalMembers) * 100).toFixed(1) 
          : '0';
      });
      
      return {
        packageStats: stats,
        mostPopular: stats[0] || null,
        leastPopular: stats[stats.length - 1] || null,
        totalPackages: packages.length,
        activePackages: packages.filter((pkg: any) => pkg.status === 'Active').length,
      };
    },
    enabled: subscriptions.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to get top active members by check-ins
export const useTopActiveMembers = (limit: number = 10, year?: number, month?: number | null) => {
  const { data: checkInsResponse } = useCheckIns();
  const { data: membersResponse } = useMembers();
  const { data: subscriptionsResponse } = useSubscriptions();
  const { data: branches = [] } = useBranches();
  
  const checkIns = checkInsResponse?.data || [];
  const members = (membersResponse && 'success' in membersResponse && membersResponse.success) 
    ? membersResponse.data || [] 
    : [];
  const subscriptions = subscriptionsResponse?.data || [];

  return useQuery({
    queryKey: ['top-active-members', limit, checkIns, members, subscriptions, branches, year, month],
    queryFn: () => {
      // Filter check-ins by date
      let filteredCheckIns = checkIns;
      if (year) {
        filteredCheckIns = checkIns.filter((checkIn: any) => {
          const checkInDate = new Date(checkIn.checkInTime || checkIn.createdAt);
          if (month) {
            return checkInDate.getFullYear() === year && checkInDate.getMonth() === (month - 1);
          }
          return checkInDate.getFullYear() === year;
        });
      }

      // Count check-ins per member
      const memberCheckInCounts: Record<string, number> = {};
      
      filteredCheckIns.forEach((checkIn: any) => {
        const memberId = checkIn.memberId?._id || checkIn.memberId;
        if (!memberId) return;
        memberCheckInCounts[memberId] = (memberCheckInCounts[memberId] || 0) + 1;
      });

      // Map to member details
      const topMembers = Object.entries(memberCheckInCounts)
        .map(([memberId, count]) => {
          const member = members.find((m: any) => String(m._id) === String(memberId));
          const activeSub = subscriptions.find((sub: any) => {
            const subMemberId = sub.memberId?._id || sub.memberId;
            return String(subMemberId) === String(memberId) && sub.status === 'Active';
          });
          
          // Get branch from subscription or checkIn
          const branchId = activeSub?.branchId?._id || activeSub?.branchId;
          const branch = branches.find((b: any) => String(b._id) === String(branchId));
          const branchName = branch?.name || 'Chưa xác định';
          
          return {
            memberId,
            memberName: member?.fullName || 'Unknown',
            checkInCount: count,
            currentPackage: activeSub?.packageId?.name || activeSub?.type || 'Không có gói',
            branchName,
          };
        })
        .sort((a, b) => b.checkInCount - a.checkInCount)
        .slice(0, limit);

      return topMembers;
    },
    enabled: checkIns.length > 0 && members.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to get revenue statistics from real payment data
export const useRevenueStats = () => {
  const { data: paymentsResponse } = usePayments();
  const payments = paymentsResponse?.data || [];

  return useQuery({
    queryKey: ['revenue-stats', payments],
    queryFn: () => {
      const monthlyRevenue = calculateMonthlyRevenue(payments);
      const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
      const averageRevenue = monthlyRevenue.length > 0 ? totalRevenue / monthlyRevenue.length : 0;

      // Calculate revenue growth
      const lastMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
      const prevMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
      const revenueGrowth = prevMonth > 0 ? (((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1) : '0';

      // Calculate completed vs total payments
      const completedPayments = payments.filter((p: any) => p.paymentStatus === 'Completed').length;
      const totalPayments = payments.length;
      const successRate = totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0;

      return {
        monthlyRevenue,
        totalRevenue,
        averageRevenue,
        revenueGrowth,
        completedPayments,
        totalPayments,
        successRate,
      };
    },
    enabled: payments.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook to get peak hours for check-ins
export const usePeakHours = () => {
  const { data: checkInsResponse } = useCheckIns();
  const checkIns = checkInsResponse?.data || [];

  return useQuery({
    queryKey: ['peak-hours', checkIns],
    queryFn: () => {
      const hourCounts: Record<number, number> = {};
      
      // Initialize only operating hours (6am - 10pm)
      const OPERATING_START = 6;
      const OPERATING_END = 22;
      
      for (let i = OPERATING_START; i < OPERATING_END; i++) {
        hourCounts[i] = 0;
      }
      
      // Count check-ins by hour (only during operating hours)
      checkIns.forEach((checkIn: any) => {
        const hour = new Date(checkIn.checkInTime).getHours();
        if (hour >= OPERATING_START && hour < OPERATING_END) {
          hourCounts[hour] += 1;
        }
      });
      
      // Find peak and quiet hours (only within operating hours)
      const sortedHours = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count);
      
      const peakHour = sortedHours[0];
      const quietHour = sortedHours[sortedHours.length - 1];
      
      // Categorize by time of day
      const morningCheckIns = Object.entries(hourCounts)
        .filter(([hour]) => parseInt(hour) >= 6 && parseInt(hour) < 12)
        .reduce((sum, [_, count]) => sum + count, 0);
      
      const afternoonCheckIns = Object.entries(hourCounts)
        .filter(([hour]) => parseInt(hour) >= 12 && parseInt(hour) < 18)
        .reduce((sum, [_, count]) => sum + count, 0);
      
      const eveningCheckIns = Object.entries(hourCounts)
        .filter(([hour]) => parseInt(hour) >= 18 && parseInt(hour) < 22)
        .reduce((sum, [_, count]) => sum + count, 0);
      
      return {
        peakHour: {
          hour: peakHour.hour,
          count: peakHour.count,
          label: `${peakHour.hour}:00 - ${peakHour.hour + 1}:00`,
        },
        quietHour: {
          hour: quietHour.hour,
          count: quietHour.count,
          label: `${quietHour.hour}:00 - ${quietHour.hour + 1}:00`,
        },
        timeDistribution: {
          morning: morningCheckIns,
          afternoon: afternoonCheckIns,
          evening: eveningCheckIns,
        },
      };
    },
    enabled: checkIns.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

