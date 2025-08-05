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
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  user_type: string;
  role: string;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  email?: string;
  phone?: string;
}

interface AdminAction {
  type: 'add' | 'remove' | 'promote' | 'demote';
  email?: string;
  userId?: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export default function AdminUsers() {
  const { user, profile } = useSupabaseAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
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

  // Check admin access
  useEffect(() => {
    if (user && profile) {
      const isAdmin = profile.user_type === 'admin' || user.email === 'admin@elghella.com';
      if (!isAdmin) {
        window.location.href = '/admin';
      }
    }
  }, [user, profile]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
          message: `Admin privileges added to ${newAdminEmail}`
        }]);
        setNewAdminEmail('');
        setShowAddModal(false);
        fetchUsers(); // Refresh user list
      } else {
        setAdminActions(prev => [...prev, {
          type: 'add',
          email: newAdminEmail,
          status: 'error',
          message: result.error || 'Failed to add admin'
        }]);
      }
    } catch (error) {
      setAdminActions(prev => [...prev, {
        type: 'add',
        email: newAdminEmail,
        status: 'error',
        message: 'Network error occurred'
      }]);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveAdmin = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove admin privileges from ${userName}?`)) return;

    setActionLoading(`remove-${userId}`);
    try {
      const response = await fetch('/api/admin/remove-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result.success) {
        setAdminActions(prev => [...prev, {
          type: 'remove',
          userId,
          status: 'success',
          message: `Admin privileges removed from ${userName}`
        }]);
        fetchUsers(); // Refresh user list
      } else {
        setAdminActions(prev => [...prev, {
          type: 'remove',
          userId,
          status: 'error',
          message: result.error || 'Failed to remove admin'
        }]);
      }
    } catch (error) {
      setAdminActions(prev => [...prev, {
        type: 'remove',
        userId,
        status: 'error',
        message: 'Network error occurred'
      }]);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.user_type === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isAdmin: boolean, isVerified: boolean) => {
    if (isAdmin) return <Crown className="w-4 h-4 text-purple-600" />;
    if (isVerified) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  // Show loading state until hydration is complete
  if (!isHydrated) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري تحميل إدارة المستخدمين...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري تحميل المستخدمين...</p>
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
              <Link href="/admin" className="text-emerald-600 hover:text-emerald-700">
                <i className="fas fa-arrow-right text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
                <p className="text-emerald-600 text-sm">إدارة حسابات المستخدمين والصلاحيات</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold flex items-center"
            >
              <UserPlus className="w-5 h-5 ml-2" />
              إضافة مدير جديد
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Actions Summary */}
        {adminActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 ml-2 text-emerald-600" />
                آخر الإجراءات الإدارية
              </h3>
              <div className="space-y-2">
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
                      {action.type === 'add' ? 'إضافة مدير' : 'إزالة صلاحيات'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">البحث</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ابحث في المستخدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نوع المستخدم</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">جميع المستخدمين</option>
                <option value="admin">المدراء</option>
                <option value="expert">الخبراء</option>
                <option value="user">المستخدمين العاديين</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                إجمالي المستخدمين: <span className="font-bold text-emerald-600">{filteredUsers.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-lg font-bold text-gray-800">{user.full_name || 'مستخدم بدون اسم'}</h3>
                    <p className="text-gray-500 text-sm">{user.email || 'لا يوجد بريد إلكتروني'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(user.is_admin, user.is_verified)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">نوع المستخدم:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.user_type)}`}>
                    {user.user_type === 'admin' ? 'مدير' : 
                     user.user_type === 'expert' ? 'خبير' : 'مستخدم عادي'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">الحالة:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.is_verified ? 'مؤكد' : 'في انتظار التأكيد'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">تاريخ التسجيل:</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse">
                {user.is_admin ? (
                  <button
                    onClick={() => handleRemoveAdmin(user.id, user.full_name || 'المستخدم')}
                    disabled={actionLoading === `remove-${user.id}`}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="إزالة صلاحيات المدير"
                  >
                    {actionLoading === `remove-${user.id}` ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddAdmin()}
                    disabled={actionLoading === 'add'}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                    title="ترقية إلى مدير"
                  >
                    {actionLoading === 'add' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مستخدمين</h3>
            <p className="text-gray-500">لم يتم العثور على مستخدمين تطابق معايير البحث</p>
          </motion.div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
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
                  setShowAddModal(false);
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
                    setShowAddModal(false);
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