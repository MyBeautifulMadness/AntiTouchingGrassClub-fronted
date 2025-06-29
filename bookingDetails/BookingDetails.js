document.addEventListener('DOMContentLoaded', function() {
    
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/login/Login.html';
        alert("Пожалуйста, авторизуйтесь для бронирования");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pcId = urlParams.get('pcId');
    const pcPrice = parseInt(urlParams.get('price')) || 100;
    
    if (!pcId) {
        alert("Не указан компьютер для бронирования");
        window.location.href = '/index.html';
        return;
    }

    // Элементы DOM
    const stepDate = document.getElementById('step-date');
    const stepTime = document.getElementById('step-time');
    const stepPromo = document.getElementById('step-promo');
    const stepPayment = document.getElementById('step-payment');
    const stepConfirm = document.getElementById('step-confirm');
    
    const dateInput = document.getElementById('booking-date');
    const checkDateBtn = document.getElementById('check-date-btn');
    const availableSlots = document.getElementById('available-slots');
    const startTimeSelect = document.getElementById('start-time');
    const endTimeSelect = document.getElementById('end-time');
    const timeSlider = document.getElementById('time-slider');
    const confirmTimeBtn = document.getElementById('confirm-time-btn');
    const promotionsList = document.getElementById('promotions-list');
    const confirmPromoBtn = document.getElementById('confirm-promo-btn');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const finalConfirmBtn = document.getElementById('final-confirm-btn');
    
    const basePriceEl = document.getElementById('base-price');
    const discountValueEl = document.getElementById('discount-value');
    const finalPriceEl = document.getElementById('final-price');
    
    // Установка минимальной даты (сегодня)
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    
    // Переменные состояния
    let selectedDate = null;
    let selectedStartTime = null;
    let selectedEndTime = null;
    let selectedPromotion = null;
    let paymentMethod = "QR_ONLINE";
    let bookings = [];
    let promotions = [];
    
    // Инициализация слайдера времени
    initTimeSlider();
    
    // Обработчики событий
    checkDateBtn.addEventListener('click', checkDateAvailability);
    confirmTimeBtn.addEventListener('click', confirmTimeSelection);
    confirmPromoBtn.addEventListener('click', confirmPromoSelection);
    confirmPaymentBtn.addEventListener('click', confirmPaymentSelection);
    finalConfirmBtn.addEventListener('click', finalConfirmBooking);
    
    // Настройка способов оплаты
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            paymentMethod = this.dataset.method;
            document.querySelectorAll('.payment-method').forEach(m => {
                m.querySelector('label').classList.remove('selected');
            });
            this.querySelector('label').classList.add('selected');
        });
    });
    
    // Функции
    
    function initTimeSlider() {
        const sliderTicks = document.getElementById('slider-ticks');
        sliderTicks.innerHTML = '';
        
        for (let i = 10; i <= 22; i++) {
            const tick = document.createElement('div');
            tick.className = 'slider-tick';
            tick.dataset.hour = `${i}:00`;
            sliderTicks.appendChild(tick);
        }
    }
    
    function checkDateAvailability() {
        const date = dateInput.value;
        if (!date) {
            alert('Пожалуйста, выберите дату');
            return;
        }
        
        selectedDate = date;
        
        // Тестовые данные вместо реального запроса
        // Реальный запрос (закомментирован):
        /*
        fetch(`http://localhost:8080/pcs/${pcId}/bookings-by-day?date=${date}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            bookings = data;
            renderAvailableSlots();
            stepDate.classList.remove('active');
            stepTime.classList.add('active');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при загрузке данных о бронированиях');
        });
        */
        
        // Тестовые данные
        bookings = [
            { startTime: `${date}T12:00:00.000Z`, endTime: `${date}T14:00:00.000Z` },
            { startTime: `${date}T16:00:00.000Z`, endTime: `${date}T18:00:00.000Z` },
            { startTime: `${date}T20:00:00.000Z`, endTime: `${date}T22:00:00.000Z` }
        ];
        
        renderAvailableSlots();
        stepDate.classList.remove('active');
        stepTime.classList.add('active');
    }
    
    function renderAvailableSlots() {
        availableSlots.innerHTML = '';
        startTimeSelect.innerHTML = '';
        endTimeSelect.innerHTML = '';
        
        // Создаем массив всех возможных слотов (каждый час с 10:00 до 22:00)
        const allSlots = [];
        for (let hour = 10; hour <= 22; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            allSlots.push({
                time: time,
                hour: hour,
                booked: isTimeBooked(hour)
            });
        }
        
        // Рендерим доступные слоты
        allSlots.forEach(slot => {
            // Для визуального отображения
            const slotElement = document.createElement('div');
            slotElement.className = `time-slot ${slot.booked ? 'booked' : ''}`;
            slotElement.textContent = slot.time;
            slotElement.dataset.hour = slot.hour;
            
            if (!slot.booked) {
                slotElement.addEventListener('click', () => selectStartTime(slot.hour));
            }
            
            availableSlots.appendChild(slotElement);
            
            // Для выпадающего списка начала
            if (!slot.booked) {
                const option = document.createElement('option');
                option.value = slot.hour;
                option.textContent = slot.time;
                startTimeSelect.appendChild(option);
            }
        });
        
        // Настройка выпадающих списков времени
        startTimeSelect.addEventListener('change', updateEndTimeOptions);
        timeSlider.addEventListener('input', updateEndTimeBySlider);
    }
    
    function isTimeBooked(hour) {
        const date = new Date(selectedDate);
        const slotStart = new Date(date.setHours(hour, 0, 0, 0));
        const slotEnd = new Date(date.setHours(hour + 1, 0, 0, 0));
        
        return bookings.some(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            return (slotStart >= bookingStart && slotStart < bookingEnd) || 
                   (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                   (slotStart <= bookingStart && slotEnd >= bookingEnd);
        });
    }
    
    function selectStartTime(hour) {
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        const selectedSlot = document.querySelector(`.time-slot[data-hour="${hour}"]`);
        if (selectedSlot) selectedSlot.classList.add('selected');
        
        startTimeSelect.value = hour;
        updateEndTimeOptions();
    }
    
    function updateEndTimeOptions() {
        const startHour = parseInt(startTimeSelect.value);
        if (isNaN(startHour)) return;
        
        endTimeSelect.innerHTML = '';
        timeSlider.disabled = false;
        timeSlider.min = 1;
        
        // Максимальное время брони - до 22:00
        const maxEndHour = Math.min(22, startHour + 6);
        let maxAvailableHours = 1;
        
        for (let hour = startHour + 1; hour <= maxEndHour; hour++) {
            if (isTimeBooked(hour)) break;
            
            const time = `${hour.toString().padStart(2, '0')}:00`;
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = time;
            endTimeSelect.appendChild(option);
            
            maxAvailableHours = hour - startHour;
        }
        
        timeSlider.max = maxAvailableHours;
        timeSlider.value = 1;
        updateEndTimeBySlider();
        
        confirmTimeBtn.disabled = false;
    }
    
    function updateEndTimeBySlider() {
        const startHour = parseInt(startTimeSelect.value);
        if (isNaN(startHour)) return;
        
        const hoursToAdd = parseInt(timeSlider.value);
        const endHour = startHour + hoursToAdd;
        
        endTimeSelect.value = endHour;
    }
    
    function confirmTimeSelection() {
        selectedStartTime = parseInt(startTimeSelect.value);
        selectedEndTime = parseInt(endTimeSelect.value);
        
        if (isNaN(selectedStartTime) || isNaN(selectedEndTime)) {
            alert('Пожалуйста, выберите время');
            return;
        }
        
        // Загрузка акций
        loadPromotions();
    }
    
    function loadPromotions() {
        // Тестовые данные вместо реального запроса
        // Реальный запрос (закомментирован):
        /*
        fetch('http://localhost:8080/promotions', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            promotions = data;
            renderPromotions();
            stepTime.classList.remove('active');
            stepPromo.classList.add('active');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при загрузке акций');
        });
        */
        
        // Тестовые данные
        promotions = [
            {
                id: "promo1",
                type: "PERCENT",
                promotionValue: 10,
                description: "Скидка 10% на все бронирования",
                start_date: `${selectedDate}T00:00:00.000Z`,
                end_date: `${selectedDate}T23:59:59.000Z`,
                platformFor: "PC"
            },
            {
                id: "promo2",
                type: "FIXED_AMOUNT",
                promotionValue: 50,
                description: "Скидка 50 руб. на вечерние бронирования",
                start_date: `${selectedDate}T18:00:00.000Z`,
                end_date: `${selectedDate}T22:00:00.000Z`,
                platformFor: "PC"
            }
        ];
        
        renderPromotions();
        stepTime.classList.remove('active');
        stepPromo.classList.add('active');
    }
    
    function renderPromotions() {
        promotionsList.innerHTML = '';
        
        // Фильтруем акции, которые действуют в выбранное время
        const bookingStart = new Date(`${selectedDate}T${selectedStartTime.toString().padStart(2, '0')}:00:00.000Z`);
        const bookingEnd = new Date(`${selectedDate}T${selectedEndTime.toString().padStart(2, '0')}:00:00.000Z`);
        
        const applicablePromotions = promotions.filter(promo => {
            const promoStart = new Date(promo.start_date);
            const promoEnd = new Date(promo.end_date);
            
            return (bookingStart >= promoStart && bookingStart < promoEnd) || 
                   (bookingEnd > promoStart && bookingEnd <= promoEnd) ||
                   (bookingStart <= promoStart && bookingEnd >= promoEnd);
        });
        
        if (applicablePromotions.length === 0) {
            promotionsList.innerHTML = '<p>Нет доступных акций для выбранного времени</p>';
            confirmPromoBtn.textContent = 'Продолжить без скидки';
        } else {
            applicablePromotions.forEach(promo => {
                const promoEl = document.createElement('div');
                promoEl.className = 'promotion-item';
                promoEl.dataset.id = promo.id;
                
                promoEl.innerHTML = `
                    <h3>${promo.type === 'PERCENT' ? `Скидка ${promo.promotionValue}%` : `Скидка ${promo.promotionValue} руб.`}</h3>
                    <p>${promo.description}</p>
                `;
                
                promoEl.addEventListener('click', () => selectPromotion(promo));
                promotionsList.appendChild(promoEl);
            });
            
            confirmPromoBtn.textContent = 'Продолжить без скидки';
        }
        
        // Обновляем отображение цены
        updatePriceDisplay(null);
    }
    
    function selectPromotion(promo) {
        selectedPromotion = promo;
        
        document.querySelectorAll('.promotion-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        document.querySelector(`.promotion-item[data-id="${promo.id}"]`).classList.add('selected');
        
        updatePriceDisplay(promo);
    }
    
    function updatePriceDisplay(promo) {
        const hours = selectedEndTime - selectedStartTime;
        const basePrice = hours * pcPrice;
        
        let discount = 0;
        let finalPrice = basePrice;
        
        if (promo) {
            if (promo.type === 'PERCENT') {
                discount = basePrice * promo.promotionValue / 100;
            } else if (promo.type === 'FIXED_AMOUNT') {
                discount = promo.promotionValue;
            }
            finalPrice = basePrice - discount;
        }
        
        basePriceEl.textContent = `${basePrice} руб.`;
        
        if (discount > 0) {
            discountValueEl.textContent = promo.type === 'PERCENT' 
                ? `${promo.promotionValue}% (${discount} руб.)` 
                : `${discount} руб.`;
            finalPriceEl.innerHTML = `<span class="old-price">${basePrice} руб.</span> ${finalPrice} руб.`;
        } else {
            discountValueEl.textContent = '0 руб.';
            finalPriceEl.textContent = `${finalPrice} руб.`;
        }
    }
    
    function confirmPromoSelection() {
        stepPromo.classList.remove('active');
        stepPayment.classList.add('active');
    }
    
    function confirmPaymentSelection() {
        stepPayment.classList.remove('active');
        stepConfirm.classList.add('active');
        
        // Заполняем сводку бронирования
        document.getElementById('summary-pc').textContent = `ПК ${pcId.replace('pc', '')}`;
        document.getElementById('summary-date').textContent = formatDate(selectedDate);
        document.getElementById('summary-time').textContent = 
            `${selectedStartTime.toString().padStart(2, '0')}:00 - ${selectedEndTime.toString().padStart(2, '0')}:00`;
        
        const hours = selectedEndTime - selectedStartTime;
        const basePrice = hours * pcPrice;
        let finalPrice = basePrice;
        
        if (selectedPromotion) {
            if (selectedPromotion.type === 'PERCENT') {
                finalPrice = basePrice - (basePrice * selectedPromotion.promotionValue / 100);
            } else if (selectedPromotion.type === 'FIXED_AMOUNT') {
                finalPrice = basePrice - selectedPromotion.promotionValue;
            }
        }
        
        document.getElementById('summary-price').textContent = `${finalPrice} руб.`;
        document.getElementById('summary-payment').textContent = 
            paymentMethod === 'QR_ONLINE' ? 'Онлайн' : 'Офлайн';
    }
    
    function finalConfirmBooking() {
        // Получаем данные профиля (тестовые вместо реального запроса)
        // Реальный запрос (закомментирован):
        /*
        fetch('http://localhost:8080/profile', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => response.json())
        .then(profile => {
            createBooking(profile);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при загрузке профиля');
        });
        */
        
        // Тестовые данные профиля
        const profile = {
            id: "user123",
            username: "testuser",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+79123456789",
            email: "test@example.com"
        };
        
        createBooking(profile);
    }
    
    function createBooking(profile) {
        const hours = selectedEndTime - selectedStartTime;
        const basePrice = hours * pcPrice;
        let finalPrice = basePrice;
        
        if (selectedPromotion) {
            if (selectedPromotion.type === 'PERCENT') {
                finalPrice = basePrice - (basePrice * selectedPromotion.promotionValue / 100);
            } else if (selectedPromotion.type === 'FIXED_AMOUNT') {
                finalPrice = basePrice - selectedPromotion.promotionValue;
            }
        }
        
        const bookingData = {
            id: "booking-" + Math.random().toString(36).substr(2, 9),
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
            email: profile.email,
            pcId: pcId,
            startTime: `${selectedDate}T${selectedStartTime.toString().padStart(2, '0')}:00:00.000Z`,
            endTime: `${selectedDate}T${selectedEndTime.toString().padStart(2, '0')}:00:00.000Z`,
            paymentMethod: paymentMethod,
            finalPrice: finalPrice.toString()
        };
        
        // Реальный запрос (закомментирован):
        /*
        fetch('http://localhost:8080/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Бронирование успешно создано!');
            window.location.href = '/profile.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при создании бронирования');
        });
        */
        
        // Тестовый ответ
        console.log('Booking data:', bookingData);
        alert('Бронирование успешно создано! (тестовый режим)');
        window.location.href = '/index.html';
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
});