'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/supabaseClient';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Crown, 
  Shield, 
  Mail, 
  Phone,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bot,
  Command,
  Settings,
  Database,
  FileText,
  Bell,
  TrendingUp
} from 'lucide-react';

interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalAdmins: number;
  totalMessages: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
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
    totalRevenue: 0,
    totalAdmins: 0,
    totalMessages: 0
  });
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminActions, setAdminActions] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

        // Fetch total users and admins
        const { data: users, count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        const totalAdmins = users?.filter(u => u.is_admin).length || 0;

        // Fetch total orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Calculate total revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount');

        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

        // Fetch total messages
        const { count: messagesCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalProducts,
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          totalAdmins,
          totalMessages: messagesCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalAdmins: 0,
          totalMessages: 0
        });
      }
    };

    if (isAuthenticated) {
      fetchRealStats();
    }
  }, [isAuthenticated]);

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;

    setActionLoading('add');
    try {
      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newAdminEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setAdminActions(prev => [...prev, {
          type: 'add',
          email: newAdminEmail,
          status: 'success',
          message: `Admin privileges added to ${newAdminEmail}`,
          timestamp: new Date()
        }]);
        setNewAdminEmail('');
        setShowAddAdminModal(false);
      } else {
        setAdminActions(prev => [...prev, {
          type: 'add',
          email: newAdminEmail,
          status: 'error',
          message: result.error || 'Failed to add admin',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setAdminActions(prev => [...prev, {
        type: 'add',
        email: newAdminEmail,
        status: 'error',
        message: 'Network error occurred',
        timestamp: new Date()
      }]);
    } finally {
      setActionLoading(null);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-admin',
      title: 'إضافة مدير جديد',
      description: 'إضافة مدير جديد بالبريد الإلكتروني',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'bg-purple-500',
      action: () => setShowAddAdminModal(true)
    },
    {
      id: 'view-users',
      title: 'عرض المستخدمين',
      description: 'عرض قائمة جميع المستخدمين',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      action: () => window.location.href = '/admin/users'
    },
    {
      id: 'send-email',
      title: 'إرسال إيميل',
      description: 'إرسال إيميل لجميع العملاء',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-green-500',
      action: () => window.location.href = '/admin/messages'
    },
    {
      id: 'market-prices',
      title: 'أسعار السوق',
      description: 'تحقق من أسعار السوق الحالية',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
      action: () => {
        // Call MCP for market prices
        console.log('Fetching market prices...');
      }
    }
  ];

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
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/admin/users"
                className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center"
              >
                <Users className="w-4 h-4 ml-2" />
                إدارة المستخدمين
              </Link>
              <Link
                href="/"
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                العودة للموقع
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
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
                <p className="text-xs text-gray-500">منهم {stats.totalAdmins} مدير</p>
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Command className="w-5 h-5 ml-2 text-emerald-600" />
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 text-right"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                    {action.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Admin Actions */}
        {adminActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Bell className="w-5 h-5 ml-2 text-emerald-600" />
                آخر الإجراءات الإدارية
              </h3>
              <div className="space-y-3">
                {adminActions.slice(-5).map((action, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      action.status === 'success' ? 'bg-green-50 border border-green-200' :
                      action.status === 'error' ? 'bg-red-50 border border-red-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center">
                      {action.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                      ) : action.status === 'error' ? (
                        <XCircle className="w-4 h-4 text-red-600 ml-2" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 ml-2" />
                      )}
                      <span className="text-sm font-medium text-gray-700">{action.message}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {action.timestamp ? new Date(action.timestamp).toLocaleTimeString('ar-SA') : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

          {/* MCP Integration */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg p-6 border border-purple-200">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">الذكاء الاصطناعي</h3>
            <p className="text-gray-600 text-sm mb-4">استخدم الأوامر الصوتية والذكاء الاصطناعي لإدارة الموقع</p>
            <div className="space-y-2">
              <div className="text-xs bg-purple-50 p-3 rounded-lg">
                <strong className="block mb-2">أمثلة على الأوامر:</strong>
                <ul className="space-y-1 text-gray-600">
                  <li>• "أضف مدير جديد john@example.com"</li>
                  <li>• "عرض جميع المستخدمين"</li>
                  <li>• "أرسل إيميل لجميع العملاء"</li>
                  <li>• "تحقق من أسعار السوق"</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Crown className="w-6 h-6 ml-2 text-emerald-600" />
                إضافة مدير جديد
              </h2>
              <button
                onClick={() => {
                  setShowAddAdminModal(false);
                  setNewAdminEmail('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-emerald-600 ml-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-1">معلومات مهمة</h4>
                    <p className="text-sm text-emerald-700">
                      سيتم إنشاء حساب جديد للمدير وإرسال رسالة ترحيب إلى البريد الإلكتروني المحدد.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 space-x-reverse pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdminModal(false);
                    setNewAdminEmail('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddAdmin}
                  disabled={!newAdminEmail.trim() || actionLoading === 'add'}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold disabled:opacity-50 flex items-center"
                >
                  {actionLoading === 'add' ? (
                    <>
                      <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 ml-2" />
                      إضافة المدير
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
