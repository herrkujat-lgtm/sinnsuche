# Was brauchst du wirklich? – Anleitung

Interaktive Religions-Doppelstunde (Klasse 11) mit anonymer Live-Auswertung für iPads.
Die Schüler:innen brauchen nur den Link: kein Code, kein Login, kein Name.

## Inhalt des Ordners

- `public/index.html` – die Unterrichtsseite
- `public/qrcode.js` – erzeugt den QR-Code für den Beamer
- `netlify/functions/api.mjs` – sammelt die Abgaben anonym (Netlify Blobs)
- `netlify.toml`, `package.json` – Konfiguration für Netlify

## Einmalig online stellen (ca. 15 Minuten, am Computer)

1. **GitHub-Konto** anlegen auf github.com (kostenlos).
2. Oben rechts **„+“ → „New repository“**, Name z. B. `sinnsuche`, „Create repository“.
3. Auf der neuen Seite **„uploading an existing file“** anklicken.
   Diesen Ordner öffnen und **seinen Inhalt** ins Browserfenster ziehen:
   die Ordner `public` und `netlify` sowie `netlify.toml` und `package.json`.
   Wichtig: Die beiden Ordner müssen als Ordner ankommen (in Chrome oder Edge klappt das per Drag & Drop).
   Dann unten **„Commit changes“**.
4. Auf app.netlify.com: **„Add new project“ → „Import an existing project“ → GitHub**,
   Zugriff erlauben, das Repository `sinnsuche` wählen, **„Deploy“**.
5. Fertig. Den Seitennamen (z. B. `sinnsuche-roeka.netlify.app`) und die Lehrkraft-PIN
   kann Claude über den Netlify-Connector für dich einrichten, oder du machst es selbst:
   - Name: „Project configuration“ → „Change project name“
   - PIN: „Project configuration“ → „Environment variables“ → Key `LEHRER_PIN`, Wert = deine PIN,
     danach „Deploys“ → „Trigger deploy“.

Spätere Änderungen: Neue Datei bei GitHub hochladen, Netlify aktualisiert die Seite von selbst.

## Im Unterricht

1. Am Beamer-Rechner `…netlify.app/?lehrer` öffnen (oder unten auf der Seite „Lehrkraft-Ansicht öffnen“).
   Beim ersten Mal die PIN eingeben, sie wird auf diesem Gerät gemerkt.
2. Vor jeder Klasse **„Neue Runde starten“**. Die Antworten der vorigen Runde werden dabei gelöscht.
3. Die Schüler:innen scannen den QR-Code mit der iPad-Kamera oder öffnen den Link.
4. Abgaben kommen live an. Du siehst die Anzahl pro Station und deckst die Ergebnisse auf, wenn du so weit bist.
5. Mit „Vorschau mit Beispieldaten“ kannst du alles vorher ausprobieren.

Hinweis: Es läuft immer genau eine Runde. Arbeiten zwei Klassen gleichzeitig mit derselben Seite,
landen ihre Antworten in derselben Auswertung.

## Datenschutz

Gespeichert werden nur die Antworten: je Station und iPad eine (eine zufällige Geräte-Kennung sorgt dafür,
dass erneutes Abgeben überschreibt statt doppelt zählt). Keine Namen, keine Konten, keine IP-Adressen
in den Daten. „Neue Runde starten“ löscht alle bisherigen Antworten.
Schriften werden von Google Fonts geladen. Wer das vermeiden möchte, entfernt in `index.html`
die Zeilen mit fonts.googleapis.com, dann nutzt die Seite Systemschriften.
