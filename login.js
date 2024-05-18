let loginE = document.getElementById("loginform").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userId = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  login(userId, password);
  document.getElementById('loginform').reset();
});

async function login(userId, password) {
  const urlpost = 'http://localhost:8000/login';
  const dataToSend = {
    userId: userId,
    password: password,
  };

  try {
    const response = await fetch(urlpost, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    if (response.ok) {
      const data = await response.json(); // Parse the JSON response
      localStorage.setItem('token', data.token); // Store the token in local storage
      window.location.href = 'http://localhost:8000/';
      // const ans=localStorage.getItem('token');
      // console.log(ans);
  } else {
      alert('Login failed');
  }
  } catch (error) {
    console.log(error);
  }
}
