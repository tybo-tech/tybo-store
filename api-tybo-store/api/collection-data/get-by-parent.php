<?php
// api/collection-data/get-by-parent.php
include_once '../../config/Connection.php';
include_once '../../models/CollectionDataQuery.php';

$company_id = isset($_GET['company_id']) ? $_GET['company_id'] : null;
if (!$company_id) {
    echo json_encode(["error" => "Missing or invalid company_id"]);
    exit;
}

if (!isset($_GET['parentId'])) {
    echo json_encode(["error" => "Missing or invalid parentId"]);
    exit;
}

$parentId = $_GET['parentId'];
$collectionId = isset($_GET['collectionId']) ? $_GET['collectionId'] : '';
$Connection = new Connection();
$db = $Connection->connect();

$service = new CollectionDataQuery($db);
$result = $service->getByParentId($parentId, $collectionId, $company_id);

echo json_encode($result);
