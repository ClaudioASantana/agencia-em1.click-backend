import * as https from 'https';

const candidates = {
  'Oficina': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
  'Supermercado': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'Crossfit': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  'Vet': 'https://images.unsplash.com/photo-1553688738-a278b9f063e0?auto=format&fit=crop&w=800&q=80'
};

function check(url: string, name: string) {
  https.request(url, { method: 'HEAD' }, (res) => {
    console.log(`${name}: ${res.statusCode}`);
  }).on('error', (e) => console.error(`${name} error: ${e.message}`)).end();
}

Object.entries(candidates).forEach(([name, url]) => check(url, name));
