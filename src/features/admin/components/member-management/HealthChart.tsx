import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { TrendingUp, Activity } from 'lucide-react';
import { HealthInfo } from '../../../member/api/healthInfo.api';

interface HealthChartProps {
  healthInfoList: HealthInfo[];
  isLoading?: boolean;
}

type MetricType = 'weight' | 'bmi' | 'bodyFatPercent' | 'muscleMass' | 'healthScore';

interface ChartPoint {
  x: number;
  y: number;
  date: Date;
  value: number;
  label: string;
  fullDate: string;
}

export function HealthChart({ healthInfoList, isLoading }: HealthChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // Helper functions
  const getMetricLabel = (metric: MetricType): string => {
    switch (metric) {
      case 'weight': return 'Cân nặng (kg)';
      case 'bmi': return 'BMI';
      case 'bodyFatPercent': return '% Mỡ cơ thể';
      case 'muscleMass': return 'Khối lượng cơ (kg)';
      case 'healthScore': return 'Điểm sức khỏe';
      default: return '';
    }
  };

  const getMetricColor = (metric: MetricType): string => {
    switch (metric) {
      case 'weight': return '#10b981'; // green
      case 'bmi': return '#8b5cf6'; // purple
      case 'bodyFatPercent': return '#f59e0b'; // orange
      case 'muscleMass': return '#ec4899'; // pink
      case 'healthScore': return '#3b82f6'; // blue
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="bg-indigo-50/50">
          <CardTitle className="flex items-center space-x-2 text-indigo-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Biểu đồ sức khỏe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthInfoList || healthInfoList.length === 0) {
    return (
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="bg-indigo-50/50">
          <CardTitle className="flex items-center space-x-2 text-indigo-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Biểu đồ sức khỏe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Activity className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-500">Chưa có đủ dữ liệu để hiển thị biểu đồ</p>
            <p className="text-xs text-gray-400">Cần ít nhất 2 bản ghi để xem xu hướng</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by date (oldest first)
  const sortedHealthInfo = [...healthInfoList].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
    return dateA - dateB;
  });

  // Filter out records without the selected metric
  const validRecords = sortedHealthInfo.filter((record) => {
    switch (selectedMetric) {
      case 'weight':
        return record.weight !== undefined && record.weight !== null;
      case 'bmi':
        return record.bmi !== undefined && record.bmi !== null;
      case 'bodyFatPercent':
        return record.bodyFatPercent !== undefined && record.bodyFatPercent !== null;
      case 'muscleMass':
        return record.muscleMass !== undefined && record.muscleMass !== null;
      case 'healthScore':
        return record.healthScore !== undefined && record.healthScore !== null;
      default:
        return false;
    }
  });

  if (validRecords.length < 2) {
    return (
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="bg-indigo-50/50">
          <CardTitle className="flex items-center space-x-2 text-indigo-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Biểu đồ sức khỏe</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Activity className="h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-500">Chưa có đủ dữ liệu cho chỉ số này</p>
            <p className="text-xs text-gray-400">Cần ít nhất 2 bản ghi có dữ liệu {getMetricLabel(selectedMetric)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = validRecords.map((record) => {
    const date = new Date(record.createdAt || record.updatedAt || 0);
    let value: number;
    
    switch (selectedMetric) {
      case 'weight':
        value = record.weight!;
        break;
      case 'bmi':
        value = record.bmi!;
        break;
      case 'bodyFatPercent':
        value = record.bodyFatPercent!;
        break;
      case 'muscleMass':
        value = record.muscleMass!;
        break;
      case 'healthScore':
        value = record.healthScore!;
        break;
      default:
        value = 0;
    }

    return {
      date,
      value,
      label: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      fullDate: date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
    };
  });

  // Calculate chart dimensions
  const maxValue = Math.max(...chartData.map(d => d.value), 0.1) * 1.2 || 1;
  const minValue = Math.min(...chartData.map(d => d.value), 0);
  const valueRange = maxValue - minValue || 1;
  const chartWidth = 380;
  const chartHeight = 200;
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const spacing = plotWidth / Math.max(chartData.length - 1, 1);

  // Generate Y-axis labels
  const numYLabels = 5;
  const yAxisLabels: number[] = [];
  const yAxisPositions: number[] = [];
  
  for (let i = 0; i < numYLabels; i++) {
    const value = maxValue - (valueRange / (numYLabels - 1)) * i;
    const yPos = padding.top + (plotHeight / (numYLabels - 1)) * i;
    yAxisLabels.push(value);
    yAxisPositions.push(yPos);
  }

  // Generate points for the line
  const points: ChartPoint[] = chartData.map((data, i) => {
    const x = padding.left + (i * spacing);
    const y = padding.top + plotHeight - ((data.value - minValue) / valueRange * plotHeight);
    return { x, y, ...data };
  });

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader className="bg-indigo-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-indigo-900">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Biểu đồ sức khỏe</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Selector */}
        <div className="flex flex-wrap gap-2">
          {(['weight', 'bmi', 'bodyFatPercent', 'muscleMass', 'healthScore'] as MetricType[]).map((metric) => {
            const hasData = sortedHealthInfo.some((record) => {
              switch (metric) {
                case 'weight': return record.weight !== undefined && record.weight !== null;
                case 'bmi': return record.bmi !== undefined && record.bmi !== null;
                case 'bodyFatPercent': return record.bodyFatPercent !== undefined && record.bodyFatPercent !== null;
                case 'muscleMass': return record.muscleMass !== undefined && record.muscleMass !== null;
                case 'healthScore': return record.healthScore !== undefined && record.healthScore !== null;
                default: return false;
              }
            });
            
            return (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                disabled={!hasData}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                  selectedMetric === metric
                    ? 'bg-indigo-600 text-white'
                    : hasData
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {getMetricLabel(metric)}
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div className="relative">
          <svg 
            className="w-full h-full" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Y-axis labels */}
            {yAxisLabels.map((label, i) => (
              <text 
                key={i} 
                x={padding.left - 10} 
                y={yAxisPositions[i]} 
                className="text-xs fill-gray-500" 
                style={{ fontSize: '10px' }}
                textAnchor="end"
              >
                {label.toFixed(selectedMetric === 'bmi' || selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? 1 : 0)}
              </text>
            ))}
            
            {/* Grid lines */}
            {yAxisPositions.map((yPos, i) => (
              <line 
                key={i}
                x1={padding.left} 
                y1={yPos} 
                x2={padding.left + plotWidth} 
                y2={yPos} 
                stroke="#e5e7eb" 
                strokeWidth="1" 
              />
            ))}
            
            {/* Area gradient */}
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={getMetricColor(selectedMetric)} stopOpacity="0.3" />
                <stop offset="100%" stopColor={getMetricColor(selectedMetric)} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <polygon
              points={`${points[0].x},${padding.top + plotHeight} ${points.map(p => `${p.x},${p.y}`).join(' ')} ${points[points.length - 1].x},${padding.top + plotHeight}`}
              fill={`url(#gradient-${selectedMetric})`}
            />
            
            {/* Line */}
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={getMetricColor(selectedMetric)}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === point ? "5" : "3.5"}
                  fill={getMetricColor(selectedMetric)}
                  stroke="white"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
            
            {/* X-axis labels */}
            {points.map((point, i) => {
              // Show every nth label to avoid crowding
              const showLabel = points.length <= 6 || i % Math.ceil(points.length / 6) === 0 || i === points.length - 1;
              if (!showLabel) return null;
              
              return (
                <text
                  key={i}
                  x={point.x}
                  y={chartHeight - padding.bottom + 15}
                  className="text-xs fill-gray-500"
                  textAnchor="middle"
                  style={{ fontSize: '9px' }}
                >
                  {point.label}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10 pointer-events-none"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className="font-semibold">{hoveredPoint.fullDate}</div>
              <div className="text-gray-300">
                {getMetricLabel(selectedMetric)}: <span className="font-bold text-white">
                  {hoveredPoint.value.toFixed(selectedMetric === 'bmi' || selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? 1 : 0)}
                  {selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? '%' : selectedMetric === 'weight' || selectedMetric === 'muscleMass' ? ' kg' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {chartData.length >= 2 && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500">Giá trị đầu tiên</div>
              <div className="text-sm font-semibold text-gray-900">
                {chartData[0].value.toFixed(selectedMetric === 'bmi' || selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? 1 : 0)}
                {selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? '%' : selectedMetric === 'weight' || selectedMetric === 'muscleMass' ? ' kg' : ''}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Giá trị mới nhất</div>
              <div className="text-sm font-semibold text-gray-900">
                {chartData[chartData.length - 1].value.toFixed(selectedMetric === 'bmi' || selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? 1 : 0)}
                {selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? '%' : selectedMetric === 'weight' || selectedMetric === 'muscleMass' ? ' kg' : ''}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Thay đổi</div>
              <div className={`text-sm font-semibold ${
                chartData[chartData.length - 1].value > chartData[0].value 
                  ? 'text-green-600' 
                  : chartData[chartData.length - 1].value < chartData[0].value 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`}>
                {chartData[chartData.length - 1].value > chartData[0].value ? '+' : ''}
                {(chartData[chartData.length - 1].value - chartData[0].value).toFixed(selectedMetric === 'bmi' || selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? 1 : 0)}
                {selectedMetric === 'bodyFatPercent' || selectedMetric === 'healthScore' ? '%' : selectedMetric === 'weight' || selectedMetric === 'muscleMass' ? ' kg' : ''}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Số bản ghi</div>
              <div className="text-sm font-semibold text-gray-900">
                {chartData.length} bản ghi
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

