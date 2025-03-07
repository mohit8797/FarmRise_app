document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        email: document.querySelector("input[name='email']").value,
        password: document.querySelector("input[name='password']").value
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Login successful!");
            localStorage.setItem('token', data.token); // Store token for authentication
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});