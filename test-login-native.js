
const http = require('http');

const postData = JSON.stringify({
  email: 'quartetto.palmas@agencia.com',
  password: 'Palmas2026!'
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('LOGIN SUCCESSFUL');
    } else {
      console.log('LOGIN FAILED');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
