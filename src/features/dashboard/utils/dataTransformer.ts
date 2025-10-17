import type { TimeseriesData } from '../services/deviceService';

// Type for the data format required by the charting library
export interface ChartDataPoint {
  timestamp: number; // Keep the original timestamp for tooltips or other uses
  time: string;      // Formatted time string for the chart's X-axis
  value: number;
}

/**
 * Transforms raw timeseries data from the API into a format suitable for recharts.
 * @param apiData - The raw data object from the getTimeseriesData API call.
 * @param key - The specific timeseries key to extract data for.
 * @returns An array of data points formatted for the chart.
 */
export const transformTimeseriesData = (
  apiData: TimeseriesData,
  key: string
): ChartDataPoint[] => {
  // Check if the key exists and has data
  if (!apiData || !apiData[key] || apiData[key].length === 0) {
    return [];
  }

  // Map the data for the selected key to the ChartDataPoint format
  return apiData[key]
    .map(dataPoint => {
      let numericValue: number;

      if (typeof dataPoint.value === 'boolean') {
        numericValue = dataPoint.value ? 1 : 0;
      } else {
        numericValue = parseFloat(dataPoint.value);
        if (isNaN(numericValue)) {
          return null;
        }
      }

      const date = new Date(dataPoint.ts);

      return {
        timestamp: dataPoint.ts,
        // Format time to HH:MM for display on the chart's X-axis
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: numericValue,
      };
    })
    .filter((point): point is ChartDataPoint => point !== null) // Filter out any nulls from invalid data
    .sort((a, b) => a.timestamp - b.timestamp); // Ensure data is sorted by time
};