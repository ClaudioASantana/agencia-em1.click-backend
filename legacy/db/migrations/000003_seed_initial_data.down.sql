-- Remove seeded 'segmentos'
DELETE FROM segmentos WHERE nome IN (
    'Roteiro Gastronômico',
    'Guia Automotivo',
    'Saúde e Bem Estar',
    'Moda e Beleza',
    'Casa Construção e Decoração',
    'Serviços e Negócios'
);

-- Remove seeded 'localidades'
DELETE FROM localidades WHERE nome IN (
    'Itaguaí',
    'Seropédica',
    'Palmas',
    'UFRRJ'
);
