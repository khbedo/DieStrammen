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
                
                // Weiterleitung zur Kursauswahl
                window.location.href = 'course-selection.html';
            } else {
                errorMessage.style.display = 'block';
            }

            return false;
        }