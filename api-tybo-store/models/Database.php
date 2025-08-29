<?php
class Database
{
    public PDO $_conn;

    public function __construct(PDO $conn)
    {
        $this->_conn = $conn;
    }

    public function executeQuery($query, $params = [])
    {
        try {
            $stmt = $this->_conn->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }
}
