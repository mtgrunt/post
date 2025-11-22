---
title: PostGres Database
date: 2025-11-13
ShowPostNavLinks: true
showHero: true
description: "11 powerful PostgreSQL features that can replace your entire tech stack - from caching to AI vectors to authentication."
tags: ["Database", "PostgreSQL", "Backend", "DevOps", "AI"]
---

## Introduction

Modern web development often involves juggling 20+ different services: Redis for caching, Elasticsearch for search, a vector database for AI, Algolia for full-text search, Auth0 for authentication, and the list goes on. But what if you could achieve 90% of these features using just **PostgreSQL**?

This guide explores 11 powerful, sometimes unorthodox ways to use PostgreSQL to simplify your stack and reduce dependencies.

---

## Setup: Getting Started with PostgreSQL

First, you'll need a PostgreSQL database. You can use a managed service like [Neon](https://neon.tech) or install it locally.

### Local Installation

\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@16
brew services start postgresql@16

# Verify installation
psql --version
\`\`\`

### Connect to Your Database

\`\`\`bash
# Connect to local PostgreSQL
psql -U postgres

# Or connect to a remote database
psql "postgresql://user:password@host:5432/dbname"
\`\`\`

---

## 1. NoSQL with JSON Support

**Replace:** MongoDB, DynamoDB

PostgreSQL supports \`JSONB\` (binary JSON), allowing you to store and query unstructured data just like NoSQL databases.

### Create a Table with JSONB

\`\`\`sql
-- Create table with JSONB column
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    metadata JSONB
);

-- Insert unstructured data
INSERT INTO products (name, metadata) VALUES
    ('Laptop', '{"brand": "Dell", "specs": {"ram": "16GB", "cpu": "i7"}}'),
    ('Phone', '{"brand": "Apple", "specs": {"storage": "256GB", "color": "black"}}');
\`\`\`

### Query JSON Data

\`\`\`sql
-- Access nested fields
SELECT name, metadata->>'brand' AS brand
FROM products;

-- Filter by JSON field
SELECT * FROM products
WHERE metadata->'specs'->>'ram' = '16GB';

-- Check if key exists
SELECT * FROM products
WHERE metadata ? 'brand';
\`\`\`

### Terminal Example

\`\`\`bash
# Run the queries
psql -U postgres -d mydb << EOF
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    metadata JSONB
);

INSERT INTO products (name, metadata) VALUES
    ('Laptop', '{"brand": "Dell", "specs": {"ram": "16GB", "cpu": "i7"}}');

SELECT name, metadata->>'brand' AS brand FROM products;
EOF
\`\`\`

---

## 2. Cron Jobs with pg_cron

**Replace:** AWS Lambda scheduled events, Google Cloud Scheduler

Run scheduled tasks directly in your database without external services.

### Install pg_cron Extension

\`\`\`sql
-- Enable the extension
CREATE EXTENSION pg_cron;
\`\`\`

### Schedule Jobs

\`\`\`sql
-- Delete old records daily at 3 AM
SELECT cron.schedule(
    'delete-old-logs',
    '0 3 * * *',
    'DELETE FROM logs WHERE created_at < NOW() - INTERVAL ''30 days'''
);

-- Aggregate data every hour
SELECT cron.schedule(
    'hourly-aggregation',
    '0 * * * *',
    'INSERT INTO analytics_hourly SELECT DATE_TRUNC(''hour'', created_at), COUNT(*) FROM events GROUP BY 1'
);

-- View scheduled jobs
SELECT * FROM cron.job;

-- Unschedule a job
SELECT cron.unschedule('delete-old-logs');
\`\`\`

### Terminal Setup

\`\`\`bash
# Add pg_cron to postgresql.conf
echo "shared_preload_libraries = 'pg_cron'" | sudo tee -a /etc/postgresql/16/main/postgresql.conf

# Restart PostgreSQL
sudo systemctl restart postgresql

# Enable extension in your database
psql -U postgres -d mydb -c "CREATE EXTENSION pg_cron;"
\`\`\`

---

## 3. In-Memory Caching

**Replace:** Redis, Memcached

Create a fast cache layer using unlogged tables that live in RAM.

### Create Unlogged Cache Table

\`\`\`sql
-- Create unlogged table (no WAL, faster writes)
CREATE UNLOGGED TABLE cache (
    key TEXT PRIMARY KEY,
    value JSONB,
    expires_at TIMESTAMP
);

-- Configure for in-memory storage
ALTER TABLE cache SET (autovacuum_enabled = true);
\`\`\`

### Cache Operations

\`\`\`sql
-- Set cache value
INSERT INTO cache (key, value, expires_at)
VALUES ('user:123', '{"name": "John", "email": "john@example.com"}', NOW() + INTERVAL '1 hour')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, expires_at = EXCLUDED.expires_at;

-- Get cache value
SELECT value FROM cache WHERE key = 'user:123' AND expires_at > NOW();

-- Delete expired entries (schedule with pg_cron)
DELETE FROM cache WHERE expires_at < NOW();
\`\`\`

### Configuration for RAM Storage

\`\`\`bash
# Edit postgresql.conf to increase shared buffers
sudo nano /etc/postgresql/16/main/postgresql.conf

# Add/modify:
# shared_buffers = 256MB  # Adjust based on available RAM
# effective_cache_size = 1GB

# Restart PostgreSQL
sudo systemctl restart postgresql
\`\`\`

---

## 4. Vector Database for AI (pgvector)

**Replace:** Pinecone, Weaviate, Milvus

Store and query vector embeddings for RAG (Retrieval-Augmented Generation) applications.

### Install pgvector

\`\`\`bash
# Install from source
cd /tmp
git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
\`\`\`

\`\`\`sql
-- Enable extension
CREATE EXTENSION vector;
\`\`\`

### Store and Query Vectors

\`\`\`sql
-- Create table with vector column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536)  -- OpenAI embeddings are 1536 dimensions
);

-- Insert vectors
INSERT INTO documents (content, embedding) VALUES
    ('PostgreSQL is a powerful database', '[0.1, 0.2, 0.3, ...]');

-- Create index for fast similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);

-- Find nearest neighbors (similarity search)
SELECT content, embedding <=> '[0.1, 0.2, 0.3, ...]' AS distance
FROM documents
ORDER BY distance
LIMIT 5;

-- Different distance metrics
-- L2 distance: <->
-- Cosine distance: <=>
-- Inner product: <#>
\`\`\`

### Using pgai for Automatic Vectorization

\`\`\`sql
-- Install pgai extension
CREATE EXTENSION ai CASCADE;

-- Vectorize data automatically
SELECT ai.create_vectorizer(
    'documents'::regclass,
    destination => 'document_embeddings',
    embedding => ai.embedding_openai('text-embedding-3-small', 1536),
    chunking => ai.chunking_recursive_character_text_splitter('content')
);
\`\`\`

---

## 5. Full-Text Search

**Replace:** Elasticsearch, Algolia, Typesense

Built-in powerful search capabilities with ranking and fuzzy matching.

### Create Full-Text Search Index

\`\`\`sql
-- Create table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector tsvector
);

-- Generate search vector
UPDATE articles SET search_vector =
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''));

-- Create GIN index for performance
CREATE INDEX articles_search_idx ON articles USING GIN (search_vector);
\`\`\`

### Search Queries

\`\`\`sql
-- Basic search
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'postgresql & database') AS query
WHERE search_vector @@ query
ORDER BY rank DESC;

-- Search with auto-update trigger
CREATE FUNCTION articles_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.content, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_update
BEFORE INSERT OR UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION articles_search_trigger();

-- Fuzzy search (handles typos)
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgress:*');  -- Matches "postgresql"
\`\`\`

---

## 6. GraphQL API with pg_graphql

**Replace:** Apollo Server, Hasura

Transform your database into a GraphQL API without additional servers.

### Install pg_graphql

\`\`\`sql
CREATE EXTENSION pg_graphql;
\`\`\`

### Create GraphQL Resolvers

\`\`\`sql
-- Create a simple schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title TEXT,
    content TEXT
);

-- Query via GraphQL
SELECT graphql.resolve($$
{
  users {
    id
    name
    posts {
      title
    }
  }
}
$$);
\`\`\`

### Terminal Example

\`\`\`bash
# Query via psql
psql -U postgres -d mydb -c "
SELECT graphql.resolve('{
  users {
    id
    name
    email
  }
}');"
\`\`\`

---

## 7. Real-Time Sync with Electric SQL

**Replace:** Firebase Realtime Database, Supabase Realtime

Keep client-side data in sync automatically without WebSockets.

### Setup Electric SQL

\`\`\`bash
# Install Electric SQL
npm install electric-sql

# Configure with PostgreSQL
npx electric-sql generate
\`\`\`

### Enable Logical Replication

\`\`\`sql
-- Enable logical replication
ALTER SYSTEM SET wal_level = logical;

-- Restart required
\`\`\`

\`\`\`bash
sudo systemctl restart postgresql
\`\`\`

### Client-Side Code

\`\`\`javascript
// Initialize Electric SQL
import { electrify } from 'electric-sql/wa-sqlite'

const electric = await electrify(
  await db,
  schema,
  { url: 'postgresql://user:pass@host:5432/db' }
)

// Live queries - automatically updates
const { results } = await electric.db.users.liveMany()
\`\`\`

---

## 8. Authentication with pg_crypto & pg_jwt

**Replace:** Auth0, Clerk, Firebase Auth

Roll your own authentication entirely in PostgreSQL.

### Install Extensions

\`\`\`sql
CREATE EXTENSION pgcrypto;
CREATE EXTENSION pgjwt;
\`\`\`

### User Table with Hashed Passwords

\`\`\`sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Register user (hash password with bcrypt)
INSERT INTO users (username, password_hash)
VALUES ('john', crypt('mypassword123', gen_salt('bf')));

-- Verify login
SELECT id, username
FROM users
WHERE username = 'john'
AND password_hash = crypt('mypassword123', password_hash);
\`\`\`

### JWT Token Generation

\`\`\`sql
-- Create function to generate JWT
CREATE OR REPLACE FUNCTION generate_jwt(user_id INT, username TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN sign(
        json_build_object(
            'user_id', user_id,
            'username', username,
            'exp', extract(epoch from now() + interval '7 days')
        ),
        'your-secret-key-here'
    );
END;
$$ LANGUAGE plpgsql;

-- Login and get JWT
SELECT generate_jwt(id, username)
FROM users
WHERE username = 'john'
AND password_hash = crypt('mypassword123', password_hash);
\`\`\`

### Row-Level Security (RLS)

\`\`\`sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own posts
CREATE POLICY user_posts ON posts
FOR SELECT
USING (user_id = current_setting('app.current_user_id')::INT);

-- Set current user from JWT (in your application)
SET app.current_user_id = '123';

-- Now queries are automatically filtered
SELECT * FROM posts;  -- Only returns posts where user_id = 123
\`\`\`

---

## 9. Analytics & Time-Series Data (pg_mooncake)

**Replace:** Google Analytics, Mixpanel, TimescaleDB

Store and analyze analytics data with columnar storage for blazing-fast queries.

### Install pg_mooncake

\`\`\`sql
CREATE EXTENSION mooncake;
\`\`\`

### Create Columnstore Table

\`\`\`sql
-- Create analytics table with columnar storage
CREATE TABLE page_views (
    timestamp TIMESTAMPTZ,
    user_id INT,
    page_url TEXT,
    duration_seconds INT
) USING columnstore;

-- Insert analytics events
INSERT INTO page_views VALUES
    (NOW(), 123, '/home', 45),
    (NOW(), 456, '/products', 120);

-- Fast aggregation queries
SELECT
    DATE_TRUNC('day', timestamp) AS day,
    COUNT(*) AS views,
    AVG(duration_seconds) AS avg_duration
FROM page_views
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day DESC;
\`\`\`

### Export to Cloud Storage

\`\`\`sql
-- Export data to S3/cloud storage
COPY (SELECT * FROM page_views WHERE timestamp < NOW() - INTERVAL '90 days')
TO PROGRAM 'aws s3 cp - s3://my-bucket/old-analytics.csv' CSV HEADER;
\`\`\`

---

## 10. REST API with PostgREST

**Replace:** Express.js, Fastify, custom REST APIs

Automatically generate a RESTful API from your database schema.

### Install PostgREST

\`\`\`bash
# Download PostgREST
wget https://github.com/PostgREST/postgrest/releases/download/v12.0.2/postgrest-v12.0.2-linux-static-x64.tar.xz
tar -xf postgrest-v12.0.2-linux-static-x64.tar.xz

# Create config file
cat > postgrest.conf << EOF
db-uri = "postgresql://user:pass@localhost:5432/mydb"
db-schemas = "public"
db-anon-role = "web_anon"
server-port = 3000
EOF

# Run PostgREST
./postgrest postgrest.conf
\`\`\`

### API Usage

\`\`\`bash
# GET all users
curl http://localhost:3000/users

# GET with filtering
curl "http://localhost:3000/users?age=gt.25&order=name.asc"

# GET single record
curl http://localhost:3000/users?id=eq.1

# POST new record
curl -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice", "email": "alice@example.com"}'

# PATCH update
curl -X PATCH http://localhost:3000/users?id=eq.1 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice Updated"}'

# DELETE
curl -X DELETE http://localhost:3000/users?id=eq.1
\`\`\`

### Advanced Filtering

\`\`\`bash
# Pagination
curl "http://localhost:3000/users?limit=10&offset=20"

# Nested resources
curl "http://localhost:3000/users?select=name,posts(title,content)"

# Full-text search
curl "http://localhost:3000/articles?content=fts.postgresql"
\`\`\`

---

## 11. Storing UI Code in the Database

For the ultimate full-stack PostgreSQL experience, you can even store and serve HTML/CSS/JavaScript.

### Store Frontend Assets

\`\`\`sql
-- Create table for static files
CREATE TABLE static_files (
    path TEXT PRIMARY KEY,
    content_type TEXT,
    content BYTEA,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Store HTML
INSERT INTO static_files (path, content_type, content) VALUES
    ('/index.html', 'text/html',
     '<html><body><h1>Hello from PostgreSQL!</h1></body></html>'::bytea);

-- Store JavaScript
INSERT INTO static_files (path, content_type, content) VALUES
    ('/app.js', 'application/javascript',
     'console.log("Running from the database!");'::bytea);

-- Serve files via PostgREST or custom function
CREATE OR REPLACE FUNCTION serve_file(file_path TEXT)
RETURNS TABLE(content_type TEXT, content BYTEA) AS $$
BEGIN
    RETURN QUERY SELECT s.content_type, s.content
    FROM static_files s WHERE s.path = file_path;
END;
$$ LANGUAGE plpgsql;
\`\`\`

---

## Complete Setup Script

Here's a complete terminal script to set up a PostgreSQL database with multiple extensions:

\`\`\`bash
#!/bin/bash

# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib build-essential git

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql << EOF
CREATE DATABASE fullstack_db;
\\c fullstack_db

-- Install extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS vector;

-- Create sample schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title TEXT NOT NULL,
    content TEXT,
    search_vector tsvector,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create search trigger
CREATE FUNCTION posts_search_trigger() RETURNS trigger AS \\$\\$
BEGIN
    NEW.search_vector := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.content, ''));
    RETURN NEW;
END;
\\$\\$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_update
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION posts_search_trigger();

-- Create GIN index
CREATE INDEX posts_search_idx ON posts USING GIN (search_vector);

-- Sample data
INSERT INTO users (username, password_hash) VALUES
    ('alice', crypt('password123', gen_salt('bf')));

INSERT INTO posts (user_id, title, content) VALUES
    (1, 'Getting Started with PostgreSQL', 'PostgreSQL is an amazing database...');

EOF

echo "Database setup complete!"
\`\`\`

---

## Conclusion

PostgreSQL is far more than just a relational database. With the right extensions and configurations, it can replace a significant portion of your tech stack:

- **NoSQL**: JSONB support
- **Cron Jobs**: pg_cron
- **Caching**: Unlogged tables
- **Vector DB**: pgvector + pgai
- **Search**: Built-in full-text search
- **GraphQL**: pg_graphql
- **Real-time**: Electric SQL
- **Auth**: pg_crypto + pg_jwt + RLS
- **Analytics**: pg_mooncake
- **REST API**: PostgREST

Before you go all-in on this approach, remember to think critically about your specific needs. While PostgreSQL can do all these things, specialized tools may still be better for certain use cases. The goal isn't to use PostgreSQL for everything, but to understand what's possible and make informed decisions about your architecture.

### Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [PostgREST Documentation](https://postgrest.org/)
- [Electric SQL](https://electric-sql.com/)
- [Neon PostgreSQL](https://neon.tech/)
