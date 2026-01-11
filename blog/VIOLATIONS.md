# Violation Schema - axe-core Regeln

## Verwendete Regeln nach Kategorie

### WCAG 2.0 Level A - Critical
| Rule ID | WCAG | Beschreibung | Impact |
|---------|------|--------------|--------|
| `image-alt` | 1.1.1 | Bilder ohne alt-Attribut | critical |
| `button-name` | 4.1.2 | Buttons ohne accessible name | critical |
| `link-name` | 4.1.2 | Links ohne accessible name | critical |
| `input-image-alt` | 1.1.1 | Input type=image ohne alt | critical |

### WCAG 2.0 Level A - Serious
| Rule ID | WCAG | Beschreibung | Impact |
|---------|------|--------------|--------|
| `label` | 1.3.1 | Formularfelder ohne Label | serious |
| `frame-title` | 4.1.2 | iframes ohne title | serious |
| `html-has-lang` | 3.1.1 | html ohne lang-Attribut | serious |
| `duplicate-id` | 4.1.1 | Doppelte IDs | serious |
| `th-has-data-cells` | 1.3.1 | th ohne zugehörige Datenzellen | serious |

### WCAG 2.0 Level AA - Serious
| Rule ID | WCAG | Beschreibung | Impact |
|---------|------|--------------|--------|
| `color-contrast` | 1.4.3 | Unzureichender Kontrast (< 4.5:1) | serious |

### WCAG 2.1 Level A - Serious
| Rule ID | WCAG | Beschreibung | Impact |
|---------|------|--------------|--------|
| `aria-input-field-name` | 4.1.2 | ARIA input ohne accessible name | serious |

### WCAG 2.1 Level AA - Serious
| Rule ID | WCAG | Beschreibung | Impact |
|---------|------|--------------|--------|
| `autocomplete-valid` | 1.3.5 | Ungültiges autocomplete-Attribut | serious |

### Best Practices - Moderate
| Rule ID | Beschreibung | Impact |
|---------|--------------|--------|
| `heading-order` | Überschriften-Hierarchie übersprungen | moderate |
| `empty-heading` | Leere Überschrift | moderate |
| `link-in-text-block` | Link nicht unterscheidbar | moderate |
| `tabindex` | tabindex > 0 | moderate |

### Best Practices - Minor
| Rule ID | Beschreibung | Impact |
|---------|--------------|--------|
| `landmark-one-main` | Kein main-Landmark | minor |
| `region` | Inhalt außerhalb von Landmarks | minor |

---

## Geplante Verstöße pro Seite

### Tiefe 0 (1 Seite)
| Seite | Verstöße | Details |
|-------|----------|---------|
| index.html | 5 | 1x image-alt, 1x link-name, 1x color-contrast, 1x empty-heading, 1x heading-order |

### Tiefe 1 (7 Seiten)
| Seite | Verstöße | Details |
|-------|----------|---------|
| post-1.html | 4 | 1x color-contrast, 1x heading-order, 1x button-name, 1x tabindex |
| post-2.html | 5 | 2x label, 1x button-name, 1x color-contrast, 1x th-has-data-cells |
| post-3.html | 4 | 1x color-contrast, 2x tabindex, 1x link-name |
| category/index.html | 2 | 1x empty-heading, 1x link-name |
| admin/index.html | 3 | 1x image-alt, 1x button-name, 1x color-contrast |
| products/index.html | 3 | 1x image-alt, 1x link-name, 1x empty-heading |
| docs/index.html | 2 | 1x empty-heading, 1x link-name |

### Tiefe 2 (13 Seiten)
| Seite | Verstöße | Details |
|-------|----------|---------|
| category/tech.html | 3 | 1x image-alt, 1x link-name, 1x heading-order |
| category/news.html | 3 | 1x color-contrast, 1x link-name, 1x frame-title |
| category/tutorials.html | 2 | 1x label, 1x button-name |
| admin/users.html | 4 | 2x label, 1x button-name, 1x duplicate-id |
| admin/settings.html | 3 | 1x label, 1x autocomplete-valid, 1x heading-order |
| admin/reports/index.html | 3 | 1x link-name, 1x button-name, 1x color-contrast |
| products/scanner-pro.html | 3 | 1x label, 1x image-alt, 1x heading-order |
| products/audit-service.html | 2 | 2x label |
| products/training.html | 3 | 1x color-contrast, 1x link-name, 1x heading-order |
| products/details/index.html | 2 | 1x empty-heading, 1x link-name |
| docs/getting-started.html | 3 | 1x color-contrast, 1x heading-order, 1x empty-heading |
| docs/installation.html | 3 | 1x label, 1x heading-order, 1x tabindex |
| docs/api/index.html | 3 | 1x link-name, 1x color-contrast, 1x heading-order |

### Tiefe 3 (6 Seiten)
| Seite | Verstöße | Details |
|-------|----------|---------|
| admin/reports/monthly.html | 3 | 1x frame-title, 1x th-has-data-cells, 1x color-contrast |
| products/details/specs.html | 2 | 1x image-alt, 1x heading-order |
| products/details/reviews.html | 4 | 1x color-contrast, 2x label, 1x heading-order |
| products/details/consulting.html | 3 | 2x label, 1x heading-order |
| docs/api/reference.html | 2 | 1x link-name, 1x heading-order |
| docs/api/examples.html | 2 | 1x link-name, 1x heading-order |

---

## Zusammenfassung

### Nach Tiefe
| Tiefe | Seiten | Verstöße |
|-------|--------|----------|
| 0 | 1 | 5 |
| 1 | 7 | 23 |
| 2 | 13 | 37 |
| 3 | 6 | 16 |
| **Gesamt** | **27** | **81** |

### Nach Szenario
| Szenario | Seiten | Verstöße |
|----------|--------|----------|
| Max. Tiefe 1 | 8 | 28 |
| Max. Tiefe 2 | 21 | 65 |
| Max. Tiefe 3 | 27 | 81 |
| Ohne /admin | 22 | 64 |
| Nur /category | 4 | 10 |

### Nach Impact
| Impact | Anzahl |
|--------|--------|
| critical | 15 |
| serious | 42 |
| moderate | 22 |
| minor | 2 |

### Nach Kategorie
| Kategorie | Anzahl |
|-----------|--------|
| WCAG 2.0 A | 38 |
| WCAG 2.0 AA | 12 |
| WCAG 2.1 AA | 1 |
| Best Practices | 30 |

### Nach Rule ID (Top 10)
| Rule | Anzahl |
|------|--------|
| heading-order | 12 |
| label | 11 |
| link-name | 10 |
| color-contrast | 9 |
| image-alt | 5 |
| button-name | 5 |
| empty-heading | 5 |
| tabindex | 4 |
| frame-title | 2 |
| th-has-data-cells | 2 |
