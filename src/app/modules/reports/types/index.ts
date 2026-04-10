export type ReportType = 
  | 'Profit & Loss' 
  | 'Inventory Summary' 
  | 'Dealer Credit Report' 
  | 'Order & Payment Report' 
  | 'Supplier Consignment Report' 
  | 'Delivery Performance Report';

export type DateRangeType = 'Today' | 'This Week' | 'This Month' | 'Custom Range';

export interface ReportConfig {
  type: ReportType | '';
  dateRange: DateRangeType;
  customRange?: {
    start: string;
    end: string;
  };
  scope: {
    branches: string[];
    dealers: string[];
    suppliers: string[];
  };
}

export interface ReportKPI {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export interface ReportTableRow {
  [key: string]: string | number;
}

export interface ReportData {
  id: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  config: ReportConfig;
  aiSummary: string;
  kpis: ReportKPI[];
  tables: {
    title: string;
    headers: string[];
    rows: ReportTableRow[];
  }[];
  insights: string[];
  recommendations: string[];
}
