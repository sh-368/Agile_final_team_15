let isNightMode = false;

const nightModeToggle = document.getElementById('nightModeToggle');
const allLatestSection = document.querySelectorAll('.latest-section');
const allCards = document.querySelectorAll('.card');
const navBar = document.getElementById('mainNav');

nightModeToggle.addEventListener('click', () => {

    isNightMode = !isNightMode;

    if (isNightMode) {
        nightModeToggle.innerHTML = '<i class="fas fa-moon fa-2xl text-light"></i>'; // Switch to moon icon for night mode
        document.body.style.backgroundColor = '#333333'; // Change background color for night mode
        document.body.style.color = '#fff'; // Change text color for night mode
    
        navBar.classList.remove('navbar');
        navBar.classList.add('navbar-night');

        console.log(allLatestSection)
        allLatestSection.forEach(latestSection => {
            latestSection.classList.remove('latest-section');
            latestSection.classList.add('latest-section-night');

        })

        allCards.forEach(card => {
            card.style.backgroundColor = '#333333';
            card.classList.remove('bg-white p-3');
            card.classList.add('bg-secondary p-3');

        })

    } else {

        nightModeToggle.innerHTML = '<i class="fas fa-sun fa-2xl text-light"></i>'; // Switch to sun icon for day mode
        document.body.style.backgroundColor = '#fff'; // Change background color for day mode
        document.body.style.color = '#000'; // Change text color for day mode

        allLatestSection.forEach(latestSection => {
            latestSection.classList.add('latest-section');
            latestSection.classList.remove('latest-section-night');
        })

        navBar.classList.remove('navbar-night');
        navBar.classList.add('navbar');
    }

    allCards.forEach(card => {
        card.classList.remove('bg-secondary p-3');
        card.classList.add('bg-white p-3');

    })
});