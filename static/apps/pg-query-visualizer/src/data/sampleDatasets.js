export const datasets = {
  ecommerce: {
    name: 'E-commerce Store',
    description: 'Sample data for an online store with users, products, orders, and reviews',
    schema: [
      `CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
      )`,
      `CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      `CREATE TABLE order_items (
        id INTEGER PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`
    ],
    data: [
      // Users
      `INSERT INTO users (id, name, email, created_at) VALUES
        (1, 'Alice Johnson', 'alice@example.com', '2024-01-15'),
        (2, 'Bob Smith', 'bob@example.com', '2024-02-20'),
        (3, 'Carol White', 'carol@example.com', '2024-03-10'),
        (4, 'David Brown', 'david@example.com', '2024-04-05'),
        (5, 'Eve Davis', 'eve@example.com', '2024-05-12')`,

      // Products
      `INSERT INTO products (id, name, category, price, stock) VALUES
        (1, 'Laptop Pro 15', 'Electronics', 1299.99, 25),
        (2, 'Wireless Mouse', 'Electronics', 29.99, 150),
        (3, 'Desk Chair', 'Furniture', 249.99, 40),
        (4, 'Coffee Maker', 'Appliances', 89.99, 60),
        (5, 'Notebook Set', 'Stationery', 12.99, 200),
        (6, 'USB-C Cable', 'Electronics', 19.99, 300),
        (7, 'Standing Desk', 'Furniture', 399.99, 15),
        (8, 'Keyboard Mechanical', 'Electronics', 149.99, 75)`,

      // Orders
      `INSERT INTO orders (id, user_id, total, status, created_at) VALUES
        (1, 1, 1329.98, 'completed', '2024-06-01'),
        (2, 2, 279.98, 'completed', '2024-06-05'),
        (3, 3, 89.99, 'shipped', '2024-06-10'),
        (4, 1, 649.98, 'completed', '2024-06-12'),
        (5, 4, 12.99, 'completed', '2024-06-15'),
        (6, 5, 179.98, 'processing', '2024-06-18'),
        (7, 2, 399.99, 'shipped', '2024-06-20'),
        (8, 3, 1469.98, 'completed', '2024-06-22')`,

      // Order Items
      `INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
        (1, 1, 1, 1, 1299.99),
        (2, 1, 2, 1, 29.99),
        (3, 2, 3, 1, 249.99),
        (4, 2, 2, 1, 29.99),
        (5, 3, 4, 1, 89.99),
        (6, 4, 7, 1, 399.99),
        (7, 4, 3, 1, 249.99),
        (8, 5, 5, 1, 12.99),
        (9, 6, 8, 1, 149.99),
        (10, 6, 2, 1, 29.99),
        (11, 7, 7, 1, 399.99),
        (12, 8, 1, 1, 1299.99),
        (13, 8, 6, 1, 19.99),
        (14, 8, 8, 1, 149.99)`
    ],
    exampleQueries: [
      {
        title: 'Get all products',
        query: 'SELECT * FROM products ORDER BY price DESC;'
      },
      {
        title: 'Find top customers by total spending',
        query: `SELECT
  u.name,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;`
      },
      {
        title: 'Products with low stock',
        query: 'SELECT name, stock FROM products WHERE stock < 50 ORDER BY stock ASC;'
      },
      {
        title: 'Order details with customer info',
        query: `SELECT
  o.id as order_id,
  u.name as customer,
  o.total,
  o.status,
  o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;`
      },
      {
        title: 'Most popular products',
        query: `SELECT
  p.name,
  SUM(oi.quantity) as units_sold,
  SUM(oi.quantity * oi.price) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY units_sold DESC;`
      }
    ]
  },

  blog: {
    name: 'Blog Platform',
    description: 'Sample data for a blogging platform with authors, posts, comments, and tags',
    schema: [
      `CREATE TABLE authors (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        bio TEXT,
        joined_date TEXT NOT NULL
      )`,
      `CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        author_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        published_at TEXT NOT NULL,
        views INTEGER DEFAULT 0,
        FOREIGN KEY (author_id) REFERENCES authors(id)
      )`,
      `CREATE TABLE comments (
        id INTEGER PRIMARY KEY,
        post_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )`,
      `CREATE TABLE tags (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      )`,
      `CREATE TABLE post_tags (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      )`
    ],
    data: [
      // Authors
      `INSERT INTO authors (id, name, email, bio, joined_date) VALUES
        (1, 'Sarah Developer', 'sarah@blog.com', 'Full-stack developer and tech enthusiast', '2023-01-10'),
        (2, 'Mike Designer', 'mike@blog.com', 'UI/UX designer with a passion for minimalism', '2023-03-15'),
        (3, 'Lisa DataScientist', 'lisa@blog.com', 'Data scientist exploring ML and AI', '2023-05-20')`,

      // Posts
      `INSERT INTO posts (id, author_id, title, content, published_at, views) VALUES
        (1, 1, 'Getting Started with React', 'React is a powerful library for building user interfaces...', '2024-01-15', 1250),
        (2, 1, 'Advanced PostgreSQL Queries', 'PostgreSQL offers many advanced features for complex queries...', '2024-02-20', 980),
        (3, 2, 'Design Principles for Modern Apps', 'Good design is invisible but makes all the difference...', '2024-03-10', 1520),
        (4, 3, 'Introduction to Machine Learning', 'Machine learning is transforming how we solve problems...', '2024-04-05', 2100),
        (5, 1, 'Building RESTful APIs', 'REST APIs are the backbone of modern web applications...', '2024-05-12', 890),
        (6, 2, 'Color Theory in UI Design', 'Understanding color theory can elevate your designs...', '2024-06-01', 1340),
        (7, 3, 'Data Visualization Best Practices', 'Effective data visualization tells a story...', '2024-06-15', 1670)`,

      // Comments
      `INSERT INTO comments (id, post_id, author_name, content, created_at) VALUES
        (1, 1, 'John', 'Great introduction! Very helpful.', '2024-01-16'),
        (2, 1, 'Emma', 'Looking forward to more React tutorials!', '2024-01-17'),
        (3, 2, 'David', 'This helped me optimize my queries. Thanks!', '2024-02-21'),
        (4, 3, 'Sophie', 'Beautiful examples of design principles.', '2024-03-11'),
        (5, 4, 'Alex', 'Clear explanation of ML concepts.', '2024-04-06'),
        (6, 4, 'Maria', 'Could you do a follow-up on neural networks?', '2024-04-07'),
        (7, 5, 'Chris', 'Best REST API guide I have read.', '2024-05-13'),
        (8, 6, 'Taylor', 'The color palette suggestions were perfect!', '2024-06-02'),
        (9, 7, 'Jordan', 'Love the visualization examples!', '2024-06-16')`,

      // Tags
      `INSERT INTO tags (id, name) VALUES
        (1, 'React'),
        (2, 'JavaScript'),
        (3, 'Database'),
        (4, 'PostgreSQL'),
        (5, 'Design'),
        (6, 'UI/UX'),
        (7, 'Machine Learning'),
        (8, 'Data Science'),
        (9, 'API'),
        (10, 'Backend')`,

      // Post Tags
      `INSERT INTO post_tags (post_id, tag_id) VALUES
        (1, 1), (1, 2),
        (2, 3), (2, 4),
        (3, 5), (3, 6),
        (4, 7), (4, 8),
        (5, 9), (5, 10), (5, 2),
        (6, 5), (6, 6),
        (7, 8)`
    ],
    exampleQueries: [
      {
        title: 'Get all posts with author names',
        query: `SELECT
  p.title,
  a.name as author,
  p.published_at,
  p.views
FROM posts p
JOIN authors a ON p.author_id = a.id
ORDER BY p.published_at DESC;`
      },
      {
        title: 'Most viewed posts',
        query: `SELECT title, views
FROM posts
ORDER BY views DESC
LIMIT 5;`
      },
      {
        title: 'Authors with most posts',
        query: `SELECT
  a.name,
  COUNT(p.id) as post_count,
  SUM(p.views) as total_views
FROM authors a
LEFT JOIN posts p ON a.id = p.author_id
GROUP BY a.id, a.name
ORDER BY post_count DESC;`
      },
      {
        title: 'Posts with their tags',
        query: `SELECT
  p.title,
  GROUP_CONCAT(t.name, ', ') as tags
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, p.title;`
      },
      {
        title: 'Posts with comment counts',
        query: `SELECT
  p.title,
  COUNT(c.id) as comment_count
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.title
ORDER BY comment_count DESC;`
      },
      {
        title: 'Find posts by tag',
        query: `SELECT
  p.title,
  p.published_at
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.name = 'React';`
      }
    ]
  }
};

export default datasets;
