/**
 * Creates a notification with the specified message and adds it to the notification container.
 * If the container doesn't exist, it creates one.
 * 
 * @param {string} message - The message to be displayed in the notification.
 */
export function crNot(message) {
    const notContainer = document.getElementById('notifContainer') || createResultsContainer();

    const notDiv = document.createElement('div');
    notDiv.classList.add('notif');

    const notDetails = document.createElement('div');
    notDetails.innerHTML = message;  // innerHTML to allow HTML tags like <h2>, <div>, etc.

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-btn');
    closeButton.textContent = '×';
    closeButton.onclick = function () {
        notDiv.remove(); 
    };

    notDiv.appendChild(closeButton);
    document.getElementById('notifContainer').style.display = 'block';
    notDiv.appendChild(notDetails);
    notContainer.appendChild(notDiv); 
}


/**
 * Creates a container for notifications and adds it to the document body.
 * The container is initially hidden, and a button to close all notifications is included.
 * 
 * @returns {HTMLElement} The container element for the notifications.
 */
export function createResultsContainer() {
    const container = document.createElement('div');
    container.id = 'notifContainer';
    container.style.display = 'none';
    container.classList.add('floating-container');
    document.body.appendChild(container);

    const closeAllButton = document.createElement('span');
    closeAllButton.classList.add('close-all-btn');
    closeAllButton.textContent = '×';
    closeAllButton.onclick = function () {
        container.style.display = 'none';
    };
    container.appendChild(closeAllButton);
    return container;
}
