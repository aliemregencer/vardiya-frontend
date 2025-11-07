Feature: Kullanıcı Kimlik Doğrulama
  Vardiya Yönetim Sistemi'nde yöneticiler ve çalışanlar başarılı bir şekilde giriş yapabilmeli.

  Scenario: Başarılı Yönetici Girişi
    Given "http://localhost:5173/" adresine gidildi
    And E-posta alanına "yonetici@vardiya.com" yazıldı
    And Şifre alanına "cokguclusifre123" yazıldı
    When "Giriş Yap" butonuna tıklandı
    Then URL "/dashboard" içermeli
    And "Hoş Geldin Yönetici" yazısı görülmeli