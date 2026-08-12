import React, { useState } from 'react';
import { X, History, FileCheck, Calendar, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { SecurityReport, Appointment } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SecurityReport[];
  appointments: Appointment[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  reports,
  appointments,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'appointments'>('reports');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-red-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-red-950">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-300 uppercase tracking-tight">
                LỊCH SỬ DỊCH VỤ CỦA BẠN
              </h3>
              <p className="text-[11px] text-red-100">Tra cứu các phản ánh & lịch hẹn đã gửi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1 shrink-0">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-white text-red-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-700" />
            <span>Phản ánh ANTT ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Lịch làm việc ({appointments.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3">
          {activeTab === 'reports' ? (
            reports.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">Chưa có phản ánh an ninh nào được gửi.</p>
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-red-900 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                      Mã: {rep.receiptCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {rep.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900">{rep.type} - {rep.address}</div>
                  <p className="text-slate-600 line-clamp-2">{rep.content}</p>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                    <Clock className="w-3 h-3" />
                    <span>Gửi lúc: {rep.createdAt}</span>
                  </div>
                </div>
              ))
            )
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">Chưa có lịch làm việc nào được đăng ký.</p>
            </div>
          ) : (
            appointments.map((app) => (
              <div
                key={app.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    Mã: {app.bookingCode}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                    {app.status}
                  </span>
                </div>

                <div className="font-bold text-slate-900">{app.purpose}</div>
                <div className="text-slate-600">
                  Ngày hẹn: <strong className="text-slate-900">{app.date}</strong> ({app.timeSlot})
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-200/60">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Đăng ký lúc: {app.createdAt}</span>
                </div>
              </div>
            ))
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
