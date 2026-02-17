const jwt = require('jsonwebtoken');

const secret = 'MySuperSecretKey2026';
const userId = 3; // Manager Quartetto

const payload = {
  sub: userId,
  username: 'quartetto.palmas@agencia.com',
  name: 'Gerente Quartetto',
  role: 'STORE_OWNER',
  establishmentId: 2
};

const token = jwt.sign(payload, secret);

async function test() {
  console.log('📡 Token gerado com sucesso.');
  console.log('📡 Chamando GET http://localhost:3000/publications/my-publications...');
  
  try {
    const res = await fetch('http://localhost:3000/publications/my-publications', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📊 Status:', res.status);
    const data = await res.json();
    
    if (res.status === 200) {
      console.log('✅ Resposta 200 OK');
      console.log('📦 Encontradas:', Array.isArray(data) ? data.length : 'Não é array');
      if (Array.isArray(data)) {
        data.slice(0, 3).forEach(p => console.log(`   - [${p.id}] ${p.title} (Est ID: ${p.establishmentId})`));
      } else {
        console.log('📦 Data:', data);
      }
    } else {
      console.log('❌ Erro:', data);
    }
  } catch (e) {
    console.error('❌ Falha na conexão:', e.message);
  }
}

test();
