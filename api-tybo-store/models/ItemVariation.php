<?php

class ItemVariation
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function add(array $item_variations, int $item_id, string $item_type)
    {
        $this->deleteByItem($item_id, $item_type);
        foreach ($item_variations as $variation) {
            $stmt = $this->db->prepare("
                INSERT INTO item_variations (item_id, item_type, variation_id, option_id, metadata)
                VALUES (?, ?, ?, ?, ?)
            ");
            $metadata = json_encode($variation->metadata ?? []);
            $stmt->execute([
                $item_id,
                $item_type,
                $variation->variation_id,
                $variation->option_id,
                $metadata
            ]);
        }
    }

    public function listForItem(int $item_id, string $item_type): array
    {
        $stmt = $this->db->prepare("
            SELECT 
                iv.*,
                v.name AS variation_name,
                v.type AS variation_type,
                vo.name AS option_name,
                vo.value AS option_value
            FROM item_variations iv
            JOIN variations v ON iv.variation_id = v.id
            JOIN variation_options vo ON iv.option_id = vo.id
            WHERE iv.item_id = ? AND iv.item_type = ?
        ");
        $stmt->execute([$item_id, $item_type]);
        $variations = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $variations[] = $row;
        }
        return $variations;
    }

    public function deleteByItem(int $item_id, string $item_type): bool
    {
        $stmt = $this->db->prepare("DELETE FROM item_variations WHERE item_id = ? AND item_type = ?");
        return $stmt->execute([$item_id, $item_type]);
    }
}
