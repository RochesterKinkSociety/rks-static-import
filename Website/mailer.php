<?php
$to = "rks@rochesterkinksociety.com";
$from = filter_var ( $_REQUEST ['from'], FILTER_VALIDATE_EMAIL );
$subject = strip_tags ( $_REQUEST ['subject'] );
$message = strip_tags ( $_REQUEST ['body'] );

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From: ' . $from . "\r\n" . 'X-Mailer: PHP/' . phpversion ();

$return = mail ( $to, $subject, $message, $headers );
echo json_encode ( $return );
?>
