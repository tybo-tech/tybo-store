
<?php
include_once '../config/Connection.php';

class TableColumn {
    public $columnName;
    public $dataType;

    public function __construct($columnName, $dataType) {
        $this->columnName = $columnName;
        $this->dataType = $dataType;
    }

    public function mapToTypeScriptType() {
        switch ($this->dataType) {
            case 'int':
            case 'tinyint':
            case 'smallint':
            case 'mediumint':
            case 'bigint':
                return 'number';

            case 'decimal':
            case 'float':
            case 'double':
                return 'number';

            case 'varchar':
            case 'char':
            case 'text':
            case 'mediumtext':
            case 'longtext':
                return 'string';

            case 'date':
            case 'datetime':
            case 'timestamp':
            case 'time':
            case 'year':
                return 'string';

            default:
                return 'any';
        }
    }
}

class TypeScriptGenerator {
    private $connection;
    private $databaseName;

    public function __construct($connection, $databaseName) {
        $this->connection = $connection;
        $this->databaseName = $databaseName;
    }

    private function formatModelName($tableName) {
        // Convert the first character of the table name to uppercase
        return ucfirst($tableName);
    }

    public function generateTypeScriptInterfacesAndObjects() {
        try {
            // Query to get table names, column names, and data types in the database
            $query = "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = :database";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':database', $this->databaseName, PDO::PARAM_STR);
            $stmt->execute();

            // Fetch all table names, column names, and data types
            $tableColumns = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Organize the results into a structured array
            $result = [];
            foreach ($tableColumns as $row) {
                $tableName = $row['TABLE_NAME'];
                $columnName = $row['COLUMN_NAME'];
                $dataType = $row['DATA_TYPE'];

                if (!isset($result[$tableName])) {
                    $result[$tableName] = [];
                }

                $result[$tableName][] = new TableColumn($columnName, $dataType);
            }

            // Generate TypeScript interfaces and initialization objects as a string
            $typescriptCode = '';
            foreach ($result as $tableName => $columns) {
                $formattedTableName = $this->formatModelName($tableName);

                // Generate TypeScript interface
                $typescriptCode .= "export interface {$formattedTableName} {\n";
                foreach ($columns as $column) {
                    $typescriptCode .= "  {$column->columnName}: {$column->mapToTypeScriptType()};\n";
                }
                $typescriptCode .= "}\n\n";

                // Generate initialization object
                $typescriptCode .= "export const init{$formattedTableName}: {$formattedTableName} = {\n";
                foreach ($columns as $column) {
                    $typescriptCode .= "  {$column->columnName}: ";
                    if ($column->mapToTypeScriptType() === 'number') {
                        $typescriptCode .= "0";
                    } else {
                        $typescriptCode .= "''";
                    }
                    $typescriptCode .= ",\n";
                }
                $typescriptCode .= "};\n\n";
            }

            return $typescriptCode;
        } catch (PDOException $e) {
            return 'Connection failed: ' . $e->getMessage();
        }
    }
}

try {
    $connection = new Connection();
    $databaseName = $connection->databaseName;
    $typescriptGenerator = new TypeScriptGenerator($connection->connect(), $databaseName);

    // Generate TypeScript interfaces and initialization objects
    $typescriptCode = $typescriptGenerator->generateTypeScriptInterfacesAndObjects();

    // Print or save the TypeScript code as needed
    echo "<pre>$typescriptCode</pre>";
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>