// Check if user has access
function checkAccess() {
    // Don't check access on the gate page itself
    if (window.location.pathname.includes('gate.html')) {
        return;
    }

    // Check if user has the access cookie
    if (!document.cookie.includes('site_access=granted')) {
        window.location.href = 'gate.html';
    }
}

// Run access check when page loads
document.addEventListener('DOMContentLoaded', checkAccess); 