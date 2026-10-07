-- Automatically provision all microservice databases on first PostgreSQL startup
SELECT 'CREATE DATABASE microservice'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'microservice')\gexec

SELECT 'CREATE DATABASE "User_Service"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'User_Service')\gexec

SELECT 'CREATE DATABASE catalog_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'catalog_db')\gexec

SELECT 'CREATE DATABASE order_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'order_db')\gexec

SELECT 'CREATE DATABASE payment_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'payment_db')\gexec
