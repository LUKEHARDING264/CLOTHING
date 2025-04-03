document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const affiliateForm = document.getElementById('affiliateForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your server
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    affiliateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your server
        alert('Thank you for your affiliate application! We will review it and get back to you soon.');
        affiliateForm.reset();
    });
}); 