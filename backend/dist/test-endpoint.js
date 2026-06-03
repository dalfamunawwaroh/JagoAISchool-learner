async function main() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'customer@example.com',
                message: 'Hello, this is a test support message.'
            })
        });
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);
    }
    catch (error) {
        console.error('Error calling endpoint:', error);
    }
}
main();
export {};
