<?php
// api/categories/save.php
include_once '../../config/Connection.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->id) || empty($data->password)) {
    echo json_encode([
        "error" =>
            "Opps, Something went wrong, we could not update your password at this time."
    ]);
    exit;
}

$database = new Connection();
$db = $database->connect();

$service = new User($db);
// Check if it's an update or a new entry
$result = $service->updatePassword($data->id, $data->password);


echo json_encode($result);
