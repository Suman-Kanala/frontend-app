'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentStatusToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'success' | 'failed' | 'pending' | 'error' | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    
    if (paymentStatus) {
      setStatus(paymentStatus as any);
      setShow(true);

      // Auto-hide after 6 seconds
      const timer = setTimeout(() => {
        setShow(false);
      }, 6000);

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('reason');
      window.history.replaceState({}, '', url.toString());

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          message: 'Your career guidance session has been confirmed. Check your email for details.',
          bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
          borderColor: 'border-emerald-200 dark:border-emerald-500/20',
          iconColor: 'text-emerald-500',
          textColor: 'text-emerald-900 dark:text-emerald-100',
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again or use UPI QR code.',
          bgColor: 'bg-red-50 dark:bg-red-500/10',
          borderColor: 'border-red-200 dark:border-red-500/20',
          iconColor: 'text-red-500',
          textColor: 'text-red-900 dark:text-red-100',
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'Payment Pending',
          message: 'Your payment is being processed. We will notify you once confirmed.',
          bgColor: 'bg-amber-50 dark:bg-amber-500/10',
          borderColor: 'border-amber-200 dark:border-amber-500/20',
          iconColor: 'text-amber-500',
          textColor: 'text-amber-900 dark:text-amber-100',
        };
      case 'error':
        return {
          icon: AlertCircle,
          title: 'Payment Error',
          message: 'Something went wrong. Please contact support or try again.',
          bgColor: 'bg-red-50 dark:bg-red-500/10',
          borderColor: 'border-red-200 dark:border-red-500/20',
          iconColor: 'text-red-500',
          textColor: 'text-red-900 dark:text-red-100',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-4 z-50 max-w-md"
        >
          <div
            className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl shadow-2xl p-4 backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={24} />
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${config.textColor} mb-1`}>
                  {config.title}
                </h3>
                <p className={`text-xs ${config.textColor} opacity-90`}>
                  {config.message}
                </p>
              </div>
              <button
                onClick={() => setShow(false)}
                className={`${config.textColor} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className={`h-1 ${config.iconColor} opacity-30 rounded-full mt-3`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
