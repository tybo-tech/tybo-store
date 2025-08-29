<?php
class User
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Check if user exists by email
    public function userExistsByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create user (returns existing user if email is duplicate)
    public function create($data)
    {
        $existing = $this->userExistsByEmail($data->email);
        if ($existing) {
            return $this->getById($existing['id']);
        }

        $query = "INSERT INTO users (
            company_id, username, metadata, email, password, role,
            phone_number, address_line_1, address_line_2, city, dob, address,
            latitude, longitude, url, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = $this->conn->prepare($query);
        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

        $metadataJson = isset($data->metadata) ? json_encode($data->metadata) : null;

        $stmt->execute([
            $data->company_id ?? null,
            $data->username,
            $metadataJson,
            $data->email,
            $hashedPassword,
            $data->role,
            $data->phone_number ?? null,
            $data->address_line_1 ?? null,
            $data->address_line_2 ?? null,
            $data->city ?? null,
            $data->dob ?? null,
            $data->address ?? null,
            $data->latitude ?? null,
            $data->longitude ?? null,
            $data->url ?? null,
        ]);

        $id = $this->conn->lastInsertId();
        return $this->getById($id);
    }

    // Update user info (except password)
    public function update($data)
    {
        $query = "UPDATE users SET
            company_id = ?,
            username = ?,
            metadata = ?,
            email = ?,
            role = ?,
            phone_number = ?,
            address_line_1 = ?,
            address_line_2 = ?,
            city = ?,
            dob = ?,
            address = ?,
            latitude = ?,
            longitude = ?,
            url = ?,
            updated_at = NOW()
        WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $metadataJson = isset($data->metadata) ? json_encode($data->metadata) : null;

        return $stmt->execute([
            $data->company_id ?? null,
            $data->username,
            $metadataJson,
            $data->email,
            $data->role,
            $data->phone_number ?? null,
            $data->address_line_1 ?? null,
            $data->address_line_2 ?? null,
            $data->city ?? null,
            $data->dob ?? null,
            $data->address ?? null,
            $data->latitude ?? null,
            $data->longitude ?? null,
            $data->url ?? null,
            $data->id
        ]);
    }

    // Update password
    public function updatePassword($id, $newPassword)
    {
        $query = "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        return $stmt->execute([$hashedPassword, $id]);
    }

    // Get user by ID (decodes metadata)
    public function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && isset($user['metadata'])) {
            $user['metadata'] = $this->decodeMetadata($user['metadata']);
        }

        return $user;
    }

    // Get user by email (decodes metadata)
    public function getByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && isset($user['metadata'])) {
            $user['metadata'] = $this->decodeMetadata($user['metadata']);
        }

        return $user;
    }

    // List all users for a specific company (decodes metadata)
    public function list($company_id = null)
    {
        if ($company_id) {
            $stmt = $this->conn->prepare("SELECT * FROM users WHERE company_id = ? ORDER BY created_at DESC");
            $stmt->execute([$company_id]);
        } else {
            $stmt = $this->conn->prepare("SELECT * FROM users ORDER BY created_at DESC");
            $stmt->execute();
        }
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($users as &$user) {
            if (isset($user['metadata'])) {
                $user['metadata'] = $this->decodeMetadata($user['metadata']);
            }
        }
        return $users;
    }

    // Authenticate user by email + password (decodes metadata, removes password before returning)
    public function authenticate($email, $password)
    {
        $user = $this->getByEmail($email);
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']); // Never return the hash!
            return $user;
        }
        return false;
    }

    // Delete user by id
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }

    // Helper to decode metadata safely
    private function decodeMetadata($json)
    {
        if (!$json) return null;
        $obj = json_decode($json, true);
        return is_array($obj) ? $obj : null;
    }
}
?>
