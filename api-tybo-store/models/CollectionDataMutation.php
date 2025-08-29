<?php
require_once 'CollectionDataQuery.php';
class CollectionDataMutation
{
    private $conn;
    private CollectionDataQuery $collectionDataQuery;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->collectionDataQuery = new CollectionDataQuery($db);
    }

    // Add a new data entry
    public function add($collectionId, $data,$company_id, $parentId = null)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        $query = "INSERT INTO collection_data (collection_id, parent_id, data,company_id) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId, $parentId, json_encode($data), $company_id]);
        return $stmt->rowCount() ?
            $this->collectionDataQuery->getById($this->conn->lastInsertId()) :
            false;
    }

    // Add multiple records
 public function addMany($items)
{
    $results = [];

    foreach ($items as $item) {
        // Validate required properties
        if (!isset($item->collection_id) || !isset($item->data)) {
            continue;
        }

        $data = $this->sanitizeDataBeforeSave((object) $item->data);

        $query = "INSERT INTO collection_data (collection_id, parent_id, data) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $item->collection_id,
            $item->parent_id ?? null,
            json_encode($data),
        ]);

        if ($stmt->rowCount()) {
            $results[] = $this->collectionDataQuery->getById($this->conn->lastInsertId());
        }
    }

    return $results;
}


    // Update a data entry
    public function update($id, $data, $parentId = null)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        if ($parentId !== null) {
            $query = "UPDATE collection_data SET data = ?, parent_id = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([json_encode($data), $parentId, $id]);
        } else {
            $query = "UPDATE collection_data SET data = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([json_encode($data), $id]);
        }
        return $stmt->rowCount() ?
            $this->collectionDataQuery->getById($id) :
            false;
    }


    // Update multiple records
    public function updateMany($ids, $data)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        $query = "UPDATE collection_data SET data = ? WHERE id IN (" . implode(',', array_fill(0, count($ids), '?')) . ")";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(array_merge([json_encode($data)], $ids));
        return $stmt->rowCount();
    }

    // Delete a data entry by ID
    public function remove($id)
    {
        $query = "DELETE FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }

    // Delete all data entries for a specific collection
    public function removeByCollectionId($collectionId)
    {
        $query = "DELETE FROM collection_data WHERE collection_id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$collectionId]);
    }

    // ------------------------------------------
    // Private helper: clean expanded data fields
    // ------------------------------------------
    private function sanitizeDataBeforeSave(object $data): object
    {
        foreach ($data as $key => $value) {
            if (strpos($key, '_') === 0) {
                unset($data->$key);
            }
        }
        return $data;
    }
}
?>