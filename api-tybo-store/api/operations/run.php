<?php
include_once '../../config/Connection.php';
include_once '../../models/Crud.php';

// include_once '../../models/Authenticator.php';

$connection = new Connection();
// $authenticator = new Authenticator($connection);

// // Perform authentication
// $authenticator->authenticate();
$db = $connection->connect();

$crud = new Crud($db);

$data = json_decode(file_get_contents("php://input"));

if ($data && isset($data->operation) && isset($data->table) && isset($data->data)) {
    $operation = $data->operation;
    $company_id = $data->company_id ?? 10;
    $table = $data->table;
    $pageId = isset($data->pageId) ? $data->pageId : null;
    $crudData = (array) $data->data;

    switch ($operation) {
        case 'add':
            $result = $crud->add($table, $crudData);
            break;
        case 'get':
            if (isset($crudData['includes'])) {
                // If includes property is present, fetch children
                $result = $crud->getWithChildren($table, $crudData['id'], $crudData['includes']);
            } else {
                // Otherwise, fetch only the main record
                $result = $crud->get($table, $crudData['id']);
            }
            break;
        case 'website-get':

            $result = $crud->getCompanyForWebsite($crudData['id'], $pageId);
            break;
        case 'get-children':
            $result = $crud->getAllChildren($table, $crudData['col'], $crudData['id']);
            break;
        case 'update':
            $result = $crud->update($table, $crudData['id'], $crudData);
            break;
        case 'delete':
            $result = $crud->delete($table, $crudData['id']);
            break;
        case 'list':
            $result = $crud->getAll($company_id ,$table, $crudData['includes'] ?? [], $crudData['show_in_nav'] ?? 0, $crudData['parent_ony'] ?? 0);
            break;
        case 'radius':
            $result = $crud->searchRestaurantsByRadius($company_id ,$crudData['latitude'], $crudData['longitude'], $crudData['radius']);
            break;
        default:
            $result = ['error' => 'Invalid operation'];
            break;
    }

    echo json_encode($result);
} else {
    echo json_encode(['error' => 'Invalid input data']);
}
?>