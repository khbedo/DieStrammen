        window.onload = function() {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                // Redirect to course selection if already logged in
                window.location.href = 'course-selection.html';
            }
        }