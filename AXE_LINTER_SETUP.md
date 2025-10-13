# axe DevTools Linter Setup Anleitung

## Voraussetzungen

Du benötigst:
1. **Deque Agora Account** - Zugang zum Deque Kundenportal
2. **AXE_LINTER_API_KEY** - API-Schlüssel von Deque

## Installation

### 1. Binary herunterladen

1. Melde dich bei **Deque's Agora** an: https://agora.deque.com/
2. Navigiere zu **Downloads** > **axe DevTools Linter**
3. Lade **axe-linter-connector-macos** herunter
4. Speichere die Datei nach: `.husky/_/axe-linter-connector-macos`

### 2. Binary vorbereiten

Führe folgende Befehle aus:

```bash
# Ausführrechte setzen
chmod +x .husky/_/axe-linter-connector-macos

# macOS Quarantine-Attribut entfernen (wichtig!)
xattr -d com.apple.quarantine .husky/_/axe-linter-connector-macos
```

### 3. API-Key konfigurieren

Setze die Umgebungsvariable `AXE_LINTER_API_KEY`:

**Option A: Temporär (nur für aktuelle Terminal-Session)**
```bash
export AXE_LINTER_API_KEY="dein_api_key_hier"
```

**Option B: Dauerhaft in ~/.zshrc oder ~/.bash_profile**
```bash
echo 'export AXE_LINTER_API_KEY="dein_api_key_hier"' >> ~/.zshrc
source ~/.zshrc
```

**Option C: Projekt-spezifisch (.env Datei - NICHT committen!)**
```bash
# Erstelle .env Datei (bereits in .gitignore)
echo 'export AXE_LINTER_API_KEY="dein_api_key_hier"' > .env
# Lade vor jedem Commit:
source .env
```

## Verwendung

### Pre-commit Hook

Der Hook läuft **automatisch** bei jedem `git commit` und prüft:
- HTML, HTM
- JavaScript (JS, JSX)
- TypeScript (TS, TSX)
- Vue Dateien
- Markdown (MD, MARKDOWN)

**Beispiel:**
```bash
git add shop/checkout.html
git commit -m "Update checkout page"
# Hook läuft automatisch und prüft auf Accessibility-Probleme
```

### Manuell testen

```bash
./.husky/_/axe-linter-connector-macos -s shop/checkout.html -d . --api-key $AXE_LINTER_API_KEY --config ./axe-linter.yml --url https://axe-linter.deque.com/
```

## Konfiguration

Die Datei `axe-linter.yml` enthält die Konfiguration:
- Eingeschlossene Dateimuster
- Ausgeschlossene Dateimuster
- Minimale Severity (moderate, serious, critical)
- Regel-Konfiguration

## Troubleshooting

### "AXE_LINTER_API_KEY must be set"
→ Umgebungsvariable ist nicht gesetzt (siehe Schritt 3)

### "Cannot execute binary file"
→ Führe `xattr -d com.apple.quarantine` aus (siehe Schritt 2)

### "Permission denied"
→ Führe `chmod +x` aus (siehe Schritt 2)

### Hook umgehen (Notfall)
```bash
git commit --no-verify -m "Message"
```

## Unterschied zu @axe-core/cli

| Feature | @axe-core/cli (alt) | axe DevTools Linter (neu) |
|---------|---------------------|---------------------------|
| Kosten | Kostenlos | Kommerziell (API-Key) |
| Dateitypen | Nur HTML | HTML, JS, JSX, TS, TSX, Vue, MD |
| Reports | Basis | Detailliert + Tracking |
| Lokal/Cloud | Lokal | Cloud-Service |
| Konsistenz mit CI | - | ✅ Gleicher Service wie GitHub Action |

## Support

Bei Problemen:
- Deque Support Desk: https://support.deque.com/
- Dokumentation: https://docs.deque.com/linter/4.0.0/
