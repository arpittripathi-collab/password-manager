document.getElementById('passwordForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const site = document.getElementById('site').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    fetch('api/save_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `site=${encodeURIComponent(site)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    }).then(() => {
      loadPasswords();
      this.reset();
    });
  });
  
  function loadPasswords() {
    fetch('api/get_passwords.php')
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('#passwordTable tbody');
        tbody.innerHTML = '';
        data.forEach(row => {
          tbody.innerHTML += `
            <tr>
              <td>${row.site}</td>
              <td>${row.username}</td>
              <td>${row.password}</td>
            </tr>
          `;
        });
      });
  }
  
  loadPasswords();
  