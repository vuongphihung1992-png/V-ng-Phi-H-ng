import React, { useState, useEffect } from 'react';
import { X, Search, Phone, ShieldCheck, UserCheck, MapPin, ExternalLink, Copy, Check, Users } from 'lucide-react';
import { HamletOfficer } from '../types';
import { dataService } from '../services/dataService';
import { HAMLETS } from '../data/mockData';

interface HamletOfficersModalProps {
  onClose: () => void;
  initialHamletId?: string;
}

export const HamletOfficersModal: React.FC<HamletOfficersModalProps> = ({
  onClose,
  initialHamletId = '1'
}) => {
  const [officers, setOfficers] = useState<HamletOfficer[]>([]);
  const [selectedHamlet, setSelectedHamlet] = useState<string>(initialHamletId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getHamletOfficers();
      setOfficers(data);
    } catch (e) {
      console.error('Lỗi khi tải danh sách cán bộ', e);
    } finally {
      setLoading(false);
    }
  };

  const hamlets = HAMLETS;

  const filteredOfficers = officers.filter((officer) => {
    const matchesHamlet = selectedHamlet === 'all' || officer.hamletId === selectedHamlet;
    const matchesQuery =
      searchQuery.trim() === '' ||
      officer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.phone.includes(searchQuery) ||
      officer.hamletName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHamlet && matchesQuery;
  });

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-white p-4 sm:p-5 relative border-b border-amber-500/30 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-400 text-red-950 rounded-2xl font-black shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-300 bg-red-900/80 px-2 py-0.5 rounded border border-amber-400/30">
                  ĐỊA BÀN NƠI CƯ TRÚ
                </span>
                <span className="text-xs text-red-200 font-medium">12 Thôn Xã Pơng Drang</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 mt-0.5 uppercase tracking-wide">
                Cán Bộ Quản Lý Địa Bàn
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cán bộ, số điện thoại, cấp bậc, chức vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* 12 Thôn Tab Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-red-950 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-700" />
                  CHỌN THÔN QUẢN LÝ (12 THÔN):
                </span>
                <button
                  onClick={() => setSelectedHamlet('all')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                    selectedHamlet === 'all'
                      ? 'bg-red-800 text-white'
                      : 'text-slate-500 hover:text-red-800 hover:bg-slate-100'
                  }`}
                >
                  Xem tất cả
                </button>
              </div>

              {/* Grid 12 Thôn */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                {hamlets.map((h) => {
                  const isActive = selectedHamlet === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHamlet(h.id)}
                      className={`py-1.5 px-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center border truncate ${
                        isActive
                          ? 'bg-amber-400 text-red-950 border-amber-500 shadow-xs font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                      title={h.name}
                    >
                      {h.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Officers Cards List */}
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs font-medium animate-pulse">
              Đang tải danh sách cán bộ...
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Chưa tìm thấy thông tin cán bộ phù hợp</p>
              <p className="text-[11px] text-slate-400">Vui lòng thử chọn Thôn khác hoặc kiểm tra lại từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredOfficers.map((officer) => (
                <div
                  key={officer.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all p-3.5 flex flex-col justify-between space-y-3 relative overflow-hidden group"
                >
                  {/* Top Badge Hamlet Name */}
                  <div className="flex items-start gap-3">
                    {/* Hình thẻ Cán bộ */}
                    <div className="relative shrink-0">
                      <img
                        src={officer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={officer.fullName}
                        className="w-16 h-20 object-cover rounded-xl border-2 border-red-900/40 shadow-xs group-hover:scale-105 transition-transform bg-slate-100"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-red-800 text-white p-1 rounded-full text-[9px] shadow-2xs" title="Cán bộ CAND">
                        <UserCheck className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Officer Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md border border-amber-300">
                          {officer.hamletName}
                        </span>
                        <span className="text-[10px] font-bold text-red-800 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          {officer.rank}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 mt-1 line-clamp-1">
                        {officer.fullName}
                      </h3>

                      <p className="text-xs font-bold text-red-900/90 mt-0.5 leading-snug">
                        {officer.position}
                      </p>

                      {officer.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {officer.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Call Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">SỐ ĐIỆN THOẠI TRỰC BÀN:</span>
                      <span className="text-xs font-black text-red-700 tracking-wide">{officer.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyPhone(officer.phone)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                        title="Sao chép số"
                      >
                        {copiedPhone === officer.phone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={`tel:${officer.phone.replace(/\./g, '')}`}
                        className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi điện</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Citizen Notice Footer */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              LƯU Ý DÀNH CHO CÔNG DÂN THÔN XÃ PƠNG DRANG:
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Cán bộ quản lý địa bàn chịu trách nhiệm hướng dẫn thủ tục cư trú, cấp VNeID và tiếp nhận thông tin phản ánh an ninh trật tự tại từng thôn. Trường hợp khẩn cấp, bà con có thể gọi ngay Hotline Trực ban Công an xã: <strong className="text-red-800">0262 3876 113</strong> (24/7).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
