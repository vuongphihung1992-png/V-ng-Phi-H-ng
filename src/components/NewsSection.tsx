import React, { useState } from 'react';
import { Newspaper, Calendar, ChevronRight, X, Clock } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
  onOpenAll: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onOpenAll }) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <section className="max-w-md sm:max-w-2xl mx-auto px-3.5 py-2.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100/90 text-amber-900 shrink-0">
            <Newspaper className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-red-950 uppercase tracking-tight">
              TIN TỨC & HOẠT ĐỘNG
            </h3>
            <p className="text-[11px] text-slate-500 font-bold">
              Tin an ninh trật tự & phong trào toàn dân bảo vệ ANTQ
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAll}
          className="text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-0.5 group active:scale-95"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {news.slice(0, 4).map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedNews(item)}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            {/* Image Thumbnail */}
            <div className="relative h-36 sm:h-40 overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-red-950/90 text-amber-300 text-[10px] font-extrabold border border-amber-400/30">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> 3 phút đọc
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-900 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Công an xã Pơng Drang</span>
                <span className="text-red-800 font-bold group-hover:underline flex items-center gap-0.5">
                  Đọc tiếp <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Article Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="bg-red-950 p-3.5 text-white flex items-center justify-between shrink-0 border-b border-amber-500/30">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                TIN TỨC & HOẠT ĐỘNG AN NINH
              </span>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-1.5 rounded-xl text-red-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 rounded-lg bg-red-50 text-red-900 font-extrabold border border-red-200">
                  {selectedNews.category}
                </span>
                <span className="text-slate-600 font-bold">{selectedNews.date}</span>
              </div>

              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug">
                {selectedNews.title}
              </h1>

              {/* Cover Image */}
              <div className="rounded-xl overflow-hidden max-h-64 sm:max-h-80 bg-slate-100">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Body */}
              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed space-y-3 font-normal">
                {selectedNews.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">Nguồn: Công an xã Pơng Drang</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-all"
              >
                Đóng bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

