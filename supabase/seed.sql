insert into public.categories (id, name, icon, color, sort_order) values
  ('vegetables', 'Vegetables', 'leaf-outline', '#DDF2E2', 1),
  ('fruits', 'Fruits', 'nutrition-outline', '#FFF0D3', 2),
  ('staples', 'Staples', 'basket-outline', '#F5E7D7', 3),
  ('dairy', 'Dairy', 'water-outline', '#E4F2FA', 4),
  ('herbs', 'Herbs', 'flower-outline', '#E8F4D9', 5)
on conflict (id) do update set name = excluded.name, icon = excluded.icon, color = excluded.color;

insert into public.products (
  id, category_id, name, description, image_url, origin,
  household_price_paise, business_price_paise, household_unit, business_unit,
  stock_quantity, discount_percent, rating, featured
) values
  ('tomato', 'vegetables', 'Farm Fresh Tomatoes', 'Juicy, naturally ripened tomatoes sourced directly from partner farms.', 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800', 'Kolar, Karnataka', 3800, 2900, '1 kg', '10 kg crate', 200, 18, 4.8, true),
  ('onion', 'vegetables', 'Premium Red Onions', 'Firm, flavourful red onions with excellent shelf life.', 'https://images.unsplash.com/photo-1518977956815-dee00671e1a8?w=800', 'Nashik, Maharashtra', 4200, 3200, '1 kg', '25 kg sack', 300, 12, 4.7, true),
  ('potato', 'vegetables', 'Jyoti Potatoes', 'Clean, evenly sized all-purpose potatoes for everyday cooking.', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800', 'Agra, Uttar Pradesh', 3400, 2500, '1 kg', '30 kg sack', 300, null, 4.6, false),
  ('banana', 'fruits', 'Robusta Bananas', 'Naturally sweet bananas picked at just the right maturity.', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800', 'Yelakki, Karnataka', 5800, 4400, '1 dozen', '12 dozen crate', 150, 8, 4.9, true),
  ('apple', 'fruits', 'Royal Gala Apples', 'Crisp and aromatic apples with a balanced sweet flavour.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800', 'Himachal Pradesh', 18900, 15400, '1 kg', '18 kg box', 100, 15, 4.7, false),
  ('mango', 'fruits', 'Alphonso Mangoes', 'Rich, fragrant Alphonso mangoes from the Konkan coast.', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800', 'Ratnagiri, Maharashtra', 34900, 28500, '6 pcs', '4 dozen box', 100, 10, 4.9, true),
  ('rice', 'staples', 'Sona Masoori Rice', 'Lightweight, aromatic everyday rice with consistent grain quality.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', 'Raichur, Karnataka', 34900, 126000, '5 kg', '25 kg bag', 100, null, 4.5, false),
  ('milk', 'dairy', 'Fresh Cow Milk', 'Pasteurised fresh cow milk delivered under a cold chain.', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800', 'Bengaluru Rural', 3200, 5500, '500 ml', '1 L × 12', 100, null, 4.8, false),
  ('coriander', 'herbs', 'Fresh Coriander', 'Freshly harvested aromatic coriander, cleaned and sorted.', 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=800', 'Hosur, Tamil Nadu', 1800, 12000, '1 bunch', '10 bunches', 100, null, 4.6, false),
  ('spinach', 'herbs', 'Tender Spinach', 'Tender green spinach leaves, freshly harvested this morning.', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800', 'Hosur, Tamil Nadu', 2600, 18000, '250 g', '3 kg crate', 0, null, 4.5, false)
on conflict (id) do update set
  name = excluded.name,
  household_price_paise = excluded.household_price_paise,
  business_price_paise = excluded.business_price_paise,
  stock_quantity = excluded.stock_quantity,
  active = true;
