// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const loginBox = document.getElementById('loginBox');
        const loginBackground = document.getElementById('loginBackground');
        
        if (loadingScreen && loginBox && loginBackground) {
            loadingScreen.style.display = 'none';
            loginBox.style.display = 'block';
            loginBackground.style.display = 'block';
        } else {
            console.error('Loading screen elements not found');
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
                    setupProfileDropdown(); // Add dropdown functionality
                } else {
                    console.error('Portal elements not found');
                }
            } else {
                alert('Invalid credentials. Please try again.');
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
    }

    // Render the circular attendance chart using Chart.js
    function renderAttendanceChart() {
        const ctx = document.getElementById('attendanceChart')?.getContext('2d');
        if (!ctx) {
            console.error('Attendance chart canvas not found');
            return;
        }

        const percentages = document.querySelectorAll('.attendance-progress');
        const total = Array.from(percentages).reduce((sum, bar) => {
            const percentage = parseInt(bar.getAttribute('data-percentage')) || 0;
            return sum + percentage;
        }, 0);
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
    }

    // Set the width of attendance progress bars
    function setAttendanceProgressBars() {
        const progressBars = document.querySelectorAll('.attendance-progress');
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            if (percentage) {
                bar.style.width = `${percentage}%`;
            }
        });
    }

    // Populate the notice board with sample notices
    function populateNoticeBoard() {
        const noticeList = document.querySelector('.notice-list');
        if (!noticeList) {
            console.error('Notice list not found');
            return;
        }

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
    }

    // Setup navigation between pages
    function setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const dashboard = document.querySelector('.dashboard');
        const coursesPage = document.querySelector('.courses-page');
        const assignmentsPage = document.querySelector('.assignments-page');

        if (!dashboard || !coursesPage || !assignmentsPage) {
            console.error('Navigation pages not found');
            return;
        }

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const page = item.querySelector('.menu-text')?.textContent.toLowerCase();
                dashboard.classList.remove('active');
                coursesPage.classList.remove('active');
                assignmentsPage.classList.remove('active');

                if (page === 'dashboard') {
                    dashboard.classList.add('active');
                } else if (page === 'courses') {
                    coursesPage.classList.add('active');
                } else if (page === 'assignments') {
                    assignmentsPage.classList.add('active');
                }
            });
        });

        dashboard.classList.add('active');
    }

    // Populate profile with JSON data
    function populateProfile(student) {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userId = document.getElementById('userId');
        const userEmail = document.getElementById('userEmail');
        const userProgram = document.getElementById('userProgram');
        const userYear = document.getElementById('userYear');

        if (!userAvatar || !userName || !userId || !userEmail || !userProgram || !userYear) {
            console.error('Profile elements not found');
            return;
        }

        const initials = student.firstName[0] + student.lastName[0];
        userAvatar.textContent = initials;
        userName.textContent = `${student.firstName} ${student.lastName}`;
        userId.textContent = student.id;
        userEmail.textContent = student.email;
        userProgram.textContent = student.program;
        userYear.textContent = student.year;
    }

    // Setup profile dropdown toggle
    function setupProfileDropdown() {
        const avatar = document.querySelector('.avatar');
        const profileDropdown = document.getElementById('profileDropdown');

        if (!avatar || !profileDropdown) {
            console.error('Avatar or profile dropdown not found');
            return;
        }

        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.style.display = 
                profileDropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            if (!avatar.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }
});
