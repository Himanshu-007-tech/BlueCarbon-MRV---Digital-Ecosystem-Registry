
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, Loader2, CheckCircle2, X } from 'lucide-react';
import { CarbonCredit } from '../types';

interface PaymentModalProps {
  credit: CarbonCredit;
  onConfirm: () => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ credit, onConfirm, onClose }) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      onConfirm();
      setStep('success');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {step === 'info' && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Checkout</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Carbon Credits</span>
                <span className="font-bold text-blue-900">{credit.tons} Tons</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600 font-medium">Price per Ton</span>
                <span className="font-bold text-blue-900">$15.00</span>
              </div>
              <div className="pt-2 border-t border-blue-100 flex justify-between items-center">
                <span className="text-blue-900 font-bold">Total Amount</span>
                <span className="text-xl font-black text-blue-900">${(credit.tons * 15).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Card Details</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="text" placeholder="4242 4242 4242 4242" className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="CVC" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <button 
              onClick={handlePay}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center transition-all"
            >
              <Lock className="h-4 w-4 mr-2" /> Pay Now
            </button>
            <p className="text-[10px] text-center text-slate-400">Transactions are secured with 256-bit encryption and logged on-chain.</p>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Processing ESG Payment</h3>
              <p className="text-slate-500">Verifying funds and updating the registry ledger...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Impact Confirmed!</h3>
              <p className="text-slate-500">Your credits have been minted and assigned to your portfolio.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
