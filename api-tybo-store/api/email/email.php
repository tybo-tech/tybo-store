<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$data = json_decode(file_get_contents("php://input"));

if (isset($data->FromEmail, $data->ToEmail, $data->Subject, $data->Message)) {
    $FromEmail = $data->FromEmail;
    $ToEmail = $data->ToEmail;
    $Subject = $data->Subject;
    $Message = $data->Message;

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    $headers .= 'From: ' . $FromEmail . "\r\n" .
                'Reply-To: ' . $FromEmail . "\r\n" .
                'X-Mailer: PHP/' . phpversion();

    if (mail($ToEmail, $Subject, $Message, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Email sent successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send email']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Incomplete data provided']);
}
