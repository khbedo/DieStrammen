window.onload = function() {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const assignmentId = sessionStorage.getItem('selectedAssignment');
            
            if (!user || !assignmentId) {
                window.location.href = 'login.html';
                return;
            }
            
            document.getElementById('username').textContent = user.username;
            loadAssignmentDetails(assignmentId);
        };

        function loadAssignmentDetails(assignmentId) {
            // Simulierte Assignment-Daten
            const assignments = {
                'A0': {
                    title: 'Assignment 0: Entwicklungsumgebung einrichten',
                    submissionDate: '2024-12-15T14:30:00',
                    grade: '92/100',
                    feedback: 'Sehr gute Implementierung...'
                }
            };

            const details = assignments[assignmentId];
            if (details) {
                document.getElementById('assignmentTitle').textContent = details.title;
                document.getElementById('submissionDate').textContent = 
                    new Date(details.submissionDate).toLocaleString();
            }
        }

        function downloadFile(filename) {
            // Hier würde die tatsächliche Download-Logik implementiert
            alert(`Download von ${filename} gestartet...`);
        }

        function logout() {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    