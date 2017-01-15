<?php
    $nrkUrl = $_GET['nrkUrl'];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $nrkUrl);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $xml = curl_exec($ch);
    curl_close($ch);
    echo $xml;
?>