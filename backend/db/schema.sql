CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(160) UNIQUE NOT NULL
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  images JSONB NOT NULL DEFAULT '[]',
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0,
  vendor VARCHAR(120) NOT NULL,
  specifications JSONB NOT NULL DEFAULT '[]',
  shipping_details JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cart (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY,
  cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  total NUMERIC(10, 2) NOT NULL,
  payment_status VARCHAR(30) NOT NULL,
  order_status VARCHAR(30) NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  comment TEXT NOT NULL
);

CREATE TABLE coupons (
  id UUID PRIMARY KEY,
  code VARCHAR(60) UNIQUE NOT NULL,
  discount INT NOT NULL,
  expiry TIMESTAMP NOT NULL
);

