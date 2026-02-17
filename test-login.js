
const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://127.0.0.1:3000/auth/login', {
      email: 'quartetto.palmas@agencia.com',
      password: 'Palmas2026!'
    });
    console.log('Login Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Login Failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
