const fetch = require('node-fetch'); // Assuming node-fetch or native fetch in newer node

// If node < 18, fetch might not be global. But let's assume standard environment or use http
const http = require('http');

http.get('http://localhost:3000/api/v1/catalog/agencies', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const agencies = JSON.parse(data);
      const target = agencies.find(a => a.name === 'Barbearia Vintage');
      console.log(JSON.stringify(target, null, 2));
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
