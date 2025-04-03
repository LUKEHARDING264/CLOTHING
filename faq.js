document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.toggle-icon');

        question.addEventListener('click', () => {
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.toggle-icon').textContent = '+';
                }
            });

            // Toggle current answer
            const isOpen = answer.style.maxHeight;
            answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
            toggleIcon.textContent = isOpen ? '+' : '−';
        });
    });
}); 