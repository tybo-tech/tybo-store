<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Table Form</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .chat-container {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }

        .chat-header {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 20px;
        }

        form {
            display: flex;
            flex-direction: column;
        }

        label {
            margin-bottom: 5px;
            font-weight: bold;
        }

        input, select {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        button {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .column-entry {
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">Create Table Form</div>
        <form method="post" action="">
            <label for="tableName">Table Name:</label>
            <input type="text" id="tableName" name="tableName" required>

            <div id="columns-container">
                <div class="column-entry">
                    <label for="columnName">Column Name:</label>
                    <input type="text" name="columnData[0]" required>

                    <label for="columnType">Column Type:</label>
                    <select name="columnData[0]" required>
                        <option value="int">INT</option>
                        <option value="varchar">VARCHAR</option>
                        <!-- Add other data types as needed -->
                    </select>

                    <label for="columnSize">Column Size:</label>
                    <input type="text" name="columnData[0]" placeholder="Size (optional)">
                </div>
            </div>

            <button type="button" onclick="addColumn()">Add Column</button>
            <br>
            <button type="submit">Create Table</button>
        </form>

        <script>
            function addColumn() {
                const columnsContainer = document.getElementById('columns-container');
                const entryCount = columnsContainer.children.length;
                const newEntry = document.createElement('div');
                newEntry.classList.add('column-entry');

                newEntry.innerHTML = `
                    <label for="columnName">Column Name:</label>
                    <input type="text" name="columnData[${entryCount}]" required>

                    <label for="columnType">Column Type:</label>
                    <select name="columnData[${entryCount}]" required>
                        <option value="int">INT</option>
                        <option value="varchar">VARCHAR</option>
                        <!-- Add other data types as needed -->
                    </select>

                    <label for="columnSize">Column Size:</label>
                    <input type="text" name="columnData[${entryCount}]" placeholder="Size (optional)">
                `;

                columnsContainer.appendChild(newEntry);
            }
        </script>
    </div>
</body>
</html>
