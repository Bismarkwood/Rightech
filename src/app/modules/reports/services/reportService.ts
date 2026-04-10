import { apiClient } from '../../../core/api/client';
import { ReportConfig, ReportData } from '../types';

/**
 * ReportService handles the generation of business intelligence reports
 * by aggregating data from internal microservices.
 */
class ReportService {
  private moduleName = 'REPORTS_ENGINE';

  /**
   * Generates a report based on the provided configuration.
   * In a real system, this would call multiple internal APIs.
   */
  async generateReport(config: ReportConfig): Promise<ReportData> {
    const startTime = performance.now();
    
    // Simulate internal system data fetching and AI processing
    // This is where real microservice aggregation would happen
    const result = await apiClient.mutate<ReportData>(
      'POST', 
      `/reports/generate/${config.type.toLowerCase().replace(/ /g, '-')}`,
      this.getMockData(config),
      this.moduleName
    );

    const endTime = performance.now();
    console.log(`[REPORTS] Generated ${config.type} in ${Math.round(endTime - startTime)}ms`);

    if (!result.data) {
      throw new Error('Failed to generate report data from internal system.');
    }

    return result.data;
  }

  /**
   * Internal mock data generator (to be replaced with real API calls)
   */
  private getMockData(config: ReportConfig): ReportData {
    if (config.type === 'Inventory Summary') {
      return {
        id: `INV-${Math.floor(Math.random() * 10000)}`,
        title: `Inventory Health & Valuation Analysis`,
        generatedAt: new Date().toLocaleString(),
        generatedBy: 'Kwame Asante',
        config: config,
        aiSummary: `Inventory valuation has peaked at GHS 1.2M this month, but stock turnover for 'Electronics' has slowed by 15% due to a saturation in the Accra region. We have identified 12 critical low-stock items in the 'Construction' category that require immediate replenishment to avoid service disruption. Overall stock coverage is healthy at 42 days.`,
        kpis: [
          { label: 'Inventory Value', value: 'GHS 1,240,000', trend: 'up', trendValue: '4.5%' },
          { label: 'Low Stock Alerts', value: '12', trend: 'down', trendValue: '2 items' },
          { label: 'Out of Stock', value: '3', trend: 'down', trendValue: '1 item' },
          { label: 'Stock Coverage', value: '42 Days', trend: 'up', trendValue: '5 days' }
        ],
        tables: [
          {
            title: 'Top SKUs & Stock Health Status',
            headers: ['SKU Name', 'Stock Level', 'Cost Value', 'Retail Value', 'Status'],
            rows: [
              { 'SKU Name': 'Cement (50kg)', 'Stock Level': '450 bags', 'Cost Value': '18,200', 'Retail Value': '24,500', 'Status': 'Healthy' },
              { 'SKU Name': 'Iron Rods (16mm)', 'Stock Level': '24 units', 'Cost Value': '8,400', 'Retail Value': '11,200', 'Status': 'Warning' },
              { 'SKU Name': 'PVC Pipes (4")', 'Stock Level': '5 units', 'Cost Value': '1,200', 'Retail Value': '1,800', 'Status': 'Critical' },
              { 'SKU Name': 'Roof Tiles (Red)', 'Stock Level': '1,200 pcs', 'Cost Value': '32,000', 'Retail Value': '48,000', 'Status': 'Healthy' },
              { 'SKU Name': 'Paint (White, 20L)', 'Stock Level': '0 units', 'Cost Value': '0', 'Retail Value': '0', 'Status': 'Out of Stock' }
            ]
          }
        ],
        insights: [
          "Heavy construction materials currently represent 65% of the total inventory value.",
          "Reorder lead time for international suppliers has increased to 28 days.",
          "Electronics items are aging on average 12 days longer than the previous quarter."
        ],
        recommendations: [
          "Trigger reorder for PVC Pipes (4\") immediately to fulfill pending Accra orders.",
          "Run a promotional cleance on slow-moving 'Electronics' stock to free up GHS 80k in capital.",
          "Redirect 20% of 'Roof Tiles' inventory to the Kumasi branch where demand is 3x higher."
        ]
      };
    }

    // Default: Profit & Loss
    return {
      id: `REP-${Math.floor(Math.random() * 10000)}`,
      title: `${config.type} - ${config.dateRange}`,
      generatedAt: new Date().toLocaleString(),
      generatedBy: 'Kwame Asante',
      config: config,
      aiSummary: `Overall revenue has seen a strong growth trajectory of 14% this month, primarily driven by high-volume orders in the Accra Central branch. However, dealer credit utilization is nearing 85% in the Ashanti region, suggesting a need for tighter risk assessments. Supply chain velocity for electronics has improved by 4 days compared to last period.`,
      kpis: [
        { label: 'Net Profit', value: 'GHS 48,240', trend: 'up', trendValue: '14.2%' },
        { label: 'Total Revenue', value: 'GHS 248,200', trend: 'up', trendValue: '12%' },
        { label: 'Operating Expenses', value: 'GHS 158,400', trend: 'up', trendValue: '8%' },
        { label: 'Gross Margin', value: '38.4%', trend: 'up', trendValue: '2.1%' }
      ],
      tables: [
        {
          title: 'Detailed Profit & Loss Statement',
          headers: ['Category', 'Current Period', 'Previous Period', 'Change %'],
          rows: [
            // Revenue
            { 'Category': 'Total Sales Revenue', 'Current Period': '248,200', 'Previous Period': '221,600', 'Change %': '+12.0%' },
            { 'Category': 'Returns & Allowances', 'Current Period': '(4,200)', 'Previous Period': '(3,800)', 'Change %': '+10.5%' },
            { 'Category': 'Net Sales', 'Current Period': '244,000', 'Previous Period': '217,800', 'Change %': '+12.0%', 'type': 'subtotal' },
            // COGS
            { 'Category': 'Cost of Goods Sold (COGS)', 'Current Period': '(150,200)', 'Previous Period': '(138,400)', 'Change %': '+8.5%' },
            { 'Category': 'Gross Profit', 'Current Period': '93,800', 'Previous Period': '79,400', 'Change %': '+18.1%', 'type': 'total' },
            // Operating Expenses
            { 'Category': 'Salaries & Wages', 'Current Period': '(28,500)', 'Previous Period': '(27,000)', 'Change %': '+5.5%' },
            { 'Category': 'Rent & Utilities', 'Current Period': '(12,400)', 'Previous Period': '(12,400)', 'Change %': '0.0%' },
            { 'Category': 'Logistics & Distribution', 'Current Period': '(4,660)', 'Previous Period': '(5,100)', 'Change %': '-8.6%' },
            { 'Category': 'General & Admin', 'Current Period': '(8,240)', 'Previous Period': '(7,800)', 'Change %': '+5.6%' },
            { 'Category': 'Total Operating Expenses', 'Current Period': '(53,800)', 'Previous Period': '(52,300)', 'Change %': '+2.8%', 'type': 'subtotal' },
            // Result
            { 'Category': 'Operating Income (EBIT)', 'Current Period': '40,000', 'Previous Period': '27,100', 'Change %': '+47.6%', 'type': 'total' },
            { 'Category': 'Taxes & Other', 'Current Period': '(8,240)', 'Previous Period': '(5,420)', 'Change %': '+52.0%' },
            { 'Category': 'Net Income', 'Current Period': '31,760', 'Previous Period': '21,680', 'Change %': '+46.5%', 'type': 'final' }
          ]
        }
      ],
      insights: [
        'Dealers in the Central region are showing 22% higher payment reliability than Northern regions.',
        'Inventory restock lag for "Cement (50kg)" has peaked at 14 days due to logistics bottlenecks.',
        'Profit margins on Electronics have increased by 2% following the new supplier agreement.'
      ],
      recommendations: [
        'Increase the credit limit for top 3 performing dealers by 15%.',
        'Optimize delivery routes for Kumasi hub to reduce GHS 4k in wasted fuel costs.',
        'Initiate re-order for high-turnover items in the Ashanti branch today.'
      ]
    };
  }
}

export const reportService = new ReportService();
