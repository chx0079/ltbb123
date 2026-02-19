
export enum ScreenType {
  HOME = 'HOME',
  PORTFOLIO = 'PORTFOLIO',
  SHOP = 'SHOP',
  SETTINGS = 'SETTINGS'
}

export interface Asset {
  id: string;
  name: string;
  code: string;
  quantity: number;
  cost: number;
  currentPrice: number;
  value: number; // Derived: quantity * currentPrice
  change: number; // Daily percentage change
  type: 'stock';
  icon: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: '办公家具' | '电子设备' | '室外景观' | '特别限定';
  icon: string;
  premium?: boolean;
  owned?: boolean;
}

export interface UserState {
  companyFunds: number;
  incentivePoints: number;
  dailyProfit: number;
  vipLevel: number;
  userId: string;
  isSimulationMode: boolean;
  lastLoginDate?: string;
}
