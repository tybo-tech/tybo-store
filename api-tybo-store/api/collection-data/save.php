<?php
// api/collection-data/save.php
include_once '../../config/Connection.php';
include_once '../../models/CollectionDataMutation.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->collection_id)) {
    echo json_encode(["error" => "collection_id is required"]);
    exit;
}

$Connection = new Connection();
$db = $Connection->connect();

$service = new CollectionDataMutation($db);

if (!empty($data->id)) {
    $result = $service->update(
        $data->id,
        $data->data,
        $data->parent_id ?? null
    );
} else {
    $result = $service->add(
        $data->collection_id,
        $data->data,
        $data->company_id,
        $data->parent_id ?? null
    );
}

echo json_encode($result);
