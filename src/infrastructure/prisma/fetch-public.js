async function run() {
  try {
    console.log('📡 Buscando todas as unidades publicamente...');
    const res = await fetch('http://127.0.0.1:3000/establishments');

    const data = await res.json();
    console.log('📦 API Response (Public):');
    
    const summary = data.map(est => ({
      id: est.id,
      name: est.name,
      image: est.image?.substring(0, 50) + '...',
      logo: est.logo?.substring(0, 50) + '...'
    }));

    console.log(JSON.stringify(summary, null, 2));
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
}

run();
