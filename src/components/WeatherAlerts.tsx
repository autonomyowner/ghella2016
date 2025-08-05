// Weather Alerts Component for Agricultural Intelligence
// Displays real-time weather alerts and agricultural recommendations

import React from 'react';
import { AlertTriangle, Thermometer, Droplets, Wind, Sun, CloudRain } from 'lucide-react';

interface WeatherAlert {
  type: 'frost' | 'drought' | 'flood' | 'heat' | 'storm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  startTime: string;
  endTime: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  agricultural: {
    frostRisk: 'low' | 'medium' | 'high';
    irrigationNeeded: boolean;
    cropStress: 'low' | 'medium' | 'high';
    optimalPlantingWindow: {
      start: string;
      end: string;
    };
  };
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts, agricultural }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'frost':
        return <Thermometer className="w-5 h-5" />;
      case 'drought':
        return <Droplets className="w-5 h-5" />;
      case 'heat':
        return <Sun className="w-5 h-5" />;
      case 'storm':
        return <CloudRain className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCropStressColor = (stress: string) => {
    switch (stress) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
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

  return (
    <div className="space-y-4">
      {/* Weather Alerts Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            تنبيهات الطقس الزراعية
          </h3>
          <span className="text-sm text-gray-500">
            {alerts.length} تنبيه نشط
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Sun className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">لا توجد تنبيهات طقس حالياً</p>
            <p className="text-sm text-gray-500 mt-1">الظروف الجوية مناسبة للزراعة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 border-l-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'blue'}-500 bg-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : alert.severity === 'medium' ? 'yellow' : 'blue'}-50`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'critical' ? 'حرج' : 
                         alert.severity === 'high' ? 'عالي' : 
                         alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {alert.type === 'frost' ? 'صقيع' :
                         alert.type === 'drought' ? 'جفاف' :
                         alert.type === 'heat' ? 'حرارة' :
                         alert.type === 'storm' ? 'عاصفة' : 'تنبيه'}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{alert.description}</p>
                    <div className="text-xs text-gray-500">
                      من: {formatDate(alert.startTime)} - إلى: {formatDate(alert.endTime)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agricultural Conditions Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Wind className="w-5 h-5 text-green-500" />
          الظروف الزراعية
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Frost Risk */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-800">خطر الصقيع</span>
            </div>
            <span className={`text-sm font-medium ${
              agricultural.frostRisk === 'high' ? 'text-red-600' :
              agricultural.frostRisk === 'medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {agricultural.frostRisk === 'high' ? 'عالي' :
               agricultural.frostRisk === 'medium' ? 'متوسط' : 'منخفض'}
            </span>
          </div>

          {/* Irrigation Status */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-800">حالة الري</span>
            </div>
            <span className={`text-sm font-medium ${agricultural.irrigationNeeded ? 'text-orange-600' : 'text-green-600'}`}>
              {agricultural.irrigationNeeded ? 'مطلوب ري إضافي' : 'مستويات مياه كافية'}
            </span>
          </div>

          {/* Crop Stress */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-gray-800">إجهاد المحاصيل</span>
            </div>
            <span className={`text-sm font-medium ${getCropStressColor(agricultural.cropStress)}`}>
              {agricultural.cropStress === 'high' ? 'إجهاد عالي' :
               agricultural.cropStress === 'medium' ? 'إجهاد متوسط' : 'إجهاد منخفض'}
            </span>
          </div>

          {/* Optimal Planting Window */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-gray-800">فترة الزراعة المثلى</span>
            </div>
            <span className="text-sm text-gray-700">
              {formatDate(agricultural.optimalPlantingWindow.start)} - {formatDate(agricultural.optimalPlantingWindow.end)}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-500" />
          توصيات فورية
        </h3>

        <div className="space-y-3">
          {agricultural.frostRisk === 'high' && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-800 text-sm">
                <strong>⚠️ تحذير الصقيع:</strong> احمِ المحاصيل الحساسة باستخدام أغطية أو أنظمة تدفئة
              </p>
            </div>
          )}

          {agricultural.irrigationNeeded && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>💧 توصية الري:</strong> زيادة تكرار الري أو تطبيق أنظمة ري إضافية
              </p>
            </div>
          )}

          {agricultural.cropStress === 'high' && (
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-orange-800 text-sm">
                <strong>🌱 إجهاد المحاصيل:</strong> فحص الآفات والأمراض ومراجعة برنامج التسميد
              </p>
            </div>
          )}

          {agricultural.frostRisk === 'low' && agricultural.cropStress === 'low' && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                <strong>✅ ظروف مثالية:</strong> الظروف الجوية مناسبة للنمو الأمثل للمحاصيل
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts; 