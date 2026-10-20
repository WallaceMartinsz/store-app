import { Gamepad2, Headphones, Keyboard, Mic, Monitor, Mouse } from 'lucide-react';

const unsplash = (photo) => `https://images.unsplash.com/${photo}?w=600&q=80`;

export const CATEGORIES = [
  { value: 'MOUSE', slug: 'mouses', label: 'Mouses', icon: Mouse, img: unsplash('photo-1615663245857-ac93bb7c39e7') },
  { value: 'TECLADO', slug: 'teclados', label: 'Teclados', icon: Keyboard, img: unsplash('photo-1618384887929-16ec33fab9ef') },
  { value: 'HEADSET', slug: 'headsets', label: 'Headsets', icon: Headphones, img: unsplash('photo-1599669454699-248893623440') },
  { value: 'MONITOR', slug: 'monitores', label: 'Monitores', icon: Monitor, img: unsplash('photo-1586210579191-33b45e38fa2c') },
  { value: 'STREAMING', slug: 'streaming', label: 'Streaming', icon: Mic, img: unsplash('photo-1590602847861-f357a9332bbc') },
  { value: 'ACESSORIO', slug: 'acessorios', label: 'Acessórios', icon: Gamepad2, img: unsplash('photo-1600861194942-f883de0dfe96') }
];

export const findCategoryBySlug = (slug) => CATEGORIES.find((category) => category.slug === slug);

export const getCategoryLabel = (value) => (
  CATEGORIES.find((category) => category.value === value)?.label || 'Outros'
);
