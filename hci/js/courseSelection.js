        // Check login status
        window.onload = function() {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            document.getElementById('username').textContent = user.username;
        }

        function selectCourse(courseId) {
            // Speichere ausgewählten Kurs
            sessionStorage.setItem('selectedCourse', courseId);
            // Weiterleitung zur Assignment-Liste
            window.location.href = 'assignment-list.html';
        }

        function logout() {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }