<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>
<?php
require '../db/db.php';

$site = $_POST['site'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if ($site && $username && $password) {
  $stmt = $conn->prepare("INSERT INTO passwords (site, username, password) VALUES (?, ?, ?)");
  $stmt->bind_param("sss", $site, $username, $password);
  $stmt->execute();
  $stmt->close();
}
?>
