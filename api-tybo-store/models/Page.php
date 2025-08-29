<?php
include_once 'Database.php';
include_once 'Element.php';
include_once 'ElementStyles.php';

class Page extends Database
{
    private Element $elementService;
    public function createPages($websiteId)
    {
        $defaultPages = [
            ['title' => 'Home', 'slug' => 'home'],
            ['title' => 'About Us', 'slug' => 'about-us'],
            ['title' => 'Services', 'slug' => 'services'],
            ['title' => 'Contact Us', 'slug' => 'contact-us'],
        ];

        foreach ($defaultPages as $page) {
            $this->addPage($websiteId, $page['title'], $page['slug']);
        }
    }

    private function addPage($websiteId, $title, $slug)
    {
        // Add a page to the Page table
        $this->elementService = new Element($this->_conn);
        $query = "INSERT INTO Page (websiteId, title, slug) VALUES (:websiteId, :title, :slug)";
        $params = [':websiteId' => $websiteId, ':title' => $title, ':slug' => $slug];
        $this->executeQuery($query, $params);
        $pageId = $this->_conn->lastInsertId();
        $elementModel = new stdClass();
        $elementModel->tag = 'body';
        $elementModel->classList = ['class1', 'class2'];
        $elementModel->textContent = '';
        $elementModel->link = '';
        $elementModel->parentId = $pageId;
        $elementModel->pageId = $pageId;
        $elementModel->websiteId = $websiteId;
        $this->elementService = new Element($this->_conn);
        $elementId = $this->elementService->add($elementModel);
        $styles = [
            "background" => "#dfdcdc",
            "height" => "400px",
            "position" => "relative",
            "width" => "100%",
        ];
        $stylesService = new ElementStyles($this->_conn);
        $stylesService->addStyles($elementId, 'body', $websiteId, $pageId, $styles,$styles,$styles);
   
    }

    public function getPagesByWebsiteId($websiteId)
    {
        $query = "SELECT * FROM Page WHERE websiteId = :websiteId";
        $params = [':websiteId' => $websiteId];

        return $this->executeQuery($query, $params)->fetchAll(PDO::FETCH_ASSOC);
    }


}
