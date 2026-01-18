-- Storage Labels Database Schema
-- PostgreSQL 15+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Containers table
CREATE TABLE IF NOT EXISTS containers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(50) NOT NULL,
    number INTEGER NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    location_text VARCHAR(255),
    description TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_color_number UNIQUE (color, number)
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    container_id UUID NOT NULL REFERENCES containers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_containers_qr_code ON containers(qr_code);
CREATE INDEX idx_containers_color ON containers(color);
CREATE INDEX idx_containers_location ON containers(location_id);
CREATE INDEX idx_items_container ON items(container_id);
CREATE INDEX idx_items_name ON items(name);

-- Create full-text search indexes
CREATE INDEX idx_containers_description ON containers USING gin(to_tsvector('english', COALESCE(description, '')));
CREATE INDEX idx_items_name_description ON items USING gin(to_tsvector('english', COALESCE(name || ' ' || description, '')));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_containers_updated_at BEFORE UPDATE ON containers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default locations
INSERT INTO locations (name, description) VALUES
    ('Attic-Left', 'Left side of attic'),
    ('Attic-Right', 'Right side of attic'),
    ('Garage-A1', 'Garage section A, shelf 1'),
    ('Garage-A2', 'Garage section A, shelf 2'),
    ('Basement', 'Basement storage area')
ON CONFLICT (name) DO NOTHING;
