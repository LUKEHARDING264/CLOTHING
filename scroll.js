document.addEventListener('DOMContentLoaded', () => {
    const titleImage = document.querySelector('.title-image');
    
    if (titleImage) {
        titleImage.classList.add('parallax-scroll');
        titleImage.classList.add('mouse-move');
        
        // Mouse move effect
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            // Calculate rotation based on mouse position
            const rotateX = (clientY - innerHeight / 2) / innerHeight * 10;
            const rotateY = (clientX - innerWidth / 2) / innerWidth * 10;
            
            // Apply the transform
            titleImage.style.transform = `
                perspective(1000px)
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(${window.scrollY / 4}px)
            `;
        });

        // Scroll effect
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const offset = scrollPosition / 4;
            const maxOffset = 100;
            const limitedOffset = Math.min(offset, maxOffset);
            
            // Update the scroll position while maintaining the current rotation
            const currentTransform = titleImage.style.transform;
            const rotationValues = currentTransform.match(/rotateX\((.*?)\) rotateY\((.*?)\)/);
            
            if (rotationValues) {
                const [, rotateX, rotateY] = rotationValues;
                titleImage.style.transform = `
                    perspective(1000px)
                    ${rotateX ? `rotateX(${rotateX})` : ''}
                    ${rotateY ? `rotateY(${rotateY})` : ''}
                    translateY(${limitedOffset}px)
                `;
            }
        });
    }
}); 