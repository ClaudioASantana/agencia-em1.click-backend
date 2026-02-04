-- Database Schema for Idreau Clone
-- Derived from analysis of idreau.com.br

-- Table: localidades (Locations/Cities)
CREATE TABLE IF NOT EXISTS localidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: segmentos (Categories like 'Gastronomy', 'Services')
CREATE TABLE IF NOT EXISTS segmentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    icone_url VARCHAR(500), -- Optional URL for an icon
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: estabelecimentos (The main entity)
CREATE TABLE IF NOT EXISTS estabelecimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    logo_url VARCHAR(500),
    endereco VARCHAR(500),
    telefone VARCHAR(50),      -- Landline or alternative contact
    whatsapp VARCHAR(50),      -- Specific for CTA
    avaliacao_media DECIMAL(3, 2) DEFAULT 0.00, -- e.g. 4.95
    total_avaliacoes INTEGER DEFAULT 0,
    localidade_id INTEGER REFERENCES localidades(id),
    segmento_id INTEGER REFERENCES segmentos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: especialidades (Tags/Specialties e.g., 'Pizza', 'Delivery')
CREATE TABLE IF NOT EXISTS especialidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    estabelecimento_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE
);

-- Table: redes_sociais (Social Media links)
CREATE TABLE IF NOT EXISTS redes_sociais (
    id SERIAL PRIMARY KEY,
    plataforma VARCHAR(50) NOT NULL, -- 'Instagram', 'Facebook', etc.
    url VARCHAR(500) NOT NULL,
    estabelecimento_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE
);

-- Table: encartes (Promotional Flyers/Campaigns)
CREATE TABLE IF NOT EXISTS encartes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_validade DATE,
    imagem_capa_url VARCHAR(500),
    localidade_id INTEGER REFERENCES localidades(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Join Table: encarte_estabelecimentos (Many-to-Many between Encartes and Establishments)
CREATE TABLE IF NOT EXISTS encarte_estabelecimentos (
    encarte_id INTEGER REFERENCES encartes(id) ON DELETE CASCADE,
    estabelecimento_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    PRIMARY KEY (encarte_id, estabelecimento_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_estabelecimentos_localidade ON estabelecimentos(localidade_id);
CREATE INDEX IF NOT EXISTS idx_estabelecimentos_segmento ON estabelecimentos(segmento_id);
CREATE INDEX IF NOT EXISTS idx_encartes_localidade ON encartes(localidade_id);
