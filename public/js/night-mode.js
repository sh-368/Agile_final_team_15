let isNightMode = false;

const nightModeToggle = document.getElementById('nightModeToggle');
const pageSections = document.querySelectorAll('.page-section');

nightModeToggle.addEventListener('click', () => {
    isNightMode = !isNightMode;
    if (isNightMode) {
        nightModeToggle.innerHTML = '<i class="fas fa-moon fa-2xl text-dark"></i>'; // Switch to moon icon for night mode
        document.body.style.backgroundColor = '#333333'; // Change background color for night mode
        document.body.style.color = '#fff'; // Change text color for night mode
const pageSections = document.querySelectorAll('.page-section');
        console.log(pageSections)
        pageSections.forEach(pageSection => {
            pageSection.classList.remove('section-day');
            pageSection.classList.add('section-night');
        })

    } else {
        nightModeToggle.innerHTML = '<i class="fas fa-sun fa-2xl text-light"></i>'; // Switch to sun icon for day mode
        document.body.style.backgroundColor = '#fff'; // Change background color for day mode
        document.body.style.color = '#000'; // Change text color for day mode
        console.log(pageSections)
        pageSections.forEach(pageSection => {
            pageSection.classList.remove('section-night');
            pageSection.classList.add('section-day');
        })
    }
});