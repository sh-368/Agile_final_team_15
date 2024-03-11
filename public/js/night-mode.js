let isNightMode = false;

const nightModeToggle = document.getElementById('nightModeToggle');

nightModeToggle.addEventListener('click', () => {
    isNightMode = !isNightMode;
    document.body.classList.toggle('night-mode');
    
    if (isNightMode) {
        nightModeToggle.innerHTML = '<i class="fas fa-moon fa-2xl text-light"></i>';
    } else {
        nightModeToggle.innerHTML = '<i class="fas fa-sun fa-2xl text-light"></i>';
    }
});
