
<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>
<?php
require '../db/db.php';

$result = $conn->query("SELECT * FROM passwords ORDER BY id DESC");

$passwords = [];

while ($row = $result->fetch_assoc()) {
  $passwords[] = $row;
}

header('Content-Type: application/json');
echo json_encode($passwords);
?>
