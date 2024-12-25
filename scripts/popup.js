export function createPopup(popupId, popupHtml) {
    const popupContainer = document.createElement('div');
    popupContainer.id = popupId;
    popupContainer.classList.add('popup');
    popupContainer.innerHTML = popupHtml;

    document.body.appendChild(popupContainer);

    // Close popup event
    document.getElementById('closePopup').addEventListener('click', closePopup);
}

export function closePopup() {
    const popup = document.getElementById('crBookingPopUp');
    if (popup) {
        popup.remove();
    }
}