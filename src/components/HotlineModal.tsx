import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  MapPin,
  ExternalLink,
  Shield,
  Edit2,
  Check,
  AlertCircle,
  Siren,
  Building,
} from 'lucide-react';
import { HotlineNumber } from '../types';

interface HotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotlines: HotlineNumber[];
  onUpdateHotline?: (id: string, newNumber: string) => void;
}

export const HotlineModal: React.FC<HotlineModalProps> = ({
  isOpen,
  onClose,
  hotlines,
  onUpdateHotline,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  if (!isOpen) return null;

  const addressText = 'Trụ sở Công an xã Pơng Drang, Tỉnh Đắk Lắk';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Công an xã Pơng Drang, Đắk Lắk'
  )}`;

  const handleStartEdit = (item: HotlineNumber) => {
    setEditingId(item.id);
    setEditVal(item.number === 'Chưa cập nhật số điện thoại chính thức' ? '' : item.number);
  };

  const handleSaveEdit = (id: string) => {
    const finalNum = editVal.trim() || 'Chưa cập nhật số điện thoại chính thức';
    if (onUpdateHotline) {
      onUpdateHotline(id, finalNum);
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-red-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-red-950">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                ĐƯỜNG DÂY LIÊN HỆ
              </h3>
              <p className="text-[11px] text-red-100">Hotline khẩn cấp & danh bạ liên hệ Công an xã</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Official Hotlines List */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-red-700" />
              SỐ ĐIỆN THOẠI TRỰC BAN & TIẾP NHẬN
            </h4>

            {hotlines.map((item) => {
              const hasValidNumber =
                item.number && item.number !== 'Chưa cập nhật số điện thoại chính thức';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.isEmergency
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h5>
                        {item.isEmergency && (
                          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-black">
                            24/7
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    </div>

                    {/* Admin edit toggle */}
                    <button
                      onClick={() =>
                        editingId === item.id ? handleSaveEdit(item.id) : handleStartEdit(item)
                      }
                      className="p-1 text-slate-400 hover:text-red-700 text-xs shrink-0"
                      title="Cập nhật số điện thoại (Chế độ quản trị)"
                    >
                      {editingId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Edit2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Phone Number Display / Edit Input */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          placeholder="Nhập số ĐT chính thức..."
                          className="flex-1 px-2.5 py-1.5 bg-white border border-red-400 rounded-lg text-xs font-bold"
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm sm:text-base font-black tracking-wider">
                          {hasValidNumber ? (
                            <span className="text-red-900">{item.number}</span>
                          ) : (
                            <span className="text-slate-400 font-medium italic text-xs">
                              Chưa cập nhật số điện thoại chính thức
                            </span>
                          )}
                        </div>

                        {hasValidNumber ? (
                          <a
                            href={`tel:${item.number.replace(/\s/g, '')}`}
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                            <span>GỌI NGAY</span>
                          </a>
                        ) : (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-semibold">
                            Chờ cập nhật
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Office Address & Map Card */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-amber-700" />
              ĐỊA CHỈ TRỤ SỞ & BẢN ĐỒ VỊ TRÍ
            </h4>

            <div className="flex items-start gap-2 text-xs text-amber-950 font-medium">
              <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>{addressText}</span>
            </div>

            {/* Embedded Map in Hotline Modal */}
            <div className="rounded-xl overflow-hidden border border-amber-300 shadow-2xs h-48 bg-slate-200 relative">
              <iframe
                title="Bản đồ vị trí Công an xã Pơng Drang"
                src="https://maps.google.com/maps?q=Cong+An+Xa+Pong+Drang,+Krong+Buk,+Dak+Lak&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="pt-1 flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>CHỈ ĐƯỜNG TRÊN GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Admin Guidance note */}
          <div className="p-2.5 bg-slate-100 rounded-xl text-[10px] text-slate-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Số điện thoại chính thức có thể được chỉnh sửa trực tiếp bởi Cán bộ quản trị thông qua biểu tượng cây bút.
            </span>
          </div>
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
