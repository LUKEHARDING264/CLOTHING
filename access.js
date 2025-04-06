// Check if user has access
function checkAccess() {
    // Don't check access on the gate page itself
    if (window.location.pathname.includes('gate.html')) {
        return;
    }

    // Check if user has the access cookie
    if (!document.cookie.includes('site_access=granted')) {
        // Temporarily disabled gate redirect for development
        // window.location.href = 'gate.html';
        
        // Set the cookie automatically for development
        document.cookie = "site_access=granted; path=/; max-age=86400"; // 24 hours
    }
}

// Run access check when page loads
document.addEventListener('DOMContentLoaded', checkAccess); 