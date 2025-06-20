const branchSelector = document.querySelector('.branch-selector');
const selectedBranch = document.getElementById('selected-branch');
const branchOptions = document.getElementById('branch-options');
const grid = document.getElementById('computer-grid');
let currentBranchId = null;

const testBranches = [
  { id: 1, name: "Филиал Центральный" },
  { id: 2, name: "Филиал Северный" },
  { id: 3, name: "Филиал Западный" }
];

testBranches.forEach(branch => {
  const option = document.createElement('div');
  option.className = 'branch-option';
  option.textContent = branch.name;
  option.onclick = () => {
    selectedBranch.querySelector('span').textContent = branch.name;
    branchSelector.classList.remove('active');
    currentBranchId = branch.id;
    loadBranchMap();
  };
  branchOptions.appendChild(option);
});

selectedBranch.onclick = () => {
  branchSelector.classList.toggle('active');
};

document.addEventListener('click', (e) => {
  if (!branchSelector.contains(e.target)) {
    branchSelector.classList.remove('active');
  }
});

if (testBranches.length > 0) {
  selectedBranch.querySelector('span').textContent = testBranches[0].name;
  currentBranchId = testBranches[0].id;
  loadBranchMap();
}


/*
      const response = await fetch('http://localhost:8080/api/branches');
      if (!response.ok) throw new Error('Ошибка загрузки филиалов');
      
      const branches = await response.json();
      if (!branches.length) throw new Error('Нет доступных филиалов');
      
      // Очищаем предыдущие варианты
      branchOptions.innerHTML = '';
      
      // Заполняем меню
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
      
      // Устанавливаем первый филиал по умолчанию
      selectedBranch.querySelector('span').textContent = branches[0].name;
      currentBranchId = branches[0].id;
      loadBranchMap(branches[0].id);
      
    } catch (error) {
      console.error('Ошибка:', error);
      selectedBranch.querySelector('span').textContent = 'Ошибка загрузки';
      branchOptions.innerHTML = '<div class="branch-option">Нет доступных филиалов</div>';
    }
*/

function loadBranchMap() {
  const testComputers = currentBranchId === 1 ? [
    { positionY: 0, positionX: 0, status: 'FREE', priceLevel: 'STANDARD', number: 1, time: '' },
    { positionY: 0, positionX: 1, status: 'FREE', priceLevel: 'EXTRA', number: 2, time: '' },
    { positionY: 1, positionX: 0, status: 'BUSY', priceLevel: 'STANDARD', number: 3, time: '16:00' },
    { positionY: 1, positionX: 1, status: 'BOOKED', priceLevel: 'VIP', number: 4, time: '14:00-16:00' }
  ] : currentBranchId === 2 ? [
    { positionY: 0, positionX: 0, status: 'FREE', priceLevel: 'VIP', number: 1, time: '' },
    { positionY: 0, positionX: 1, status: 'BOOKED', priceLevel: 'EXTRA', number: 2, time: '12:00-14:00' },
    { positionY: 1, positionX: 0, status: 'FREE', priceLevel: 'STANDARD', number: 3, time: '' }
  ] : [
    { positionY: 0, positionX: 0, status: 'BUSY', priceLevel: 'EXTRA', number: 1, time: '' },
    { positionY: 0, positionX: 1, status: 'FREE', priceLevel: 'STANDARD', number: 2, time: '' },
    { positionY: 1, positionX: 0, status: 'BOOKED', priceLevel: 'VIP', number: 3, time: '16:00-18:00' },
    { positionY: 1, positionX: 1, status: 'FREE', priceLevel: 'EXTRA', number: 4, time: '' }
  ];

  renderGrid(testComputers.map(c => ({
    row: c.positionY,
    col: c.positionX,
    status: c.status === 'FREE' ? 'available' : c.status.toLowerCase(),
    price: c.priceLevel === 'STANDARD' ? 100 : c.priceLevel === 'EXTRA' ? 150 : c.priceLevel === 'VIP' ? 200 : 100,
    number: c.number,
    time: c.time
  })));

  /*
  fetch(`http://localhost:8080/api/branches/${currentBranchId}/pcs`)
    .then(res => res.json())
    .then(data => {
      renderGrid(data.map(c => ({
        row: c.positionY,
        col: c.positionX,
        status: c.status === 'FREE' ? 'available' : c.status.toLowerCase(),
        price: c.priceLevel === 'STANDARD' ? 100 : c.priceLevel === 'EXTRA' ? 150 : c.priceLevel === 'VIP' ? 200 : 100,
        number: c.number,
        time: c.time
      })));
    })
    .catch(console.error);
  */
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
        div.innerHTML = `<div class="cell-number">ПК ${cell.number}</div><div class="cell-time">${cell.time}</div>`;
      } else {
        div.className = 'computer-cell empty';
        div.textContent = '-';
      }
      grid.appendChild(div);
    }
  }
}