import React, { useState, useRef, useEffect } from 'react';
import { Search, X, FileText, Bell, Newspaper, HelpCircle, ChevronRight, Tag } from 'lucide-react';
import { Announcement, NewsItem, Procedure, FAQItem, ModalType } from '../types';

interface SearchBarProps {
  announcements: Announcement[];
  news: NewsItem[];
  procedures: Procedure[];
  faqs: FAQItem[];
  onOpenModal: (modal: ModalType) => void;
  onOpenNewsDetail?: (newsItem: NewsItem) => void;
  onOpenAnnouncementDetail?: (announcement: Announcement) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  announcements,
  news,
  procedures,
  faqs,
  onOpenModal,
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  // Filter matching items
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

  // Handle click outside to collapse results list if empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!trimmed) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trimmed]);

  const quickTags = [
    { label: 'Thường trú', query: 'thường trú' },
    { label: 'VNeID', query: 'VNeID' },
    { label: 'Căn cước', query: 'căn cước' },
    { label: 'Lịch tiếp dân', query: 'tiếp dân' },
    { label: 'Phản ánh ANTT', query: 'phản ánh' },
  ];

  return (
    <section ref={containerRef} className="max-w-md sm:max-w-2xl mx-auto px-3.5 pt-2">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2.5 sm:p-3 transition-all hover:border-red-300">
        {/* Search Input Control */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-red-800 pointer-events-none">
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
            placeholder="Tra cứu tin tức, thông báo, thủ tục (VNeID, cư trú...)..."
            className="w-full pl-9 pr-8 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all min-h-[44px]"
          />

          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setIsExpanded(false);
              }}
              className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Xóa từ khóa"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-2.5 hidden sm:flex items-center gap-1 pointer-events-none">
              <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                Tra cứu
              </span>
            </div>
          )}
        </div>

        {/* Quick Tag Suggestion Chips */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-red-800" /> Nổi bật:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => {
                setQuery(tag.query);
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all active:scale-95 border ${
                trimmed === tag.query.toLowerCase()
                  ? 'bg-red-900 text-white border-red-900 shadow-2xs'
                  : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-900 border-slate-200/80'
              }`}
            >
              #{tag.label}
            </button>
          ))}
        </div>

        {/* Expanded Live Search Results Panel */}
        {isExpanded && trimmed && (
          <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <span className="text-xs font-bold text-slate-600">
                Kết quả tìm kiếm cho "<strong className="text-red-900 font-extrabold">{query}</strong>":
              </span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-900">
                {totalResults} kết quả
              </span>
            </div>

            {totalResults === 0 ? (
              <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 font-medium">
                Không tìm thấy nội dung phù hợp. Bạn có thể tra cứu thủ tục hoặc gửi thắc mắc qua mục FAQ.
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      onOpenModal('procedures');
                      setIsExpanded(false);
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-blue-800 font-bold rounded-lg text-[11px] hover:bg-blue-100"
                  >
                    Xem tất cả Thủ tục
                  </button>
                  <button
                    onClick={() => {
                      onOpenModal('faq');
                      setIsExpanded(false);
                    }}
                    className="px-3 py-1.5 bg-amber-50 text-amber-900 font-bold rounded-lg text-[11px] hover:bg-amber-100"
                  >
                    Hỏi đáp FAQ
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {/* Procedures */}
                {matchingProcedures.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-extrabold text-blue-900 uppercase tracking-tight flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-blue-700" /> Thủ tục hành chính ({matchingProcedures.length})
                      </span>
                    </div>
                    {matchingProcedures.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onOpenModal('procedures');
                          setIsExpanded(false);
                        }}
                        className="p-2.5 bg-blue-50/60 hover:bg-blue-100/80 rounded-xl border border-blue-200/80 text-xs transition-colors cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-900">
                            {p.title} <span className="text-[10px] text-blue-700 font-extrabold bg-blue-100 px-1.5 py-0.5 rounded ml-1">{p.code}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Thời gian: {p.processingTime} • Lệ phí: {p.fee}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Announcements */}
                {matchingAnnouncements.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-extrabold text-red-900 uppercase tracking-tight flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5 text-red-700" /> Thông báo ({matchingAnnouncements.length})
                      </span>
                    </div>
                    {matchingAnnouncements.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onOpenModal('announcements_list');
                          setIsExpanded(false);
                        }}
                        className="p-2.5 bg-red-50/60 hover:bg-red-100/80 rounded-xl border border-red-200/80 text-xs transition-colors cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-red-950 line-clamp-1">
                            {a.title}
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            {a.summary}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-red-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}

                {/* News */}
                {matchingNews.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-extrabold text-amber-900 uppercase tracking-tight flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Newspaper className="w-3.5 h-3.5 text-amber-800" /> Tin tức ({matchingNews.length})
                      </span>
                    </div>
                    {matchingNews.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onOpenModal('news_list');
                          setIsExpanded(false);
                        }}
                        className="p-2.5 bg-amber-50/60 hover:bg-amber-100/80 rounded-xl border border-amber-200/80 text-xs transition-colors cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-amber-950 line-clamp-1">
                            {n.title}
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            {n.summary}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}

                {/* FAQs */}
                {matchingFaqs.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-tight flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-700" /> Hỏi đáp FAQ ({matchingFaqs.length})
                      </span>
                    </div>
                    {matchingFaqs.slice(0, 3).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => {
                          onOpenModal('faq');
                          setIsExpanded(false);
                        }}
                        className="p-2.5 bg-indigo-50/60 hover:bg-indigo-100/80 rounded-xl border border-indigo-200/80 text-xs transition-colors cursor-pointer group flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-950 line-clamp-1">
                            {f.question}
                          </div>
                          <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            {f.answer}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
