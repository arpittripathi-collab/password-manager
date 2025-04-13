<?php
session_start();


if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

require '../db/db.php';


$site = $_POST['site'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';


$user_id = $_SESSION['user_id'];


if ($site && $username && $password) {
    
    $stmt = $conn->prepare("INSERT INTO saved_password (user_id, site, username, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $user_id, $site, $username, $password);
    $stmt->execute();
    $stmt->close();
}
?>
