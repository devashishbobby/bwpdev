<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

// Sample quiz questions for "English for Engineers"
$questions = [
    [
        'question' => 'What is the primary purpose of a technical report?',
        'options' => [
            'A) To entertain the reader',
            'B) To convey technical information clearly',
            'C) To persuade without evidence',
            'D) To summarize fictional stories'
        ],
        'correct' => 'B'
    ],
    [
        'question' => 'Which of the following is a key component of a technical proposal?',
        'options' => [
            'A) Problem statement',
            'B) Personal anecdotes',
            'C) Fictional narrative',
            'D) Casual language'
        ],
        'correct' => 'A'
    ],
    [
        'question' => 'What does the term "jargon" refer to in technical communication?',
        'options' => [
            'A) Everyday language',
            'B) Specialized terminology',
            'C) Informal slang',
            'D) Emotional expressions'
        ],
        'correct' => 'B'
    ],
    [
        'question' => 'Which section of a report typically includes data analysis?',
        'options' => [
            'A) Introduction',
            'B) Methodology',
            'C) Results',
            'D) Conclusion'
        ],
        'correct' => 'C'
    ],
    [
        'question' => 'What is the purpose of an executive summary?',
        'options' => [
            'A) To provide detailed data tables',
            'B) To give a brief overview of the report',
            'C) To list all references',
            'D) To include raw data'
        ],
        'correct' => 'B'
    ],
    [
        'question' => 'Which tone is most appropriate for technical writing?',
        'options' => [
            'A) Informal and conversational',
            'B) Objective and formal',
            'C) Emotional and persuasive',
            'D) Humorous and casual'
        ],
        'correct' => 'B'
    ],
    [
        'question' => 'What is a common way to structure an email to a colleague?',
        'options' => [
            'A) Greeting, body, closing',
            'B) Body only',
            'C) Closing, body, greeting',
            'D) Subject only'
        ],
        'correct' => 'A'
    ],
    [
        'question' => 'What does "conciseness" mean in technical writing?',
        'options' => [
            'A) Using complex vocabulary',
            'B) Being brief yet clear',
            'C) Adding unnecessary details',
            'D) Writing lengthy paragraphs'
        ],
        'correct' => 'B'
    ],
    [
        'question' => 'Which visual aid is best for showing trends over time?',
        'options' => [
            'A) Pie chart',
            'B) Bar graph',
            'C) Line graph',
            'D) Table'
        ],
        'correct' => 'C'
    ],
    [
        'question' => 'Why is audience analysis important in technical communication?',
        'options' => [
            'A) To use more jargon',
            'B) To tailor content to the reader’s needs',
            'C) To make the document longer',
            'D) To avoid clarity'
        ],
        'correct' => 'B'
    ]
];

// Initialize session variables
if (!isset($_SESSION['score'])) {
    $_SESSION['score'] = 0;
    $_SESSION['question_index'] = 0;
    echo "Session initialized<br>"; // Debug
} else {
    echo "Session exists, score: " . $_SESSION['score'] . ", index: " . $_SESSION['question_index'] . "<br>"; // Debug
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_option = isset($_POST['answer']) ? $_POST['answer'] : '';
    $current_index = $_SESSION['question_index'];

    echo "Submitted answer: $selected_option, Current index: $current_index<br>"; // Debug

    if ($selected_option === $questions[$current_index]['correct']) {
        $_SESSION['score']++;
        echo "Correct answer! New score: " . $_SESSION['score'] . "<br>"; // Debug
    }

    $_SESSION['question_index']++;

    if ($_SESSION['question_index'] >= count($questions)) {
        $final_score = $_SESSION['score'];
        $total_questions = count($questions);
        $_SESSION['score'] = 0;
        $_SESSION['question_index'] = 0;
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quiz Result</title>
            <link rel="stylesheet" href="css/styles.css"> <!-- Relative to bwpm2 -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="quiz-page active"> <!-- Ensure quiz-page is active -->
                <div class="quiz-result">
                    <h2>Quiz Completed!</h2>
                    <p>Your Score: <?php echo $final_score; ?> / <?php echo $total_questions; ?></p>
                    <a href="quiz.php" class="course-action-btn">Try Again</a>
                    <a href="basic.html" class="go-home-btn">Go Back to Home</a> <!-- Updated to basic.html -->
                </div>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
    header("Location: quiz.php");
    exit;
}

$current_index = $_SESSION['question_index'];
if (!isset($questions[$current_index])) {
    echo "Error: Question index out of bounds. Index: $current_index, Total questions: " . count($questions) . "<br>";
    exit;
}
$current_question = $questions[$current_index];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechNova Engineering University Portal - Quiz</title>
    <link rel="stylesheet" href="css/styles.css"> <!-- Relative to bwpm2 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <?php if (file_exists('js/script.js')): ?>
        <script src="js/script.js"></script> <!-- Relative to bwpm2 -->
    <?php endif; ?>
</head>
<body>
    <div class="quiz-page active"> <!-- 'active' class ensures visibility -->
        <div class="quiz-header">
            <h2 class="quiz-title">English for Engineers Quiz</h2>
            <div class="quiz-progress">Question <?php echo $current_index + 1; ?> of <?php echo count($questions); ?></div>
        </div>
        <div class="quiz-content">
            <form method="POST" action="quiz.php">
                <div class="quiz-question">
                    <h3><?php echo htmlspecialchars($current_question['question']); ?></h3>
                    <?php foreach ($current_question['options'] as $option): ?>
                        <label class="quiz-option">
                            <input type="radio" name="answer" value="<?php echo htmlspecialchars(substr($option, 0, 1)); ?>" required>
                            <?php echo htmlspecialchars($option); ?>
                        </label><br>
                    <?php endforeach; ?>
                </div>
                <button type="submit" class="course-action-btn">Submit Answer</button>
            </form>
        </div>
    </div>
</body>
</html>
