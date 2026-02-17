async function run() {
  try {
    const loginRes = await fetch('http://127.0.0.1:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nossolar.palmas@agencia.com',
        password: 'Palmas2026!'
      })
    });

    const loginData = await loginRes.json();
    const token = loginData.access_token;

    if (!token) {
      console.log('❌ Falha no login:', loginData);
      return;
    }

    const res = await fetch('http://127.0.0.1:3000/establishments/my-units', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    console.log('📦 API Response:');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
}

run();
