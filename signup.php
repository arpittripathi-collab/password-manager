<?php
include 'db/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    if (!preg_match("/(^[0-9]{10}$)|(^[a-zA-Z0-9._%+-]+@gmail\\.com$)/", $username)) {
        $error = "Invalid username format. Use a 10-digit number or Gmail address.";
    } else {
        $check_stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $check_stmt->bind_param("s", $username);
        $check_stmt->execute();
        $check_stmt->store_result();

        if ($check_stmt->num_rows > 0) {
            $error = "Username already exists.";
        } else {
            $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $password);
            if ($stmt->execute()) {
                $success = "Signup successful! <a href='login.php'>Login now</a>";
            } else {
                $error = "Something went wrong.";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Signup</title>
    <link rel="stylesheet" href="styles/style2.css">
</head>
<body>
    <form method="POST">
        <h2>Signup</h2>
        <?php 
            if (!empty($error)) echo "<p class='error'>$error</p>";
            if (!empty($success)) echo "<p class='success'>$success</p>";
        ?>
        <label for="username">Username</label>
        <input type="text" name="username" id="username" required>

        <label for="password">Password</label>
        <input type="password" name="password" id="password" required>

        <input type="submit" value="Signup">
        <p>Already have an account? <a href="login.php">Login</a></p>
    </form>
</body>
</html>
