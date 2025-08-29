<?php

class Variation
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function add($data)
    {
        $query = "INSERT INTO variations (company_id, name, type, metadata) VALUES (:company_id, :name, :type, :metadata)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':company_id' => $data->company_id,
            ':name' => $data->name,
            ':type' => $data->type,
            ':metadata' => json_encode($data->metadata ?? []),
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data)
    {
        $query = "UPDATE variations SET name = :name, type = :type, metadata = :metadata WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            ':name' => $data->name,
            ':type' => $data->type,
            ':metadata' => json_encode($data->metadata ?? []),
            ':id' => $id
        ]);
    }

    public function get($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM variations WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $row['options'] = $this->listOptions($id);
        }
        return $row;
    }

    private function listOptions($variation_id)
    {
        $stmt = $this->db->prepare("SELECT * FROM variation_options WHERE variation_id = ?");
        $stmt->execute([$variation_id]);
        $options = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $options[] = $row;
        }
        return $options;
    }
    public function list($company_id)
    {
        $stmt = $this->db->prepare("SELECT * FROM variations WHERE company_id = ?");
        $stmt->execute([$company_id]);
        $variations = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $row['options'] = $this->listOptions($row['id']);
            $variations[] = $row;
        }
        return $variations;
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM variations WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
