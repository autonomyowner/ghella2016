'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterFormData {
  email: string;
  full_name: string;
}

export default function NewsletterSubscription() {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    full_name: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          email: '',
          full_name: ''
        });
      } else {
        setError(data.error || 'حدث خطأ أثناء الاشتراك');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
        <h3 className="text-2xl font-bold mb-2">اشترك في القائمة البريدية</h3>
        <p className="text-emerald-100">
          احصل على آخر الأخبار والعروض الخاصة بالمنتجات الزراعية
        </p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-500/20 border border-green-300 rounded-lg"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <p className="text-green-100">تم اشتراكك بنجاح! تحقق من بريدك الإلكتروني</p>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/20 border border-red-300 rounded-lg"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <p className="text-red-100">{error}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-name" className="block text-sm font-medium text-emerald-100 mb-2">
            الاسم الكامل
          </label>
          <input
            type="text"
            id="newsletter-name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-emerald-200"
            placeholder="أدخل اسمك الكامل"
          />
        </div>

        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium text-emerald-100 mb-2">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-emerald-300/30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-emerald-200"
            placeholder="example@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
          ) : (
            <Mail className="w-5 h-5" />
          )}
          <span>{loading ? 'جاري الاشتراك...' : 'اشترك الآن'}</span>
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-emerald-200">
          يمكنك إلغاء الاشتراك في أي وقت. نحن نحترم خصوصيتك
        </p>
      </div>
    </div>
  );
} 