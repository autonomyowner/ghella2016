import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام - الغلة',
  description: 'شروط وأحكام استخدام منصة الغلة للتكنولوجيا الزراعية',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            شروط الاستخدام
          </h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">1. قبول الشروط</h2>
              <p>
                باستخدام منصة الغلة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الخدمة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">2. وصف الخدمة</h2>
              <p>
                الغلة هي منصة رقمية تربط المزارعين والمشترين والموردين في مجال الزراعة. نقدم خدمات البيع والشراء للمنتجات الزراعية والمعدات والأراضي.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">3. المسؤولية</h2>
              <p>
                نحن لا نتحمل المسؤولية عن أي خسائر أو أضرار ناتجة عن استخدام الخدمة. المستخدمون مسؤولون عن دقة المعلومات المقدمة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">4. الخصوصية</h2>
              <p>
                نحن نلتزم بحماية خصوصية المستخدمين. راجع سياسة الخصوصية الخاصة بنا لمزيد من المعلومات.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">5. التعديلات</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-3">6. الاتصال</h2>
              <p>
                إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا من خلال صفحة الاتصال.
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