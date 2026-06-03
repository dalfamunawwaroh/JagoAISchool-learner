// Native fetch used

async function main() {
  console.log('Testing HTTP profile update API...');

  // Generate a mock large base64 string (approx 500KB)
  const largeBase64 = 'data:image/png;base64,' + 'A'.repeat(500000);

  // We need a valid JWT token. Let's log in first.
  let token = '';
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.dev@jagoai.com', password: 'password' })
    });
    const loginData = await loginRes.json() as any;
    token = loginData.token;
    console.log('Logged in successfully, token retrieved:', token ? 'YES' : 'NO');
  } catch (error) {
    console.error('Failed to log in:', error);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: 'Alex Updated',
        username: 'alexdev',
        bio: 'Updated bio',
        avatarUrl: largeBase64
      })
    });

    console.log('HTTP Status:', response.status);
    const data = await response.json();
    console.log('Response body:', data);
  } catch (error) {
    console.error('API call failed:', error);
  }
}

main();
