<?php
header('Content-Type: application/json');

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Response function
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST requests are allowed');
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// If JSON decode fails, try regular POST data
if (!$input) {
    $input = $_POST;
}

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    sendResponse(false, 'Missing required fields: ' . implode(', ', $missing_fields));
}

// Sanitize input data
$name = trim(htmlspecialchars($input['name']));
$email = trim(htmlspecialchars($input['email']));
$phone = trim(htmlspecialchars($input['phone']));
$message = trim(htmlspecialchars($input['message']));

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format');
}

// Validate phone number (basic validation)
if (!preg_match('/^[0-9\s\+\-\(\)]+$/', $phone)) {
    sendResponse(false, 'Invalid phone number format');
}

// Email configuration
$to = 'mh.jaf12@gmail.com';
$subject = 'New Contact Form Submission - CODIVA Website';

// Create email body
$email_body = "
New contact form submission from CODIVA website:

Name: {$name}
Email: {$email}
Phone: {$phone}

Message:
{$message}

---
Submitted at: " . date('Y-m-d H:i:s') . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "
";

// Email headers
$headers = [
    'From: CODIVA Contact Form <noreply@codiva.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

// Attempt to send email
$mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Email sent successfully from: {$email}\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    sendResponse(true, 'Thank you for your message! We will get back to you soon.', [
        'submitted_at' => date('Y-m-d H:i:s')
    ]);
} else {
    // Log failed submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Email failed to send from: {$email}\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    sendResponse(false, 'Sorry, there was an error sending your message. Please try again or contact us directly.');
}
?>