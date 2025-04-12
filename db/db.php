<?php
$host = "localhost";
$user = "root";
$pass = ""; // Default XAMPP password
$dbname = "password_manager";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
