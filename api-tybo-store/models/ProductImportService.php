<?php


class ProductImportService
{
    private PDO $conn;
    private array $categoryMap = [];
    private array $productMap = [];

    public function __construct(PDO $conn)
    {
        $this->conn = $conn;
    }

    public function import(object $payload): array
    {
        $categories = $payload->categories ?? [];
        $products = $payload->products ?? [];

        $startedHere = false;

        try {
            if (!$this->conn->inTransaction()) {
                $this->conn->beginTransaction();
                $startedHere = true;
            }

            // ✅ Insert categories
            foreach ($categories as $cat) {
                $oldId = $cat->old_id;
                $parentOldId = $cat->parent_old_id ?? null;

                $cat->parent_id = ($parentOldId && isset($this->categoryMap[$parentOldId]))
                    ? $this->categoryMap[$parentOldId]
                    : null;

                unset($cat->old_id, $cat->parent_old_id);

                $newId = $this->addCategory($cat);
                $this->categoryMap[$oldId] = $newId;
            }

            // ✅ Insert products
            foreach ($products as $prod) {
                $oldId = $prod->old_id ?? null;
                $categoryOldId = $prod->category ?? null;
                $categoriesIds = [];

                if ($categoryOldId && isset($this->categoryMap[$categoryOldId])) {
                    $categoriesIds[] = $this->categoryMap[$categoryOldId];
                }

                unset($prod->old_id, $prod->parent_old_id, $prod->category);

                $newId = $this->addProduct($prod);
                $this->productMap[$oldId] = $newId;

                if (!empty($categoriesIds)) {
                    $this->saveProductCategories($newId, $categoriesIds);
                }
            }

            if ($startedHere) {
                $this->conn->commit();
            }

            return [
                'success' => true,
                'message' => 'Import completed successfully.',
                'categoryMap' => $this->categoryMap,
                'productMap' => $this->productMap,
            ];
        } catch (Exception $e) {
            if ($startedHere && $this->conn->inTransaction()) {
                $this->conn->rollBack();
            }

            return [
                'success' => false,
                'error' => 'Import failed: ' . $e->getMessage(),
            ];
        }
    }

    private function addCategory(object $category): int
    {
        $slug = isset($category->slug)
            ? $category->slug
            : strtolower(preg_replace('/\s+/', '-', $category->name));

        $query = "INSERT INTO categories (company_id, name, image_url, parent_id, featured, description, slug)
                  VALUES (:company_id, :name, :image_url, :parent_id, :featured, :description, :slug)";

        $params = [
            ':company_id' => $category->company_id ?? 0,
            ':name' => $category->name,
            ':image_url' => $category->image ?? $category->image_url ?? '',
            ':parent_id' => $category->parent_id ?? null,
            ':featured' => $category->featured ?? 0,
            ':description' => $category->description ?? '',
            ':slug' => $slug,
        ];

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        return $this->conn->lastInsertId();
    }

    private function addProduct(object $product): int
    {
        $query = "INSERT INTO products (
                    company_id, featured, on_sale, name, description, price, quantity, slug,
                    availability, image_url, created_at, metadata
                  ) VALUES (
                    :company_id, :featured, :on_sale, :name, :description, :price, :quantity, :slug,
                    :availability, :image_url, NOW(), :metadata
                  )";

        $params = [
            ':company_id' => $product->company_id ?? 0,
            ':featured' => $product->featured ?? 0,
            ':on_sale' => $product->on_sale ?? 0,
            ':name' => $product->name,
            ':description' => $product->description ?? '',
            ':price' => $product->price ?? 0,
            ':quantity' => $product->quantity ?? 0,
            ':slug' => $product->slug ?? strtolower(preg_replace('/\s+/', '-', $product->name)),
            ':availability' => $product->availability ?? 1,
            ':image_url' => $product->image_url ?? '',
            ':metadata' => json_encode($product->metadata ?? []),
        ];

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        return $this->conn->lastInsertId();
    }

    private function saveProductCategories(int $productId, array $categoryIds): void
    {
        foreach ($categoryIds as $catId) {
            $stmt = $this->conn->prepare(
                "INSERT INTO product_category (product_id, category_id) VALUES (:product_id, :category_id)"
            );
            $stmt->execute([
                ':product_id' => $productId,
                ':category_id' => $catId,
            ]);
        }
    }
}
