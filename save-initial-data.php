<?php
// Preia datele JSON trimise prin POST
$data = json_decode(file_get_contents('php://input'), true);

// Converteste datele in format JSON
$jsonData = json_encode($data);

// Salveaza datele in fisierul Films4K.json
$file = 'Films4K.json';
file_put_contents($file, $jsonData);

// Raspunde cu un mesaj de succes
http_response_code(200);
?>
