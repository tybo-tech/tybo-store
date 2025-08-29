<?php

class CollectionDataQuery
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * Get a single item by its ID.
     */
    public function getById(int $id): ?array
    {
        $query = "SELECT * FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        return $item ? $this->decode($item) : null;
    }

    /**
     * Get all items by collection name (formerly collection_id).
     */
    public function getAllByCollectionName(string $collectionName): array
    {
        $query = "SELECT * FROM collection_data WHERE collection_id = ? ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionName]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'decode'], $items);
    }

    /**
     * Get all items by their parent_id.
     */
    public function getByParentId($parentId, $collectionId, $company_id): array
    {
        $query = "SELECT * FROM collection_data WHERE parent_id = ? and collection_id = ? and company_id = ? ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$parentId, $collectionId, $company_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'decode'], $items);
    }

    /**
     * Decode the JSON 'data' field into an array.
     */
    private function decode(array $item): array
    {
        $item['data'] = json_decode($item['data'], true) ?? [];
        return $item;
    }
}
