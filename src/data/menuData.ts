export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'Hot Drinks' | 'Cold Drinks' | 'Milkshake' | 'Tea';
}

export const menuItems: MenuItem[] = [
  // Hot Drinks
  {
    id: 'cappuccino_reg',
    name: 'Cappuccino Reg',
    description: 'Classic Italian cappuccino with perfect espresso and foam balance',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'cappuccino_med',
    name: 'Cappuccino Med',
    description: 'Medium cappuccino with rich espresso and velvety foam',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1708430651927-20e2e1f1e8f7?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Smooth espresso with steamed milk and light foam',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1582152747136-af63c112fce5?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'latte_medium',
    name: 'Latte Medium',
    description: 'Medium latte for the perfect coffee moment',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1582152747136-af63c112fce5?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'flat_white',
    name: 'Flat White',
    description: 'Velvety microfoam over double espresso shot',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1727080409436-356bdc609899?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water for a smooth taste',
    price: '₹150',
    image: 'https://images.unsplash.com/photo-1669872484166-e11b9638b50e?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'americano_med',
    name: 'Americano Med',
    description: 'Medium americano for extended enjoyment',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1669872484166-e11b9638b50e?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'hazelnut_cappuccino_reg',
    name: 'Hazelnut Cappuccino Reg',
    description: 'Cappuccino with rich hazelnut flavor',
    price: '₹170',
    image: 'https://images.unsplash.com/photo-1598831745385-0c404c7034a9?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'hazelnut_cappuccino_medium',
    name: 'Hazelnut Cappuccino Medium',
    description: 'Medium hazelnut cappuccino with extra richness',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1598831745385-0c404c7034a9?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'caramel_latte',
    name: 'Caramel Latte',
    description: 'Sweet caramel blended with espresso and milk',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'caramel_latte_medium',
    name: 'Caramel Latte Medium',
    description: 'Medium caramel latte with extra sweetness',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'vanilla_latte',
    name: 'Vanilla Latte',
    description: 'Classic latte with smooth vanilla notes',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'vanilla_latte_medium',
    name: 'Vanilla Latte Medium',
    description: 'Medium vanilla latte for ultimate comfort',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    description: 'Espresso marked with a dollop of foamed milk',
    price: '₹100',
    image: 'https://images.unsplash.com/photo-1604298458655-ae6e04213678?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: '₹125',
    image: 'https://images.unsplash.com/photo-1618576230663-9714aecfb99a?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Equal parts espresso and warm milk',
    price: '₹90',
    image: 'https://images.unsplash.com/photo-1747852221932-296571135b7b?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'filter_coffee',
    name: 'Filter Coffee',
    description: 'Traditional South Indian filter coffee',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'tonic_espresso',
    name: 'Tonic Espresso',
    description: 'Refreshing espresso with tonic water',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'irish_coffee',
    name: 'Irish Coffee',
    description: 'Coffee with whiskey and cream',
    price: '₹230',
    image: 'https://images.unsplash.com/photo-1549057219-0c0be1287566?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'filter_coffee_medium',
    name: 'Filter Coffee Medium',
    description: 'Medium size traditional filter coffee',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'hot_chocolate',
    name: 'Hot Chocolate',
    description: 'Rich and creamy hot chocolate',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'hot_chocolate_med',
    name: 'Hot Chocolate Med',
    description: 'Medium hot chocolate with extra richness',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'doppio',
    name: 'Doppio',
    description: 'Double shot of espresso',
    price: '₹120',
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'single_espresso',
    name: 'Single Espresso',
    description: 'Single shot of pure espresso',
    price: '₹100',
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800',
    category: 'Hot Drinks'
  },
  {
    id: 'affogato',
    name: 'Affogato',
    description: 'Vanilla ice cream drowned in hot espresso',
    price: '₹220',
    image: 'https://images.unsplash.com/photo-1638543284847-3a6bed3e1689?w=800',
    category: 'Hot Drinks'
  },

  // Cold Drinks
  {
    id: 'cold_brew',
    name: 'Cold Brew',
    description: 'Smooth cold-steeped coffee',
    price: '₹170',
    image: 'https://images.unsplash.com/photo-1561641377-f7456d23aa9b?w=800',
    category: 'Cold Drinks'
  },
  {
    id: 'cold_brew_oat',
    name: 'Cold Brew Oat',
    description: 'Cold brew with creamy oat milk',
    price: '₹200',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
    category: 'Cold Drinks'
  },
  {
    id: 'iced_americano',
    name: 'Iced Americano',
    description: 'Chilled espresso with cold water over ice',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1581996323441-538096e854b9?w=800',
    category: 'Cold Drinks'
  },
  {
    id: 'iced_tea',
    name: 'Iced Tea',
    description: 'Refreshing chilled tea',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1713949215254-9769b4ad8724?w=800',
    category: 'Cold Drinks'
  },
  {
    id: 'lemonade_cold_brew',
    name: 'Lemonade Cold Brew',
    description: 'Refreshing lemonade mixed with cold brew',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1728777187089-1af2c5facff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbmFkZSUyMGNvbGQlMjBicmV3fGVufDF8fHx8MTc2NDc2ODg3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Cold Drinks'
  },
  {
    id: 'matcha_og',
    name: 'Matcha OG',
    description: 'Premium Japanese matcha latte',
    price: '₹250',
    image: 'https://images.unsplash.com/photo-1582785513054-8d1bf9d69c1a?w=800',
    category: 'Cold Drinks'
  },
  {
    id: 'mango_matcha',
    name: 'Mango Matcha',
    description: 'Tropical mango blended with matcha',
    price: '₹260',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
    category: 'Cold Drinks'
  },
  {
    id: 'shakerato',
    name: 'Shakerato',
    description: 'Shaken iced espresso drink',
    price: '₹190',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    category: 'Cold Drinks'
  },

  // Milkshakes
  {
    id: 'chocolate_shake',
    name: 'Chocolate Shake',
    description: 'Rich chocolate milkshake',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800',
    category: 'Milkshake'
  },
  {
    id: 'cookie_cream_shake',
    name: 'Cookie Cream Shake',
    description: 'Cookies and cream milkshake',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800',
    category: 'Milkshake'
  },
  {
    id: 'mango_shake',
    name: 'Mango',
    description: 'Fresh mango milkshake',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
    category: 'Milkshake'
  },
  {
    id: 'pistachio_shake',
    name: 'Pistachio Shake',
    description: 'Creamy pistachio milkshake',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
    category: 'Milkshake'
  },
  {
    id: 'strawberry_milk_shakes',
    name: 'Strawberry Milk Shakes',
    description: 'Sweet strawberry milkshake',
    price: '₹160',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJ5JTIwbWlsa3NoYWtlfGVufDF8fHx8MTc2NDczOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Milkshake'
  },

  // Tea
  {
    id: 'alattar',
    name: 'Alattar',
    description: 'Traditional spiced tea blend',
    price: '₹100',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
    category: 'Tea'
  },
  {
    id: 'blue_pea_tea',
    name: 'Blue Pea Tea',
    description: 'Vibrant blue pea flower tea',
    price: '₹140',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    category: 'Tea'
  },
  {
    id: 'camomile',
    name: 'Camomile',
    description: 'Soothing chamomile herbal tea',
    price: '₹110',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800',
    category: 'Tea'
  },
  {
    id: 'ginger_lemon_tea',
    name: 'Ginger Lemon Tea',
    description: 'Zesty ginger and lemon blend',
    price: '₹40',
    image: 'https://images.unsplash.com/photo-1631029098074-be99eb2b425c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW5nZXIlMjBsZW1vbiUyMHRlYXxlbnwxfHx8fDE3NjQ3Njg4Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Tea'
  },
  {
    id: 'green_tea',
    name: 'Green Tea',
    description: 'Pure refreshing green tea',
    price: '₹50',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800',
    category: 'Tea'
  }
];
