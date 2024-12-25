window.onload = function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        document.body.classList.add('blurred');
        //setTimeout(function() {
            window.location.href = "index.html";
        //}, 10000);
    } else {
        document.getElementById('usernameDisplay').textContent = `Welcome, ${loggedInUser.username}`;
    }
}

document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    window.location.href = "index.html";
});
