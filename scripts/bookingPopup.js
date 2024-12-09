import { createPopup, closePopup } from './popup.js';

export function openBookingPopup(flight) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const popupHtml = `
        <div id="crBookingPopUp" class="popup-content">
            <span id="closePopup" class="close-btn">&times;</span>
            <div class="popup-header">
                <div class="header-info">
                    <div class="customer-id">CstID: ${loggedInUser.CstID}</div>
                    <h3>${flight.code} - ${flight.name}</h3>
                </div>
            </div>
            <div class="flight-details">
                <p><strong>Departure:</strong> ${flight.departure.city}, ${flight.departure.country} <br> ${new Date(flight.departure.date).toLocaleString()}</p>
                <p><strong>Arrival:</strong> ${flight.arrival.city}, ${flight.arrival.country} <br> ${new Date(flight.arrival.date).toLocaleString()}</p>
                <p class="showRight"><strong>Price:</strong> $${flight.price}</p>
            </div>
            <form id="bookingForm" class="booking-form">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" value="${loggedInUser.username.split(' ')[0]}" required />

                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" value="${loggedInUser.username.split(' ')[1]}" required />

                <label for="email">Email:</label>
                <input type="email" id="email" value="${loggedInUser.email}" required />

                <label for="phone">Phone Number:</label>
                <input type="tel" id="phone" required />

                <label for="cnic">CNIC Number:</label>
                <input type="text" id="cnic" required />

                <label for="numSeats">Number of Seats:</label>
                <input type="number" id="numSeats" required min="1" />

                <label for="seatClass">Seat Class:</label>
                <select id="seatClass" required>
                    <option value="E">Economy</option>
                    <option value="B">Business</option>
                    <option value="F">First</option>
                    <option value="S">Special</option>
                </select>

                <button type="submit" id="confirmBooking" class="btn">Book Flight</button>
            </form>
            <div id="error-message" class="error-message"></div>
        </div>
    `;

    createPopup('crBookingPopUp', popupHtml);

    setTimeout(() => {
        document.getElementById('closePopup').addEventListener('click', closePopup);
    }, 100);
}