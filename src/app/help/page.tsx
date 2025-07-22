import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المساعدة والدعم - الغلة',
  description: 'مركز المساعدة والدعم لمنصة الغلة للتكنولوجيا الزراعية',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            مركز المساعدة والدعم
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">الأسئلة الشائعة</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">كيف يمكنني التسجيل في المنصة؟</h3>
                  <p className="text-gray-600">
                    يمكنك التسجيل من خلال النقر على زر "تسجيل" في أعلى الصفحة وملء النموذج بالمعلومات المطلوبة.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">كيف يمكنني إضافة منتج للبيع؟</h3>
                  <p className="text-gray-600">
                    بعد تسجيل الدخول، اذهب إلى صفحة "إضافة منتج" واملأ النموذج بجميع التفاصيل المطلوبة.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">كيف يمكنني التواصل مع البائع؟</h3>
                  <p className="text-gray-600">
                    يمكنك استخدام نظام الرسائل المدمج في المنصة أو الاتصال بالرقم الموجود في صفحة المنتج.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800 mb-2">ما هي طرق الدفع المتاحة؟</h3>
                  <p className="text-gray-600">
                    نحن نعمل على إضافة طرق دفع متعددة. حالياً، يتم الدفع نقداً عند الاستلام.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">الدعم الفني</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">البريد الإلكتروني</h3>
                  <p className="text-gray-600 mb-2">support@elghella.com</p>
                  <p className="text-sm text-gray-500">الرد خلال 24 ساعة</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">رقم الهاتف</h3>
                  <p className="text-gray-600 mb-2">+213 XXX XXX XXX</p>
                  <p className="text-sm text-gray-500">من الأحد إلى الخميس 9:00 - 17:00</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">أدلة الاستخدام</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">دليل التسجيل وإنشاء الحساب</h3>
                    <p className="text-sm text-gray-600">تعلم كيفية إنشاء حساب جديد على المنصة</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">دليل إضافة المنتجات</h3>
                    <p className="text-sm text-gray-600">تعلم كيفية إضافة منتجاتك للبيع</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">دليل البحث والشراء</h3>
                    <p className="text-sm text-gray-600">تعلم كيفية البحث عن المنتجات وشرائها</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">الإبلاغ عن مشكلة</h2>
              <p className="text-gray-600 mb-4">
                إذا واجهت أي مشكلة في استخدام المنصة، يرجى إخبارنا بها لنتمكن من مساعدتك.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                الإبلاغ عن مشكلة
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 