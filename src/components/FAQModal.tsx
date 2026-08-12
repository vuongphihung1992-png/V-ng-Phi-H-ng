import React, { useState } from 'react';
import { X, HelpCircle, Search, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqs: FAQItem[];
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, faqs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  if (!isOpen) return null;

  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-indigo-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-indigo-950">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                CÂU HỎI THƯỜNG GẶP (FAQ)
              </h3>
              <p className="text-[11px] text-indigo-100">Giải đáp thắc mắc về an ninh & thủ tục</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập câu hỏi hoặc từ khóa tìm kiếm..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:border-indigo-600 outline-none"
            />
          </div>
        </div>

        {/* Accordions */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">Không tìm thấy câu hỏi phù hợp.</div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpenItem = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpenItem ? null : faq.id)}
                    className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-start justify-between gap-2 hover:bg-indigo-50/50 transition-colors"
                  >
                    <span className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </span>
                    {isOpenItem ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpenItem && (
                    <div className="p-3.5 pt-0 text-xs text-slate-700 leading-relaxed border-t border-slate-200/50 bg-white">
                      {faq.answer}
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
