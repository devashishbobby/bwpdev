// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('loginBox').style.display = 'block';
        document.getElementById('loginBackground').style.display = 'block';
    }, 3000);

    // Handle login
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple validation (you can replace this with actual authentication)
        if (username === 'js2025' && password === 'password') {
            document.getElementById('loginBox').style.display = 'none';
            document.getElementById('loginBackground').style.display = 'none';
            document.getElementById('portalContainer').style.display = 'block';
            initializeDashboard();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    // Initialize dashboard after login
    function initializeDashboard() {
        // Render attendance chart
        renderAttendanceChart();

        // Set attendance progress bars
        setAttendanceProgressBars();

        // Populate notice board
        populateNoticeBoard();
    }

    // Render the circular attendance chart using Chart.js
    function renderAttendanceChart() {
        const ctx = document.getElementById('attendanceChart').getContext('2d');
        // Calculate average attendance from subject data
        const percentages = document.querySelectorAll('.attendance-progress');
        const total = Array.from(percentages).reduce((sum, bar) => sum + parseInt(bar.getAttribute('data-percentage')), 0);
        const overallAttendance = Math.round(total / percentages.length);
    
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [overallAttendance, 100 - overallAttendance],
                    backgroundColor: ['#02d8ff', 'rgba(255, 255, 255, 0.1)'],
                    borderWidth: 0,
                    circumference: 360,
                    cutout: '80%',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            },
            plugins: [{
                id: 'textCenter',
                beforeDraw: function(chart) {
                    const width = chart.width;
                    const height = chart.height;
                    const ctx = chart.ctx;
                    ctx.restore();
                    const fontSize = (height / 114).toFixed(2);
                    ctx.font = `${fontSize}em sans-serif`;
                    ctx.textBaseline = "middle";
                    const text = `${overallAttendance}%`;
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2;
                    ctx.fillStyle = '#ffffff';
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
            bar.style.width = `${percentage}%`;
        });
    }

    // Populate the notice board with sample notices
    function populateNoticeBoard() {
        const noticeList = document.querySelector('.notice-list');
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
});
