<?php
// Database configuration
$host = 'localhost';
$dbname = 'technova_portal'; // Reverted to original database name
$username = 'root';
$password = ''; // Leave empty if no password is set in XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Placeholder for student data (to be replaced with session/auth data later)
$studentData = [
    'id' => 'JS2025',
    'full_name' => 'John Smith',
    'email' => 'john.smith@technova.edu'
];

// Handle form submission
$message = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_id = $_POST['student-id'] ?? '';
    $full_name = $_POST['full-name'] ?? '';
    $email = $_POST['email'] ?? '';
    $exam_type = $_POST['exam-type'] ?? '';
    $exam_date = $_POST['exam-date'] ?? '';
    $exam_center = $_POST['exam-center'] ?? '';

    // Basic validation
    if (empty($student_id) || empty($full_name) || empty($email) || empty($exam_type) || empty($exam_date) || empty($exam_center)) {
        $message = '<span style="color: var(--danger);">Please fill in all required fields.</span>';
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO exam_applications (student_id, full_name, email, exam_type, exam_date, exam_center) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$student_id, $full_name, $email, $exam_type, $exam_date, $exam_center]);
            $message = '<span style="color: var(--success);">Application submitted successfully!</span>';
        } catch (PDOException $e) {
            $message = '<span style="color: var(--danger);">Error submitting application: ' . $e->getMessage() . '</span>';
        }
    }
}

// Fetch all submissions for backend view
$submissions = $pdo->query("SELECT * FROM exam_applications ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exam Application - TechNova</title>
    <link rel="stylesheet" href="css/styles.css">
    <style>
        .submissions-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .submissions-table th, .submissions-table td {
            padding: 10px;
            border: 1px solid rgba(0, 183, 217, 0.1);
            text-align: left;
            color: #ffffff;
        }
        .submissions-table th {
            background: rgba(0, 183, 217, 0.2);
        }
        .submissions-table tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.05);
        }
        .view-submissions-btn {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(90deg, #6b48ff, #af56ff);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 1rem;
            transition: background 0.3s;
            margin-top: 20px;
        }
        .view-submissions-btn:hover {
            background: linear-gradient(90deg, #5a3ee6, #9d4ae6);
        }
        .submissions-section {
            display: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="exam-application-page active">
        <div class="exam-application-header">
            <h2 class="exam-application-title">Exam Application</h2>
        </div>
        <div class="exam-application-content">
            <form id="examApplicationForm" method="POST" action="examapp.php">
                <div class="form-group">
                    <label for="student-id">Student ID</label>
                    <input type="text" id="student-id" name="student-id" value="<?php echo htmlspecialchars($studentData['id']); ?>" readonly>
                </div>
                <div class="form-group">
                    <label for="full-name">Full Name</label>
                    <input type="text" id="full-name" name="full-name" value="<?php echo htmlspecialchars($studentData['full_name']); ?>" readonly>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($studentData['email']); ?>" readonly>
                </div>
                <div class="form-group">
                    <label for="exam-type">Exam Type *</label>
                    <select id="exam-type" name="exam-type" required>
                        <option value="" disabled <?php echo !isset($_POST['exam-type']) ? 'selected' : ''; ?>>Select Exam Type</option>
                        <option value="Midterm" <?php echo isset($_POST['exam-type']) && $_POST['exam-type'] === 'Midterm' ? 'selected' : ''; ?>>Midterm</option>
                        <option value="Final" <?php echo isset($_POST['exam-type']) && $_POST['exam-type'] === 'Final' ? 'selected' : ''; ?>>Final</option>
                        <option value="Supplementary" <?php echo isset($_POST['exam-type']) && $_POST['exam-type'] === 'Supplementary' ? 'selected' : ''; ?>>Supplementary</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="exam-date">Exam Date *</label>
                    <input type="date" id="exam-date" name="exam-date" value="<?php echo isset($_POST['exam-date']) ? htmlspecialchars($_POST['exam-date']) : ''; ?>" required>
                </div>
                <div class="form-group">
                    <label for="exam-center">Exam Center *</label>
                    <select id="exam-center" name="exam-center" required>
                        <option value="" disabled <?php echo !isset($_POST['exam-center']) ? 'selected' : ''; ?>>Select Exam Center</option>
                        <option value="Main Campus" <?php echo isset($_POST['exam-center']) && $_POST['exam-center'] === 'Main Campus' ? 'selected' : ''; ?>>Main Campus</option>
                        <option value="Downtown Campus" <?php echo isset($_POST['exam-center']) && $_POST['exam-center'] === 'Downtown Campus' ? 'selected' : ''; ?>>Downtown Campus</option>
                    </select>
                </div>
                <button type="submit">Submit Application</button>
            </form>
            <div id="message"><?php echo $message; ?></div>
            <a href="basic.html" class="course-action-btn" style="margin-top: 20px; display: inline-block;">Back to Portal</a>
            <a href="#" class="view-submissions-btn" onclick="toggleSubmissions(event)">View Submissions</a>
            <div class="submissions-section" id="submissionsSection">
                <table class="submissions-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Exam Type</th>
                            <th>Exam Date</th>
                            <th>Exam Center</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($submissions as $submission): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($submission['id']); ?></td>
                            <td><?php echo htmlspecialchars($submission['student_id']); ?></td>
                            <td><?php echo htmlspecialchars($submission['full_name']); ?></td>
                            <td><?php echo htmlspecialchars($submission['email']); ?></td>
                            <td><?php echo htmlspecialchars($submission['exam_type']); ?></td>
                            <td><?php echo htmlspecialchars($submission['exam_date']); ?></td>
                            <td><?php echo htmlspecialchars($submission['exam_center']); ?></td>
                            <td><?php echo htmlspecialchars($submission['created_at']); ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script>
        function toggleSubmissions(event) {
            event.preventDefault();
            const section = document.getElementById('submissionsSection');
            section.style.display = section.style.display === 'block' ? 'none' : 'block';
        }
    </script>
</body>
</html>
