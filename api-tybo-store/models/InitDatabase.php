<?php
include_once 'Database.php';

class InitDatabase extends Database
{

     function createTables()
    {
        $this->createWebsiteTable();
        $this->createPageTable();
        $this->createSectionTable();
        return ["success"=> "Done"];
    }

    private function createWebsiteTable()
    {
        $query = "
            CREATE TABLE IF NOT EXISTS tybo_website (
                websiteId INT PRIMARY KEY,
                name VARCHAR(255),
                baseUrl VARCHAR(255),
                apiUrl VARCHAR(255)
            )
        ";
        $this->executeQuery($query);
    }

    private function createPageTable()
    {
        $query = "
            CREATE TABLE IF NOT EXISTS tybo_page (
                pageId INT PRIMARY KEY,
                websiteId INT,
                path VARCHAR(255),
                title VARCHAR(255)
            )
        ";
        $this->executeQuery($query);
    }

    private function createSectionTable()
    {
        $query = "
            CREATE TABLE IF NOT EXISTS tybo_section (
                sectionId INT PRIMARY KEY,
                pageId INT,
                type VARCHAR(50),
                metadata TEXT
            )
        ";
        $this->executeQuery($query);
    }
}
