<?php
include_once 'Database.php';

class TyboWebsite extends Database
{

    // Add and Update Website
    public function addWebsite($data)
    {
        $query = "INSERT INTO tybo_website (name, baseUrl, apiUrl) VALUES (:name, :baseUrl, :apiUrl)";
        $params = [':name' => $data->name, ':baseUrl' => $data->baseUrl, ':apiUrl' => $data->apiUrl];

        try {
            $this->executeQuery($query, $params);

            // Get the ID of the inserted record
            $websiteId = $this->_conn->lastInsertId();

            // Return success response with the inserted ID
            return ['success' => 'Website added successfully', 'websiteId' => $websiteId];
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to add website', 'details' => $e->getMessage()];
        }
    }


    public function updateWebsite($data)
    {
        $query = "UPDATE tybo_website SET name = :name, baseUrl = :baseUrl, apiUrl = :apiUrl WHERE websiteId = :websiteId";
        $params = [
            ':websiteId' => $data->websiteId,
            ':name' => $data->name,
            ':baseUrl' => $data->baseUrl,
            ':apiUrl' => $data->apiUrl,
        ];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the update was successful
                return ['success' => 'Website updated successfully'];
            } else {
                // Return a response indicating that no records were updated
                return ['info' => 'No changes made, website not found'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to update website', 'details' => $e->getMessage()];
        }
    }


    // Add and update Page
    // Add and update Page
    public function addPage($data)
    {
        $query = "INSERT INTO tybo_page (websiteId, path, title, slug) VALUES (:websiteId, :path, :title, :slug)";
        $params = [
            ':websiteId' => $data->websiteId,
            ':path' => $data->path,
            ':title' => $data->title,
            ':slug' => $data->slug,
        ];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the insertion was successful
                return ['success' => 'Page added successfully', 'pageId' => $this->_conn->lastInsertId()];
            } else {
                // Return a response indicating that no records were added
                return ['error' => 'Failed to add page'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to add page', 'details' => $e->getMessage()];
        }
    }

    public function updatePage($data)
    {
        $query = "UPDATE tybo_page SET websiteId = :websiteId, path = :path, title = :title WHERE pageId = :pageId";
        $params = [
            ':pageId' => $data->pageId,
            ':websiteId' => $data->websiteId,
            ':path' => $data->path,
            ':title' => $data->title,
        ];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the update was successful
                return ['success' => 'Page updated successfully'];
            } else {
                // Return a response indicating that no records were updated
                return ['info' => 'No changes made, page not found'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to update page', 'details' => $e->getMessage()];
        }
    }

    // Add and update section
    public function addSection($data)
    {
        $metadataJson = json_encode($data->metadata);

        $query = "INSERT INTO tybo_section (pageId, type, metadata,position) VALUES (:pageId, :type, :metadata,:position)";
        $params = [
            ':pageId' => $data->pageId,
            ':type' => $data->type,
            ':metadata' => $metadataJson,
            ':position' => $data->position
        ];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the insertion was successful
                return ['success' => 'Section added successfully', 'sectionId' => $this->_conn->lastInsertId()];
            } else {
                // Return a response indicating that no records were added
                return ['error' => 'Failed to add section'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to add section', 'details' => $e->getMessage()];
        }
    }

    public function updateSection($data)
    {
        $metadataJson = json_encode($data->metadata);

        $query = "UPDATE tybo_section SET pageId = :pageId, type = :type, metadata = :metadata, position = :position WHERE sectionId = :sectionId";
        $params = [
            ':pageId' => $data->pageId,
            ':type' => $data->type,
            ':metadata' => $metadataJson,
            ':position' => $data->position,
            ':sectionId' => $data->sectionId
        ];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the update was successful
                return ['success' => 'Section updated successfully'];
            } else {
                // Return a response indicating that no records were updated
                return ['info' => 'No changes made, section not found'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to update section', 'details' => $e->getMessage()];
        }
    }

    // Delete Page
    // Delete Page
    public function deletePage($pageId)
    {
        $query = "DELETE FROM tybo_page WHERE pageId = :pageId";
        $params = [':pageId' => $pageId];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the deletion was successful
                return ['success' => 'Page deleted successfully'];
            } else {
                // Return a response indicating that no records were deleted
                return ['info' => 'No changes made, page not found'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to delete page', 'details' => $e->getMessage()];
        }
    }

    // Delete Section
    public function deleteSection($sectionId)
    {
        $query = "DELETE FROM tybo_section WHERE sectionId = :sectionId";
        $params = [':sectionId' => $sectionId];

        try {
            $rowCount = $this->executeQuery($query, $params);

            if ($rowCount > 0) {
                // Return success response if the deletion was successful
                return ['success' => 'Section deleted successfully'];
            } else {
                // Return a response indicating that no records were deleted
                return ['info' => 'No changes made, section not found'];
            }
        } catch (Exception $e) {
            // Handle exceptions, log, or provide an appropriate response
            return ['error' => 'Failed to delete section', 'details' => $e->getMessage()];
        }
    }


    private function getCurrentPage($websiteId, $pages, $pageSlug)
    {
        foreach ($pages as $page) {
            if ($page['slug'] === $pageSlug || $page['pageId'] == $pageSlug ) {
                return $page;
            }
        }

        return null;
    }

    private function getPagesByWebsiteId($websiteId)
    {
        $pagesQuery = "SELECT * FROM tybo_page WHERE websiteId = :websiteId";
        $pagesParams = [':websiteId' => $websiteId];
        $pagesResult = $this->executeQuery($pagesQuery, $pagesParams);
        $pages = [];

        while ($row = $pagesResult->fetch(PDO::FETCH_ASSOC)) {
            $pages[] = $row;
        }

        return $pages;
    }

    private function getSectionsByPageId($pageId)
    {
        $sectionsQuery = "SELECT * FROM tybo_section WHERE pageId = :pageId";
        $sectionsParams = [':pageId' => $pageId];
        $sectionsResult = $this->executeQuery($sectionsQuery, $sectionsParams);
        $sections = [];
    
        while ($row = $sectionsResult->fetch(PDO::FETCH_ASSOC)) {
            // Decode the metadata field assuming it contains JSON data
            $row['metadata'] = json_decode($row['metadata'], true);
    
            // Check if section type is "item-list" and tableName is set in metadata
            if ($row['type'] === 'item-list' && isset($row['metadata']['tableName']) && !empty($row['metadata']['tableName'])) {
                // Fetch data from the specified table
                $tableName = $row['metadata']['tableName'];
                $itemListData = $this->fetchDataFromTable($tableName);
                
                // Append the fetched data to the section metadata
                $row['metadata']['itemListData'] = $itemListData;
            }
    
            $sections[] = $row;
        }
    
        return $sections;
    }
    
    private function fetchDataFromTable($tableName)
    {
        // Assuming you have a method to execute a query and fetch data
        // Adjust the query and parameters based on your database structure
        $query = "SELECT * FROM $tableName";
        $params = [];
    
        $result = $this->executeQuery($query, $params);
        $data = [];
    
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
    
        return $data;
    }
    

    public function getWebsiteById($websiteId, $pageSlug = "home")
    {
        $websiteQuery = "SELECT * FROM tybo_website WHERE websiteId = :websiteId";
        $websiteParams = [':websiteId' => $websiteId];
        $websiteResult = $this->executeQuery($websiteQuery, $websiteParams);
        $website = $websiteResult->fetch(PDO::FETCH_ASSOC);

        if (!$website) {
            return null; // Website not found
        }

        $website['pages'] = $this->getPagesByWebsiteId($websiteId);
        $currentPage = $this->getCurrentPage($websiteId, $website['pages'], $pageSlug);

        if ($currentPage) {
            $currentPage['sections'] = $this->getSectionsByPageId($currentPage['pageId']);
        }

        $website['currentPage'] = $currentPage;

        return $website;
    }


}
