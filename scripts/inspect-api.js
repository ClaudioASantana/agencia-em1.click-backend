const http = require('http');

http.get('http://localhost:3000/establishments', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const agencies = JSON.parse(data);
      console.log(`Total de estabelecimentos retornados pela API: ${agencies.length}`);
      agencies.forEach((a, i) => {
        console.log(`\n${i + 1}. Nome: ${a.name} (ID: ${a.id})`);
        console.log(`   Localização: ${a.location?.name || 'NULA'}`);
        console.log(`   Segmento: ${a.segment?.name || 'NULO'}`);
        console.log(`   Cidade (campo city): ${a.city}`);
        console.log(`   Total de Ofertas: ${a.offers?.length || 0}`);
        if (a.offers?.length > 0) {
           console.log(`   Status da 1ª Oferta: ${a.offers[0].publication?.status}`);
        }
      });
    } catch (e) {
      console.error('Erro ao processar JSON:', e.message);
      console.log('Resposta bruta:', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Erro na requisição:', err.message);
});
