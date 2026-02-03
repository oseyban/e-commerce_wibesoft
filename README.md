# E-Commerce Örnek Projesi

**Monorepo** — Next.js (web) + Expo (mobile) + paylaşılan paketler (api, store, design-tokens, types, utils)

Bu README, Monorepo-ECommerce  **tek kaynaklı** proje dokümantasyonudur. Aşağıda projenin amacı, mimarisi, nasıl çalıştırılacağı, codegen/CI adımları ve değerlendirme kriterlerine yönelik kontrol listesi yer almaktadır.


## İçindekiler

1. [Proje özeti](#proje-özeti)
2. [Hızlı Başlangıç (Local)](#h%C4%B1zl%C4%B1-ba%C5%9Flang%C4%B1%C3%A7-local)
3. [Monorepo yapısı](#monorepo-yap%C4%B1s%C4%B1)
4. [Nasıl çalışır? (mimari bileşenler)](#nas%C4%B1l-%C3%A7al%C4%B1%C5%9Fr-mimari-bile%C5%9Fenler)
5. [Önemli dosyalar ve konumları](#%C3%B6nemli-dosyalar-ve-konumlar%C4%B1)
6. [Codegen / OpenAPI akışı](#codegen--openapi-ak%C4%B1%C5%9F%C4%B1)
7. [Çalıştırma komutları](#%C3%A7al%C4%B1%C5%9Frt%C4%B1rma-komutlar%C4%B1)
8. [Environment ve konfigürasyonlar](#environment-ve-konfig%C3%BCrasyonlar)
9. [CI / Test önerisi](#ci--test-%C3%B6nerisi)
10. [Değerlendirme kontrol listesi (Frontend görevinden)](#de%C4%9Ferleme-kontrol-listesi-frontend-g%C3%B6revinden)

---

## Proje özeti

Bu monorepo, Wibesoft için hazırlanmış bir e‑commerce örnek uygulamasıdır. Amaç:

* Web: Next.js ile Figma referanslı responsive UI
* Mobile: Expo ile benzer UX yakalayan mobil uygulama
* Paylaşılan paketlerde OpenAPI üzerinden otomatik üretilen client ve hook'lar
* TanStack Query (v5) ile veri yönetimi, 
* Zustand ile global state (cart) yönetimi

Projede `packages/api` OpenAPI codegen çıktıları ve shared adapter/hook'lar içerir. `apps/web` bu paketleri workspace olarak kullanır.

---

## Hızlı Başlangıç (Local)

Gereksinimler: Node.js (LTS), pnpm (>= 8 recommended), Git. 

```bash
# repo kökünde
pnpm install
# sadece web
pnpm --filter web dev
# veya sadece mobile
pnpm --filter mobile start
# tüm develop (parallel)
pnpm dev
```

Web build:

```bash
pnpm --filter web build
```

## Monorepo yapısı (özet)

Ana dizinler:

```
apps/
  web/        # Next.js uygulaması
  mobile/     # Expo uygulaması
packages/
  api/        # OpenAPI generated client + adapter + hooks
  store/      # Zustand store (cart, auth)
  design-tokens
  types
  utils
```

## Nasıl çalışır? (mimari bileşenler)

* **API client (packages/api)**

  * `openapi.json` — spec
  * `generated/` — codegen çıktısı (client, types)
  * `client.ts` — client konfigürasyonu ve `configureClient` fonksiyonu
  * `adapter.ts` — `unwrap`, tip çıkarımlar ve basit helper fonksiyonlar
  * `hooks/` — paylaşılan yardımcı hook'lar (useAsync vs.)

* **Web uygulaması (apps/web)**

  * `src/lib/api.ts` — uygulama başlangıcında `configureClient({ baseUrl, responseStyle: 'data' })` çağrılır
  * `src/app/providers.tsx` — `QueryClientProvider` burada tanımlı ve `src/app/layout.tsx` içinde sarılmış
  * `src/hooks` — uygulama seviyesinde yardımcı hook'lar
  * `src/components` — UI bileşenleri (product card, cart list vb.)

* **State ve cart**

  * `packages/store` içinde Zustand tabanlı store, cart slice ve tiplerle birlikte

---

## Önemli dosyalar ve konumları

* `packages/api/openapi.json` — OpenAPI spec
* `packages/api/src/generated` — codegen çıktı dosyaları
* `packages/api/src/adapter.ts`, `client.ts` — API adapter & client
* `apps/web/src/app/layout.tsx` — Providers’in sarıldığı yer
* `apps/web/src/lib/api.ts` — `configureClient` çağrısı
* `apps/web/src/components/*` — UI
* `apps/web/src/app/product/[id]/page.tsx` — ürün detay sayfası

---

## Codegen / OpenAPI akışı (güncel)

Spec: `packages/api/openapi.json`

1. Spec'i güncelle (el ile veya otomatik kaynak).
  # packages/api/openapi.json -> (el ile veya otomatik fetch)
2. Codegen çalıştır:
   ```bash
   pnpm codegen

3. packages/api içindeki adapter / re-export'ları kontrol et
# (ör: packages/api/src/index.ts veya packages/api/src/adapters/*)

4. Root'ta build/test
```bash
  pnpm install
  pnpm build


## Çalıştırma komutları (özet)

Root:

* `pnpm dev` — turbo ile paralel dev
* `pnpm --filter web dev` — sadece web
* `pnpm --filter mobile start` — sadece mobile
* `pnpm build` — tümü build

Web (apps/web):

* `pnpm --filter web dev`
* `pnpm --filter web build`
* `pnpm --filter web start`

Lint/Format (root):

* `pnpm lint` (turbo üzerinden çalışır)

---

## Environment ve konfigürasyonlar

* `apps/web/.env` (örnek):

```
NEXT_PUBLIC_API_URL=https://fakestoreapi.com
```

* `packages/api` `configureClient` çağrısında `responseStyle: 'data'` kullanılıyor — adapter bu formata göre yazıldı.

---

## CI / Test önerisi

* Basit pipeline:

  1. `pnpm install --frozen-lockfile`
  2. `pnpm lint`
  3. `pnpm build`
  4. Unit tests: `pnpm test:e2e` 

* Codegen adımlarını CI’ye ekleyin (spec değiştiyse üretim adımı çalışsın). `openapitools.json` ve codegen script’lerini CI’de tetikleyin.

---

Testler (E2E)

Projede temel kullanıcı akışlarını doğrulamak için Playwright ile E2E testler bulunmaktadır.

Testleri Çalıştırma
pnpm test:e2e


Bu komut testler başlamadan önce apps/web uygulamasını otomatik olarak ayağa kaldırır ve tarayıcı üzerinden senaryoları çalıştırır.

Kapsanan Senaryolar

API'nin çalıştığını doğrulayan basit bir /products isteği

Ana sayfadan bir ürüne gitme

Ürünü sepete ekleme

Sepet sayfasında ürünün göründüğünü doğrulama

Bu testler; routing, API bağlantısı, state yönetimi (cart) ve temel UI akışlarının birlikte doğru çalıştığını garanti eder.

---

## Değerlendirme kontrol listesi (Frontend görevinden)

Aşağıdaki maddeler dökümantasyondaki görev kriterlerine göre düzenlendi. 

 [*] Ürün listeleme ekranı: API’den çekiliyor, loading ve error durumları var
 [*] Her ürün kartında: görsel, isim, fiyat
 [*] Ürün detay ekranı: görsel, açıklama, fiyat, "Sepete ekle" butonu
 [*] Sepet ekranı: liste, adet güncelleme, silme, toplam tutar
 [*] Zustand ile sepet yönetimi kullanılıyor
 [*] TypeScript ile tip güvenliği
 [*] TanStack Query (v5) kullanımı (QueryClientProvider root’ta)
 [*] Tailwind CSS ile UI
 [*] Figma uyumuna dikkat (layout, spacing, typography)
 [*] Test Sonucu Kontrol Etme

