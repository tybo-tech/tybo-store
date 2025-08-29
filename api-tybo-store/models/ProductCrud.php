<?php

include_once 'Database.php';

class ProductCrud extends Database
{

    public function addProduct($product)
    {
        $query = "INSERT INTO products (company_id, category_id,quantity,on_sale,featured,slug, name, description, price, availability, image_url, metadata) 
                  VALUES (:company_id, :category_id,:quantity,:on_sale,:featured,:slug, :name, :description, :price, :availability, :image_url, :metadata)";

        $params = [
            ':company_id' => $product->company_id,
            ':category_id' => $product->category_id,
            ':quantity' => $product->quantity,
            ':on_sale' => $product->on_sale,
            ':featured' => $product->featured,
            ':slug' => $product->slug,
            ':name' => $product->name,
            ':description' => $product->description,
            ':price' => $product->price,
            ':availability' => $product->availability,
            ':image_url' => $product->image_url,
            ':metadata' => json_encode($product->metadata),
        ];

        $this->executeQuery($query, $params);

        $productId = $this->_conn->lastInsertId();

        // Add logic to handle additional operations after insertion if needed
        $added = $this->get($productId);
        if (isset($added)) {
            $added['slug'] = $added['slug'] . "-" . $productId;
            $this->updateProduct((object) $added);

            // Insert product-category pivot
            if (isset($product->categoriesIds) && is_array($product->categoriesIds)) {
                include_once 'Category.php';
                $categoryService = new Category($this->_conn);
                $categoryService->saveCategoriesForProduct($productId, $product->categoriesIds);
            }
        }

        return $added;
    }



    function addMany($products)
    {
        $addedProducts = [];
        foreach ($products as $product) {
            $addedProduct = $this->addProduct($product);
            if (isset($addedProduct)) {
                $addedProducts[] = $addedProduct;
            }
        }
        return $addedProducts;
    }

    public function updateProduct($product)
    {

        $query = "UPDATE products SET 
                  company_id = :company_id, 
                  category_id = :category_id, 
                  quantity = :quantity, 
                  on_sale = :on_sale, 
                  featured = :featured, 
                  slug = :slug, 
                  name = :name, 
                  description = :description, 
                  price = :price, 
                  availability = :availability, 
                  image_url = :image_url, 
                  metadata = :metadata 
                  WHERE id = :id";

        $params = [
            ':company_id' => $product->company_id,
            ':category_id' => $product->category_id,
            ':quantity' => $product->quantity,
            ':on_sale' => $product->on_sale,
            ':featured' => $product->featured,
            ':slug' => $product->slug,
            ':name' => $product->name,
            ':description' => $product->description,
            ':price' => $product->price,
            ':availability' => $product->availability,
            ':image_url' => $product->image_url,
            ':metadata' => json_encode($product->metadata),
            ':id' => $product->id
        ];

        $this->executeQuery($query, $params);

        // Add logic to handle additional operations after update if needed

        // Save product-category pivot
        if (isset($product->categoriesIds) && is_array($product->categoriesIds)) {
            include_once 'Category.php';
            $categoryService = new Category($this->_conn);
            $categoryService->saveCategoriesForProduct($product->id, $product->categoriesIds);
        }

        // Save product variations
        if (isset($product->variations) && is_array($product->variations)) {
            include_once 'ItemVariation.php';
            $variationService = new ItemVariation($this->_conn);
            $variationService->add($product->variations, $product->id, 'product');
        }

        return $this->get($product->id);
    }

    public function listProducts($company_id, $featured, $on_sale, $category_id)
    {
        $query = "SELECT * FROM products WHERE company_id = '$company_id'";
        if ($featured == 1) {
            $query = "SELECT * FROM products where featured = '1' and company_id = '$company_id'";
        }
        if ($on_sale == 1) {
            $query = "SELECT * FROM products where on_sale = '1' and company_id = '$company_id'";
        }
        if ($category_id > 0) {
            $query = "SELECT * FROM products where category_id = '$category_id' and company_id = '$company_id'";
        }
        $result = $this->executeQuery($query);

        $products = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $products[] = $row;
        }

        return $products;
    }

    function latestProducts($company_id, $limit = 10)
    {
        $limit = (int) $limit; // Sanitize to ensure it's a valid integer
        $query = "SELECT * FROM products WHERE company_id = :company_id ORDER BY created_at DESC LIMIT $limit";
        $params = [':company_id' => $company_id];
        $result = $this->executeQuery($query, $params);
        $products = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $products[] = $row;
        }

        return $products;
    }

    public function get_catergory($id)
    {
        $products = $this->filter($id);
        $query = "SELECT * FROM categories WHERE id = '$id' or  slug = '$id'";
        $result = $this->executeQuery($query);
        $category = [];
        if ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $category = $row;
            $category["products"] = $products;
        }
        return $category;
    }
    public function filter($id)
    {
        $query = "SELECT id, metadata FROM products";
        $result = $this->executeQuery($query);
        $ids = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $categories = $row['metadata']['categories'];
            if (isset($categories) && $this->has_id($id, $categories)) {
                $ids[] = $row['id'];
            }
        }

        if (!empty($ids)) {
            $ids = '(' . implode(',', $ids) . ')';
        } else {
            $ids = '()';
        }
        if ($id == '()') {
            return [];
        }
        $query = "SELECT * FROM products where id in $ids";
        $result = $this->executeQuery($query);
        $products = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $products[] = $row;
        }

        return $products;

    }

    private function has_id($id, $categories)
    {
        foreach ($categories as $category) {
            if ($category['slug'] == $id || $category['id'] == $id) {
                return true;
            }
        }
        return false;
    }


    public function listProductsByCatergory($category_id)
    {
        $category = $this->getCategory($category_id);
        if (isset($category) && !empty($category["id"])) {
            $id = $category["id"];
            $query = "SELECT * FROM products where category_id = '$id'";

            $result = $this->executeQuery($query);

            $products = [];

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $row['metadata'] = json_decode($row['metadata'], true);
                $products[] = $row;
            }
            $category["products"] = $products;
            return $category;
        }
        return $category;
    }

    function get($id)
    {
        $query = "SELECT * FROM products WHERE id = :productId or slug = :productId";
        $params = [':productId' => $id];
        $result = $this->executeQuery($query, $params);

        if ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            return $row;
        }

        return null;
    }

    function getCategory($category_id)
    {
        $query = "SELECT * FROM categories WHERE id = '$category_id' or  slug = '$category_id'";
        $result = $this->executeQuery($query);

        if ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            return $row;
        }

        return null;
    }

    function search($searchTerm, $company_id)
    {
        $sql = "SELECT * FROM products WHERE company_id = :company_id AND (name LIKE :query OR description LIKE :query)";
        $params = [
            ':company_id' => $company_id,
            ':query' => '%' . $searchTerm . '%'
        ];
        $result = $this->executeQuery($sql, $params);
        $products = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $row['metadata'] = json_decode($row['metadata'], true);
            $products[] = $row;
        }

        return $products;
    }

}


