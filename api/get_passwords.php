<?php
session_start();


if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

require '../db/db.php';


$user_id = $_SESSION['user_id'];


$stmt = $conn->prepare("SELECT * FROM saved_password WHERE user_id = ? ORDER BY id DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();


$passwords = [];
while ($row = $result->fetch_assoc()) {
    $passwords[] = $row;
}


header('Content-Type: application/json');
echo json_encode($passwords);
?>
