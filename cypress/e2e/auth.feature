Feature: 1. Kullanıcı Kimlik Doğrulama ve Çıkış İşlemleri
  Sistem, kullanıcıların rol bazlı kimlik doğrulamasını ve güvenli çıkışı desteklemelidir.

  @auth
  Scenario: 1. Başarılı Yönetici Girişi
    Given "http://localhost:5173/" adresine gidildi
    And E-posta alanına "yonetici@vardiya.com" yazıldı
    And Şifre alanına "cokguclusifre123" yazıldı
    When "Giriş Yap" butonuna tıklandı
    Then URL "/dashboard" içermeli
    And "Hoş Geldin Yönetici" yazısı görülmeli

  @auth
  Scenario: 2. Geçersiz Şifre ile Giriş Başarısız Olmalı
    Given "http://localhost:5173/" adresine gidildi
    And E-posta alanına "calisan@vardiya.com" yazıldı
    And Şifre alanına "yanlis_sifre" yazıldı
    When "Giriş Yap" butonuna tıklandı
    Then URL "/login" içermeli
    And "Kullanıcı adı veya şifre hatalı" uyarısı görülmeli

  @logout
  Scenario: 5. Başarılı Çıkış Yapma
    Given "yonetici@vardiya.com" kullanıcısı sisteme giriş yaptı
    When "Çıkış Yap" butonuna tıklandı
    Then URL "/login" içermeli
    And "Giriş Yap" butonu görülmeli