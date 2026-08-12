import React, { useState } from 'react';
import {
  X,
  FileText,
  Search,
  Clock,
  Coins,
  CheckCircle,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Procedure } from '../types';

interface ProceduresModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedures: Procedure[];
  onOpenAppointment: () => void;
}

export const ProceduresModal: React.FC<ProceduresModalProps> = ({
  isOpen,
  onClose,
  procedures,
  onOpenAppointment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['Tất cả', 'Cư trú', 'CCCD/Định danh', 'PCCC'];

  const filteredProcedures = procedures.filter((p) => {
    const matchesCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-blue-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-blue-950">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                HƯỚNG DẪN THỦ TỤC HÀNH CHÍNH
              </h3>
              <p className="text-[11px] text-blue-100">Cơ sở dữ liệu quy trình & thành phần hồ sơ chuẩn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên thủ tục hoặc mã thủ tục (ví dụ: đăng ký thường trú)..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Procedures List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {filteredProcedures.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Không tìm thấy thủ tục hành chính phù hợp.
            </div>
          ) : (
            filteredProcedures.map((proc) => {
              const isExpanded = expandedId === proc.id;

              return (
                <div
                  key={proc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-blue-300"
                >
                  {/* Card Header (clickable) */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : proc.id)}
                    className="p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-blue-50/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-extrabold">
                          {proc.code}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {proc.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {proc.title}
                      </h4>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {proc.processingTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          {proc.fee}
                        </span>
                      </div>
                    </div>

                    <button className="p-1 rounded-lg text-slate-400 hover:text-blue-800 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Guidance */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-700 space-y-3 animate-in fade-in">
                      {/* Requirements */}
                      <div>
                        <h5 className="font-extrabold text-slate-900 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          Thành phần hồ sơ cần chuẩn bị:
                        </h5>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                          {proc.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Steps */}
                      <div>
                        <h5 className="font-extrabold text-slate-900 mb-1.5">Trình tự thực hiện:</h5>
                        <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                          {proc.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                        {proc.formName && (
                          <button
                            onClick={() => alert(`Đang tải mẫu tờ khai demo: ${proc.formName}`)}
                            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>Tải mẫu biểu</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onClose();
                            onOpenAppointment();
                          }}
                          className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs active:scale-95 transition-all ml-auto"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-300" />
                          <span>Đặt lịch làm thủ tục này</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
