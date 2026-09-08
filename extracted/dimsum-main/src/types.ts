export type DimsumServingType = 'frozen' | 'cooked';

export interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  value: string;
  url: string;
  description: string;
  color: string;
}

export interface BusinessMilestone {
  year: string;
  title: string;
  highlight: string;
  description: string;
}

export interface OrderDetails {
  quantity: number;
  unitPrice: number;
  servingType: DimsumServingType;
  couponCode: string;
  isCouponApplied: boolean;
  discountAmount: number;
  totalPrice: number;
}
