# e-commerce_wibesoft
E-Commerce Next &amp; Expo Repository For WibeSoft
Projede NextJs ve Expo kullanıldı. monorepo kullanılarak iki uygulamanın da birlikte çalışması ve ortak kodları kullanarak projede %40 daha az kod yazma sağlandı böylece zamandan ve maliyetlerden tasarruf edilmesi düşünüldü.

Yüklenecek paketler:

Root / geliştirme araçları (devDependencies)
turbo (Turborepo) — build/run orchestration
pnpm (workspace yönetimi)
eslint, prettier, eslint-config-prettier, eslint-plugin-react, @typescript-eslint/parser, @typescript-eslint/eslint-plugin
husky, lint-staged
TypeScript (root tip check için, her uygulama da TS olacak)


Web (apps/web):
next
react, react-dom (create-next-app ekler)
tailwindcss, postcss, autoprefixer
@tanstack/react-query (v5)
zustand
axios
react-icons (UI için)
clsx (utility)
openapi-react-query-codegen (dev / API client codegen için)
@types/* 
Mobile (apps/mobile — Expo)
expo (create-expo-app oluşturur)
expo-router
react-native ( expo için)
@tanstack/react-query
zustand
axios (veya fetch)
nativewind (Tailwind benzeri utility for RN)
react-native-safe-area-context, expo-asset (expo tipik paketleri)

Ortak paketler (packages/*):
packages/types (sadece TypeScript tipleri; paket olarak publish edilmez)
packages/api (openapi generated client + react-query hooks) — openapi codegen çıktısı
packages/store (zustand store)
packages/utils (formatter, currency helper vs)
packages/design-tokens (renk / spacing token’ları)

monorepo kullanımı sebebiyle pnpm workspace kullanıldı.



