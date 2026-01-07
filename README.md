# Flight Reservation System

Bu proje, kullanıcıların uçuş arama, rezervasyon yapma ve iptal işlemlerini gerçekleştirebildiği; admin kullanıcıların ise uçuş ve sistem yönetimini sağladığı bir **Uçuş Rezervasyon Sistemi**dir.

## Temel Özellikler

- **Rol Tabanlı Erişim (RBAC)**
  - Admin: Uçuş ekleme, düzenleme, silme
  - Müşteri: Uçuş arama, rezervasyon yapma, iptal etme

- **Uçuş Yönetimi**
  - Kalkış / varış bilgileri, tarih, fiyat ve koltuk takibi
  - Uçuş silindiğinde bağlı rezervasyonların otomatik iptali

- **Rezervasyon Sistemi**
  - Yetişkin, çocuk ve bebek yolcu desteği
  - Dinamik koltuk güncelleme
  - Rezervasyon iptalinde koltukların geri eklenmesi

- **Uçuş Sınıfları**
  - Süper Eko (1.00)
  - Avantaj (1.20)
  - Comfort Flex (1.50)

- **Dashboard**
  - Admin: Günlük uçuş ve rezervasyon özeti
  - Müşteri: Aktif/iptal rezervasyonlar ve yaklaşan uçuşlar

## Güvenlik

- Session tabanlı oturum yönetimi
- Form doğrulama ve yetkilendirme kontrolleri

## Sonuç

Bu proje, gerçek hayattaki uçuş rezervasyon sistemlerinin temel işleyişini sade ve modüler bir yapıyla modellemektedir.
