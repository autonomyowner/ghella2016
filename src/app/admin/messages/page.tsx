'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MessageCircle, 
  UserPlus, 
  Mail, 
  Eye, 
  Reply, 
  Archive, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Message {
  id: string;
  name?: string;
  email: string;
  subject?: string;
  message?: string;
  status: string;
  created_at: string;
  message_type?: string;
  admin_notes?: string;
  admin_reply?: string;
}

interface ExpertApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  experience_years: number;
  bio: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  admin_reply?: string;
}

interface NewsletterSubscription {
  id: string;
  email: string;
  full_name?: string;
  status: string;
  subscribed_at: string;
}

export default function AdminMessagesPage() {
  const [activeTab, setActiveTab] = useState('contact');
  const [messages, setMessages] = useState<Message[]>([]);
  const [expertApplications, setExpertApplications] = useState<ExpertApplication[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ExpertApplication | null>(null);
  const [replyText, setReplyText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const tabs = [
    { id: 'contact', label: 'رسائل الاتصال', icon: MessageCircle, count: messages.filter(m => m.status === 'unread').length },
    { id: 'experts', label: 'طلبات الخبراء', icon: UserPlus, count: expertApplications.filter(e => e.status === 'pending').length },
    { id: 'newsletter', label: 'القائمة البريدية', icon: Mail, count: newsletterSubscriptions.filter(n => n.status === 'active').length }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'contact') {
        console.log('Fetching contact messages...');
        const response = await fetch('/api/contact');
        console.log('Contact response:', response);
        const data = await response.json();
        console.log('Contact data:', data);
        if (data.success) {
          setMessages(data.data || []);
          console.log('Set messages:', data.data);
        } else {
          console.error('Contact API error:', data.error);
        }
      } else if (activeTab === 'experts') {
        console.log('Fetching expert applications...');
        const response = await fetch('/api/expert-application');
        console.log('Expert response:', response);
        const data = await response.json();
        console.log('Expert data:', data);
        if (data.success) {
          setExpertApplications(data.data || []);
          console.log('Set expert applications:', data.data);
        } else {
          console.error('Expert API error:', data.error);
        }
      } else if (activeTab === 'newsletter') {
        console.log('Fetching newsletter subscriptions...');
        const response = await fetch('/api/newsletter');
        console.log('Newsletter response:', response);
        const data = await response.json();
        console.log('Newsletter data:', data);
        if (data.success) {
          setNewsletterSubscriptions(data.data || []);
          console.log('Set newsletter subscriptions:', data.data);
        } else {
          console.error('Newsletter API error:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, type: string) => {
    setActionLoading(id);
    try {
      const endpoint = type === 'contact' ? '/api/contact' : '/api/expert-application';
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    console.log('Starting delete for:', { id, type });
    setActionLoading(id);
    try {
      const endpoint = type === 'contact' ? '/api/contact' : 
                      type === 'expert' ? '/api/expert-application' : 
                      '/api/newsletter';
      
      console.log('Delete endpoint:', endpoint);
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Delete response status:', response.status);
      const responseData = await response.json();
      console.log('Delete response data:', responseData);

      if (response.ok) {
        console.log('Delete successful, refreshing data...');
        setDeleteConfirm(null);
        fetchData();
        // Clear selection if deleted item was selected
        if (selectedMessage?.id === id) setSelectedMessage(null);
        if (selectedApplication?.id === id) setSelectedApplication(null);
      } else {
        console.error('Delete failed:', responseData);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReply = async (id: string, type: string) => {
    setActionLoading(id);
    try {
      const endpoint = type === 'contact' ? '/api/contact' : '/api/expert-application';
      const response = await fetch(`${endpoint}?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          admin_reply: replyText,
          status: 'replied'
        })
      });

      if (response.ok) {
        setReplyText('');
        setSelectedMessage(null);
        setSelectedApplication(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'read':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'archived':
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DeleteConfirmModal = ({ id, type, name }: { id: string; type: string; name: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">تأكيد الحذف</h3>
        </div>
        <p className="text-gray-600 mb-6">
          هل أنت متأكد من حذف {type === 'contact' ? 'الرسالة' : type === 'expert' ? 'طلب الخبير' : 'الاشتراك'}؟
          <br />
          <span className="font-medium">{name}</span>
        </p>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            إلغاء
          </button>
          <button
            onClick={() => handleDelete(id, type)}
            disabled={actionLoading === id}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {actionLoading === id ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            حذف
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/admin" className="text-emerald-600 hover:text-emerald-700">
                ← العودة للوحة الإدارة
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة الرسائل</h1>
                <p className="text-emerald-600 text-sm">إدارة جميع الرسائل والطلبات الواردة</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              تحديث
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-emerald-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {activeTab === 'contact' && 'رسائل الاتصال'}
                    {activeTab === 'experts' && 'طلبات الخبراء'}
                    {activeTab === 'newsletter' && 'القائمة البريدية'}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {activeTab === 'contact' && `${messages.length} رسالة`}
                    {activeTab === 'experts' && `${expertApplications.length} طلب`}
                    {activeTab === 'newsletter' && `${newsletterSubscriptions.length} مشترك`}
                  </div>
                </div>

                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد رسائل حالياً</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="font-semibold text-gray-800">{message.name}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{message.email}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(message.status)}`}>
                              {message.status === 'unread' ? 'جديد' : 
                               message.status === 'read' ? 'مقروء' : 
                               message.status === 'replied' ? 'تم الرد' : 'مؤرشف'}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-800 mb-1">{message.subject}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                            <div className="flex space-x-2 space-x-reverse">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(message.id, 'read', 'contact');
                                }}
                                disabled={actionLoading === message.id}
                                className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(message.id, 'archived', 'contact');
                                }}
                                disabled={actionLoading === message.id}
                                className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(message.id);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'experts' && (
                  <div className="space-y-4">
                    {expertApplications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد طلبات خبراء حالياً</p>
                      </div>
                    ) : (
                      expertApplications.map((application) => (
                        <div
                          key={application.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className="font-semibold text-gray-800">{application.full_name}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">{application.email}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                              {application.status === 'pending' ? 'في الانتظار' : 
                               application.status === 'under_review' ? 'قيد المراجعة' : 
                               application.status === 'approved' ? 'مقبول' : 'مرفوض'}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">{application.specialization}</span>
                            <span className="text-gray-500 mx-2">•</span>
                            <span className="text-sm text-gray-600">{application.experience_years} سنة خبرة</span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">{application.bio}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{formatDate(application.created_at)}</span>
                            <div className="flex space-x-2 space-x-reverse">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(application.id, 'approved', 'expert');
                                }}
                                disabled={actionLoading === application.id}
                                className="text-green-600 hover:text-green-700 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(application.id, 'rejected', 'expert');
                                }}
                                disabled={actionLoading === application.id}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(application.id);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'newsletter' && (
                  <div className="space-y-4">
                    {newsletterSubscriptions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>لا توجد اشتراكات في القائمة البريدية حالياً</p>
                      </div>
                    ) : (
                      newsletterSubscriptions.map((subscription) => (
                        <div
                          key={subscription.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <span className="font-semibold text-gray-800">{subscription.email}</span>
                                {subscription.full_name && (
                                  <>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">{subscription.full_name}</span>
                                  </>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{formatDate(subscription.subscribed_at)}</span>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subscription.status)}`}>
                                {subscription.status === 'active' ? 'نشط' : 'ملغي'}
                              </span>
                              <button 
                                onClick={() => setDeleteConfirm(subscription.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Message Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">تفاصيل الرسالة</h3>
                
                {selectedMessage && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                      <p className="text-gray-800">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                      <p className="text-gray-800">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                      <p className="text-gray-800">{selectedMessage.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                      <p className="text-gray-800 text-sm">{selectedMessage.message}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                      <p className="text-gray-800 text-sm">{formatDate(selectedMessage.created_at)}</p>
                    </div>

                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">الرد</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                        rows={4}
                        placeholder="اكتب ردك هنا..."
                      />
                      <div className="flex space-x-2 space-x-reverse mt-2">
                        <button
                          onClick={() => handleReply(selectedMessage.id, 'contact')}
                          disabled={actionLoading === selectedMessage.id}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center"
                        >
                          {actionLoading === selectedMessage.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Reply className="w-4 h-4 mr-2" />
                          )}
                          إرسال الرد
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedMessage.id, 'archived', 'contact')}
                          disabled={actionLoading === selectedMessage.id}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                        >
                          أرشفة
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                      <p className="text-gray-800">{selectedApplication.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                      <p className="text-gray-800">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
                      <p className="text-gray-800">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">التخصص</label>
                      <p className="text-gray-800">{selectedApplication.specialization}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">سنوات الخبرة</label>
                      <p className="text-gray-800">{selectedApplication.experience_years} سنة</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">السيرة الذاتية</label>
                      <p className="text-gray-800 text-sm">{selectedApplication.bio}</p>
                    </div>

                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">الملاحظات</label>
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                        rows={3}
                        placeholder="أضف ملاحظاتك هنا..."
                      />
                      <div className="flex space-x-2 space-x-reverse mt-2">
                        <button
                          onClick={() => handleStatusChange(selectedApplication.id, 'approved', 'expert')}
                          disabled={actionLoading === selectedApplication.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedApplication.id, 'rejected', 'expert')}
                          disabled={actionLoading === selectedApplication.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedMessage && !selectedApplication && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>اختر رسالة لعرض تفاصيلها</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <DeleteConfirmModal 
            id={deleteConfirm}
            type={activeTab === 'contact' ? 'contact' : activeTab === 'experts' ? 'expert' : 'newsletter'}
            name={
              activeTab === 'contact' 
                ? messages.find(m => m.id === deleteConfirm)?.name || 'الرسالة'
                : activeTab === 'experts'
                ? expertApplications.find(e => e.id === deleteConfirm)?.full_name || 'طلب الخبير'
                : newsletterSubscriptions.find(n => n.id === deleteConfirm)?.email || 'الاشتراك'
            }
          />
        )}
      </div>
    </div>
  );
} 