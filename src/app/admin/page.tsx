'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/supabaseClient';

interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPanel() {
  const { user, profile } = useSupabaseAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // Handle hydration and browser extension cleanup
  useEffect(() => {
    const cleanupBrowserExtensions = () => {
      const elements = document.querySelectorAll('[bis_skin_checked], [bis_use], [data-bis-config]');
      elements.forEach(element => {
        element.removeAttribute('bis_skin_checked');
        element.removeAttribute('bis_use');
        element.removeAttribute('data-bis-config');
      });
    };

    // Run cleanup and set hydration state
    const timer = setTimeout(() => {
      cleanupBrowserExtensions();
      setIsHydrated(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && profile) {
        // Check if user is admin (you can modify this logic)
        const isAdmin = profile.user_type === 'admin' || user.email === 'admin@elghella.com';
        setIsAuthenticated(isAdmin);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAdminStatus();
  }, [user, profile]);

  // Fetch real stats from Supabase
  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // Fetch total products (equipment + animals + land)
        const { count: equipmentCount } = await supabase
          .from('equipment')
          .select('*', { count: 'exact', head: true });

        const { count: animalsCount } = await supabase
          .from('animals')
          .select('*', { count: 'exact', head: true });

        const { count: landCount } = await supabase
          .from('land')
          .select('*', { count: 'exact', head: true });

        const totalProducts = (equipmentCount || 0) + (animalsCount || 0) + (landCount || 0);

        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch total orders (if you have an orders table)
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Calculate total revenue (if you have orders with prices)
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount');

        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        setStats({
          totalProducts,
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to mock data if there's an error
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0
        });
      }
    };

    if (isAuthenticated) {
      fetchRealStats();
    }
  }, [isAuthenticated]);

  // Show loading state until hydration is complete
  if (!isHydrated) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري تحميل لوحة الإدارة...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح لك بالوصول</h2>
          <p className="text-gray-600 mb-6">تحتاج إلى صلاحيات المدير للوصول إلى هذه الصفحة</p>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <i className="fas fa-shield-alt text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">لوحة الإدارة</h1>
                <p className="text-emerald-600 text-sm">مرحباً {profile?.full_name || 'المدير'}</p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              العودة للموقع
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المنتجات</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-box text-emerald-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المستخدمين</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-shopping-cart text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString('en-US')} د.ج</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-money-bill-wave text-green-600 text-xl"></i>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* إدارة المنتجات */}
          <Link href="/admin/products" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <i className="fas fa-box text-emerald-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">إدارة المنتجات</h3>
              <p className="text-gray-600 text-sm">عرض، إضافة، تعديل وحذف المنتجات والخدمات</p>
            </div>
          </Link>

          {/* إدارة المستخدمين */}
          <Link href="/admin/users" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <i className="fas fa-users text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h3>
              <p className="text-gray-600 text-sm">إدارة حسابات المستخدمين والصلاحيات</p>
            </div>
          </Link>

          {/* إدارة الرسائل */}
          <Link href="/admin/messages" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <i className="fas fa-envelope text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">إدارة الرسائل</h3>
              <p className="text-gray-600 text-sm">إدارة رسائل الاتصال وطلبات الخبراء والقائمة البريدية</p>
            </div>
          </Link>

          {/* إدارة الطلبات */}
          <Link href="/admin/orders" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <i className="fas fa-shopping-cart text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">إدارة الطلبات</h3>
              <p className="text-gray-600 text-sm">متابعة وإدارة طلبات الشراء والخدمات</p>
            </div>
          </Link>

          {/* إعدادات الموقع */}
          <Link href="/admin/settings" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <i className="fas fa-cog text-orange-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">إعدادات الموقع</h3>
              <p className="text-gray-600 text-sm">تعديل إعدادات الموقع والمحتوى العام</p>
            </div>
          </Link>

          {/* التقارير */}
          <Link href="/admin/reports" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <i className="fas fa-chart-bar text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">التقارير</h3>
              <p className="text-gray-600 text-sm">عرض تقارير المبيعات والإحصائيات</p>
            </div>
          </Link>

          {/* النسخ الاحتياطي */}
          <Link href="/admin/backup" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <i className="fas fa-database text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">النسخ الاحتياطي</h3>
              <p className="text-gray-600 text-sm">إدارة النسخ الاحتياطية واستعادة البيانات</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
