document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        fullName: document.querySelector("input[name='fullName']").value,
        email: document.querySelector("input[name='email']").value,
        password: document.querySelector("input[name='password']").value,
        confirmPassword: document.querySelector("input[name='confirmPassword']").value,
        role: document.querySelector("select[name='role']").value,
        phoneNumber: document.querySelector("input[name='phoneNumber']").value
    };

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup successful! You can now log in.");
            window.location.href = "login.html"; // Redirect to login
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});