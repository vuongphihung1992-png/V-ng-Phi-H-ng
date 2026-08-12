import React, { useState, useEffect } from 'react';
import { ContactInfo } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Save,
  CheckCircle2,
  PhoneCall,
  Share2
} from 'lucide-react';

export const ContactAdmin: React.FC = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setLoading(true);
    const data = await dataService.getContactInfo();
    setContact(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setSaving(true);
    await dataService.updateContactInfo(contact);
    setSaving(false);
    showToast('Đã lưu cập nhật thông tin liên hệ thành công!');
  };

  if (loading || !contact) {
    return <div className="py-12 text-center text-slate-400 text-xs font-medium">Đang tải thông tin liên hệ...</div>;
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-red-800" />
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">
              QUẢN LÝ THÔNG TIN LIÊN HỆ & TRỤ SỞ
            </h3>
            <p className="text-[11px] text-slate-500">
              Tùy chỉnh linh hoạt thông tin đơn vị, số điện thoại hotline, địa chỉ hiển thị cho người dân
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Unit Name & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-red-700" />
                Tên đơn vị *
              </label>
              <input
                type="text"
                required
                value={contact.unitName || ''}
                onChange={(e) => setContact({ ...contact, unitName: e.target.value })}
                placeholder="CÔNG AN XÃ PƠNG DRANG"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-extrabold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cấp hành chính / Tỉnh</label>
              <input
                type="text"
                value={contact.districtProvince || ''}
                onChange={(e) => setContact({ ...contact, districtProvince: e.target.value })}
                placeholder="Tỉnh Đắk Lắk"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-700" />
              Địa chỉ Trụ sở *
            </label>
            <input
              type="text"
              required
              value={contact.address || ''}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              placeholder="Thôn 3, Xã Pơng Drang, Tỉnh Đắk Lắk"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
            />
          </div>

          {/* Hotline & Phone (No hardcoded phones, completely editable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-red-700" />
                Số điện thoại Hotline Trực ban *
              </label>
              <input
                type="text"
                required
                value={contact.hotlinePhone || ''}
                onChange={(e) => setContact({ ...contact, hotlinePhone: e.target.value })}
                placeholder="Ví dụ: 0262 3876 113"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-extrabold text-red-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                Số di động Trực ban 24/7
              </label>
              <input
                type="text"
                value={contact.dutyPhone || ''}
                onChange={(e) => setContact({ ...contact, dutyPhone: e.target.value })}
                placeholder="Ví dụ: 0987 654 321"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-bold"
              />
            </div>
          </div>

          {/* Email & Google Maps URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-700" />
                Email công vụ chính thức
              </label>
              <input
                type="email"
                value={contact.email || ''}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="conganxapongdrang@daklak.gov.vn"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                Đường dẫn Google Maps URL
              </label>
              <input
                type="text"
                value={contact.googleMapsUrl || ''}
                onChange={(e) => setContact({ ...contact, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-700" />
              Thời gian làm việc & tiếp công dân
            </label>
            <textarea
              rows={2}
              value={contact.workingHours || ''}
              onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
              placeholder="Ví dụ: Thứ 2 - Thứ 6: 07h30 - 17h00 | Trực ban 24/7"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                Trang Facebook Fanpage (URL)
              </label>
              <input
                type="text"
                value={contact.facebookPage || ''}
                onChange={(e) => setContact({ ...contact, facebookPage: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-sky-600" />
                Trang Zalo Official Account (URL)
              </label>
              <input
                type="text"
                value={contact.zaloOa || ''}
                onChange={(e) => setContact({ ...contact, zaloOa: e.target.value })}
                placeholder="https://zalo.me/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-red-800 hover:bg-red-900 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu thông tin liên hệ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
