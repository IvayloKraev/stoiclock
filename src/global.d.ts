import type AlpineType from 'alpinejs';

declare global {
  interface Window {
    Alpine: typeof AlpineType;
  }
}

export {};