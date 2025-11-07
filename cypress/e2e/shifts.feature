Feature: 2. Vardiya Yönetimi ve Yetkilendirme Kontrolleri
  Sadece yöneticiler vardiya oluşturup yayımlayabilir; çalışanlar sadece kendi yayımlanmış vardiyalarını görmelidir.

  @shifts
  Scenario: 3. Yönetici Yeni Vardiya Oluşturabilmeli
    Given "yonetici@vardiya.com" kullanıcısı sisteme giriş yaptı
    And Vardiya Oluşturma sayfasına gidildi
    When Başlangıç zamanı "2026-01-01T08:00:00Z" ve Bitiş zamanı "2026-01-01T16:00:00Z" olarak dolduruldu
    And "Vardiya Yarat" butonuna tıklandı
    Then Vardiya API'ı 201 statüsü ile başarılı yanıt vermeli
    And Yeni vardiya listede görünmeli

  @view
  Scenario: 4. Çalışan Sadece Kendi Yayımlanmış Vardiyalarını Görebilmeli
    Given "calisan@vardiya.com" kullanıcısı sisteme giriş yaptı
    When "/dashboard" adresine gidildi
    Then Listede sadece "Çalışan Vardiya 1" görülmeli
    And Listede "Yönetici Vardiya" görülmemeli

  @authz
  Scenario: 6. Çalışan, Yönetici Rotalarına Erişim Engeli Almalı
    Given "calisan@vardiya.com" kullanıcısı sisteme giriş yaptı
    When Yönetici Paneli linkine tıklandı
    Then URL "/403-forbidden" içermeli
    And "Bu işlemi yapmaya yetkiniz yok." uyarısı görülmeli