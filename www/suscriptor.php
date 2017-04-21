<?php 

date_default_timezone_set("EST");

require __DIR__ . "/../vendor/autoload.php";

extract($_POST);
$url_administrador = 'https://locales.avenidacabildo.com.ar/';

$mail_admin = "
<html>
<head>
  <title>Hola Administrador, una nueva cuenta ha sido creada a nombre de {$nombre_suscriptor}</title>
</head>
<body>
  <table>
    <tr>
      <td>Nombre:</td><td>{$nombre_suscriptor}</td>
    </tr>
    <tr>
      <td>Local:</td><td>{$local}</td>
    </tr>
    <tr>
      <td>Nombre de usuario:</td><td>{$mail_suscriptor}</td>
    </tr>
    <tr>
      <td>Clave:</td><td>{$pass}</td>
    </tr>	    
  </table>
</body>
</html>";

// mensaje
$mail_usuario = "
<html>
<head>
  <title>ArtBCo</title>
</head>
<body>
  <table>
    <tr>
      <td>Estimado {$nombre_suscriptor},<br><br>

      Bienvenido a Administración Avenida Cabildo.<br> <br>

      Desde tu panel podrás actualizar los datos de tu local y notificar pagos.<br><br>

      por favor conserva este correo con los siguientes datos para ingresar a tu panel<br><br>

<pre>
  URL del panel : {$url_administrador}
  Local : {$local}
  Nombre de usuario: {$mail_suscriptor}<br><br>
  Contraseña: {$pass} <br><br>
</pre>

      <br><br>

      El equipo Avenida Cabildo</td>
      </tr>
  </table>
</body>
</html>";

$mail = new PHPMailer;
$mail->isSMTP(); 

/* Hay que hacer esto porque el server no funciona el ssl */

$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
$mail->Host = 'mail.avenidacabildo.com.ar';
$mail->SMTPAuth = true;    
$mail->SMTPAutoTLS = false;
$mail->Username = 'noresponder@avenidacabildo.com.ar';
$mail->Password = 'noresp2004';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('no-reply@avenidacabildo.com.ar', 'Avenida Cabildo');
$mail->addAddress('info@avenidacabildo.com.ar', 'Avenida Cabildo');     // Add a recipient
//$mail->setFrom('no-reply@avenidacabildo.com.ar', 'Avenida Cabildo');
//$mail->addAddress('martin@devmeta.net', 'Avenida Cabildo');     // Add a recipient

$mail->Body    = $mail_admin;
$mail->AltBody = $mail_admin;
$mail->SMTPDebug = 0;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Success';
}

$mail->addAddress($mail_suscriptor, "{$nombre_suscriptor}");
$mail->addReplyTo('info@avenidacabildo.com.ar', 'Avenida Cabildo');
$mail->Subject = "{$nombre_suscriptor}, tu nueva cuenta ha sido creadacon éxito";
$mail->Body    = $mail_usuario;
$mail->AltBody = $mail_usuario;
$mail->SMTPDebug = 0;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Success';
}