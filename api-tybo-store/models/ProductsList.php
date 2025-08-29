<?php
include_once 'Database.php';

class ProductsList extends Database
{
    // 🟣 List products with full category objects
    public function list(
        int $companyId,
        $limit = 1000,
        $offset = 0
    ) {
        $query = "SELECT * FROM products
                    WHERE company_id = :company_id
         ORDER BY id DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->_conn->prepare($query);
        $stmt->bindValue(':company_id', (int) $companyId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        $stmt->execute();

        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($products as &$product) {
            $product['metadata'] = json_decode($product['metadata'], true);
            $product['categories'] = $this->getCategoryObjects($product['id']);
        }

        return $products;
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
}
