 // Hardcodierte Login-Daten
        const validCredentials = [
            { username: 'student1', password: 'pass123', role: 'student' },
            { username: 'tutor1', password: 'pass456', role: 'tutor' }
        ];

        function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
            const user = validCredentials.find(cred => 
                cred.username === username && cred.password === password
            );

            if (user) {
                // Speichere User-Infos im sessionStorage
                sessionStorage.setItem('user', JSON.stringify({
                    username: user.username,
                    role: user.role
                }));

                // Weiterleitung basierend auf der Rolle
                if (user.role === 'tutor') {
                    window.location.href = 'tutor-course-selection.html'; // Seite für Tutoren
                } else if (user.role === 'student') {
                    window.location.href = 'course-selection.html'; // Seite für Studenten
                }
            } else {
                errorMessage.style.display = 'block';
            }

            return false;
        }