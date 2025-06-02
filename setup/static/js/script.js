document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const artistCards = document.querySelectorAll('.artist-card .btn-select');
    const timeSlots = document.querySelectorAll('.time-slot');
    const stepElements = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.booking-step-content');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    const bookingForm = document.querySelector('.booking-form');
    
    // Calendar setup
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const calendarGrid = document.querySelector('.calendar-grid');
    
    let currentDate = new Date();
    let selectedDate = null;
    let selectedArtist = null;
    let selectedTime = null;
    
    // Initialize the calendar
    function initCalendar() {
        renderCalendar(currentDate);
        
        prevMonthButton.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
        
        nextMonthButton.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Render the calendar
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Set the month header
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                           'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Add day headers
        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('calendar-day-header');
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get the first day of the month
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        // Add empty cells for days before the first day of the month
        const firstDayIndex = firstDayOfMonth.getDay();
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add cells for each day of the month
        const today = new Date();
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            
            const dateToCheck = new Date(year, month, day);
            
            // Disable past dates
            if (dateToCheck < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                dayElement.classList.add('disabled');
            } else {
                // Available dates
                dayElement.classList.add('available');
                
                // Add click event
                dayElement.addEventListener('click', function() {
                    // Remove selected class from all days
                    document.querySelectorAll('.calendar-day').forEach(day => {
                        day.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked day
                    this.classList.add('selected');
                    
                    // Store selected date
                    selectedDate = new Date(year, month, day);
                    
                    // Update the summary
                    updateSummary();
                });
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Artist selection
    artistCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the artist name
            selectedArtist = this.closest('.artist-card').querySelector('h4').textContent;
            
            // Go to next step
            goToStep(2);
            
            // Update the summary
            updateSummary();
        });
    });
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all time slots
            timeSlots.forEach(slot => slot.classList.remove('selected'));
            
            // Add selected class to clicked time slot
            this.classList.add('selected');
            
            // Store selected time
            selectedTime = this.textContent;
            
            // Update the summary
            updateSummary();
        });
    });
    
    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.booking-step-content').id.replace('step', ''));
            goToStep(currentStep + 1);
        });
    });
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.booking-step-content').id.replace('step', ''));
            goToStep(currentStep - 1);
        });
    });
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!selectedArtist || !selectedDate || !selectedTime) {
                alert('Por favor, complete todas as seleções antes de confirmar.');
                return;
            }
            
            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                description: document.getElementById('description').value,
                reminder: document.getElementById('reminder').checked,
                artist: selectedArtist,
                date: selectedDate,
                time: selectedTime
            };
            
            // Here you would normally send the data to your server
            // For this template, we'll just show a confirmation
            alert('Agendamento solicitado com sucesso! O tatuador irá analisar e confirmar seu horário em breve.');
            
            // Reset form and selections
            resetBookingProcess();
        });
    }
    
    // Function to go to a specific step
    function goToStep(stepNumber) {
        // Update step indicators
        stepElements.forEach((step, index) => {
            if (index + 1 < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Show the corresponding step content
        stepContents.forEach((content, index) => {
            if (index + 1 === stepNumber) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // Function to update the booking summary
    function updateSummary() {
        if (selectedArtist) {
            document.getElementById('summary-artist').textContent = selectedArtist;
        }
        
        if (selectedDate) {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            document.getElementById('summary-date').textContent = selectedDate.toLocaleDateString('pt-BR', options);
        }
        
        if (selectedTime) {
            document.getElementById('summary-time').textContent = selectedTime;
        }
    }
    
    // Function to reset the booking process
    function resetBookingProcess() {
        // Reset selections
        selectedArtist = null;
        selectedDate = null;
        selectedTime = null;
        
        // Reset form
        if (bookingForm) {
            bookingForm.reset();
        }
        
        // Reset UI
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        
        timeSlots.forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Go back to step 1
        goToStep(1);
    }
    
    // Initialize calendar if it exists
    if (calendarGrid) {
        initCalendar();
    }
    
    // Start at step 1
    goToStep(1);
    
    // Add CSS for calendar days (these styles depend on JavaScript)
                addCalendarStyles();
    
    function addCalendarStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .calendar-day-header {
                text-align: center;
                font-weight: bold;
                padding: 10px;
                background-color: var(--light-gray);
            }
            
            .calendar-day {
                text-align: center;
                padding: 10px;
                cursor: pointer;
                border: 1px solid var(--border);
                transition: all 0.3s ease;
            }
            
            .calendar-day.empty {
                background-color: transparent;
                border: none;
                cursor: default;
            }
            
            .calendar-day.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .calendar-day.available:hover {
                background-color: var(--primary-light);
                color: var(--light);
            }
            
            .calendar-day.selected {
                background-color: var(--primary);
                color: var(--light);
                border-color: var(--primary);
            }
            
            .step.completed .step-number {
                background-color: var(--success);
            }
        `;
        document.head.appendChild(style);
    }
});