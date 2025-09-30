import { Product } from '../types';

export const mockTrendingProducts: Product[] = [
  {
    product_id: 123,
    masterproductid: '123',
    name: 'שמפו לשיער יבש פינוק',
    productName: 'שמפו לשיער יבש פינוק',
    brand: 'פינוק',
    image: 'https://via.placeholder.com/150',
    image_url: 'https://via.placeholder.com/150',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'שמפו איכותי לשיער יבש',
    price: 14.9,
    healthScore: 85,
    prices: [],
    promotions: [
      { id: 1, description: '25% Off This Week', type: 'discount' }
    ]
  },
  {
    product_id: 456,
    masterproductid: '456',
    name: 'קרם הגנה SPF50',
    productName: 'קרם הגנה SPF50',
    brand: 'Life',
    image: 'https://via.placeholder.com/150',
    image_url: 'https://via.placeholder.com/150',
    imageUrl: 'https://via.placeholder.com/150',
    description: 'קרם הגנה איכותי',
    price: 49.9,
    healthScore: 78,
    prices: [],
  },
];

export const mockProductDetails = {
  masterproductid: '456', productName: 'קרם הגנה לפנים SPF50', brand: 'Life', imageUrl: 'https://via.placeholder.com/250', healthScore: 78, 
  ingredients: [
    { name: 'Aqua', type: 'safe' as const },
    { name: 'Octocrylene', type: 'warning' as const },
    { name: 'Glycerin', type: 'safe' as const },
    { name: 'Titanium Dioxide', type: 'safe' as const }
  ],
  israeliPrices: [ { retailerName: 'Super-Pharm', price: 49.90 }, { retailerName: 'Be Pharm', price: 52.50 }, { retailerName: 'Good Pharm', price: 47.90 }, ],
  internationalAlternatives: [
    { productName: 'Sunscreen Face Cream SPF50', brand: 'CeraVe', imageUrl: 'https://via.placeholder.com/250', finalPriceNIS: 65.00, trustLabel: 'similar', userVotes: { good: 12, bad: 2 }, },
    { productName: 'UV Face Sunscreen SPF50+', brand: 'La Roche-Posay', imageUrl: 'https://via.placeholder.com/250', finalPriceNIS: 72.00, trustLabel: 'relevant', userVotes: { good: 45, bad: 1 }, },
  ],
};

export const mockCartItems = [
  { masterproductid: '123', productName: 'שמפו לשיער יבש פינוק', brand: 'פינוק', imageUrl: 'https://via.placeholder.com/150', quantity: 1, price: 14.9, },
  { masterproductid: '456', productName: 'קרם הגנה SPF50', brand: 'Life', imageUrl: 'https://via.placeholder.com/150', quantity: 2, price: 49.9, },
];

export const mockCartComparison = [
  { retailerName: 'Super-Pharm', total: 114.70 },
  { retailerName: 'Be Pharm', total: 119.90 },
  { retailerName: 'Good Pharm', total: 109.50 },
];