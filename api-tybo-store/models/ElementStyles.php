<?php
include_once 'Database.php';

class ElementStyles extends Database
{
    public function addStyles($elementId, $tag, $websiteId, $pageId, $pcStyles, $tabStyles, $phoneStyles)
    {
        try {
            // Assuming $tag is the class name or identifier for the element
            $selector = '.' . $tag . '-' . $elementId;

            $query = "INSERT INTO ElementStyles (selector, pcStyles, tabStyles, phoneStyles, elementId, pageId, websiteId) 
                      VALUES (:selector, :pcStyles, :tabStyles, :phoneStyles, :elementId, :pageId, :websiteId)";
            $params = [
                ':selector' => $selector,
                ':pcStyles' => json_encode($pcStyles),
                ':tabStyles' => json_encode($tabStyles),
                ':elementId' => $elementId,
                ':phoneStyles' => json_encode($phoneStyles),
                ':pageId' => $pageId,
                ':websiteId' => $websiteId
            ];

            $this->executeQuery($query, $params);

            // Optionally, you might return information about the inserted styles or handle other post-insert logic.
        } catch (PDOException $e) {
            // Handle the exception, log, or propagate it as needed.
            echo 'Error: ' . $e->getMessage();
        }
    }


    public function getStylesByWebsiteId($websiteId)
    {
        try {
            $query = "SELECT * FROM ElementStyles WHERE websiteId = :websiteId";
            $params = [':websiteId' => $websiteId];

            $styles = $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);
            foreach ($styles as &$style) {
                $style['pcStyles'] = json_decode($style['pcStyles'], true);
                $style['tabStyles'] = json_decode($style['tabStyles'], true);
                $style['phoneStyles'] = json_decode($style['phoneStyles'], true);
            }
            return $styles;
        } catch (PDOException $e) {
            // Handle the exception, log, or propagate it as needed.
            echo 'Error: ' . $e->getMessage();
        }
    }
    public function updateStyles($stylesArray)
    {
        try {
            // Use a transaction to ensure atomicity
            $this->_conn->beginTransaction();

            foreach ($stylesArray as $style) {
                $this->updateStyle($style);
            }

            // Commit the transaction if all updates are successful
            $this->_conn->commit();
            return $stylesArray;
        } catch (PDOException $e) {
            // Rollback the transaction in case of an error
            $this->_conn->rollBack();
            // Throw an exception or return an error status
            throw new Exception('Error updating styles: ' . $e->getMessage());
        }
    }
    private function updateStyle($style)
    {
        $query = "UPDATE ElementStyles 
                  SET pcStyles = :pcStyles, tabStyles = :tabStyles, phoneStyles = :phoneStyles
                  WHERE elementId = :elementId";

        $params = [
            ':pcStyles' => json_encode($style->pcStyles),
            ':tabStyles' => json_encode($style->tabStyles),
            ':phoneStyles' => json_encode($style->phoneStyles),
            ':elementId' => $style->elementId
        ];

        $this->executeQuery($query, $params);
    }
}
