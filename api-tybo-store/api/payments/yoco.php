<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');
$apiUrl = 'https://payments.yoco.com/api/checkouts';
$secretKey = $_GET['key'];
$cancelUrl = $_GET['cancelUrl'];
$successUrl = $_GET['successUrl'];
$amount = $_GET['amount'];

$requestData = array(
    'amount' => $amount,
    'successUrl' => $successUrl,
    'cancelUrl' => $cancelUrl,
    'secretKey' => $secretKey,
    'currency' => 'ZAR'
);
// echo json_encode($requestData);
// return;

$headers = array(
    'Content-Type: application/json',
    'Authorization: Bearer ' . $secretKey
);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);

if ($response === false) {
    $error["Error"] = 'cURL error: ' . curl_error($ch);
    echo json_encode($error);
} else {
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode === 200) {
        echo $response;
    } else {
        $error["Error"] = 'Payment Failed. HTTP Status Code: ' . $httpCode;
        $error["Response"] =  json_decode($response, true);
        echo json_encode($error);
    }
}

curl_close($ch);
?>
