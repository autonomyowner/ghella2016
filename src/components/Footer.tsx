'use client';

import React from 'react';
import { useWebsiteSettings } from '@/lib/websiteSettings';
import Link from 'next/link';

export default function Footer() {
  const { settings } = useWebsiteSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">{settings.site_title}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {settings.site_description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 space-x-reverse">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61578467404013&mibextid=wwXIfr&rdid=SeDWt8dZzlNCz9Fh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ApK4nZXXR%2F%3Fmibextid%3DwwXIfr#"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                title="تابعنا على Facebook"
              >
                <i className="fab fa-facebook-f text-white text-lg group-hover:text-white"></i>
              </a>
              
              {/* Instagram */}
              <a
                href="https://www.instagram.com/el_ghella_/?fbclid=IwY2xjawLwqzJleHRuA2FlbQIxMABicmlkETF1V0htdkVhRVNhcG9hb1YzAR6JtdV_SYKFKbWZi-eAC56MfdAcEwok-_hDSctq9tRuEhCBPYW1s0HPl-F6ig_aem_Akct20fqf2UrxE9Mf1EoiQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                title="تابعنا على Instagram"
              >
                <i className="fab fa-instagram text-white text-lg group-hover:text-white"></i>
              </a>
              
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@elghella10?_t=ZN-8yKMuFB1wIA&_r=1&fbclid=IwY2xjawLwqy5leHRuA2FlbQIxMABicmlkETF1V0htdkVhRVNhcG9hb1YzAR6jZLxUf1XjQseM-gHEzbPOsMaV0wH7ZLTgJu-Wter5Kxs0aKEnUr9In9w5fg_aem_BdvgT-Mkmob_c0Rp62-dGg"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                title="تابعنا على TikTok"
              >
                <i className="fab fa-tiktok text-white text-lg group-hover:text-white"></i>
              </a>
              
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على Twitter"
                >
                  <i className="fab fa-twitter text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على LinkedIn"
                >
                  <i className="fab fa-linkedin-in text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              
              {settings.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على YouTube"
                >
                  <i className="fab fa-youtube text-white text-lg group-hover:text-white"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  السوق
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">معلومات الاتصال</h4>
            <div className="space-y-3">
              {settings.contact_email && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <i className="fas fa-envelope text-emerald-400"></i>
                  <a 
                    href={`mailto:${settings.contact_email}`}
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}
              
              {/* Phone Numbers */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <i className="fas fa-phone text-emerald-400"></i>
                  <a 
                    href="tel:0558981686"
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    05 58981686
                  </a>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <i className="fas fa-phone text-emerald-400"></i>
                  <a 
                    href="tel:0798700447"
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    07 98700447
                  </a>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <i className="fas fa-phone text-emerald-400"></i>
                  <a 
                    href="tel:0660378697"
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    06 60378697
                  </a>
                </div>
              </div>
              
              {settings.address && (
                <div className="flex items-start space-x-2 space-x-reverse">
                  <i className="fas fa-map-marker-alt text-emerald-400 mt-1"></i>
                  <span className="text-gray-300">{settings.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {settings.site_title}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
