<?php
include_once 'Database.php';
class Crud extends Database
{
    public function add($table, $model)
    {
        $model = $this->encodeMetadata($model);

        $columns = implode(", ", array_keys((array) $model));
        $placeholders = ":" . implode(", :", array_keys((array) $model));

        $query = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        $this->executeQuery($query, (array) $model);

        // Fetch the inserted record and return it
        $id = $this->_conn->lastInsertId();
        return $this->get($table, $id);
    }

    public function update($table, $id, $model)
    {
        $model = $this->encodeMetadata($model);

        $updateString = "";
        foreach ($model as $key => $value) {
            $updateString .= "$key = :$key, ";
        }
        $updateString = rtrim($updateString, ', ');

        $query = "UPDATE $table SET $updateString WHERE id = :id";
        $model['id'] = $id;

        $this->executeQuery($query, $model);

        // Fetch the updated record and return it
        return $this->get($table, $id);
    }

    public function get($table, $id)
    {
        $query = "SELECT * FROM $table WHERE id = :id";
        $params = [':id' => $id];
        $result = $this->executeQuery($query, $params)->fetch(PDO::FETCH_ASSOC);

        // Check for metadata column and decode if necessary
        $result = $this->decodeMetadata($result);

        return $result;
    }

    public function getAll($company_id, $table, $includes = [], $show_in_nav = 0, $parent_ony = 0)
    {

        $query = "SELECT * FROM $table where company_id = '$company_id'";
        if ($show_in_nav == 1) {
            $query = "SELECT * FROM $table WHERE show_in_nav = 1 AND company_id = '$company_id'";
        }
        if ($parent_ony == 1) {
            $query = "SELECT * FROM $table WHERE (parent_id = 0 OR parent_id IS NULL) AND company_id = '$company_id'";
        }
        $results = $this->executeQuery($query)->fetchAll(PDO::FETCH_ASSOC);

        // Check for metadata column and decode if necessary
        foreach ($results as &$result) {
            $result = $this->decodeMetadata($result);
            if (count($includes) > 0) {
                foreach ($includes as $include) {
                    $childTable = $include->tableName;
                    $childColumn = $include->columnName;
                    $result[$childTable] = $this->getAllChildren($childTable, $childColumn, $result['id']);
                }
            }
        }

        return $results;
    }

    public function getAllChildren($table, $col, $id)
    {
        $query = "SELECT * FROM $table  WHERE $col = :id";
        $params = [':id' => $id];
        $results = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);

        // Check for metadata column and decode if necessary
        foreach ($results as &$result) {
            $result = $this->decodeMetadata($result);
        }

        return $results;
    }

    function getCompanyForWebsite($id, $pageId = null)
    {
        $query = "SELECT * FROM companies WHERE id = :id or slug = :id";

        $params = [':id' => $id];
        $result = $this->executeQuery($query, $params)->fetch(PDO::FETCH_ASSOC);

        if (!$result)
            return null;

        $result = $this->decodeMetadata($result);

        if ($pageId) {
            if (!class_exists('CollectionDataQuery')) {
                require_once 'CollectionDataQuery.php';
            }
            $collectionDataQuery = new CollectionDataQuery($this->_conn);
            $result['pageContent'] = $collectionDataQuery->getByParentId(
                $pageId,
                'page',
                $result['id'],
            );
        }

        return $result;
    }


    public function getWithChildren($table, $id, $includes)
    {
        $mainRecord = $this->get($table, $id);

        foreach ($includes as $include) {
            $childTable = $include->tableName;
            $childColumn = $include->columnName;
            $mainRecord[$childTable] = $this->getAllChildren($childTable, $childColumn, $id);
        }

        return $mainRecord;
    }

    public function delete($table, $id)
    {
        $query = "DELETE FROM $table WHERE id = :id";
        $params = [':id' => $id];
        $this->executeQuery($query, $params);
        return ['deleted' => $id];
    }

    public function searchRestaurantsByRadius($company_id, $userLat, $userLng, $radius)
    {
        $restaurants = $this->getAll($company_id, "companies");
        $result = [];

        foreach ($restaurants as $restaurant) {
            $restaurantLat = $restaurant['latitude'];
            $restaurantLng = $restaurant['longitude'];

            $distance = $this->haversineDistance($userLat, $userLng, $restaurantLat, $restaurantLng);

            if ($distance <= $radius) {
                $result[] = $restaurant;
            }
        }

        return $result;
    }

    private function encodeMetadata($model)
    {
        if (isset($model['metadata'])) {
            $model['metadata'] = json_encode($model['metadata']);
        }

        return $model;
    }

    private function decodeMetadata($result)
    {
        if (isset($result['metadata'])) {
            $result['metadata'] = json_decode($result['metadata'], true);
        }

        return $result;
    }

    function haversineDistance($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) * sin($dLng / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c;

        return $distance;
    }

    function myCompanies($owner_id)
    {
        $query = "SELECT 
        slug,
        id,
        name,
        description,
        logo
         FROM companies WHERE owner_id = :owner_id";
        $params = [':owner_id' => $owner_id];
        $results = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);

        // Check for metadata column and decode if necessary
        foreach ($results as &$result) {
            $result = $this->decodeMetadata($result);
        }

        return $results;
    }
}