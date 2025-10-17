export interface TimeseriesData {
    ts: number;
    value: string;
}

export interface TimeseriesResponse {
    [key: string]: TimeseriesData[];
}

export type AggregationType = 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT';

export interface TimeseriesParams {
    keys: string;
    startTs: number;
    endTs: number;
    intervalType: string;
    interval: number;
    timeZone: string;
    limit: number;
    agg: AggregationType;
    orderBy: string;
    useStrictDataTypes: boolean;
}