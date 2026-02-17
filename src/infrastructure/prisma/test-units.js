const jwt = require('jsonwebtoken');

const secret = 'MySuperSecretKey2026';
const userId = 3;

const payload = {
  sub: userId,
  username: 'quartetto.palmas@agencia.com',
  name: 'Gerente Quartetto',
  role: 'STORE_OWNER',
  establishmentId: 2
};

const token = jwt.sign(payload, secret);

async function test() {
  console.log('📡 Chamando GET http://localhost:3000/establishments/my-units...');
  
  try {
    const res = await fetch('http://localhost:3000/establishments/my-units', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📊 Status:', res.status);
    const data = await res.json();
    console.log('📦 Encontradas:', Array.isArray(data) ? data.length : 'Não é array');
  } catch (e) {
    console.error('❌ Falha:', e.message);
  }
}

test();
