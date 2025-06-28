const branchSelector = document.querySelector('.branch-selector');
const selectedBranch = document.getElementById('selected-branch');
const branchOptions = document.getElementById('branch-options');
const grid = document.getElementById('computer-grid');
const pcDetails = document.getElementById('pc-details');
let currentBranchId = null;
let selectedPcId = null;
let testComputers = [];
let authToken = localStorage.getItem('authToken');


if (!authToken) {
  window.location.href = '/login/Login.html';
  alert("токена нет");
}

async function loadBranches() {
  try {
    const response = await fetch('http://localhost:8080/branches', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) throw new Error('Ошибка загрузки филиалов');
    
    const branches = await response.json();
    if (!branches.length) throw new Error('Нет доступных филиалов');
    
    branchOptions.innerHTML = '';
    
    branches.forEach(branch => {
      const option = document.createElement('div');
      option.className = 'branch-option';
      option.textContent = branch.name;
      option.onclick = () => {
        selectedBranch.querySelector('span').textContent = branch.name;
        branchSelector.classList.remove('active');
        currentBranchId = branch.id;
        loadBranchMap(branch.id);
      };
      branchOptions.appendChild(option);
    });
    
    selectedBranch.querySelector('span').textContent = branches[0].name;
    currentBranchId = branches[0].id;
    loadBranchMap(branches[0].id);
    
  } catch (error) {
    console.error('Ошибка:', error);
    selectedBranch.querySelector('span').textContent = 'Ошибка загрузки';
    branchOptions.innerHTML = '<div class="branch-option">Нет доступных филиалов</div>';
  }
}



selectedBranch.onclick = () => {
  branchSelector.classList.toggle('active');
};

document.addEventListener('click', (e) => {
  if (!branchSelector.contains(e.target)) {
    branchSelector.classList.remove('active');
  }
});


function loadBranchMap(currentBranchId) {

  fetch(`http://localhost:8080/branches/${currentBranchId}/pcs`)
    .then(res => res.json())
    .then(data => {
      testComputers = data;
      renderGrid(data.map(c => ({
        id: c.id,
        row: c.positionY,
        col: c.positionX,
        status: c.status === 'FREE' ? 'available' : c.status.toLowerCase(),
        price: c.priceLevel === 'STANDARD' ? 100 : c.priceLevel === 'EXTRA' ? 150 : c.priceLevel === 'VIP' ? 200 : 100,
        number: c.number,
        time: c.time || ''
      })));
    })
    .catch(console.error);
}

function renderGrid(cells) {
  grid.innerHTML = '';
  if (!cells.length) return;
  
  const maxR = Math.max(...cells.map(c => c.row));
  const maxC = Math.max(...cells.map(c => c.col));
  grid.style.gridTemplateColumns = `repeat(${maxC+1}, 60px)`;

  for (let r = 0; r <= maxR; r++) {
    for (let c = 0; c <= maxC; c++) {
      const cell = cells.find(x => x.row === r && x.col === c);
      const div = document.createElement('div');
      
      if (cell) {
        div.className = 'computer-cell';
        const cls = cell.status === 'available' 
          ? `available-${cell.price}` 
          : cell.status;
        div.classList.add(cls);
        div.innerHTML = `
          <div class="cell-number">ПК ${cell.number}</div>
          <div class="cell-time">${cell.time}</div>
        `;
        div.onclick = () => handlePcClick(cell.id);
      } else {
        div.className = 'computer-cell empty';
        div.textContent = '-';
      }
      
      grid.appendChild(div);
    }
  }
}


function handlePcClick(pcId) {
  if (selectedPcId === pcId) {
    pcDetails.classList.remove('active');
    selectedPcId = null;
    return;
  }
  
  selectedPcId = pcId;
  loadPcDetails(pcId);
}

function loadPcDetails(pcId) {

  fetch(`http://localhost:8080/pcs/${pcId}`)
    .then(res => res.json())
    .then(data => {
      const pcData = testComputers.find(pc => pc.id === pcId) || {};
      renderPcDetails({
        ...data,
        status: pcData.status === 'FREE' ? 'available' : pcData.status.toLowerCase(),
        time: pcData.time || ''
      });
    })
    .catch(console.error);

  const pcData = testComputers.find(pc => pc.id === pcId) || {};
  
  const testPcDetails = {
    'pc1': { cpu: 'Intel Core i5-12400F', gpu: 'NVIDIA RTX 3060', motherboard: 'ASUS PRIME B660M-K', ram: '16GB DDR4 3200MHz', storage: '512GB NVMe SSD', games: 'CS2, Dota 2, Fortnite, GTA V', hz: 144 },
    'pc2': { cpu: 'Intel Core i7-12700KF', gpu: 'NVIDIA RTX 3070 Ti', motherboard: 'MSI MAG B660 TOMAHAWK', ram: '32GB DDR4 3600MHz', storage: '1TB NVMe SSD', games: 'CS2, Dota 2, Fortnite, GTA V, Cyberpunk 2077', hz: 240 },
    'pc3': { cpu: 'Intel Core i5-12400F', gpu: 'NVIDIA RTX 3060', motherboard: 'Gigabyte B660M DS3H', ram: '16GB DDR4 3200MHz', storage: '512GB NVMe SSD + 1TB HDD', games: 'CS2, Dota 2, Fortnite, GTA V', hz: 144 },
    'pc4': { cpu: 'Intel Core i9-13900K', gpu: 'NVIDIA RTX 4090', motherboard: 'ASUS ROG MAXIMUS Z790 HERO', ram: '64GB DDR5 6000MHz', storage: '2TB NVMe SSD', games: 'Все игры', hz: 360 },
    'pc5': { cpu: 'Intel Core i9-13900K', gpu: 'NVIDIA RTX 4090', motherboard: 'ASUS ROG MAXIMUS Z790 HERO', ram: '64GB DDR5 6000MHz', storage: '2TB NVMe SSD', games: 'Все игры', hz: 360 },
    'pc6': { cpu: 'Intel Core i7-13700K', gpu: 'NVIDIA RTX 4080', motherboard: 'MSI MPG Z790 EDGE', ram: '32GB DDR5 5600MHz', storage: '1TB NVMe SSD', games: 'Все игры', hz: 240 },
    'pc7': { cpu: 'Intel Core i5-13400F', gpu: 'NVIDIA RTX 4060 Ti', motherboard: 'ASUS TUF GAMING B760-PLUS', ram: '16GB DDR4 3200MHz', storage: '512GB NVMe SSD', games: 'CS2, Dota 2, Fortnite, GTA V', hz: 165 },
    'pc8': { cpu: 'Intel Core i7-13700K', gpu: 'NVIDIA RTX 4070 Ti', motherboard: 'Gigabyte Z790 AORUS ELITE', ram: '32GB DDR5 5600MHz', storage: '1TB NVMe SSD', games: 'Все игры', hz: 240 },
    'pc9': { cpu: 'Intel Core i5-12400F', gpu: 'NVIDIA RTX 3060', motherboard: 'ASUS PRIME B660M-K', ram: '16GB DDR4 3200MHz', storage: '512GB NVMe SSD', games: 'CS2, Dota 2, Fortnite, GTA V', hz: 144 },
    'pc10': { cpu: 'Intel Core i9-13900K', gpu: 'NVIDIA RTX 4090', motherboard: 'ASUS ROG MAXIMUS Z790 HERO', ram: '64GB DDR5 6000MHz', storage: '2TB NVMe SSD', games: 'Все игры', hz: 360 },
    'pc11': { cpu: 'Intel Core i7-12700KF', gpu: 'NVIDIA RTX 3080', motherboard: 'MSI MAG B660 TOMAHAWK', ram: '32GB DDR4 3600MHz', storage: '1TB NVMe SSD', games: 'CS2, Dota 2, Fortnite, GTA V, Cyberpunk 2077', hz: 240 }
  };

  const details = {
    id: pcId,
    ...testPcDetails[pcId],
    status: pcData.status === 'FREE' ? 'available' : pcData.status.toLowerCase(),
    time: pcData.time || ''
  };

  renderPcDetails(details);
}

function renderPcDetails(details) {
  let html = `
    <h3>ПК ${details.id.replace('pc', '')} - Характеристики</h3>
    <div class="pc-specs">
      <div class="pc-spec-item">
        <span class="pc-spec-label">Процессор</span>
        <span class="pc-spec-value">${details.cpu}</span>
      </div>
      <div class="pc-spec-item">
        <span class="pc-spec-label">Видеокарта</span>
        <span class="pc-spec-value">${details.gpu}</span>
      </div>
      <div class="pc-spec-item">
        <span class="pc-spec-label">Материнская плата</span>
        <span class="pc-spec-value">${details.motherboard}</span>
      </div>
      <div class="pc-spec-item">
        <span class="pc-spec-label">Оперативная память</span>
        <span class="pc-spec-value">${details.ram}</span>
      </div>
      <div class="pc-spec-item">
        <span class="pc-spec-label">Накопитель</span>
        <span class="pc-spec-value">${details.storage}</span>
      </div>
      <div class="pc-spec-item">
        <span class="pc-spec-label">Доступные игры</span>
        <span class="pc-spec-value">${details.games}</span>
      </div>
      <div class="pc-spec-item">
        <span class="pc-spec-label">Монитор</span>
        <span class="pc-spec-value">${details.hz}Hz</span>
      </div>
    </div>
  `;

  const timeText = details.time || '';
  const isAvailable = details.status === 'available';
  const hasTimeInfo = timeText && (timeText.includes('-') || timeText.includes(':'));

  if (isAvailable) {
    html += `<button class="book-button active">Забронировать</button>`;
  } else if (hasTimeInfo) {
    const endTime = timeText.includes('-') ? timeText.split('-')[1].trim() : timeText.trim();
    html += `<button class="book-button active" data-time="${endTime}">
              Забронировать (свободен с ${endTime})
            </button>`;
  } else {
    html += `<button class="book-button inactive" disabled>
              Забронировать (время неизвестно)
            </button>`;
  }

  pcDetails.innerHTML = html;
  pcDetails.classList.add('active');

  const bookButton = pcDetails.querySelector('.book-button.active');
  if (bookButton) {
    bookButton.onclick = () => {
      alert(`Бронирование ПК ${details.id.replace('pc', '')}`);
    };
  }
}

loadBranches();