# Kuaför/Barber Randevu ve Yönetim Sistemi

## Proje Tanımı
Bu proje, berber ve kuaförler için modern bir randevu ve yönetim sistemi geliştirmek amacıyla hazırlanmıştır. Amaç, randevu süreçlerini dijitalleştirerek hem işletme sahiplerinin hem de müşterilerin işini kolaylaştırmak, manuel randevu takibi ve iletişimde yaşanan aksaklıkları ortadan kaldırmaktır. Kullanıcılar kolayca randevu alabilir, adminler hizmet ve saat yönetimi yapabilir, tüm kullanıcılar birbirine mesaj gönderebilir. Sistem, rol tabanlı erişim ve bildirim altyapısı ile güçlü bir yönetim paneli sunar.

## Kullanılan Teknolojiler
- **Next.js** (React tabanlı tam stack framework)
- **Prisma ORM** (Veritabanı yönetimi)
- **SQLite** (Varsayılan veritabanı)
- **Tailwind CSS** (Modern ve hızlı stil altyapısı)
- **TypeScript**
- Ek kütüphaneler: @heroicons/react, bcryptjs, date-fns, jsonwebtoken, swiper

## Kurulum Talimatları
1. **Depoyu klonlayın:**
   ```bash
   git clone <repo-url>
   cd <repo>
   ```
2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```
3. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```
4. **Veritabanı migrasyonlarını çalıştırın:**
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

## Admin Giriş Bilgileri
Test ve demo için admin rolüne sahip örnek kullanıcı:
- **E-posta:** tosunoglukerim@gmail.com
- **Şifre:** Kerim123

---

## Özellikler
- Kullanıcı kayıt & giriş, profil yönetimi
- Rol tabanlı erişim (admin/normal kullanıcı)
- Admin paneli: kullanıcı, hizmet, randevu saati, mesaj ve bildirim yönetimi
- Kullanıcılar arası mesajlaşma
- Randevu alma ve yönetimi
- Bildirimler: yeni kullanıcı kaydı ve randevu alımı admin paneline otomatik olarak düşer, gizlenebilir veya silinebilir
- Responsive ve modern arayüz

## Ortam Değişkenleri
- `DATABASE_URL`: SQLite veya başka bir veritabanı bağlantı adresi
- Diğer gerekli değişkenler için `.env.example` dosyasına bakınız.

## Veritabanı Yönetimi
- Prisma ile migration ve seed işlemleri kolayca yapılabilir.
- Migration komutları:
  ```bash
  npx prisma migrate dev --name <migration-name>
  npx prisma generate
  ```
- Veritabanı şeması `prisma/schema.prisma` dosyasındadır.

## Geliştirici Notları
- Kodlar modüler ve okunabilir şekilde yazılmıştır.
- API route'ları Next.js app directory yapısına uygundur.
- Prisma ile kolayca farklı veritabanlarına geçiş yapılabilir.
- Herhangi bir hata veya katkı için issue/pull request açabilirsiniz.
