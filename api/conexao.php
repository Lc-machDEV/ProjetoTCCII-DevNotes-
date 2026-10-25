
<?php
        $dbh = new PDO('mysql:host=localhost; dbname=todo_list; charset=utf8mb4', 'root', '');
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>