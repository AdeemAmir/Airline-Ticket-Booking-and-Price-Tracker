export function getUserBookingsHtml(loggedInUser) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBookings = bookings.filter(booking => booking.userId === loggedInUser.CstID);

    if (userBookings.length === 0) {
        return null;
    }

    let bookedFlightsHtml = `
        <div class="user-bookings">
            <h3 style="margin-bottom: -10px;"><strong>Customer ID:</strong> ${loggedInUser.CstID}</h3>
            <h3>Your Booked Flights</h3>
            <ul class="bookings-list">
    `;

    userBookings.forEach(booking => {
        bookedFlightsHtml += `
            <li class="booking-item">
                <div class="booking-header">
                <h3 style="margin-bottom: -10px; margin-top: 10px;"><strong>Ticket Number:</strong> ${userBookings[0]?.ticketNumber || 'N/A'}</h3>
                    <strong>Flight ID:</strong> ${booking.flight.flight.code} 
                    <span class="price"><strong>Price:</strong> $${booking.flight.price}</span>
                </div>
                <div class="booking-details">
                    <strong>Airline:</strong> ${booking.flight.flight.name}<br>
                    <strong>From:</strong> ${booking.flight.departure.city} (${booking.flight.departure.airport})<br>
                    <strong>To:</strong> ${booking.flight.arrival.city} (${booking.flight.arrival.airport})<br>
                    <strong>Departure:</strong> ${new Date(booking.flight.departure.date).toLocaleString()}<br>
                    <strong>Arrival:</strong> ${new Date(booking.flight.arrival.date).toLocaleString()}<br>
                    <strong>Seats:</strong> ${booking.numSeats} (${booking.seatClass} Class)<br>
                    <strong>CNIC:</strong> ${booking.cnic}<br>
                    <strong>Phone:</strong> ${booking.phone}
                </div>
            </li>
        `;
    });

    bookedFlightsHtml += `</ul></div>`;
    return bookedFlightsHtml;
}