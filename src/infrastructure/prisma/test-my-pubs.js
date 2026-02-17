async function run() {
  try {
    console.log('📡 Autenticando...');
    const loginRes = await fetch('http://127.0.0.1:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'quartetto.palmas@agencia.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    const access_token = loginData.access_token;

    if (!access_token) {
        console.error('❌ Login falhou:', loginData);
        return;
    }
    
    console.log('📡 Buscando publicações via /my-publications...');
    const res = await fetch('http://127.0.0.1:3000/publications/my-publications', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const data = await res.json();
    
    if (!Array.isArray(data)) {
        console.error('❌ Resposta não é um array:', data);
        return;
    }

    console.log('📦 Encontradas:', data.length, 'publicações.');
    
    data.forEach(pub => {
      console.log(`   ✅ [${pub.establishment?.name || 'Desconhecido'}] ${pub.title} (Status: ${pub.status})`);
    });
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
}

run();
