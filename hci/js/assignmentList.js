 // Check login status and load course info
        window.onload = function() {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const courseId = sessionStorage.getItem('selectedCourse');
            
            if (!user || !courseId) {
                window.location.href = 'login.html';
                return;
            }
            
            document.getElementById('username').textContent = user.username;
            document.getElementById('courseName').textContent = getCourseTitle(courseId);
        }

        function getCourseTitle(courseId) {
            const courses = {
                'CS101': 'Programmierung 1',
                'CS102': 'Datenbanken'
            };
            return courses[courseId] || 'Unbekannter Kurs';
        }

        function goToSubmission(assignmentId) {
            sessionStorage.setItem('selectedAssignment', assignmentId);
            window.location.href = 'assignment-submission.html';
        }

        function viewSubmission(assignmentId) {
            sessionStorage.setItem('selectedAssignment', assignmentId);
            window.location.href = 'assignment-details.html';
        }

        function logout() {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    