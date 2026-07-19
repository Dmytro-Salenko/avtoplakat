<?php

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$cart = $_POST['cart'];


$subject = "=?utf-8?B?" . base64_encode("Нове замовлення") . "?=";
$headers = "From: $email\r\nReply-to: $email\r\nContent-type: text/html; charset=utf-8\r\n";

$order = "<b>Ім'я </b>:" . $name . '<br><b>Email: </b>' . $email . '<br><b>Номер телефону: </b>' . $phone . '<br>' . $cart;

$success = mail("support@avtoplakat.com.ua", $subject, $order, $headers);
echo $success;
