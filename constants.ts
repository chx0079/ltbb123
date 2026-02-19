
import { Asset, ShopItem } from './types';

export const ASSETS: Asset[] = [];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 's1', name: '现代办公桌', price: 450, category: '办公家具', icon: 'desk' },
  { id: 's2', name: '豪华咖啡机', price: 800, category: '办公家具', icon: 'coffee_maker' },
  { id: 's3', name: '黄金服务器', price: 2500, category: '电子设备', icon: 'dns', premium: true },
  { id: 's4', name: 'CEO 专属座椅', price: 1200, category: '办公家具', icon: 'chair' },
  { id: 's5', name: '禅意盆栽', price: 300, category: '室外景观', icon: 'potted_plant' },
  { id: 's6', name: '抽象艺术画', price: 600, category: '办公家具', icon: 'art_track' },
];
