<?php
include_once 'Database.php';

class TableCreator extends Database
{
    public function createTable($tableName, $columns)
    {
        // Ensure the table name and columns are provided
        if (empty($tableName) || empty($columns)) {
            return ['error' => 'Table name and columns are required.'];
        }

        // Construct the CREATE TABLE query
        $query = "CREATE TABLE IF NOT EXISTS $tableName (";
        foreach ($columns as $column => $type) {
            $query .= "$column $type, ";
        }
        $query = rtrim($query, ', '); // Remove the trailing comma
        $query .= ")";

        // Execute the query
        $createTableResult = $this->executeQuery($query);
        return $this->getListofTables();
    }

    public function getListofTables()
    {
        try {
            // Query to get a list of tables in the database
            $query = "SHOW TABLES";
            $stmt = $this->_conn->prepare($query);
            $stmt->execute();

            // Fetch all table names
            $tableNames = $stmt->fetchAll(PDO::FETCH_COLUMN);

            // Fetch columns for each table
            $tables = [];
            foreach ($tableNames as $tableName) {
                $columns = $this->getTableColumns($tableName);
                $tables[] = ['name' => $tableName, 'columns' => $columns];
            }

            return $tables;
        } catch (PDOException $e) {
            return ['error' => 'Error fetching list of tables: ' . $e->getMessage()];
        }
    }

    private function getTableColumns($tableName)
    {
        try {
            // Query to get columns for a specific table
            $query = "SHOW COLUMNS FROM $tableName";
            $stmt = $this->_conn->prepare($query);
            $stmt->execute();

            // Fetch column information
            $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $columns;
        } catch (PDOException $e) {
            return ['error' => 'Error fetching columns for table ' . $tableName . ': ' . $e->getMessage()];
        }
    }
}
?>