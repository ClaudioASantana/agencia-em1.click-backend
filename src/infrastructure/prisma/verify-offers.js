async function run() {
  try {
    console.log('📡 Verificando ofertas do Quartetto...');
    const res = await fetch('http://127.0.0.1:3000/establishments');
    const data = await res.json();
    
    const quartetto = data.filter(est => est.name.includes('Quartetto'));
    
    quartetto.forEach(est => {
      console.log(`🏪 ${est.name}:`);
      console.log(`   🔸 Ofertas encontradas: ${est.offers?.length || 0}`);
      if (est.offers?.length > 0) {
        est.offers.forEach(o => {
          console.log(`      ✅ ${o.title} - R$ ${o.price}`);
        });
      }
    });
  } catch (e) {
    console.error('❌ Erro:', e.message);
  }
}

run();
