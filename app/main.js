document.addEventListener("DOMContentLoaded", function () {
    // Get the input field and the button
    const inputField = document.querySelector('input[placeholder="ID do cartão"]');
    const button = document.querySelector('button');

    // Function to check the input value and enable/disable the button
    function toggleButtonState() {
        if (inputField.value.trim() === "") {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    // Function to clear the input field
    function clearInputField() {
        inputField.value = "";
        toggleButtonState(); // Disable the button after clearing the input
    }

    // Function to log the input value (for example, to console or send to server)
    async function logInputValue() {
        const id = inputField.value;
        try {
            const response = await fetch(`http://localhost:3000/clients/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                alert('Cliente não encontrado!');
                return; // Exit if the client is not found
            }
            const data = await response.json();
            displayClientData(data); // Chama a função para exibir os dados e remover o container vazio
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
        clearInputField(); // Clear the input field after logging the value
    }

    // Function to create and show the modal
    function showCongratulationsModal() {
        const modal = document.getElementById('congratulations-modal');
        const closeButton = modal.querySelector('.close-button');

        modal.classList.remove('hidden');

        closeButton.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Close modal if clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    function displayClientData(client) {
        // Remover o container vazio se ele existir
        const emptyContainer = document.getElementById('client-container-empty');
        if (emptyContainer) {
            emptyContainer.remove();
        }

        // Selecionar o container onde os dados serão exibidos
        const clientContainer = document.getElementById('client-container');
        clientContainer.innerHTML = ''; // Limpar conteúdo existente
        const clientData = document.createElement('div');
        clientData.classList.add('client-data');

        // Criar a seção de perfil do cliente
        const clientProfile = document.createElement('section');
        clientProfile.classList.add('client-profile');
        clientProfile.innerHTML = `
            <div class="client-photo-wrapper">
                <img src="/assets/${client.id}.png" alt="Foto de ${client.name}" class="client-photo">
            </div>
            <div class="client-info">
                <h2>${client.name}</h2>
                <p>Cliente desde ${client.clientSince}</p>
            </div>
        `;
        clientData.appendChild(clientProfile);

        // Criar a seção de histórico de agendamentos
        const appointmentHistory = document.createElement('section');
        appointmentHistory.classList.add('appointment-history');
        appointmentHistory.innerHTML = `
            <div class="total-cuts-container">
                <h3>Histórico</h3>
                <span class="total-cuts">${client.loyaltyCard.totalCuts} cortes</span>
            </div>
            <ul></ul>
        `;
        const historyList = appointmentHistory.querySelector('ul');

        // Adicionar itens do histórico de agendamentos
        client.appointmentHistory.forEach(appointment => {
            const historyItem = document.createElement('li');
            historyItem.innerHTML = `
                <div class="appointment-container">
                    <span>${appointment.date}</span>
                    <p>${appointment.time}</p>
                </div>
                <img src="/assets/check-icon.png" class="check-icon-history">
            `;
            historyList.appendChild(historyItem);
        });
        clientData.appendChild(appointmentHistory);
        clientContainer.appendChild(clientData);

        // Criar a seção do cartão de fidelidade
        const loyaltyCardContainer = document.createElement('section');
        loyaltyCardContainer.classList.add('loyalty-card-container');
        const loyaltyCard = document.createElement('section');
        loyaltyCard.classList.add('loyalty-card');
        loyaltyCard.innerHTML = `
            <div class="loyalty-header">
                <div class="loyalty-info">
                    <p><strong>CARTÃO FIDELIDADE</strong></p>
                    <p>Ao fazer cortes de cabelo, o décimo sai de graça!</p>
                </div>
                <span class="client-id"><strong> ID: ${client.id}</strong></span>
            </div>
            <div class="stamps"></div>
        `;
        const stampsContainer = loyaltyCard.querySelector('.stamps');

        // Adicionar os selos ao cartão de fidelidade
        for (let i = 0; i < client.loyaltyCard.totalCuts; i++) {
            const stamp = document.createElement('div');
            stamp.classList.add('stamp', 'checked');
            stampsContainer.appendChild(stamp);
        }
        for (let i = client.loyaltyCard.totalCuts; i < 10; i++) {
            const stamp = document.createElement('div');
            stamp.classList.add('stamp', i === 9 ? 'gift' : 'unchecked');
            stampsContainer.appendChild(stamp);
        }
        loyaltyCardContainer.appendChild(loyaltyCard);

        // Criar a seção de progresso do cartão de fidelidade
        const loyaltyProgress = document.createElement('section');
        loyaltyProgress.classList.add('loyalty-progress');
        const progressPercentage = (client.loyaltyCard.totalCuts / 10) * 100;
        loyaltyProgress.innerHTML = `
            <div class="loyalty-progress-progress-container">
                <p><strong>${client.loyaltyCard.cutsRemaining} </strong>cortes restantes</p>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progressPercentage}%;"></div>
                    </div>
                    <span class="progress-info">${client.loyaltyCard.totalCuts} de 10</span>
                </div>
            </div>
            <img src="/assets/present.png" class="present" alt="Ícone de presente">
        `;
        loyaltyCardContainer.appendChild(loyaltyProgress);
        clientContainer.appendChild(loyaltyCardContainer);

        // Criar a seção de histórico de MOBILE
        const appointmentHistoryMobile = document.createElement('section');
        appointmentHistoryMobile.classList.add('appointment-history-mobile');
        appointmentHistoryMobile.innerHTML = `
            <div class="total-cuts-container">
                <h3>Histórico</h3>
                <span class="total-cuts">${client.loyaltyCard.totalCuts} cortes</span>
            </div>
            <div class="list-container">
                <ul></ul>
            </div>
        `;
        const historyListMobile = appointmentHistoryMobile.querySelector('ul');

        // Adicionar itens do histórico de agendamentos
        client.appointmentHistory.forEach(appointment => {
            const historyItem = document.createElement('li');
            historyItem.innerHTML = `
                <div class="appointment-container">
                    <span>${appointment.date}</span>
                    <p>${appointment.time}</p>
                </div>
                <img src="/assets/check-icon.png" class="check-icon-history">
            `;
            historyListMobile.appendChild(historyItem);
        });
        clientContainer.appendChild(appointmentHistoryMobile);

        // Show modal if there are no cuts remaining
        if (client.loyaltyCard.cutsRemaining === 0) {
            showCongratulationsModal();
        }
    }

    // Initial setup
    function initialize() {
        toggleButtonState(); // Initially disable the button
        inputField.addEventListener('input', toggleButtonState); // Listen for input events to toggle the button state
        button.addEventListener('click', logInputValue); // Log the input value when the button is clicked
    }

    // Call the initialize function to set everything up
    initialize();
});
