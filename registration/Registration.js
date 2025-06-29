document.addEventListener('DOMContentLoaded', function() {
  const registrationForm = document.querySelector('.registration-box form');
  
  registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const phone = this.querySelector('input[type="number"]').value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Пожалуйста, введите корректный email (например, user@example.com)');
      return;
    }
    
    if (password.length < 6) {
      alert('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    if (username.length < 3) {
      alert('Логин должен содержать не менее 3 символов');
      return;
    }
    
    const phoneRegex = /^[0-9+]{5,}$/;
    if (!phoneRegex.test(phone)) {
      alert('Телефон должен содержать минимум 5 цифр (можно с + в начале)');
      return;
    }
    
    const registrationData = {
      email: email,
      phone: phone,
      username: username,
      password: password
    };
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Регистрация...';
    submitButton.disabled = true;
    
    fetch('http://5.129.207.193:8080/auth/register', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    })
    .then(response => {
      if (response.status === 200) {
        alert('Регистрация успешна! Теперь вы можете войти в систему.');
        window.location.href = '/login/Login.html';
      } else if (response.status === 401) {
        throw new Error('Ошибка регистрации: такой пользователь уже существует');
      } else {
        throw new Error('Произошла ошибка сервера');
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert(error.message || 'Произошла ошибка при регистрации');
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
  });
});