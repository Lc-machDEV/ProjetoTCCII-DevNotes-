<?php
    //preparing the response headers for JSON output
    header('Content-Type: application/json; charset=utf-8');

    try {   
        include_once __DIR__ . '/conexao.php';
        $sql = "SELECT * 
        FROM tarefas 
        WHERE data_exclusao IS NULL 
        ORDER BY id DESC";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tarefas);
    } catch (PDOException $e) {
        http_response_code(500); // Internal Server Error
        $dados_tarefas['status'] = false;
        $dados_tarefas['mensagem'] = 'Erro ao listar as tarefas.';
        echo json_encode($dados_tarefas);
    }

?>