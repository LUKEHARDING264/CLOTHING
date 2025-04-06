// Theme data
const themeData = {
    performance: {
        title: 'PERFORMANCE',
        description: 'Experience the raw energy and intensity of live performance. This collection captures the essence of artistic expression through movement and emotion.',
        image: 'images/THEME 1.webp'
    },
    technology: {
        title: 'TECHNOLOGY',
        description: 'Explore the intersection of human consciousness and digital evolution. A fusion of organic and synthetic elements that challenges our perception of reality.',
        image: 'images/THEME 2.jpg'
    },
    society: {
        title: 'SOCIETY',
        description: 'Dive into the depths of social commentary and cultural critique. This theme examines the complex relationships between individuals and the systems that shape our world.',
        image: 'images/THEME 3.jpg'
    }
};

// Update time display
function updateTime() {
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
}

// Initialize time display and update every minute
updateTime();
setInterval(updateTime, 60000);

// Handle theme window interactions
document.addEventListener('DOMContentLoaded', () => {
    const themeWindow = document.getElementById('theme-window');
    const themePreview = document.getElementById('theme-preview');
    const themeTitle = document.getElementById('theme-title');
    const themeText = document.getElementById('theme-text');
    const closeButton = document.querySelector('.close-button');

    // Add click handlers to desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const theme = icon.dataset.theme;
            const data = themeData[theme];
            
            themePreview.src = data.image;
            themeTitle.textContent = data.title;
            themeText.textContent = data.description;
            
            themeWindow.style.display = 'block';
        });
    });

    // Close window when clicking the close button
    closeButton.addEventListener('click', () => {
        themeWindow.style.display = 'none';
    });

    // Close window when clicking outside
    themeWindow.addEventListener('click', (e) => {
        if (e.target === themeWindow) {
            themeWindow.style.display = 'none';
        }
    });
    
    // Floating buttons interaction
    const floatingButtons = document.querySelectorAll('.floating-button');
    
    floatingButtons.forEach(button => {
        // Add subtle hover animation
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        
        // Add click animation
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 1000);
            
            // Handle different button actions
            switch(action) {
                case 'explore':
                    // Open the first theme
                    const performanceIcon = document.querySelector('.desktop-icon[data-theme="performance"]');
                    if (performanceIcon) performanceIcon.click();
                    break;
                case 'discover':
                    // Open the second theme
                    const technologyIcon = document.querySelector('.desktop-icon[data-theme="technology"]');
                    if (technologyIcon) technologyIcon.click();
                    break;
                case 'connect':
                    // Open the third theme
                    const societyIcon = document.querySelector('.desktop-icon[data-theme="society"]');
                    if (societyIcon) societyIcon.click();
                    break;
            }
        });
    });
}); 