import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  Printer,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  LayoutDashboard,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { ReportConfig, ReportData, ReportType, DateRangeType } from '../types';
import { reportService } from '../services/reportService';

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'config', title: 'Configure', icon: LayoutDashboard },
  { id: 'generating', title: 'Analysing', icon: Sparkles },
  { id: 'results', title: 'Review', icon: FileText }
];

const REPORT_TYPES: ReportType[] = [
  'Profit & Loss',
  'Inventory Summary',
  'Dealer Credit Report',
  'Order & Payment Report',
  'Supplier Consignment Report',
  'Delivery Performance Report'
];

const DATE_RANGES: DateRangeType[] = ['Today', 'This Week', 'This Month', 'Custom Range'];

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<ReportConfig>({
    type: '',
    dateRange: 'This Month',
    scope: {
      branches: ['All Branches'],
      dealers: ['All Dealers'],
      suppliers: ['All Suppliers']
    }
  });

  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setGeneratedReport(null);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setCurrentStep(1);
    try {
      const result = await reportService.generateReport(config);
      setGeneratedReport(result);
      setCurrentStep(2);
    } catch (error) {
      console.error('Report Generation Error:', error);
      // Fallback or error state could be handled here
      setCurrentStep(0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#09090B]/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[840px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#ECEDEF] flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#D40073] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-[#D40073]/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#111111] tracking-tight">Intelligent Report Generation</h2>
                <div className="flex items-center gap-4 mt-1">
                  {STEPS.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${idx <= currentStep ? 'bg-[#D40073]' : 'bg-[#ECEDEF]'}`} />
                      <span className={`text-[12px] font-semibold ${idx === currentStep ? 'text-[#111111]' : 'text-[#8B93A7]'}`}>
                        {step.title}
                      </span>
                      {idx < STEPS.length - 1 && <ChevronRight size={14} className="text-[#ECEDEF]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] hover:text-[#111111] transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div 
                  key="step-config"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-10 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Report Type */}
                    <div className="space-y-3">
                      <label className="text-[13px] font-bold text-[#111111] flex items-center gap-2 uppercase tracking-wider">
                        <FileText size={16} className="text-[#D40073]" /> Report Type
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {REPORT_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => setConfig({ ...config, type })}
                            className={`text-left px-4 py-3 rounded-[12px] text-[14px] font-medium transition-all border ${
                              config.type === type 
                                ? 'bg-[#D40073]/5 border-[#D40073] text-[#D40073]' 
                                : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#D40073]/40'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Date Range */}
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-[#111111] flex items-center gap-2 uppercase tracking-wider">
                          <Calendar size={16} className="text-[#D40073]" /> Date Range
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DATE_RANGES.map(range => (
                            <button
                              key={range}
                              onClick={() => setConfig({ ...config, dateRange: range })}
                              className={`px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all border ${
                                config.dateRange === range 
                                  ? 'bg-[#111111] border-[#111111] text-white' 
                                  : 'bg-white border-[#ECEDEF] text-[#525866] hover:border-[#8B93A7]'
                              }`}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Scope Selection */}
                      <div className="space-y-3">
                        <label className="text-[13px] font-bold text-[#111111] flex items-center gap-2 uppercase tracking-wider">
                          <MapPin size={16} className="text-[#D40073]" /> Scope Selection
                        </label>
                        <div className="p-5 bg-[#FBFBFC] rounded-[16px] border border-[#ECEDEF] space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] text-[#525866] font-medium">Applied Filters</span>
                            <span className="text-[11px] font-bold py-0.5 px-2 bg-white rounded-full border border-[#ECEDEF]">3 Active</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-[#16A34A]" />
                              <span className="text-[13px] text-[#111111] font-medium">All Branches & Locations</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-[#16A34A]" />
                              <span className="text-[13px] text-[#111111] font-medium">All Business Partners (Dealers)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-[#16A34A]" />
                              <span className="text-[13px] text-[#111111] font-medium">Consignment & Direct Suppliers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div 
                  key="step-generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-20 flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="w-32 h-32 rounded-full border-[3px] border-dashed border-[#D40073]/30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D40073] to-[#7C3AED] flex items-center justify-center text-white shadow-xl shadow-[#D40073]/40"
                      >
                        <Sparkles size={32} />
                      </motion.div>
                    </div>
                    {/* Floating Orbs */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          x: [0, Math.cos(i) * 60, 0],
                          y: [0, Math.sin(i) * 60, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#D40073]"
                      />
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-[24px] font-bold text-[#111111]">Analysing Business Data...</h3>
                    <p className="text-[15px] text-[#525866] max-w-[400px]">
                      Our AI model is interpreting cross-service metrics and generating your narrative report.
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-[300px] h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4 }}
                      className="h-full bg-[#D40073]"
                    />
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#8B93A7]">
                      <RefreshCw size={14} className="animate-spin" /> FETCHING PAYMENTS
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#8B93A7]">
                      <RefreshCw size={14} className="animate-spin" /> PARSING INVENTORY
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && generatedReport && (
                <motion.div 
                  key="step-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 space-y-8"
                >
                  {/* Generated Report View */}
                  <div className="bg-white border border-[#ECEDEF] rounded-[20px] overflow-hidden">
                    <div className="p-6 bg-[#FBFBFC] border-b border-[#ECEDEF] flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[10px] bg-white border border-[#ECEDEF] flex items-center justify-center text-[#111111]">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#525866] text-[10px] font-bold uppercase rounded border border-[#ECEDEF]">Official Report</span>
                            <span className="text-[11px] text-[#8B93A7]">{generatedReport.id}</span>
                          </div>
                          <h3 className="text-[22px] font-bold text-[#111111] tracking-tight leading-none">{generatedReport.title}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="h-9 px-3.5 bg-white border border-[#ECEDEF] rounded-[8px] text-[12px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-all flex items-center gap-2">
                          <Download size={15} /> PDF
                        </button>
                        <button className="h-9 px-3.5 bg-white border border-[#ECEDEF] rounded-[8px] text-[12px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-all flex items-center gap-2">
                          <FileSpreadsheet size={15} /> Excel
                        </button>
                        <button className="h-9 px-3.5 bg-white border border-[#ECEDEF] rounded-[8px] text-[12px] font-bold text-[#111111] hover:bg-[#F3F4F6] transition-all flex items-center gap-2">
                          <FileJson size={15} /> JSON
                        </button>
                      </div>
                    </div>

                    <div className="p-8 space-y-10">
                      {/* AI Summary Block - Refined (No Glow) */}
                      <div className="p-6 bg-[#FBFBFC] border border-[#ECEDEF] rounded-[18px] space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[13px] font-bold text-[#111111] flex items-center gap-2 uppercase tracking-tight">
                            <Sparkles size={16} className="text-[#D40073]" /> Narrative Executive Summary
                          </h4>
                          <span className="text-[10px] font-bold text-[#8B93A7] px-2 py-0.5 bg-white border border-[#ECEDEF] rounded-full">INTELLIGENT INSIGHTS</span>
                        </div>
                        <p className="text-[15px] text-[#111111] leading-relaxed font-medium">
                          {generatedReport.aiSummary}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {generatedReport.kpis.map((kpi, idx) => (
                          <div key={idx} className="p-4 bg-white border border-[#ECEDEF] rounded-[16px]">
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider mb-1.5">{kpi.label}</p>
                            <div className="flex items-end justify-between">
                              <h5 className="text-[18px] font-bold text-[#111111]">{kpi.value}</h5>
                              {kpi.trend && (
                                <span className={`flex items-center text-[11px] font-bold ${kpi.trend === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                                  {kpi.trend === 'up' ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                                  {kpi.trendValue}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial Statement / Data Table */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[14px] font-bold text-[#111111] uppercase tracking-tight">{generatedReport.tables[0].title}</h4>
                          <span className="text-[11px] font-medium text-[#8B93A7]">Reporting period: {config.dateRange}</span>
                        </div>
                        <div className="overflow-hidden border border-[#ECEDEF] rounded-[18px] bg-white">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#FBFBFC] border-b border-[#ECEDEF]">
                                {generatedReport.tables[0].headers.map((header, idx) => (
                                  <th key={header} className={`px-5 py-3.5 text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider ${idx === 0 ? 'w-[40%]' : 'text-right'}`}>
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {generatedReport.tables[0].rows.map((row, i) => {
                                const isTotal = row.type === 'total' || row.type === 'final';
                                const isSubtotal = row.type === 'subtotal';
                                return (
                                  <tr key={i} className={`
                                    ${isTotal ? 'bg-[#F3F4F6]' : 'hover:bg-[#FBFBFC]'} 
                                    ${isSubtotal ? 'bg-[#FBFBFC]' : ''}
                                    transition-colors
                                  `}>
                                    <td className={`px-5 py-3 text-[13px] ${isTotal || isSubtotal ? 'font-bold text-[#111111]' : 'text-[#525866]'}`}>
                                      {isSubtotal ? '— ' : ''}{row.Category || row['SKU Name']}
                                    </td>
                                    <td className={`px-5 py-3 text-[13px] text-right font-medium ${isTotal ? 'text-[#111111]' : 'text-[#525866]'}`}>
                                      {row['Current Period'] || row['Stock Level']}
                                    </td>
                                    <td className="px-5 py-3 text-[13px] text-right text-[#8B93A7] font-medium">
                                      {row['Previous Period'] || row['Cost Value']}
                                    </td>
                                    <td className="px-5 py-3 text-[13px] text-right">
                                      {row['Status'] ? (
                                        <div className="flex justify-end">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            row['Status'] === 'Healthy' ? 'bg-[#ECFDF3] text-[#16A34A] border border-[#16A34A]/20' :
                                            row['Status'] === 'Warning' ? 'bg-[#FFF7ED] text-[#D97706] border border-[#D97706]/20' :
                                            row['Status'] === 'Out of Stock' ? 'bg-[#F3F4F6] text-[#8B93A7] border border-[#ECEDEF]' :
                                            'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20'
                                          }`}>
                                            {row['Status']}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className={`font-bold ${
                                          String(row['Change %'] || '').startsWith('+') ? 'text-[#16A34A]' : 
                                          String(row['Change %'] || '').startsWith('-') ? 'text-[#DC2626]' : 
                                          'text-[#525866]'
                                        }`}>
                                          {row['Change %']}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Insights & Recommendations - Refined */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#ECEDEF]">
                        <div className="space-y-3">
                          <h4 className="text-[13px] font-bold text-[#111111] flex items-center gap-2 uppercase tracking-tight">
                            <AlertCircle size={16} className="text-[#8B93A7]" /> Critical Insights
                          </h4>
                          <div className="space-y-2">
                            {generatedReport.insights.map((insight, i) => (
                              <div key={i} className="p-3 bg-white border border-[#ECEDEF] rounded-[12px] flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#D40073] mt-1.5 shrink-0" />
                                <p className="text-[12px] text-[#525866] font-medium leading-relaxed">{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[13px] font-bold text-[#111111] flex items-center gap-2 uppercase tracking-tight">
                            <TrendingUp size={16} className="text-[#16A34A]" /> AI Recommendations
                          </h4>
                          <div className="space-y-2">
                            {generatedReport.recommendations.map((rec, i) => (
                              <div key={i} className="p-3 bg-[#ECFDF3]/50 border border-[#16A34A]/20 rounded-[12px] flex gap-3 items-start">
                                <CheckCircle2 size={14} className="text-[#16A34A] mt-0.5 shrink-0" />
                                <p className="text-[12px] text-[#111111] font-bold leading-relaxed">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-[#ECEDEF] flex justify-between items-center bg-white sticky bottom-0 z-10 rounded-b-[24px]">
            {currentStep === 0 ? (
              <>
                <p className="text-[13px] text-[#8B93A7] font-medium">Ready to analyze? Click the button to start the AI model.</p>
                <div className="flex items-center gap-3">
                  <button 
                    disabled={!config.type}
                    onClick={handleGenerate}
                    className={`h-[48px] px-8 rounded-[12px] text-[15px] font-bold transition-all flex items-center gap-2 shadow-lg ${
                      config.type 
                        ? 'bg-[#111111] text-white hover:bg-[#000000] hover:-translate-y-0.5 shadow-gray-200' 
                        : 'bg-[#F3F4F6] text-[#8B93A7] cursor-not-allowed shadow-none'
                    }`}
                  >
                    Generate Intelligent Report <Sparkles size={18} />
                  </button>
                </div>
              </>
            ) : currentStep === 2 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <p className="text-[13px] text-[#16A34A] font-bold underline">Report Saved to History</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentStep(0)}
                    className="h-11 px-6 bg-white border border-[#ECEDEF] rounded-[10px] text-[13px] font-bold text-[#525866] hover:bg-[#F3F4F6] transition-all"
                  >
                    Generate New
                  </button>
                  <button 
                    className="h-11 px-6 bg-[#D40073] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#B80063] transition-all flex items-center gap-2 shadow-lg shadow-[#D40073]/20"
                  >
                    <Printer size={16} /> Print Report
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center italic text-[#8B93A7] text-[13px] font-medium">
                Wait while the AI agent extracts multi-service insights...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
