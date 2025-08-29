<?php

class VariationOption
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function add($data)
    {
        $query = "INSERT INTO variation_options (variation_id, name, value, metadata) VALUES (:variation_id, :name, :value, :metadata)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([
            ':variation_id' => $data->variation_id,
            ':name' => $data->name,
            ':value' => $data->value ?? '',
            ':metadata' => json_encode($data->metadata ?? []),
        ]);

        $id = $this->db->lastInsertId();
        if ($id) {
            return $this->get($id);
        } else {
            throw new Exception("Failed to insert variation option");
        }
    }


    public function update($id, $data)
    {
        $query = "UPDATE variation_options SET name = :name, value = :value, metadata = :metadata WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            ':name' => $data->name,
            ':value' => $data->value,
            ':metadata' => json_encode($data->metadata ?? []),
            ':id' => $id
        ]);
    }

    public function get($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM variation_options WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $row['metadata'] = json_decode($row['metadata'], true);
        }
        return $row;
    }

    public function list($variation_id)
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

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM variation_options WHERE id = ?");
        if ($stmt->execute([$id])) {
            return ['status' => 'success', 'message' => 'Option deleted successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to delete option'];
        }
    }
}
