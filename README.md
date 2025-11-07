# Vardiya Frontend

Bu depo Vardiya uygulamasının ön yüz (frontend) kaynak kodunu içerir. Proje React + TypeScript + Vite kullanılarak oluşturulmuştur.

Kısa özet
- React 19 + TypeScript
- Vite ile geliştirme sunucusu (HMR)
- Cypress ile uçtan uca (e2e) test iskeleti (features ve step'ler mevcut)

Önkoşullar
- Node.js (LTS önerilir; >= 18 veya 20 uyumludur)
- npm veya pnpm/yarn (örnekler npm ile verilmiştir)

Hızlı başlama

1) Bağımlılıkları yükleyin

```powershell
npm ci
```

Eğer `ci` çalışmazsa:

```powershell
npm install
```

2) Geliştirme sunucusunu çalıştırın

```powershell
npm run dev
```

3) Üretim için derleme

```powershell
npm run build
npm run preview
```

Lint

```powershell
npm run lint
```

Cypress (e2e) testleri

Bu projede `cypress` eklentileri ve Cucumber feature dosyaları bulunmaktadır. Testleri başlatmak için:

```powershell
# etkileşimli
npx cypress open

# CI için çalıştırma (headless)
npx cypress run
```

Not: Cypress çalıştırırken test verileri/fixture'lar ve environment değişkenlerine ihtiyaç olabilir. Gerekirse `.env` dosyası oluşturun (bu dosya `.gitignore` içinde ihmal edilir).

GitHub'a yükleme (örnek komutlar — PowerShell)

Projeyi yeni bir repository'ye yüklemek için (uzaktan `https://github.com/aliemregencer/vardiya-frontend.git`):

```powershell
# varsa daha önceki .git'i korumak istemiyorsanız, dikkat: silme işlemi geri alınamaz
# Remove-Item -Recurse -Force .git

git init
git add .
git commit -m "chore: initial commit"

git branch -M main
git remote add origin https://github.com/aliemregencer/vardiya-frontend.git

git push -u origin main
```

Uyarılar / kimlik doğrulama
- HTTPS ile push yaparken GitHub, kullanıcı adı/parola yerine Personal Access Token (PAT) isteyebilir. Bir PAT oluşturup (repo scope) kullanın veya Windows credential manager/VS Code Git entegrasyonunu kullanın.
- Alternatif olarak SSH anahtarları oluşturup GitHub'a ekleyerek `git@github.com:aliemregencer/vardiya-frontend.git` şeklinde SSH URL'si kullanabilirsiniz.

Doğrulama
- Push sonrası GitHub deposunu ziyaret ederek dosyaların gelmiş olduğunu doğrulayın.

İleri adımlar (öneriler)
- LICENSE ekleyin (örn. MIT) — telif hakları ve kullanım koşulları için
- CI (ör. GitHub Actions) eklentisi ekleyin: build/test/lint adımlarını çalıştırmak için
- package-lock.json dosyasını commit edin (örnek olarak `npm ci` kullandığımız için lock dosyası önemlidir)

İletişim
- Repo sahibi: https://github.com/aliemregencer

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
