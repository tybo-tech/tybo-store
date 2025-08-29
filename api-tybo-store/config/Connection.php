<?php
include_once 'headers.php';

class Connection
{
    public $databaseName = 'tybocoza_store_v3';
    private $userName = 'tybocoza_store_v3';
    private $pass = 'Strong11!@AAA';
    private $host = 'localhost';
    public function connect()
    {
        $conn = null;

        // $this->setLocalhost();
        try {
            $conn = new PDO("mysql:host=$this->host;dbname=$this->userName", $this->userName, $this->pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode($e->getMessage());
        }

        return $conn;
    }
    private function setLocalhost()
    {
        $this->host = 'mysql';
        $this->userName = 'docker';
        $this->pass = 'docker';
        $this->databaseName = 'tybofash_2024';
    }
    public function generateToken($user_id)
    {
        $token = base64_encode(random_bytes(32));

        $conn = $this->connect();
        $query = "INSERT INTO tokens (user_id, token) VALUES (:user_id, :token)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        return $token;
    }

    public function validateToken($token)
    {
        $conn = $this->connect();
        $query = "SELECT * FROM tokens WHERE token = :token";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function registerUser($user)
    {
        $conn = $this->connect();

        if (!$conn) {
            return ['error' => 'Unable to connect to the database'];
        }

        $checkQuery = "SELECT * FROM users WHERE email = :email";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(':email', $user->email);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            return ['error' => 'Email is already registered'];
        }

        $hashedPassword = password_hash($user->password, PASSWORD_BCRYPT);

        $insertQuery = "INSERT INTO 
        users (username,email, password, role,metadata) 
        VALUES (:username,:email, :password, :role,:metadata)";

        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bindParam(':username', $user->username);
        $insertStmt->bindParam(':email', $user->email);
        $insertStmt->bindParam(':password', $hashedPassword);
        $insertStmt->bindParam(':role', $user->role);
        $insertStmt->bindParam(':metadata', json_encode($user->metadata));

        if ($insertStmt->execute()) {
            return ['success' => 'User registered successfully'];
        } else {
            return ['error' => 'Error registering user'];
        }
    }


    public function authenticateUser($email, $password)
    {
        $conn = $this->connect();

        if (!$conn) {
            return false; // Unable to connect to the database
        }

        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $hashedPassword = $user['password'];

            // Verify the password
            if (password_verify($password, $hashedPassword)) {
                $user['metadata'] = json_decode($user['metadata'], true);
                return $user; // Authentication successful
            }
        }

        return false; // Authentication failed
    }
    public function getByEmail($email)
    {
        $conn = $this->connect();

        if (!$conn) {
            return false; // Unable to connect to the database
        }

        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        return false; // Authentication failed
    }

    public function updatePasswordById($userId, $newPassword)
    {
        $conn = $this->connect();

        if (!$conn) {
            return ['error' => 'Unable to connect to the database'];
        }

        // Check if the user with the given ID exists
        $checkQuery = "SELECT * FROM users WHERE id = :userId";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(':userId', $userId);
        $checkStmt->execute();

        if ($checkStmt->rowCount() === 0) {
            return ['error' => 'User with the provided ID does not exist'];
        }

        // Hash the new password
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

        // Update the user's password
        $updateQuery = "UPDATE users SET password = :password WHERE id = :userId";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bindParam(':password', $hashedPassword);
        $updateStmt->bindParam(':userId', $userId);

        if ($updateStmt->execute()) {
            return ['success' => 'Password updated successfully'];
        } else {
            return ['error' => 'Error updating password'];
        }
    }
}

?>