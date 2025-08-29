<?php
include_once 'Database.php';

class Category extends Database
{
    public function list($company_id)
    {
        $query = "SELECT * FROM categories WHERE company_id = :company_id ORDER BY id ASC";
        $params = [':company_id' => $company_id];
        $results = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);
        return $this->buildNestedCategories($results);
    }

    private function buildNestedCategories(array $flat, $parentId = 0)
    {
        $nested = [];

        foreach ($flat as $category) {
            if ((int) $category['parent_id'] === (int) $parentId) {
                $category['categories'] = $this->buildNestedCategories($flat, $category['id']);
                $nested[] = $category;
            }
        }

        return $nested;
    }

    // 🆕 (Optional) Add helper to get category IDs for a product
    public function getCategoryIdsByProductId($productId)
    {
        $query = "SELECT category_id FROM product_category WHERE product_id = :product_id";
        $params = [':product_id' => $productId];

        $rows = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);
        return array_column($rows, 'category_id');
    }

    // 🆕 (Optional) Add helper to save category IDs for a product
    /**
     * Save categories for a product.
     *
     * @param int $productId
     * @param array $categoryIds
     * @throws Exception
     */
    public function saveCategoriesForProduct($productId, array $categoryIds)
    {
        try {
            $this->_conn->beginTransaction();

            $this->executeQuery("DELETE FROM product_category WHERE product_id = :product_id", [
                ':product_id' => $productId
            ]);

            foreach ($categoryIds as $catId) {
                $this->executeQuery(
                    "INSERT INTO product_category (product_id, category_id) VALUES (:product_id, :category_id)",
                    [':product_id' => $productId, ':category_id' => $catId]
                );
            }

            $this->_conn->commit();
        } catch (Exception $e) {
            $this->_conn->rollBack();
            throw $e;
        }
    }

    public function getCategoryById($id)
    {
        $query = "SELECT * FROM categories WHERE id = :id";
        $result = $this->executeQuery($query, [':id' => $id])->fetch(PDO::FETCH_ASSOC);
        if (!$result) {
            return null; // Return null if no category found
        }
        $result['categories'] = $this->getImmediateSubcategories($id);
        $result['products'] = $this->getProductsByCategory($id);
        $result['trail'] = $this->getCategoryTrail($id);
        return $result;
    }

    public function getImmediateSubcategories($parentId)
    {
        $query = "SELECT * FROM categories WHERE parent_id = :parent_id ORDER BY id ASC";
        return $this->executeQuery($query, [':parent_id' => $parentId])->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getProductsByCategory($categoryId)
    {
        $query = "
        SELECT p.* 
        FROM products p
        JOIN product_category pc ON pc.product_id = p.id
        WHERE pc.category_id = :category_id
        ORDER BY p.id ASC
    ";
        $items = $this->executeQuery($query, [':category_id' => $categoryId])->fetchAll(PDO::FETCH_ASSOC);
        if (!$items) {
            return []; // Return empty array if no products found
        }

        // parse metadata for each product
        foreach ($items as &$item) {
            $item['metadata'] = json_decode($item['metadata'], true);
            if (!$item['metadata']) {
                $item['metadata'] = []; // Ensure metadata is always an array
            }
        }
        return $items; // e.g. [ {id: 1, name: 'Product 1', metadata: {...}}, ... ]
    }
    public function getCategoryTrail($categoryId)
    {
        $trail = [];
        while ($categoryId) {
            $query = "SELECT id, name, parent_id FROM categories WHERE id = :id";
            $category = $this->executeQuery($query, [':id' => $categoryId])->fetch(PDO::FETCH_ASSOC);

            if (!$category)
                break;

            array_unshift($trail, $category); // prepend to maintain root-first order
            $categoryId = $category['parent_id'];
        }

        return $trail; // e.g. [ {id: 1, name: 'Electrical'}, {id: 5, name: 'Lighting'} ]
    }

    // Root categories
    public function getRootCategories($company_id)
    {
        $query = "SELECT * FROM categories
         WHERE( parent_id IS NULL or parent_id = '' ) and company_id = :company_id
         ORDER BY id ASC";
        return $this->executeQuery($query, [':company_id' => $company_id])->fetchAll(PDO::FETCH_ASSOC);
    }


    // Featured categories
    public function getFeaturedCategories($company_id)
    {
        $query = "SELECT * FROM categories
         WHERE featured = 1 AND company_id = :company_id
         ORDER BY id ASC";
        return $this->executeQuery($query, [':company_id' => $company_id])->fetchAll(PDO::FETCH_ASSOC);
    }


}
