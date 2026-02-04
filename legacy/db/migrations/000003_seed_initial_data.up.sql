-- Seed 'localidades'
INSERT INTO localidades (nome) VALUES
('Itaguaí'),
('Seropédica'),
('Palmas'),
('UFRRJ')
ON CONFLICT DO NOTHING;

-- Seed 'segmentos'
INSERT INTO segmentos (nome) VALUES
('Roteiro Gastronômico'),
('Guia Automotivo'),
('Saúde e Bem Estar'),
('Moda e Beleza'),
('Casa Construção e Decoração'),
('Serviços e Negócios')
ON CONFLICT DO NOTHING;
