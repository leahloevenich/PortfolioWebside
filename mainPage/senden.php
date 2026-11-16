<?php
// Nur ausführen, wenn das Formular per POST abgesendet wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {


                    // SPAMSCHUTZ: Prüfen, ob das Honeypot-Feld ausgefüllt wurde
                    if (!empty($_POST["website"])) {
                        echo "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.";
                        exit;
                    }

    // 1. Ihre Ziel-E-Mail-Adresse (HIER ANPASSEN)
    $empfaenger = "leah.loevenich@gmail.com";
    $betreff = "Neue Kontaktanfrage über die Webseite";

    // 2. Formulardaten sicher auslesen und bereinigen
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $nachricht = trim($_POST["nachricht"]);
    $datenschutz = isset($_POST["datenschutz"]);

    // 3. Pflichtfelder und E-Mail-Format prüfen
    if (empty($name) || empty($nachricht) || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$datenschutz) {
        echo "Bitte füllen Sie alle Pflichtfelder korrekt aus und akzeptieren Sie die Datenschutzerklärung.";
        exit;
    }

    // 4. Inhalt der E-Mail zusammenstellen
    $email_inhalt = "Name: $name\n";
    $email_inhalt .= "E-Mail: $email\n\n";
    $email_inhalt .= "Nachricht:\n$nachricht\n";

    // 5. E-Mail-Header festlegen (Wichtig gegen Spam-Einstufung)
    // Nutzen Sie als 'From' am besten eine Adresse Ihrer eigenen Domain
    $headers = "From: Webseite <noreply@ihre-domain.de>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // 6. E-Mail absenden
    if (mail($empfaenger, $betreff, $email_inhalt, $headers)) {
        echo "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.";
    } else {
        echo "Entschuldigung, beim Senden der Nachricht ist ein Fehler aufgetreten.";
    }

} else {
    // Direkten Aufruf der PHP-Datei verhindern
    echo "Ungültiger Zugriff.";
}
?>