<?php
include_once 'Database.php';

class Element extends Database
{
    public function add($model)
    {
        $query = "INSERT INTO Element (tag, classList, textContent, link, parentId, pageId, websiteId, children) 
                  VALUES (:tag, :classList, :textContent, :link, :parentId, :pageId, :websiteId, :children)";
        $params = [
            ':tag' => $model->tag,
            ':classList' => json_encode($model->classList),
            ':textContent' => $model->textContent,
            ':link' => $model->link,
            ':parentId' => $model->parentId,
            ':pageId' => $model->pageId,
            ':websiteId' => $model->websiteId,
            ':children' => json_encode($model->children),
        ];

        $this->executeQuery($query, $params);
        return $this->_conn->lastInsertId();
    }

    public function update($model)
    {
        $query = "UPDATE Element 
                  SET tag = :tag, classList = :classList, textContent = :textContent, 
                      link = :link, parentId = :parentId, pageId = :pageId, websiteId = :websiteId, 
                      children = :children
                  WHERE id = :id";
        $params = [
            ':id' => $model->id,
            ':tag' => $model->tag,
            ':classList' => json_encode($model->classList),
            ':textContent' => $model->textContent,
            ':link' => $model->link,
            ':parentId' => $model->parentId,
            ':pageId' => $model->pageId,
            ':websiteId' => $model->websiteId,
            ':children' => json_encode($model->children),
        ];

        $this->executeQuery($query, $params);
        return $this->get($model->id);
    }

    public function delete($elementId)
    {
        $query = "DELETE FROM Element WHERE id = :id";
        $params = [':id' => $elementId];

        $this->executeQuery($query, $params);
    }

    public function get($elementId)
    {
        $query = "SELECT * FROM Element WHERE id = :id";
        $params = [':id' => $elementId];

        $result = $this->executeQuery($query, $params)->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $result['classList'] = isset($result['classList']) ? json_decode($result['classList'], true) : null;
            $result['children'] = isset($result['children']) ? json_decode($result['children'], true) : null;
        }

        return $result;
    }

    public function getElementsByWebsiteId($websiteId)
    {
        $query = "SELECT * FROM Element WHERE websiteId = :websiteId";
        $params = [':websiteId' => $websiteId];

        $results = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as &$result) {
            $result['classList'] = isset($result['classList']) ? json_decode($result['classList'], true) : null;
            $result['children'] = isset($result['children']) ? json_decode($result['children'], true) : null;
        }

        return $results;
    }

    public function updateBulk(array $models)
    {
        try {
            $query = "UPDATE Element 
                      SET tag = :tag, classList = :classList, textContent = :textContent, 
                          link = :link, parentId = :parentId, pageId = :pageId, websiteId = :websiteId, 
                          children = :children
                      WHERE id = :id";

            $stmt = $this->_conn->prepare($query);

            foreach ($models as $model) {
                $params = [
                    ':tag' => $model->tag,
                    ':classList' => json_encode($model->classList),
                    ':textContent' => $model->textContent,
                    ':link' => $model->link,
                    ':parentId' => $model->parentId,
                    ':pageId' => $model->pageId,
                    ':websiteId' => $model->websiteId,
                    ':children' => json_encode($model->children),
                    ':id' => $model->id
                ];

                $stmt->execute($params);
            }

            return true;
        } catch (PDOException $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }
    
    // ... (other methods)
}
