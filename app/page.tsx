"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white py-16 px-4">
      <div className="max-w-2xl w-full bg-white/80 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center relative overflow-hidden">
        <div className="mb-4">
          <Image src="/uploads/profile_2_1749195774727.jpg" alt="Kuaför By Kerim Logo" width={120} height={120} className="mx-auto rounded-full shadow-lg" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">Kuaför By Kerim</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">Modern Berber Randevu Deneyimi</h2>
        <p className="text-gray-600 mb-6 max-w-lg">
          Kolayca online randevu al, beklemeden hizmet al! <br />
          Hızlı, güvenli ve kullanıcı dostu berber randevu sistemiyle tanışın. <br />
          Tüm hizmetler, iletişim ve yol tarifi tek ekranda.
        </p>
        {/* Fotoğraf Galerisi - Slider */}
        <div className="w-full max-w-2xl mb-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            loop
            className="rounded-2xl shadow-lg"
          >
            <SwiperSlide>
              <div className="aspect-[4/3] bg-white flex items-center justify-center rounded-2xl">
                <img src="/uploads/resim1.jpg" alt="Kuaför By Kerim 1" className="rounded-2xl object-contain w-full h-full" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="aspect-[4/3] bg-white flex items-center justify-center rounded-2xl">
                <img src="/uploads/resim2.jpg" alt="Kuaför By Kerim 2" className="rounded-2xl object-contain w-full h-full" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="aspect-[4/3] bg-white flex items-center justify-center rounded-2xl">
                <img src="/uploads/resim3.jpg" alt="Kuaför By Kerim 3" className="rounded-2xl object-contain w-full h-full" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="aspect-[4/3] bg-white flex items-center justify-center rounded-2xl">
                <img src="/uploads/resim4.jpg" alt="Kuaför By Kerim 4" className="rounded-2xl object-contain w-full h-full" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="absolute right-8 top-8 opacity-10 text-blue-300 text-8xl select-none pointer-events-none">💈</div>
      </div>
      {/* Harita ve iletişim alanı */}
      <div className="max-w-2xl w-full mt-10 bg-white/80 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center gap-6">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Bize Ulaşın</h3>
        <div className="w-full h-64 rounded-xl overflow-hidden shadow mb-2">
          <iframe
            src="https://www.google.com/maps?q=Anadolu,+Tunçalp+Sk.+No:4,+34275+Arnavutköy/İstanbul&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="text-xl font-bold text-blue-800 mb-4">Kuaför By Kerim</div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-2">
          <a href="https://www.google.com/maps/search/?api=1&query=Anadolu,+Tunçalp+Sk.+No:4,+34275+Arnavutköy/İstanbul" target="_blank" rel="noopener" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Google Haritalar'da Aç
          </a>
          <a href="https://maps.apple.com/?address=Anadolu,+Tunçalp+Sk.+No:4,+34275+Arnavutköy/İstanbul" target="_blank" rel="noopener" className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 7 7 13 7 13s7-6 7-13c0-3.87-3.13-7-7-7z" /></svg>
            Apple Haritalar'da Aç
          </a>
        </div>
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="font-semibold text-gray-700">Adres:</span>
          <span className="text-gray-600">Anadolu, Tunçalp Sk. No:4, 34275 Arnavutköy/İstanbul</span>
          <span className="font-semibold text-gray-700 mt-2">Telefon:</span>
          <a href="tel:05382489271" className="text-blue-700 hover:underline">0538 248 92 71</a>
          <span className="font-semibold text-gray-700 mt-2">Çalışma Saatleri:</span>
          <span className="text-gray-600">Pazartesi - Cumartesi: 09:00 - 19:00</span>
          <span className="text-gray-600">Pazar: Kapalı</span>
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <a href="https://www.instagram.com/kerim.celikkiran?igsh=MW51cmJib3VpdzFiMQ==" target="_blank" rel="noopener" className="text-pink-600 hover:text-pink-800 text-3xl" title="Instagram">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z" /></svg>
          </a>
          <a href="https://www.facebook.com/share/19RVrecjgi/?mibextid=wwXIfr" target="_blank" rel="noopener" className="text-blue-700 hover:text-blue-900 text-3xl" title="Facebook">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89c1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.243 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z" /></svg>
          </a>
          <a href="https://wa.me/905382489271" target="_blank" rel="noopener" className="text-green-600 hover:text-green-800 text-3xl" title="WhatsApp">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12c0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.7 0-3.36-.44-4.8-1.28l-.34-.2l-3.69.97l.99-3.59l-.22-.36A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10s-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9c-.25-.09-.43-.14-.61.14c-.18.28-.7.9-.86 1.08c-.16.18-.32.2-.6.07c-.28-.14-1.18-.44-2.25-1.41c-.83-.74-1.39-1.65-1.55-1.93c-.16-.28-.02-.43.12-.57c.13-.13.28-.34.42-.51c.14-.17.18-.29.28-.48c.09-.19.05-.36-.02-.5c-.07-.14-.61-1.47-.84-2.01c-.22-.53-.45-.46-.61-.47c-.16-.01-.35-.01-.54-.01c-.19 0-.5.07-.76.36c-.26.29-1 1-1 2.43c0 1.43 1.02 2.81 1.16 3c.14.19 2.01 3.07 4.87 4.19c.68.29 1.21.46 1.62.59c.68.22 1.3.19 1.79.12c.55-.08 1.65-.67 1.89-1.32c.23-.65.23-1.2.16-1.32c-.07-.12-.25-.19-.53-.33z" /></svg>
          </a>
        </div>
      </div>
    </main>
  );
} 