    <?php
    //preparing the response headers for JSON output
    header('Content-Type: application/json; charset=utf-8');

    //initializing the response array
    $dados_tarefas = [
        'status' => false,
        'mensagem' => ''
    ];
    
    //validating POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $titulo = trim($_POST['titulo'] ?? '');
    } else {
        http_response_code(405); // Method Not Allowed
        $dados_tarefas['status'] = false;
        $dados_tarefas['mensagem'] = 'Método inválido. Use POST para criar uma tarefa.';
        echo json_encode($dados_tarefas);
        exit; 
    }
    //titulo for !null and not empty
    if (!empty($titulo)) {
    } else {
        http_response_code(400); // Bad Request
        $dados_tarefas['status'] = false;
        $dados_tarefas['mensagem'] = 'O campo \'titulo\' é obrigatório para criar a tarefa.';
        echo json_encode($dados_tarefas);
        exit;
    }
    //if conditions POST and titulo are valid, insert into database
    try {   
        include_once __DIR__ . '/conexao.php';
        $sql = "INSERT INTO tarefas (titulo) VALUES (?)";
        $stmt = $dbh->prepare($sql);
        $stmt->execute([$titulo]);
        http_response_code(201); // Created
        $dados_tarefas['titulo'] = $titulo;
        $dados_tarefas['status'] = true;
        $dados_tarefas['mensagem'] = 'Tarefa criada com sucesso.';
        echo json_encode($dados_tarefas);
        } catch (PDOException $e) {
            error_log(
                $e->getMessage() . PHP_EOL,
                3,
                __DIR__ . '/erros.log'
            );
            http_response_code(500); // Internal Server Error
            $dados_tarefas['status'] = false;
            $dados_tarefas['mensagem'] = 'Erro ao criar a tarefa.';
            echo json_encode($dados_tarefas);
        }
    ?>