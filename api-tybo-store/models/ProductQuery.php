<?php
include_once 'Database.php';

class ProductQuery extends Database
{
    // 🟢 For editing forms: returns basic product info + category IDs
    public function getById($id)
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $params = [':id' => $id];
        $product = $this->executeQuery($query, $params)->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product['metadata'] = json_decode($product['metadata'], true);
            $product['categoriesIds'] = $this->getCategoryIds($id);
        }

        return $product;
    }

    // 🟠 For displaying in product detail page: includes full category objects
    public function getWithCategoryDetails($id)
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $params = [':id' => $id];
        $product = $this->executeQuery($query, $params)->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product['metadata'] = json_decode($product['metadata'], true);
            $product['categories'] = $this->getCategoryObjects($id);
            $product['variations'] = $this->getProductVariations($id);
        }

        return $product;
    }

    private function getCategoryIds($productId)
    {
        $query = "SELECT category_id FROM product_category WHERE product_id = :product_id";
        $params = [':product_id' => $productId];

        $rows = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);
        return array_column($rows, 'category_id');
    }

    private function getCategoryObjects($productId)
    {
        $query = "SELECT c.* 
                  FROM categories c 
                  INNER JOIN product_category pc ON pc.category_id = c.id
                  WHERE pc.product_id = :product_id";
        $params = [':product_id' => $productId];

        return $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductVariations($productId)
    {
        $sql = "
        SELECT 
            iv.variation_id,
            iv.item_id,
            v.name as variation_name,
            v.type,
            vo.id as option_id,
            vo.name as option_name,
            vo.value
        FROM item_variations iv
        JOIN variations v ON v.id = iv.variation_id
        JOIN variation_options vo ON vo.id = iv.option_id
        WHERE iv.item_id = ? AND iv.item_type = 'product'
    ";
    $params = [$productId];

        return $this->executeQuery($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
    }



}
