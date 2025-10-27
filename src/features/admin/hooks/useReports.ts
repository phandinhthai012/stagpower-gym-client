import { useQuery } from '@tanstack/react-query';
import { useSubscriptions } from './useSubscriptions';
import { useMembers } from '../../member/hooks/useMembers';
import { useCheckIns } from './useCheckIns';
import { usePackages } from './usePackages';
import { usePayments, calculateMonthlyRevenue } from '../../member/hooks/usePayments';

// Hook to get package statistics with real revenue from payments
export const usePackageStats = () => {
  const { data: subscriptionsResponse } = useSubscriptions();
  const { data: packagesResponse } = usePackages();
  const { data: paymentsResponse } = usePayments();
  
  const subscriptions = subscriptionsResponse?.data || [];
  const packages = packagesResponse?.data || [];
  const payments = paymentsResponse?.data || [];

  return useQuery({
    queryKey: ['package-stats', subscriptions, packages, payments],
    queryFn: () => {
      // Count subscriptions by package and calculate real revenue
      const packageCounts: Record<string, any> = {};
      
      subscriptions.forEach((sub: any) => {
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
          };
        }
        
        packageCounts[pkgIdStr].count += 1;
        
        if (sub.status === 'Active') packageCounts[pkgIdStr].activeCount += 1;
        if (sub.status === 'Expired') packageCounts[pkgIdStr].expiredCount += 1;
      });

      // Add real revenue from payments
      payments
        .filter((payment: any) => payment.paymentStatus === 'Completed')
        .forEach((payment: any) => {
          // Extract subscription ID (could be ObjectId string or populated object)
          const subId = payment.subscriptionId?._id || payment.subscriptionId;
          
          // Find matching subscription
          const subscription = subscriptions.find((sub: any) => 
            String(sub._id) === String(subId)
          );
          
          if (subscription) {
            const pkgId = String(subscription.packageId?._id || subscription.packageId);
            
            if (packageCounts[pkgId]) {
              packageCounts[pkgId].revenue += payment.amount || 0;
            }
          }
        });

      const stats = Object.values(packageCounts).sort((a: any, b: any) => b.count - a.count);
      
      // Calculate retention rate for each package
      stats.forEach((pkg: any) => {
        const total = pkg.count;
        const active = pkg.activeCount;
        pkg.retentionRate = total > 0 ? ((active / total) * 100).toFixed(1) : 0;
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
export const useTopActiveMembers = (limit: number = 10) => {
  const { data: checkInsResponse } = useCheckIns();
  const { data: membersResponse } = useMembers();
  const { data: subscriptionsResponse } = useSubscriptions();
  
  const checkIns = checkInsResponse?.data || [];
  const members = (membersResponse && 'success' in membersResponse && membersResponse.success) 
    ? membersResponse.data || [] 
    : [];
  const subscriptions = subscriptionsResponse?.data || [];

  return useQuery({
    queryKey: ['top-active-members', limit, checkIns, members, subscriptions],
    queryFn: () => {
      // Count check-ins per member
      const memberCheckInCounts: Record<string, number> = {};
      
      checkIns.forEach((checkIn: any) => {
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
          
          return {
            memberId,
            memberName: member?.fullName || 'Unknown',
            checkInCount: count,
            currentPackage: activeSub?.packageId?.name || activeSub?.type || 'Không có gói',
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

