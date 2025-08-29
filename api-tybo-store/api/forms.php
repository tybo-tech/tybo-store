<?php
include_once '../config/Connection.php';

class TableColumn
{
    public $columnName;
    public $dataType;

    public function __construct($columnName, $dataType)
    {
        $this->columnName = $columnName;
        $this->dataType = $dataType;
    }

    public function mapToTypeScriptType()
    {
        // Mapping logic remains the same as before
        // ...
    }
}

class FormConfigGenerator
{
    private $connection;
    private $databaseName;

    public function __construct($connection, $databaseName)
    {
        $this->connection = $connection;
        $this->databaseName = $databaseName;
    }

    public function generateFormConfig()
    {
        try {
            $query = "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = :database";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':database', $this->databaseName, PDO::PARAM_STR);
            $stmt->execute();

            $tableColumns = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $result = [];

            foreach ($tableColumns as $row) {
                $tableName = $row['TABLE_NAME'];
                $columnName = $row['COLUMN_NAME'];
                $dataType = $row['DATA_TYPE'];

                if (!isset($result[$tableName])) {
                    $result[$tableName] = [];
                }

                // Modify the label value
                $formattedLabel = ucfirst(str_replace('_', ' ', $columnName));

                // Determine whether to show the field based on specific criteria
                $showOnAdd = $this->shouldShowFieldOnForm($tableName, $columnName, 'add');
                $showOnUpdate = $this->shouldShowFieldOnForm($tableName, $columnName, 'update');
                $showOnList = $this->shouldShowFieldOnForm($tableName, $columnName, 'list');
                $showOnDetails = $this->shouldShowFieldOnForm($tableName, $columnName, 'details');

                // Add 'value' field with an empty string
                $result[$tableName][] = [
                    'label' => $formattedLabel,
                    'value' => '',
                    'type' => $this->mapToFormType($dataType),
                    'show_on_add' => $showOnAdd,
                    'show_on_update' => $showOnUpdate,
                    'show_on_list' => $showOnList,
                    'show_on_details' => $showOnDetails,
                ];
            }

            return json_encode($result, JSON_PRETTY_PRINT);
        } catch (PDOException $e) {
            return 'Connection failed: ' . $e->getMessage();
        }
    }

    private function shouldShowFieldOnForm($tableName, $columnName, $formType)
    {
        // Define conditions based on your criteria
        $excludeColumns = ['id', 'create_date', 'last_modified'];

        // Check if the column meets the criteria to be excluded
        if (in_array($columnName, $excludeColumns)) {
            return false;
        }

        // Add more conditions if needed for specific tables or columns

        // Default to true if no exclusion criteria match
        return true;
    }

    private function mapToFormType($dataType)
    {
        // Form type mapping logic based on data type
        switch ($dataType) {
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
                return 'text';

            case 'date':
            case 'datetime':
            case 'timestamp':
                return 'datetime-local';

            case 'time':
                return 'time';

            case 'year':
                return 'number';

            case 'email':
                return 'email';

            // Add more cases as needed for other data types

            default:
                return 'text';
        }
    }
}

try {
    $connection = new Connection();
    $databaseName = $connection->databaseName;

    // Using the FormConfigGenerator
    $formConfigGenerator = new FormConfigGenerator($connection->connect(), $databaseName);
    $formConfigs = $formConfigGenerator->generateFormConfig();

    // Print or save the form configurations as needed
    echo "<pre>$formConfigs</pre>";
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}

