<link rel="stylesheet" href="nois-code.css">
<?php
// Configurações do banco - ATENÇÃO: altere para suas configurações!
$host = "localhost";
$usuario = "root";      // normalmente é 'root'
$senha = "123456";            // normalmente vazia no XAMPP
$banco = "noiscoddde_db";

// Tentar conectar
$conexao = new mysqli($host, $usuario, $senha, $banco);

// Verificar se conectou
if ($conexao->connect_error) {
    die("Erro de conexão: " . $conexao->connect_error);
}

echo "✅ Conectado ao banco com sucesso!<br>";

// Testar se consegue buscar os usuários
$sql = "SELECT * FROM usuarios";
$resultado = $conexao->query($sql);

if ($resultado->num_rows > 0) {
    echo "✅ Usuários encontrados: " . $resultado->num_rows . "<br>";
    
    while($usuario = $resultado->fetch_assoc()) {
        echo "Nome: " . $usuario["nome"] . " - Email: " . $usuario["email"] . "<br>";
    }
} else {
    echo "❌ Nenhum usuário encontrado";
}

$conexao->close();
?>