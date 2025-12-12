export const convertData = <T extends any[]>(
  chartData: T | undefined,
  groupBy: (item: NonNullable<T[number]>) => string,
  xAxisDataKey: string,
  countBy: (item: NonNullable<T[number]>) => Record<string, number> = () => ({
    count: 1,
  }),
  tooltipData?: (item: NonNullable<T[number]>) => Record<string, number>, // Separate tooltip data
  labels?: Record<string, string>
): Record<string, any>[] => {
  // Group data by the specified key and count multiple metrics
  const groupedData = chartData?.reduce((acc, item) => {
    const groupKey = groupBy(item);
    const counts = countBy(item);
    const tooltipCounts = tooltipData ? tooltipData(item) : {};

    if (!acc[groupKey]) {
      acc[groupKey] = {
        [xAxisDataKey]: groupKey,
        ...Object.keys(counts).reduce((obj, key) => {
          obj[key] = 0;
          return obj;
        }, {} as Record<string, number>),
        // Add tooltip data with a prefix to distinguish it
        ...Object.keys(tooltipCounts).reduce((obj, key) => {
          obj[`tooltip_${key}`] = 0;
          return obj;
        }, {} as Record<string, number>),
      };
    }

    // Add counts for each metric (bar data)
    Object.entries(counts).forEach(([key, value]) => {
      acc[groupKey][key] += value;
    });

    // Add tooltip data (not shown as bars)
    Object.entries(tooltipCounts).forEach(([key, value]) => {
      acc[groupKey][`tooltip_${key}`] += value;
    });

    return acc;
  }, {} as Record<string, any>);

  const result = Object.values(groupedData || {}) as Record<string, any>[];

  // Apply labels if provided
  if (labels) {
    return result.map((item: Record<string, any>) => ({
      ...item,
      [xAxisDataKey]: labels[item[xAxisDataKey]] || item[xAxisDataKey],
    }));
  }

  return result;
};
