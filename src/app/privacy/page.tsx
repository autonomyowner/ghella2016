import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - الغلة',
  description: 'سياسة الخصوصية لمنصة الغلة للتكنولوجيا الزراعية',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            سياسة الخصوصية
          </h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">1. جمع المعلومات</h2>
              <p>
                نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو استخدام الخدمة، بما في ذلك الاسم والبريد الإلكتروني ورقم الهاتف.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">2. استخدام المعلومات</h2>
              <p>
                نستخدم المعلومات المجمعة لتقديم وتحسين خدماتنا، والتواصل معك، وضمان أمان المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">3. مشاركة المعلومات</h2>
              <p>
                لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات المصرح بها قانوناً أو بموافقتك الصريحة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">4. حماية المعلومات</h2>
              <p>
                نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الاستخدام أو الكشف.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">5. ملفات تعريف الارتباط</h2>
              <p>
                نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل حركة المرور على موقعنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">6. حقوقك</h2>
              <p>
                لديك الحق في الوصول إلى معلوماتك الشخصية وتحديثها أو حذفها في أي وقت.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">7. التغييرات</h2>
              <p>
                قد نحدث هذه السياسة من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">8. الاتصال</h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى الاتصال بنا.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 