// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, starting setup');

    // Simulate loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const loginBox = document.getElementById('loginBox');
        const loginBackground = document.getElementById('loginBackground');
        
        if (loadingScreen && loginBox && loginBackground) {
            loadingScreen.style.display = 'none';
            loginBox.style.display = 'block';
            loginBackground.style.display = 'block';
            console.log('Loading screen hidden, login shown');
        } else {
            console.error('Loading screen or login elements missing:', {
                loadingScreen: !!loadingScreen,
                loginBox: !!loginBox,
                loginBackground: !!loginBackground
            });
        }
    }, 3000);

    // Sample JSON data for student profile
    const studentData = {
        student: {
            id: 'JS2025',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@technova.edu',
            program: 'B.Tech in Mechanical Engineering',
            year: '2025'
        }
    };

    // Handle login
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;

            console.log('Login attempted with:', { username, password });

            if (username === 'js2025' && password === 'password') {
                const loginBox = document.getElementById('loginBox');
                const loginBackground = document.getElementById('loginBackground');
                const portalContainer = document.getElementById('portalContainer');

                if (loginBox && loginBackground && portalContainer) {
                    loginBox.style.display = 'none';
                    loginBackground.style.display = 'none';
                    portalContainer.style.display = 'block';
                    initializeDashboard();
                    setupNavigation();
                    populateProfile(studentData.student);
                    setupProfileDropdown();
                    console.log('Login successful, portal loaded');
                } else {
                    console.error('Portal elements missing:', {
                        loginBox: !!loginBox,
                        loginBackground: !!loginBackground,
                        portalContainer: !!portalContainer
                    });
                }
            } else {
                alert('Invalid credentials. Please try again.');
                console.log('Login failed');
            }
        });
    } else {
        console.error('Login button not found');
    }

    // Initialize dashboard after login
    function initializeDashboard() {
        renderAttendanceChart();
        setAttendanceProgressBars();
        populateNoticeBoard();
        console.log('Dashboard initialized');
    }

    // Render the circular attendance chart using Chart.js
    function renderAttendanceChart() {
        const ctx = document.getElementById('attendanceChart')?.getContext('2d');
        if (ctx) {
            const percentages = document.querySelectorAll('.attendance-progress');
            const total = Array.from(percentages).reduce((sum, bar) => sum + (parseInt(bar.getAttribute('data-percentage')) || 0), 0);
            const overallAttendance = percentages.length > 0 ? Math.round(total / percentages.length) : 0;

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [overallAttendance, 100 - overallAttendance],
                        backgroundColor: ['#02d8ff', 'rgba(255, 255, 255, 0.1)'],
                        borderWidth: 0,
                        circumference: 360,
                        cutout: '80%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                },
                plugins: [{
                    id: 'textCenter',
                    beforeDraw: function(chart) {
                        const { width, height, ctx } = chart;
                        ctx.restore();
                        const fontSize = (height / 114).toFixed(2);
                        ctx.font = `${fontSize}em sans-serif`;
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#ffffff';
                        const text = `${overallAttendance}%`;
                        const textX = Math.round((width - ctx.measureText(text).width) / 2);
                        const textY = height / 2;
                        ctx.fillText(text, textX, textY);
                        ctx.save();
                    }
                }]
            });
            console.log('Attendance chart rendered');
        } else {
            console.error('Attendance chart canvas not found');
        }
    }

    // Set the width of attendance progress bars
    function setAttendanceProgressBars() {
        const progressBars = document.querySelectorAll('.attendance-progress');
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            if (percentage) bar.style.width = `${percentage}%`;
        });
        console.log('Progress bars set');
    }

    // Populate the notice board with sample notices
    function populateNoticeBoard() {
        const noticeList = document.querySelector('.notice-list');
        if (noticeList) {
            const notices = [
                { title: 'Physics Exam', content: 'Exam scheduled for next week.', progress: 60 },
                { title: 'Math Assignment', content: 'Submit by Friday.', progress: 80 },
                { title: 'Mechanics Project', content: 'Group project due in 2 weeks.', progress: 45 },
                { title: 'English Presentation', content: 'Prepare for next class.', progress: 70 }
            ];

            notices.forEach(notice => {
                const noticeItem = document.createElement('div');
                noticeItem.classList.add('notice-item');
                noticeItem.innerHTML = `
                    <div class="notice-content">
                        <h4>${notice.title}</h4>
                        <p>${notice.content}</p>
                    </div>
                    <div class="notice-progress-container">
                        <div class="notice-progress" style="width: ${notice.progress}%"></div>
                        <span class="notice-percentage">${notice.progress}%</span>
                    </div>
                `;
                noticeList.appendChild(noticeItem);
            });
            console.log('Notice board populated');
        } else {
            console.error('Notice list not found');
        }
    }

    // Setup navigation between pages
    function setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const dashboard = document.querySelector('.dashboard');
        const coursesPage = document.querySelector('.courses-page');
        const assignmentsPage = document.querySelector('.assignments-page');
        const quizPage = document.querySelector('.quiz-page');
        const gradesPage = document.querySelector('.grades-page');
        const examApplicationPage = document.querySelector('.exam-application-page');
    
        if (!dashboard || !coursesPage || !assignmentsPage || !quizPage || !gradesPage || !examApplicationPage) {
            console.error('Navigation pages not found:', {
                dashboard: !!dashboard,
                coursesPage: !!coursesPage,
                assignmentsPage: !!assignmentsPage,
                quizPage: !!quizPage,
                gradesPage: !!gradesPage,
                examApplicationPage: !!examApplicationPage
            });
            return;
        }
    
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Click detected on:', item.querySelector('.menu-text').textContent);
    
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
    
                dashboard.classList.remove('active');
                coursesPage.classList.remove('active');
                assignmentsPage.classList.remove('active');
                quizPage.classList.remove('active');
                gradesPage.classList.remove('active');
                examApplicationPage.classList.remove('active');
    
                const page = item.getAttribute('data-page');
                console.log('Attempting to switch to:', page);
                if (page === 'dashboard') {
                    console.log('Switching to Dashboard');
                    dashboard.classList.add('active');
                } else if (page === 'courses') {
                    console.log('Switching to Courses');
                    coursesPage.classList.add('active');
                } else if (page === 'assignments') {
                    console.log('Switching to Assignments');
                    assignmentsPage.classList.add('active');
                } else if (page === 'grades') {
                    console.log('Switching to Grades');
                    gradesPage.classList.add('active');
                } else if (page === 'quiz') {
                    console.log('Attempting to load quiz content from quiz.php');
                    fetch('quiz.php')
                        .then(response => response.text())
                        .then(html => {
                            quizPage.innerHTML = html;
                            quizPage.classList.add('active');
                            console.log('Quiz content loaded dynamically');
                        })
                        .catch(error => {
                            console.error('Failed to load quiz.php:', error);
                            window.location.href = 'quiz.php'; // Fallback redirect
                        });
                } else if (page === 'exam-application') {
                    console.log('Switching to Exam Application');
                    examApplicationPage.classList.add('active');
                }
            });
        });
    
        dashboard.classList.add('active');
        console.log('Initial navigation set to Dashboard');
    }

    // Populate profile with JSON data
    function populateProfile(student) {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userId = document.getElementById('userId');
        const userEmail = document.getElementById('userEmail');
        const userProgram = document.getElementById('userProgram');
        const userYear = document.getElementById('userYear');

        if (userAvatar && userName && userId && userEmail && userProgram && userYear) {
            const initials = student.firstName[0] + student.lastName[0];
            userAvatar.textContent = initials;
            userName.textContent = `${student.firstName} ${student.lastName}`;
            userId.textContent = student.id;
            userEmail.textContent = student.email;
            userProgram.textContent = student.program;
            userYear.textContent = student.year;
            console.log('Profile populated with:', student);
        } else {
            console.error('Profile elements missing:', {
                userAvatar: !!userAvatar,
                userName: !!userName,
                userId: !!userId,
                userEmail: !!userEmail,
                userProgram: !!userProgram,
                userYear: !!userYear
            });
        }
    }

    // Setup profile dropdown toggle
    function setupProfileDropdown() {
        const avatar = document.querySelector('.avatar');
        const profileDropdown = document.getElementById('profileDropdown');

        if (avatar && profileDropdown) {
            avatar.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
                console.log('Profile dropdown toggled');
            });

            document.addEventListener('click', (event) => {
                if (!avatar.contains(event.target) && !profileDropdown.contains(event.target)) {
                    profileDropdown.style.display = 'none';
                    console.log('Profile dropdown closed');
                }
            });
        } else {
            console.error('Avatar or profile dropdown missing:', {
                avatar: !!avatar,
                profileDropdown: !!profileDropdown
            });
        }
    }
});
