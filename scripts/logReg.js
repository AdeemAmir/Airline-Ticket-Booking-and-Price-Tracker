const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const iconClose = document.querySelector('.icon-close');
const loginStatus = document.getElementById('login-status');

document.addEventListener('DOMContentLoaded', function() {
    const baseImageUrl = "https://raw.githubusercontent.com/AdeemAmir/Project-Files/main/Airline%20Ticket%20Booking%20and%20Price%20Tracker/files/images/logReg/";
    const db = 'https://raw.githubusercontent.com/AdeemAmir/Project-Files/main/Airline%20Ticket%20Booking%20and%20Price%20Tracker/files/images/logReg/data.json';
    fetch(db)
        .then(response => {
            //throw new Error('Data file not found'); 
            if (!response.ok) console.log('Data file not found');   // Error Handler
            return response.json();
        })
        .then(data => {
            if (data.meta && Array.isArray(data.meta.image_urls) && data.meta.image_urls.length > 0) {
                const images = data.meta.image_urls;
                const randomIndex = Math.floor(Math.random() * images.length);
                const randomImage = images[randomIndex];
                const imageUrl = baseImageUrl + randomImage;
                document.body.style.backgroundImage = `url('${imageUrl}')`;
            } else {
                console.log("No valid image URLs found in data.json.");  // Error Handler
            }
        })
        .catch(error => {
            console.log('Error fetching data:', error);  // Error Handler
        });
});

window.onload = function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        loginStatus.textContent = "Logged In";
        loginStatus.style.color = "green";
        loginStatus.classList.add('logged-in');
        wrapper.style.background = "rgba(0, 200, 0, 0.3)";
        wrapper.style.border = "2px solid green";
        wrapper.style.boxShadow = "0 0 30px rgba(0, 255, 0, 0.5)"; 
        setTimeout(() => {
            window.location.href = "hero.html";
        }, 4321);
    } else {
        loginStatus.textContent = "Not Logged In";
        loginStatus.style.color = "red";
        loginStatus.classList.add('not-logged-in');
        wrapper.style.background = "rgba(100, 50, 50, 0.7)";
        wrapper.style.border = "2px solid red";
        wrapper.style.boxShadow = "0 0 30px rgba(255, 0, 0, 0.5)"; 
    }

    wrapper.classList.add('active-popup');
};

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

/*iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
}); FOR THE X ICON*/ 

document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Generate unique CstID :P
    const CstID = Date.now();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const email = document.getElementById("signup-email").value;

    const c1 = /.{8,}/.test(password);
    const c2 = /^[a-zA-Z]/.test(password);
    const c3 = /^(?=.*[a-zA-Z])(?=.*\d)/.test(password); 

    if (!c1 || !c2 || !c3) {
        alert("Password must be at least 8 characters long, start with a letter, and contain both letters and numbers.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.email === email)) {
        alert("Email already exists!");
        return;
    }

    const newUser = { username, password, email, CstID };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("User signed up successfully!");
    wrapper.classList.remove('active');
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email);

    if (!user) {
        alert("User not found!");
        return;
    } else if (user.password !== password) {
        alert("Incorrect password!");
        return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));

    window.location.href = "hero.html";
});




/*
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the local data file
    fetch('./files/data.json')  // Adjust if the path is wrong
        .then(response => {
            if (!response.ok) {
                throw new Error('Data file not found');
            }
            return response.json();  // Parse the response as JSON
        })
        .then(data => {
            const totalImages = data.meta.lgR_images; // Get the number of images
            const formats = ['jpg', 'jpeg', 'png', 'gif'];
            const images = [];

            // Check if each image exists and add it to the images array
            let promises = [];
            for (let i = 1; i <= totalImages; i++) {
                for (let format of formats) {
                    const imageUrl = `https://raw.githubusercontent.com/AdeemAmir/Project-Files/main/Airline%20Ticket%20Booking%20and%20Price%20Tracker/files/images/logReg/live${i}.${format}`;
                    promises.push(
                        checkImageExists(imageUrl).then(exists => {
                            if (exists) {
                                images.push(imageUrl);  // Add to images if it exists
                            }
                        })
                    );
                }
            }

            // Once all promises are resolved, pick a random image and set it as background
            Promise.all(promises).then(() => {
                if (images.length > 0) {
                    const randomIndex = Math.floor(Math.random() * images.length);
                    document.body.style.backgroundImage = `url(${images[randomIndex]})`;  // Set background
                } else {
                    console.log("No valid images found.");
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);  // Handle errors fetching data
        });

    // Function to check if an image exists using a HEAD request
    function checkImageExists(imageUrl) {
        return fetch(imageUrl, { method: 'HEAD' })
            .then(response => response.ok)
            .catch(() => false); // If the fetch fails, return false
    }
});
*/
