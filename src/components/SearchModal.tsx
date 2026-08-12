import React, { useState } from 'react';
import { X, Search, FileText, Bell, Newspaper, HelpCircle, ChevronRight } from 'lucide-react';
import { Announcement, NewsItem, Procedure, FAQItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  news: NewsItem[];
  procedures: Procedure[];
  faqs: FAQItem[];
  onOpenReport: () => void;
  onOpenAppointment: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  announcements,
  news,
  procedures,
  faqs,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingAnnouncements = trimmed
    ? announcements.filter(
        (a) => a.title.toLowerCase().includes(trimmed) || a.summary.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingNews = trimmed
    ? news.filter(
        (n) => n.title.toLowerCase().includes(trimmed) || n.summary.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingProcedures = trimmed
    ? procedures.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.code.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed)
      )
    : [];

  const matchingFaqs = trimmed
    ? faqs.filter(
        (f) => f.question.toLowerCase().includes(trimmed) || f.answer.toLowerCase().includes(trimmed)
      )
    : [];

  const totalResults =
    matchingAnnouncements.length + matchingNews.length + matchingProcedures.length + matchingFaqs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-purple-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-purple-950">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                TRA CỨU THÔNG TIN TỔNG HỢP
              </h3>
              <p className="text-[11px] text-purple-100">Tìm kiếm thông báo, thủ tục & tin tức</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Nhập từ khóa cần tra cứu (ví dụ: thường trú, VNeID, trộm cắp, lịch tiếp...)..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-purple-300 rounded-xl text-xs font-semibold focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
            />
          </div>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!trimmed ? (
            <div className="text-center py-10 space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">
                Hãy nhập từ khóa để tra cứu thông tin trên hệ thống.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Thường trú', 'VNeID', 'Căn cước', 'An ninh trật tự', 'Trực ban'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-purple-50 text-purple-800 text-[11px] font-bold rounded-lg border border-purple-200 hover:bg-purple-100"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Không tìm thấy kết quả phù hợp cho "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500">
                Tìm thấy <strong className="text-purple-900">{totalResults}</strong> kết quả:
              </p>

              {/* Procedures */}
              {matchingProcedures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-blue-900 uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-700" /> Thủ tục hành chính ({matchingProcedures.length})
                  </h4>
                  {matchingProcedures.map((p) => (
                    <div key={p.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs">
                      <div className="font-bold text-slate-900">{p.title} ({p.code})</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">Thời gian: {p.processingTime} • Lệ phí: {p.fee}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Announcements */}
              {matchingAnnouncements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-red-900 uppercase flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-red-700" /> Thông báo ({matchingAnnouncements.length})
                  </h4>
                  {matchingAnnouncements.map((a) => (
                    <div key={a.id} className="p-3 bg-red-50/50 rounded-xl border border-red-200 text-xs">
                      <div className="font-bold text-slate-900">{a.title}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{a.summary}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* News */}
              {matchingNews.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-amber-900 uppercase flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-amber-700" /> Tin tức & Hoạt động ({matchingNews.length})
                  </h4>
                  {matchingNews.map((n) => (
                    <div key={n.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs">
                      <div className="font-bold text-slate-900">{n.title}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{n.summary}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* FAQs */}
              {matchingFaqs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-indigo-900 uppercase flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-700" /> Câu hỏi thường gặp ({matchingFaqs.length})
                  </h4>
                  {matchingFaqs.map((f) => (
                    <div key={f.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs">
                      <div className="font-bold text-slate-900">{f.question}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{f.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
