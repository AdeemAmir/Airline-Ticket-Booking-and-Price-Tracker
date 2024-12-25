import { BST } from './ds_BST.js';
import { Graph } from './ds_Graph.js';
import { crNot } from './notif.js'; 
import { getWeather } from './weathCall.js';
import { openBookingPopup } from './bookingPopup.js';
import { getUserBookingsHtml } from './bookedFlH.js';
import { closePopup } from './popup.js';
import { fDate } from './fDateUtil.js';

const globalBST = new BST();
const routeGraph = new Graph();

let flights = [];
let greyedOutFlights = [];
let selectedFlight = null;

let prTrackInterval = null; 
let isTracking = false;
let prUpdInterval = null;
let isUpdating = false;
let minMaxInterval = null;
let MinMaxTracking = false;


async function fetchFlights() {
    try {
        const response = await fetch('files/flights.json');
        flights = await response.json();

        flights.forEach(flight => {
            flight.orig_price = flight.price; // Used to limit proliferation of forcePriceUpdate
            globalBST.insert(flight.price, flight.flight.code);
            routeGraph.addRoute(flight.departure.city.toLowerCase(), flight.arrival.city.toLowerCase(), flight.price);
        });

        displayFlights(flights);
    } catch (error) {
        console.error('Error fetching flights:', error);
    }
}

function displayFlights(flights) {
    const flightsContainer = document.getElementById('flightsContainer');
    flightsContainer.innerHTML = '';

    flights.forEach(flight => {
        const flightDiv = document.createElement('div');
        flightDiv.className = 'flight';
        flightDiv.id = `flight-${flight.flight.code}`;
        if (greyedOutFlights.includes(flight.flight.code)) {
            flightDiv.classList.add('greyed-out');
        }
        flightDiv.innerHTML = `
            <h3>${flight.flight.code} - ${flight.flight.name}</h3>
            <p><strong>From:</strong> ${flight.departure.city}, ${flight.departure.country} (${flight.departure.airport})</p>
            <p><strong>To:</strong> ${flight.arrival.city}, ${flight.arrival.country} (${flight.arrival.airport})</p>
            <p><strong>Departure:</strong> ${fDate(flight.departure.date)} - <strong>Arrival:</strong> ${fDate(flight.arrival.date)}</p>
            <p class="price"><strong>Price:</strong> PKR ${flight.price}</p>
        `;
        flightDiv.addEventListener('click', () => selectFlight(flightDiv, flight));
        flightsContainer.appendChild(flightDiv);
    });
}

function getFilteredFlights() {
    const source = (document.getElementById('sourceInput').value || '').trim().toLowerCase();
    const destination = (document.getElementById('destinationInput').value || '').trim().toLowerCase();
    const airline = (document.getElementById('airlineInput').value || '').trim().toLowerCase();
    const date = (document.getElementById('dateInput').value || '').trim().toLowerCase();

    return flights.filter(flight => {
        const matchesSource = !source || 
            (flight.departure.city && flight.departure.city.toLowerCase().includes(source)) ||
            (flight.departure.airport && flight.departure.airport.toLowerCase().includes(source)) ||
            (flight.departure.country && flight.departure.country.toLowerCase().includes(source));

        const matchesDestination = !destination || 
            (flight.arrival.city && flight.arrival.city.toLowerCase().includes(destination)) ||
            (flight.arrival.airport && flight.arrival.airport.toLowerCase().includes(destination)) ||
            (flight.arrival.country && flight.arrival.country.toLowerCase().includes(destination));

        const matchesAirline = !airline || 
            (flight.flight.name && flight.flight.name.toLowerCase().includes(airline)) ||
            (flight.flight.code && flight.flight.code.toLowerCase().includes(airline)) ||
            (flight.flight.number && flight.flight.number.toLowerCase().includes(airline));

        const matchesDate = !date || 
            (flight.departure.date && flight.departure.date.toLowerCase().includes(date));

        return matchesSource && matchesDestination && matchesAirline && matchesDate;
    });
}

function filterFlights() {
    const filteredFlights = getFilteredFlights();
    displayFlights(filteredFlights);
}

function selectFlight(flightDiv, flight) {
    document.querySelectorAll('.flight').forEach(f => f.classList.remove('selected'));
    flightDiv.classList.add('selected');
    selectedFlight = flight;
    console.log('Selected Flight:', flight);
}

function startPriceTracking() {
    const threshold = parseInt(document.getElementById('priceThreshold').value);
    if (isNaN(threshold) || threshold <= 0) {
        crNot('Please enter a valid price threshold.');
        return;
    }
    if (!isTracking) {
        prTrackInterval = setInterval(() => {
            const filteredFlights = getFilteredFlights();
            const prDrpdFlights = filteredFlights.filter(flight => flight.price <= threshold);
            if (prDrpdFlights.length > 0) {
                prDrpdFlights.forEach(flight => {
                    crNot(`Price for flight ${flight.flight.code} has dropped below the threshold! New price: PKR ${flight.price}`);
                });
                clearInterval(prTrackInterval);
                isTracking = false;
                crNot('Price tracking stopped');
            }
        }, 1000);
        isTracking = true;
        crNot('Price tracking started');
    } else {
        crNot('Price tracking stopeed');
        isTracking = false;
    }
}

function forcePriceUpdate() {
    if (isUpdating) {
        crNot("Stopping price updates...");
        clearInterval(prUpdInterval); // inv back to null
        isUpdating = false;
    } else {
        crNot("Starting price updates...");
        prUpdInterval = setInterval(() => {
            console.log("Updating prices...");
            const filteredFlights = getFilteredFlights(); 
            flights.forEach(flight => {
                const priceChange = Math.floor(Math.random() * 2000) - 1000; // +-1000
                const orig_price = flight.orig_price;
                let bounds = [(orig_price * 0.95), (orig_price * 1.05)];
                let newPrice = orig_price + priceChange;
                if (newPrice < bounds[0]) {newPrice = bounds[0];}
                else if (newPrice > bounds[1]) {newPrice = bounds[1];}
                flight.price = newPrice;
                globalBST.insert(flight.price, flight.flight.code);
                console.log(`Updated price for flight ${flight.flight.code} - ${flight.flight.name}: PKR ${flight.price}`);
            });
            displayFlights(filteredFlights);
        }, 4000);
        isUpdating = true;
    }
}

function minMaxTracking() {
    if (MinMaxTracking) {
        crNot("Min-Max Stopped");
        clearInterval(minMaxInterval);
        MinMaxTracking = false;
        return;
    }

    const filteredFlights = getFilteredFlights();
    const minMaxBST = new BST();

    filteredFlights.forEach(flight => {
        minMaxBST.insert(flight.price, flight.flight.code);
    });

    minMaxInterval = setInterval(() => {
    if (minMaxBST.root) {
        const minPriceFlight = minMaxBST.findMin();
        const maxPriceFlight = minMaxBST.findMax();

        crNot(`Cheapest flight: ${minPriceFlight.value} (PKR ${minPriceFlight.key})`);
        crNot(`Most expensive flight: ${maxPriceFlight.value} (PKR ${maxPriceFlight.key})`);
    } else {
        crNot("No flights match the selected criteria.");
        return;
    }  
    }, 3000);
    crNot("Min-Max Started");
    MinMaxTracking = true;
}

async function chkWeath4Flights(flights) {
    crNot("Calling WeatherAPI, Please wait.");
    const weatherChecks = flights.map(flight => {
        return Promise.all([
            getWeather(flight.departure.city, flight.departure.country),
            getWeather(flight.arrival.city, flight.arrival.country)
        ]).then(results => {
            const [isBadWeatherDep, isBadWeatherArr] = results;
            if (isBadWeatherDep || isBadWeatherArr) {
                greyedOutFlights.push(flight.flight.code);
                routeGraph.removeRoute(flight.departure.city.toLowerCase(), flight.arrival.city.toLowerCase());
                return true;
            }
            return false;
        });
    });
    Promise.all(weatherChecks).then(() => {
        displayFlights(flights);
    });
}

function suggestRoute() {
    const sourceCity = document.getElementById('sourceInput').value.toLowerCase();
    const destinationCity = document.getElementById('destinationInput').value.toLowerCase();

    if (!sourceCity || !destinationCity) {
        crNot("Please enter both source and destination cities.");
        return;
    }

    const alternateRoutes = routeGraph.findAllPaths(sourceCity, destinationCity);

    if (alternateRoutes.length === 0) {
        crNot(`No alternate routes found from ${sourceCity} to ${destinationCity}`);
        return;
    }

    let resultMessage = `<h2>Alternate Routes from ${sourceCity} to ${destinationCity}:</h2>`;
    alternateRoutes.forEach(route => {
        const routeDetails = route.join(' -> ');
        resultMessage += `<div class="route">Route: ${routeDetails}</div>`;
    });

    // Dijkstra’s algorithm
    /*
    const cheapestRoute = routeGraph.findCheapestPath(sourceCity, destinationCity);

    if (cheapestRoute.cost !== undefined) {
        resultMessage += `<h2>Cheapest Route:</h2>`;
        resultMessage += `<div class="route">Route: ${cheapestRoute.path.join(' -> ')} <br> Total Cost: ${cheapestRoute.cost}</div>`;
    } else {
        resultMessage += `<h2>No Cheapest Route Found</h2>`;
    }    */

    crNot(resultMessage);
}

function generateTicketNumber() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${selectedFlight.flight.code}-${loggedInUser.CstID}-${randomPart}`;
}

document.getElementById('bookFlightButton').addEventListener('click', function() {
    if (!selectedFlight) {
        crNot("Please select a flight to book.");
        return;
    }

    if (greyedOutFlights.includes(selectedFlight.flight.number)) {
        crNot("Cannot book this flight due to bad weather conditions.", true);
        return;
    }

    openBookingPopup(selectedFlight);

    setTimeout(() => {
        document.getElementById('bookingForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const cnic = document.getElementById('cnic').value;
            const numSeats = parseInt(document.getElementById('numSeats').value);
            const seatClass = document.getElementById('seatClass').value;

            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.textContent = ''; // Clear previous error message if any

            // Validation
            if (!firstName || !lastName || !email || !phone || !cnic || isNaN(numSeats) || numSeats <= 0 || !seatClass) {
                errorMessageDiv.textContent = "Please provide valid information.";
                errorMessageDiv.style.borderBottom = '2px solid red';
                errorMessageDiv.style.color = 'red';
                setTimeout(() => {
                    errorMessageDiv.textContent = '';
                    errorMessageDiv.style.borderBottom = 'none';
                }, 3000);
                return;
            }

            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            const ticketNumber = generateTicketNumber(); // Generate ticket number
            const booking = {
                ticketNumber,
                userId: loggedInUser.CstID,
                firstName,
                lastName,
                email,
                phone,
                cnic,
                numSeats,
                seatClass,
                flight: selectedFlight
            };

            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            crNot("Flight booked successfully!");
            console.log("Booking Details:", booking);

            closePopup();
        });
    }, 100);
});

const button = document.getElementById('viewBookedFlightsButton');
const userInfoSection = document.getElementById('userInfoSection');

button.addEventListener('mouseover', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        crNot("You must be logged in to view booked flights.");
        return;
    }

    const userBookingsHtml = getUserBookingsHtml(loggedInUser);

    if (!userBookingsHtml) {
        crNot("You have no booked flights.");
        return;
    }

    userInfoSection.innerHTML = userBookingsHtml;
    userInfoSection.style.display = 'block';
});


userInfoSection.addEventListener('mouseenter', function () {
    userInfoSection.style.display = 'block';
});

userInfoSection.addEventListener('mouseleave', function () {
    userInfoSection.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const inps = ['sourceInput', 'destinationInput', 'airlineInput', 'dateInput'];
    inps.forEach(id => {
        document.getElementById(id).addEventListener('input', filterFlights);
    });
    document.getElementById('startTrackingButton').addEventListener('click', startPriceTracking);
    document.getElementById('forceUpdateButton').addEventListener('click', forcePriceUpdate);
    document.getElementById('suggestRoutesButton').addEventListener('click', suggestRoute);
    document.getElementById('checkWeatherForFlights').addEventListener('click', () => chkWeath4Flights(flights));
    document.getElementById('minMaxTracking').addEventListener('click', () => minMaxTracking());
    fetchFlights();
});
