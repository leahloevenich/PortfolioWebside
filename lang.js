/* changing the language of the website */

function changeLanguage(lang) {
    // 1. Sprache im Browser speichern, damit sie beim Klick auf andere Seiten erhalten bleibt
    localStorage.setItem('site-lang', lang);

    // 2. Alle Elemente suchen, die ein data-de Attribut haben
    document.querySelectorAll('[data-de]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            // innerHTML wird genutzt, damit auch HTML-Zeichen (wie Pfeile &rarr;) funktionieren
            el.innerHTML = text;

            if (el.classList.contains('banner')) {
                const charCount = text.length; // Zählt die Zeichen (z.B. "Versuche es..." = 13)
                el.style.setProperty('--steps', charCount);
                
                // Optional: Die Duration leicht anpassen, damit längere Texte nicht zu schnell rattern
                // Beispiel: 0.15 Sekunden pro Buchstabe, mindestens aber 1.5 Sekunden
                const duration = Math.max(1.5, charCount * 0.1) + 's';
                el.style.setProperty('--duration', duration);
            }
        }
    });

    // 3. Optional: CSS-Klasse für aktive Buttons umschalten (falls du Buttons stylen willst)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(lang)) {
            btn.classList.add('active-lang');
        } else {
            btn.classList.remove('active-lang');
        }
    });
}

// 4. Automatisch beim Laden jeder Seite ausführen
window.addEventListener('DOMContentLoaded', () => {
    // Standardmäßig Deutsch ('de'), wenn noch nichts gewählt wurde
    const savedLang = localStorage.getItem('site-lang') || 'de';
    changeLanguage(savedLang);
});