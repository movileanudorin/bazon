<?php
$targetDir = ""; // Specify the directory where you want to store the uploaded files

$uploadedFiles = $_FILES["filesToUpload"]; // Get the array of uploaded files

$uploadedFileCount = count($uploadedFiles["name"]); // Count the number of uploaded files

$uploadSuccessCount = 0; // Counter for successful uploads

// Loop through each uploaded file
for ($i = 0; $i < $uploadedFileCount; $i++) {
    $targetFile = $targetDir . basename($uploadedFiles["name"][$i]); // Get the file path for each file

    // Check if the file is valid and move it to the specified directory
    if (move_uploaded_file($uploadedFiles["tmp_name"][$i], $targetFile)) {
        $uploadSuccessCount++;
    }
}

$response = "$uploadSuccessCount out of $uploadedFileCount files have been uploaded successfully.";

// Send the response back to the client as JSON
header('Content-Type: application/json');
echo json_encode(['message' => $response]);

// Redirect to index.html
header('Location: index.html');
exit; // Terminate the current script

?>
