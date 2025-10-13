<link rel="stylesheet" href="nois-code.css">
<?php
// Configurações do banco (altere se precisar)
$host = "localhost";
$usuario = "root";
$senha = "123456";
$banco = "noiscode_db";

// Conectar ao banco
$conexao = new mysqli($host, $usuario, $senha, $banco);

// Verificar se deu certo
if ($conexao->connect_error) {
    die("❌ Erro: " . $conexao->connect_error);
}

echo "✅ Conectado ao banco com sucesso!<br><br>";

// Buscar usuários
$sql = "SELECT * FROM usuarios";
$resultado = $conexao->query($sql);

if ($resultado->num_rows > 0) {
    echo "👥 Usuários cadastrados:<br>";
    while($user = $resultado->fetch_assoc()) {
        echo " - " . $user["nome"] . " (" . $user["stack_principal"] . ")<br>";
    }
} else {
    echo "❌ Nenhum usuário encontrado";
}

$conexao->close();
?>