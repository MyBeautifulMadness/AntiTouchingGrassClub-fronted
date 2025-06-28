let authToken = localStorage.getItem('authToken');
let profileData = {};
let bookingsData = [];
let branchesData = [];

// Проверка авторизации
/*if (!authToken) {
  window.location.href = '/login/Login.html';
}*/

// Тестовые данные профиля
const testProfileData = {
  id: "user123",
  username: "KERRIGAN",
  email: "kerrigan@example.com",
  firstName: "Sarah",
  lastName: "Kerrigan",
  phone: "+79123456789"
};

const testBookingsData = [
  {
    id: "booking1",
    firstName: "Sarah",
    lastName: "Kerrigan",
    phone: "+79123456789",
    email: "kerrigan@example.com",
    pcId: "pc3",
    startTime: "2025-06-28T10:00:00.000Z",
    endTime: "2025-06-28T12:00:00.000Z",
    paymentMethod: "QR_ONLINE",
    finalPrice: "300 ₽"
  },
  {
    id: "booking2",
    firstName: "Sarah",
    lastName: "Kerrigan",
    phone: "+79123456789",
    email: "kerrigan@example.com",
    pcId: "pc5",
    startTime: "2025-06-29T14:00:00.000Z",
    endTime: "2025-06-29T16:00:00.000Z",
    paymentMethod: "QR_OFFLINE",
    finalPrice: "500 ₽"
  }
];

// Тестовые данные филиалов
const testBranchesData = [
  { id: "branch1", name: "Филиал Центральный" },
  { id: "branch2", name: "Филиал Северный" },
  { id: "branch3", name: "Филиал Западный" }
];

// Тестовые данные компьютеров
const testPcsData = {
  branch1: [
    { id: "pc1", number: "1", status: "FREE", priceLevel: "STANDARD", positionX: 0, positionY: 0 },
    { id: "pc2", number: "2", status: "FREE", priceLevel: "EXTRA", positionX: 1, positionY: 0 },
    { id: "pc3", number: "3", status: "BUSY", priceLevel: "STANDARD", positionX: 0, positionY: 1 },
    { id: "pc4", number: "4", status: "BOOKED", priceLevel: "VIP", positionX: 1, positionY: 1 }
  ],
  branch2: [
    { id: "pc5", number: "1", status: "FREE", priceLevel: "VIP", positionX: 0, positionY: 0 },
    { id: "pc6", number: "2", status: "BOOKED", priceLevel: "EXTRA", positionX: 1, positionY: 0 },
    { id: "pc7", number: "3", status: "FREE", priceLevel: "STANDARD", positionX: 0, positionY: 1 }
  ],
  branch3: [
    { id: "pc8", number: "1", status: "BUSY", priceLevel: "EXTRA", positionX: 0, positionY: 0 },
    { id: "pc9", number: "2", status: "FREE", priceLevel: "STANDARD", positionX: 1, positionY: 0 },
    { id: "pc10", number: "3", status: "BOOKED", priceLevel: "VIP", positionX: 0, positionY: 1 },
    { id: "pc11", number: "4", status: "FREE", priceLevel: "EXTRA", positionX: 1, positionY: 1 }
  ]
};

// Загрузка данных профиля
function loadProfileData() {
  /*
  fetch('http://localhost:8080/api/profile', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка загрузки профиля');
    return response.json();
  })
  .then(data => {
    profileData = data;
    renderProfileInfo();
  })
  .catch(error => {
    console.error('Ошибка:', error);
    profileData = testProfileData;
    renderProfileInfo();
  });
  */

  profileData = testProfileData;
  renderProfileInfo();
}

// Загрузка данных бронирований
function loadBookingsData() {
  /*
  fetch('http://localhost:8080/api/profile/bookings', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка загрузки бронирований');
    return response.json();
  })
  .then(data => {
    bookingsData = data;
    loadBranchesData();
  })
  .catch(error => {
    console.error('Ошибка:', error);
    bookingsData = testBookingsData;
    loadBranchesData();
  });
  */

  bookingsData = testBookingsData;
  loadBranchesData();
}

// Загрузка данных филиалов
function loadBranchesData() {
  /*
  fetch('http://localhost:8080/api/branches', {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка загрузки филиалов');
    return response.json();
  })
  .then(data => {
    branchesData = data;
    renderBookingsTable();
  })
  .catch(error => {
    console.error('Ошибка:', error);
    branchesData = testBranchesData;
    renderBookingsTable();
  });
  */

  branchesData = testBranchesData;
  renderBookingsTable();
}

// Отрисовка информации профиля
function renderProfileInfo() {
  const profileInfo = document.getElementById('profile-info');
  profileInfo.innerHTML = `
    <p><strong>Имя пользователя:</strong> ${profileData.username}</p>
    <p><strong>Имя:</strong> ${profileData.firstName}</p>
    <p><strong>Фамилия:</strong> ${profileData.lastName}</p>
    <p><strong>Email:</strong> ${profileData.email}</p>
    <p><strong>Телефон:</strong> ${profileData.phone}</p>
  `;
}

// Отрисовка таблицы бронирований
function renderBookingsTable() {
  const bookingsTable = document.getElementById('bookings-table');
  bookingsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Дата и время</th>
          <th>Адрес</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        ${bookingsData.map((booking, index) => {
          const startDate = new Date(booking.startTime);
          const endDate = new Date(booking.endTime);
          const dateStr = startDate.toLocaleDateString('ru-RU');
          const timeStr = `${startDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`;
          
          const branchInfo = findBranchByPcId(booking.pcId);
          const branchName = branchInfo ? branchInfo.name : 'Неизвестный филиал';
          
          const status = booking.paymentMethod === 'QR_ONLINE' ? 'Оплачено' : 'Необходимо оплатить';
          
          return `
            <tr class="booking-row" onclick="toggleBookingDetails(${index})">
              <td>${dateStr}<br>${timeStr}</td>
              <td>${branchName}</td>
              <td>${status}</td>
            </tr>
            <tr class="booking-details" id="booking-details-${index}">
              <td colspan="3">
                <div>
                  <p><strong>Сумма:</strong> ${booking.finalPrice}</p>
                  ${booking.paymentMethod === 'QR_OFFLINE' ? `
                    <div class="qr-code">QR-код для оплаты</div>
                    <button class="cancel-btn" onclick="cancelBooking('${booking.id}', event)">Отменить бронь</button>
                  ` : `
                    <button class="cancel-btn" onclick="cancelBooking('${booking.id}', event)">Отменить бронь</button>
                  `}
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// Поиск филиала по ID компьютера
function findBranchByPcId(pcId) {
  /*
  for (const branch of branchesData) {
    const response = await fetch(`http://localhost:8080/api/branches/${branch.id}/pcs`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const pcs = await response.json();
    if (pcs.some(pc => pc.id === pcId)) {
      return branch;
    }
  }
  return null;
  */

  // Тестовая реализация
  for (const branchId in testPcsData) {
    if (testPcsData[branchId].some(pc => pc.id === pcId)) {
      return branchesData.find(b => b.id === branchId);
    }
  }
  return null;
}

// Переключение отображения деталей бронирования
function toggleBookingDetails(index) {
  const details = document.getElementById(`booking-details-${index}`);
  details.classList.toggle('active');
}

// Отмена бронирования
function cancelBooking(bookingId, event) {
  event.stopPropagation();
  
  if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
    return;
  }

  /*
  fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка отмены бронирования');
    loadBookingsData();
  })
  .catch(error => {
    console.error('Ошибка:', error);
    alert('Не удалось отменить бронирование');
  });
  */

  // Тестовая реализация
  alert(`Бронирование ${bookingId} отменено (тестовый режим)`);
  bookingsData = bookingsData.filter(b => b.id !== bookingId);
  renderBookingsTable();
}

// Редактирование профиля
document.getElementById('edit-profile-btn').addEventListener('click', () => {
  document.getElementById('profile-info').style.display = 'none';
  document.getElementById('edit-profile-form').style.display = 'block';
  
  document.getElementById('first-name').value = profileData.firstName;
  document.getElementById('last-name').value = profileData.lastName;
  document.getElementById('email').value = profileData.email;
  document.getElementById('phone').value = profileData.phone;
});

document.getElementById('cancel-edit-btn').addEventListener('click', () => {
  document.getElementById('profile-info').style.display = 'block';
  document.getElementById('edit-profile-form').style.display = 'none';
});

document.getElementById('profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const updatedData = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };

  /*
  fetch('http://localhost:8080/api/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) throw new Error('Ошибка обновления профиля');
    location.reload();
  })
  .catch(error => {
    console.error('Ошибка:', error);
    alert('Не удалось обновить профиль');
  });
  */

  // Тестовая реализация
  profileData = { ...profileData, ...updatedData };
  document.getElementById('profile-info').style.display = 'block';
  document.getElementById('edit-profile-form').style.display = 'none';
  renderProfileInfo();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  loadBookingsData();
});