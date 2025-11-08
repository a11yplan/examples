# Sample Creation Guide (Leitfaden)

**A comprehensive guide for creating machine-readable accessibility test samples**

## Table of Contents

1. [Overview](#overview)
2. [Before You Start](#before-you-start)
3. [Step-by-Step Creation Process](#step-by-step-creation-process)
4. [Machine-Readable Patterns](#machine-readable-patterns)
5. [HTML Template](#html-template)
6. [Metadata Specifications](#metadata-specifications)
7. [CSS Conventions](#css-conventions)
8. [Test Case Categories](#test-case-categories)
9. [Expected Results Documentation](#expected-results-documentation)
10. [Validation and Testing](#validation-and-testing)
11. [Examples](#examples)
12. [Common Pitfalls](#common-pitfalls)

---

## Overview

This guide explains how to create accessibility test samples that are:
- ✅ **Machine-readable** - AI and scripts can parse expectations
- ✅ **Self-documenting** - Clear expectations embedded in HTML
- ✅ **Comprehensive** - Cover pass/fail/edge cases
- ✅ **Reproducible** - Deterministic, no external dependencies
- ✅ **Maintainable** - Follow consistent conventions

## Before You Start

### Required Knowledge

- WCAG criterion you want to test
- Success/failure conditions for that criterion
- Common patterns that violate the criterion
- Detection algorithm (if applicable)

### Choose Your Sample Type

**Type 1: Basic Example**
- Simple pass/fail demonstrations
- User education focus
- 6-12 test cases
- Example: `focus-visible-test.html`

**Type 2: Algorithm Test Suite**
- Comprehensive algorithm validation
- Edge case testing
- 20-40 test cases
- Example: `focus-visibility-detector-test.html`

**Type 3: Integration Test**
- Real-world scenarios
- Multiple criteria
- Complex interactions

---

## Step-by-Step Creation Process

### Step 1: Research the WCAG Criterion

```markdown
Criterion: [Number] - [Name]
Level: [A, AA, AAA]
Understanding Document: [URL]
Common Failures: [List]
Detection Method: [Manual, Automated, Algorithm]
```

Example:
```markdown
Criterion: 2.4.7 - Focus Visible
Level: AA
Understanding Document: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
Common Failures:
  - outline: none with no alternative
  - Insufficient contrast on focus indicator
  - Focus indicator too subtle
Detection Method: Algorithm-based (style comparison)
```

### Step 2: Define Test Case Categories

Organize test cases into logical categories:

```
Category 1: Clear Failures (< threshold)
Category 2: Clear Passes (> threshold)
Category 3: Edge Cases (near threshold)
Category 4: Combinations
Category 5: [Element-specific: inputs, links, etc.]
```

### Step 3: Plan Specific Test Cases

For each category, define specific test cases:

```markdown
TC1.1: [Description]
  - Element Type: [button, link, input, etc.]
  - Violation Pattern: [CSS pattern]
  - Expected Result: [pass/fail]
  - Expected Score: [if applicable]
  - Reason: [why it passes/fails]
```

Example:
```markdown
TC1.1: Outline None
  - Element Type: button
  - Violation Pattern: outline: none
  - Expected Result: FAIL
  - Expected Score: -50 points
  - Reason: Focus indicator removed with no alternative
```

### Step 4: Create File Structure

Use the [HTML Template](#html-template) below as your starting point.

### Step 5: Implement Test Cases

For each test case, add:
1. HTML element with data attributes
2. CSS styles (baseline + focus state)
3. Visual card with documentation
4. Code example block

### Step 6: Add Machine-Readable Metadata

Ensure every test case has complete metadata (see [Metadata Specifications](#metadata-specifications)).

### Step 7: Document Expected Results

Add structured expected results section (see [Expected Results Documentation](#expected-results-documentation)).

### Step 8: Validate

Run through the [Validation Checklist](#validation-and-testing).

---

## Machine-Readable Patterns

### Core Principle: Everything is Data

**❌ Bad - Human-readable only:**
```html
<p>This button should fail because it has no focus indicator.</p>
<button class="bad-button">Click me</button>
```

**✅ Good - Machine-readable:**
```html
<div class="test-card"
     data-test-id="TC1.1"
     data-expected-result="violation"
     data-expected-score="-50"
     data-wcag-criterion="2.4.7"
     data-violation-type="no-focus-indicator">
    <button class="tc1-outline-none">Click me</button>
</div>
```

### Naming Conventions

#### 1. File Names
```
Pattern: {criterion-slug}-{type}.html

Examples:
  focus-visible-test.html
  focus-visibility-detector-test.html
  color-contrast-test.html
  target-size-algorithm-test.html
```

#### 2. Test Case IDs
```
Pattern: TC{category}.{number}

Examples:
  TC1.1, TC1.2, TC1.3  (Category 1: Clear failures)
  TC2.1, TC2.2         (Category 2: Clear passes)
  TC3.1, TC3.2, TC3.3  (Category 3: Edge cases)

Usage:
  <div data-test-id="TC1.1">
```

#### 3. CSS Classes
```
Pattern: tc{category}-{descriptive-name}

Examples:
  .tc1-outline-none
  .tc2-standard-outline
  .tc3-background-only
  .tc4-outline-shadow

Usage:
  <button class="tc1-outline-none">
```

#### 4. Section IDs
```
Pattern: section-{category-name}

Examples:
  #section-clear-failures
  #section-clear-passes
  #section-edge-cases
```

### Data Attribute Taxonomy

#### Required Attributes

```html
data-test-id="TC1.1"              <!-- Unique test case identifier -->
data-expected-result="violation"   <!-- Expected outcome: violation|pass -->
data-wcag-criterion="2.4.7"       <!-- WCAG criterion number -->
```

#### Optional Attributes

```html
data-expected-score="-50"         <!-- Algorithm score (if applicable) -->
data-category="clear-failure"     <!-- Test category -->
data-element-type="button"        <!-- Element being tested -->
data-violation-type="no-focus"    <!-- Type of violation -->
data-confidence="high"            <!-- Expected confidence level -->
data-threshold="30"               <!-- Threshold value -->
```

#### Custom Algorithm Attributes

For algorithm-specific testing:

```html
data-outline-score="-50"          <!-- Individual indicator scores -->
data-border-score="0"
data-shadow-score="0"
data-background-score="0"
data-opacity-score="0"
data-total-score="-50"            <!-- Sum of all scores -->
```

---

## HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WCAG {criterion} - {Name} Test Page</title>

    <!-- Machine-readable metadata -->
    <meta name="test:wcag-criterion" content="{criterion}">
    <meta name="test:total-cases" content="{number}">
    <meta name="test:expected-violations" content="{number}">
    <meta name="test:expected-passes" content="{number}">

    <style>
        /* Base styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        /* Section styles */
        .section-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 40px 0 20px 0;
        }

        /* Test card grid */
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .test-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 2px solid #dee2e6;
        }

        /* Badge styles */
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
        }

        .badge-fail { background-color: #dc3545; color: white; }
        .badge-pass { background-color: #198754; color: white; }
        .badge-edge { background-color: #ffc107; color: #000; }

        /* Code block */
        .css-code {
            background-color: #2d2d2d;
            color: #d4d4d4;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin-top: 10px;
            overflow-x: auto;
        }

        /* Expected score indicators */
        .expected-score {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .score-fail { background-color: #f8d7da; color: #842029; }
        .score-pass { background-color: #d1e7dd; color: #0f5132; }
        .score-edge { background-color: #fff3cd; color: #664d03; }

        /* ============================================
           TEST CASE STYLES
           ============================================ */

        /* TC1.1: [Description] */
        .tc1-example {
            /* baseline styles */
        }
        .tc1-example:focus {
            /* focus styles that demonstrate violation/pass */
        }

        /* Add more test cases... */
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 WCAG {criterion} - {Name} Test Page</h1>

        <!-- Header with machine-readable info -->
        <div class="header-info"
             data-wcag-criterion="{criterion}"
             data-total-test-cases="{number}"
             data-expected-violations="{number}">
            <strong>Testing: WCAG {criterion} - {Name}</strong>
            <p>This page contains {number} test cases to validate detection of {criterion}.</p>
        </div>

        <!-- TEST CATEGORY 1 -->
        <div class="section-header" id="section-clear-failures">
            <h2>❌ Category 1: Clear Failures</h2>
            <p>Description of this category</p>
        </div>

        <div class="test-grid">
            <!-- Test Case 1.1 -->
            <div class="test-card"
                 data-test-id="TC1.1"
                 data-expected-result="violation"
                 data-expected-score="-50"
                 data-wcag-criterion="{criterion}"
                 data-category="clear-failure">

                <h3>TC1.1: [Test Name] <span class="badge badge-fail">FAIL</span></h3>

                <span class="expected-score score-fail">Expected: -50 points</span>

                <div class="test-description">
                    Clear explanation of what this test case demonstrates.
                </div>

                <div class="test-element-container">
                    <button class="tc1-example">Test Element</button>
                </div>

                <div class="css-code">/* CSS that causes the violation */
.tc1-example:focus {
  outline: none;
}</div>
            </div>

            <!-- Add more test cases... -->
        </div>

        <!-- TEST CATEGORY 2 -->
        <div class="section-header" id="section-clear-passes">
            <h2>✅ Category 2: Clear Passes</h2>
            <p>Description of this category</p>
        </div>

        <div class="test-grid">
            <!-- Test cases for passing examples... -->
        </div>

        <!-- EXPECTED RESULTS SECTION -->
        <div class="expected-results-section"
             data-total-focusable="{number}"
             data-expected-violations="{number}"
             data-expected-passes="{number}">

            <h3>📊 Expected Test Results</h3>

            <div class="results-summary">
                <ul>
                    <li><strong>Total Test Cases:</strong> {number}</li>
                    <li><strong>Expected Violations:</strong> {number}
                        <ul class="violation-list">
                            <li>TC1.1 - {reason}</li>
                            <li>TC1.2 - {reason}</li>
                        </ul>
                    </li>
                    <li><strong>Expected Passes:</strong> {number}</li>
                </ul>
            </div>

            <!-- Algorithm details (if applicable) -->
            <div class="algorithm-details">
                <h4>Detection Algorithm</h4>
                <ul>
                    <li><strong>Indicator 1:</strong> {points} points</li>
                    <li><strong>Indicator 2:</strong> {points} points</li>
                    <li><strong>Threshold:</strong> ≥{percentage}% confidence</li>
                </ul>
            </div>

            <!-- Console output example -->
            <div class="expected-console-output">
                <h4>Expected Scanner Output</h4>
                <div class="css-code">
[SCOPE:operation] {Description}: {checked} checked, {violations} violations
[PHASE:{PHASE_NAME}] Found {violations} violations

Violation Details:
- TC1.1: {description} (confidence: {score}%)
- TC1.2: {description} (confidence: {score}%)
                </div>
            </div>
        </div>
    </div>

    <!-- Debugging and validation scripts -->
    <script>
        // Machine-readable test metadata
        window.testMetadata = {
            wcagCriterion: '{criterion}',
            totalCases: {number},
            expectedViolations: {number},
            expectedPasses: {number},
            testCases: []
        };

        // Parse all test cases
        document.querySelectorAll('[data-test-id]').forEach(testCard => {
            const testCase = {
                id: testCard.dataset.testId,
                expectedResult: testCard.dataset.expectedResult,
                expectedScore: parseInt(testCard.dataset.expectedScore || '0'),
                criterion: testCard.dataset.wcagCriterion,
                category: testCard.dataset.category
            };
            window.testMetadata.testCases.push(testCase);
        });

        // Export function for validation scripts
        window.getTestMetadata = function() {
            return window.testMetadata;
        };

        // Focus event logging
        document.addEventListener('focus', function(e) {
            const element = e.target;
            const className = element.className;

            if (className.startsWith('tc')) {
                console.log(`[FOCUS] ${className}`);
                const styles = window.getComputedStyle(element);
                console.log('  Computed styles:', {
                    outline: styles.outline,
                    border: styles.border,
                    boxShadow: styles.boxShadow,
                    backgroundColor: styles.backgroundColor
                });
            }
        }, true);

        console.log('✅ Test page loaded');
        console.log('📊 Test metadata:', window.testMetadata);
        console.log('🔍 Use window.getTestMetadata() to access test data');
    </script>
</body>
</html>
```

---

## Metadata Specifications

### Complete Metadata Example

```html
<div class="test-card"
     data-test-id="TC1.1"
     data-expected-result="violation"
     data-expected-score="-50"
     data-wcag-criterion="2.4.7"
     data-category="clear-failure"
     data-element-type="button"
     data-violation-type="no-focus-indicator"
     data-confidence="high"
     data-threshold="30"
     data-outline-score="-50"
     data-border-score="0"
     data-shadow-score="0"
     data-background-score="0"
     data-total-score="-50">
    <!-- Test content -->
</div>
```

### Metadata for Different Test Types

#### Simple Pass/Fail Tests

```html
<div data-test-id="TC1.1"
     data-expected-result="violation"
     data-wcag-criterion="1.4.3">
```

#### Algorithm-Based Tests

```html
<div data-test-id="TC1.1"
     data-expected-result="violation"
     data-expected-score="-50"
     data-wcag-criterion="2.4.7"
     data-threshold="30">
```

#### Multi-Criterion Tests

```html
<div data-test-id="TC1.1"
     data-expected-results='["violation:1.4.3", "pass:2.4.7"]'
     data-wcag-criteria="1.4.3,2.4.7">
```

---

## CSS Conventions

### Naming Pattern

```css
/* Pattern: .tc{category}-{descriptive-slug} */

/* Category 1: Clear Failures */
.tc1-outline-none { }
.tc1-outline-zero { }
.tc1-no-indicator { }

/* Category 2: Clear Passes */
.tc2-standard-outline { }
.tc2-custom-outline { }
.tc2-box-shadow { }

/* Category 3: Edge Cases */
.tc3-background-only { }
.tc3-transform-only { }
.tc3-border-background { }
```

### Style Organization

```css
/* ============================================
   TEST CASE 1: CLEAR FAILURES
   ============================================ */

/* TC1.1: Outline none with no alternative */
.tc1-outline-none {
    /* baseline styles */
    padding: 10px 20px;
    background-color: #0d6efd;
    color: white;
    border: none;
    cursor: pointer;
}
.tc1-outline-none:focus {
    /* focus state that demonstrates violation */
    outline: none; /* Violation */
}

/* TC1.2: Another test case */
/* ... */
```

### Comment Headers

Use clear comment blocks to organize CSS:

```css
/* ============================================
   CATEGORY NAME (Expected Score Range)
   ============================================ */
```

---

## Test Case Categories

### Category 1: Clear Failures

**Purpose:** Test cases that should definitely be flagged as violations

**Characteristics:**
- Obvious violations
- Well below threshold (if algorithm-based)
- Common anti-patterns

**Example:**
```html
<div data-test-id="TC1.1" data-expected-result="violation">
    <button class="tc1-outline-none">No focus indicator</button>
</div>
```

### Category 2: Clear Passes

**Purpose:** Test cases that should definitely pass

**Characteristics:**
- Clear compliance
- Well above threshold (if algorithm-based)
- Best practices

**Example:**
```html
<div data-test-id="TC2.1" data-expected-result="pass">
    <button class="tc2-standard-outline">Clear focus outline</button>
</div>
```

### Category 3: Edge Cases

**Purpose:** Test boundary conditions and threshold limits

**Characteristics:**
- Near threshold values
- Subtle differences
- Tests algorithm precision

**Example:**
```html
<div data-test-id="TC3.1"
     data-expected-result="violation"
     data-expected-score="25"
     data-threshold="30">
    <button class="tc3-just-below">Just below threshold</button>
</div>
```

### Category 4: Combinations

**Purpose:** Test multiple indicators or patterns together

**Example:**
```html
<div data-test-id="TC4.1" data-expected-result="pass">
    <button class="tc4-outline-shadow">Outline + Shadow</button>
</div>
```

### Category 5+: Element-Specific

**Purpose:** Test different element types

**Categories:**
- Input elements (text, select, textarea)
- Links (anchor tags)
- Buttons
- Custom interactive elements (divs with tabindex)

---

## Expected Results Documentation

### Structured Format

```html
<div class="expected-results-section"
     data-total-elements="{number}"
     data-expected-violations="{number}"
     data-expected-passes="{number}">

    <h3>📊 Expected Test Results</h3>

    <ul>
        <li><strong>Total Elements:</strong> <span data-value="total">{number}</span></li>
        <li><strong>Expected Violations:</strong> <span data-value="violations">{number}</span>
            <ul data-violation-list>
                <li data-violation-id="TC1.1">TC1.1 - {reason}</li>
                <li data-violation-id="TC1.2">TC1.2 - {reason}</li>
            </ul>
        </li>
        <li><strong>Expected Passes:</strong> <span data-value="passes">{number}</span></li>
    </ul>
</div>
```

### Validation Script Template

```javascript
/**
 * Validate scanner results against expected outcomes
 */
function validateScannerResults(scannerOutput) {
    const expected = window.getTestMetadata();
    const results = {
        totalTests: expected.totalCases,
        passed: 0,
        failed: 0,
        falsePositives: [],
        falseNegatives: []
    };

    expected.testCases.forEach(testCase => {
        const scannerResult = scannerOutput.find(r => r.selector.includes(testCase.id));
        const expectedViolation = testCase.expectedResult === 'violation';
        const foundViolation = !!scannerResult;

        if (expectedViolation === foundViolation) {
            results.passed++;
        } else {
            results.failed++;
            if (foundViolation && !expectedViolation) {
                results.falsePositives.push(testCase.id);
            } else {
                results.falseNegatives.push(testCase.id);
            }
        }
    });

    return results;
}
```

---

## Validation and Testing

### Pre-Commit Checklist

```markdown
- [ ] File name follows convention
- [ ] All test cases have unique IDs
- [ ] All test cases have expected results
- [ ] CSS classes follow naming pattern
- [ ] Metadata is complete and consistent
- [ ] Expected results section is accurate
- [ ] Visual indicators are present
- [ ] Code examples are included
- [ ] No external dependencies
- [ ] Tested in browser (manual keyboard navigation)
- [ ] Tested with scanner (if available)
- [ ] Documentation is clear
```

### Manual Testing

1. **Keyboard Navigation:**
   ```
   - Press Tab to navigate through all focusable elements
   - Verify expected pass/fail behavior matches reality
   - Check that visual indicators are clear
   ```

2. **Visual Inspection:**
   ```
   - Color coding matches expected results
   - Badges (PASS/FAIL) are correct
   - Code examples match actual CSS
   ```

3. **Metadata Validation:**
   ```javascript
   // Run in browser console
   const metadata = window.getTestMetadata();
   console.table(metadata.testCases);

   // Verify:
   // - All IDs are unique
   // - All scores are present (for algorithm tests)
   // - Total counts match
   ```

### Automated Validation Script

```javascript
/**
 * Automated validation of test page structure
 */
function validateTestPage() {
    const errors = [];
    const warnings = [];

    // Check meta tags
    const metaTags = {
        criterion: document.querySelector('meta[name="test:wcag-criterion"]'),
        totalCases: document.querySelector('meta[name="test:total-cases"]'),
        violations: document.querySelector('meta[name="test:expected-violations"]')
    };

    if (!metaTags.criterion) {
        errors.push('Missing meta tag: test:wcag-criterion');
    }

    // Check test cases
    const testCases = document.querySelectorAll('[data-test-id]');
    const ids = new Set();

    testCases.forEach(tc => {
        const id = tc.dataset.testId;

        // Check for duplicates
        if (ids.has(id)) {
            errors.push(`Duplicate test ID: ${id}`);
        }
        ids.add(id);

        // Check required attributes
        if (!tc.dataset.expectedResult) {
            errors.push(`${id}: Missing data-expected-result`);
        }
        if (!tc.dataset.wcagCriterion) {
            errors.push(`${id}: Missing data-wcag-criterion`);
        }

        // Check CSS class naming
        const element = tc.querySelector('[class^="tc"]');
        if (!element) {
            warnings.push(`${id}: No element with tc* class found`);
        }
    });

    // Check expected results section
    const resultsSection = document.querySelector('.expected-results-section');
    if (!resultsSection) {
        errors.push('Missing expected results section');
    }

    return { errors, warnings, totalTests: testCases.length };
}

// Run validation
const validation = validateTestPage();
console.log('Validation Results:', validation);
```

---

## Examples

### Example 1: Simple Color Contrast Test

```html
<div class="test-card"
     data-test-id="TC1.1"
     data-expected-result="violation"
     data-wcag-criterion="1.4.3"
     data-contrast-ratio="2.5"
     data-required-ratio="4.5">

    <h3>TC1.1: Insufficient Contrast <span class="badge badge-fail">FAIL</span></h3>

    <div class="test-description">
        Text with 2.5:1 contrast ratio (requires 4.5:1 for normal text).
    </div>

    <div class="test-element-container">
        <p class="tc1-low-contrast">This text has insufficient contrast.</p>
    </div>

    <div class="css-code">.tc1-low-contrast {
  color: #777;           /* Low contrast */
  background: #f5f5f5;   /* Light background */
  /* Contrast ratio: 2.5:1 < 4.5:1 required */
}</div>
</div>
```

### Example 2: Algorithm-Based Focus Test

```html
<div class="test-card"
     data-test-id="TC3.1"
     data-expected-result="violation"
     data-expected-score="25"
     data-wcag-criterion="2.4.7"
     data-threshold="30"
     data-outline-score="0"
     data-background-score="25"
     data-total-score="25">

    <h3>TC3.1: Background Only <span class="badge badge-fail">FAIL</span></h3>

    <span class="expected-score score-edge">Expected: 25 points (below 30% threshold)</span>

    <div class="test-description">
        Only background color changes on focus. Scores 25 points (below 30% threshold).
    </div>

    <div class="test-element-container">
        <button class="tc3-background-only">Focus Me</button>
    </div>

    <div class="css-code">.tc3-background-only:focus {
  outline: none;                /* 0 points */
  background-color: #cfe2ff;    /* +25 points */
  /* Total: 25 < 30 threshold → FAIL */
}</div>
</div>
```

### Example 3: Multi-Element Test

```html
<div class="test-card"
     data-test-id="TC5.1"
     data-expected-result="violation"
     data-wcag-criterion="2.5.5"
     data-target-size="20"
     data-required-size="24">

    <h3>TC5.1: Small Touch Target <span class="badge badge-fail">FAIL</span></h3>

    <div class="test-description">
        Button with 20×20px touch target (requires 24×24px minimum).
    </div>

    <div class="test-element-container">
        <button class="tc5-small-target"
                data-width="20"
                data-height="20">×</button>
    </div>

    <div class="css-code">.tc5-small-target {
  width: 20px;    /* Too small */
  height: 20px;   /* Requires 24×24px */
  padding: 0;
}</div>
</div>
```

---

## Common Pitfalls

### ❌ Pitfall 1: Inconsistent Naming

```html
<!-- Bad -->
<div data-test-id="test1.1">
<div data-test-id="TC-1-1">
<div data-test-id="failure1">

<!-- Good -->
<div data-test-id="TC1.1">
<div data-test-id="TC1.2">
<div data-test-id="TC1.3">
```

### ❌ Pitfall 2: Missing Metadata

```html
<!-- Bad -->
<div class="test-card">
    <button class="bad-button">Test</button>
</div>

<!-- Good -->
<div class="test-card"
     data-test-id="TC1.1"
     data-expected-result="violation"
     data-wcag-criterion="2.4.7">
    <button class="tc1-outline-none">Test</button>
</div>
```

### ❌ Pitfall 3: No Expected Results

```html
<!-- Bad -->
<p>This page tests focus visibility.</p>

<!-- Good -->
<div class="expected-results-section"
     data-expected-violations="11">
    <h3>Expected Results</h3>
    <ul>
        <li>Expected Violations: 11</li>
        <li>Expected Passes: 16</li>
    </ul>
</div>
```

### ❌ Pitfall 4: External Dependencies

```html
<!-- Bad -->
<link rel="stylesheet" href="https://cdn.example.com/styles.css">
<script src="https://cdn.example.com/lib.js"></script>

<!-- Good -->
<style>
    /* All styles inline */
</style>
<script>
    // All scripts inline
</script>
```

### ❌ Pitfall 5: Unclear Test Cases

```html
<!-- Bad -->
<button class="test-button">Button</button>

<!-- Good -->
<div class="test-card" data-test-id="TC1.1">
    <h3>TC1.1: Outline None <span class="badge badge-fail">FAIL</span></h3>
    <div class="test-description">
        Button with outline:none and no alternative focus indicator.
    </div>
    <button class="tc1-outline-none">Button</button>
    <div class="css-code">
.tc1-outline-none:focus { outline: none; }
    </div>
</div>
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ QUICK REFERENCE: Test Sample Creation              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ FILE NAMING:                                        │
│   {criterion-slug}-{type}.html                      │
│   Example: focus-visible-test.html                  │
│                                                     │
│ TEST CASE ID:                                       │
│   TC{category}.{number}                             │
│   Example: TC1.1, TC2.3                             │
│                                                     │
│ CSS CLASS:                                          │
│   .tc{category}-{description}                       │
│   Example: .tc1-outline-none                        │
│                                                     │
│ REQUIRED METADATA:                                  │
│   data-test-id="TC1.1"                              │
│   data-expected-result="violation|pass"             │
│   data-wcag-criterion="X.X.X"                       │
│                                                     │
│ OPTIONAL METADATA:                                  │
│   data-expected-score="{number}"                    │
│   data-category="{category-name}"                   │
│   data-threshold="{number}"                         │
│                                                     │
│ MUST INCLUDE:                                       │
│   ✓ Visual badge (PASS/FAIL/EDGE)                   │
│   ✓ Expected score indicator                        │
│   ✓ Test description                                │
│   ✓ CSS code example                                │
│   ✓ Expected results section                        │
│   ✓ Validation script                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Review existing samples** (`focus-visibility-detector-test.html`)
2. **Choose a WCAG criterion** to test
3. **Follow this guide** step-by-step
4. **Validate your sample** using the checklist
5. **Test with your scanner**
6. **Commit and document** your work

---

**Questions or Issues?**

Refer to:
- [claude.md](./claude.md) - Repository overview
- Existing samples in the repository
- WCAG Understanding documents

**Last Updated:** 2025-11-08
