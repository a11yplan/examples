# Accessibility Testing Examples Repository

## Overview

This repository contains **machine-readable, AI-parsable test samples** for validating accessibility scanning tools and algorithms. Each HTML file is specifically designed to test detection capabilities for various WCAG (Web Content Accessibility Guidelines) criteria violations.

**🎉 NEW: Public JSON API** - All test cases are now available via a publicly accessible JSON file at `https://a11yplan.github.io/examples/test-cases.json`, enabling automated discovery and implementation of all available tests. See the [Public JSON API section](#-public-json-api-test-casesjson) for details.

## Purpose

The primary goal of this repository is to enable **automated, script-driven accessibility testing** where both AI agents and automated tools can:

1. **Download test suite metadata** from the public JSON API
2. **Parse test expectations** from structured metadata
3. **Validate detection algorithms** against known violations
4. **Generate comprehensive test reports** with confidence scores
5. **Benchmark scanner accuracy** across different WCAG criteria
6. **Integrate with CI/CD pipelines** for continuous validation

## Repository Structure

```
examples/
├── index.html                                   # Landing page with links to all tests
├── claude.md                                    # This file - repository documentation
├── test-cases.json                              # 🆕 PUBLIC JSON API - All test metadata
├── sync-test-cases.js                           # 🆕 Script to generate test-cases.json
├── SAMPLE_CREATION_GUIDE.md                     # How to create new samples
├── focus-visible-test.html                      # Basic WCAG 2.4.7 example
├── focus-visibility-detector-test.html          # Algorithm test suite
├── contrast-minimum-test.html                   # WCAG 1.4.3 test page
├── non-text-contrast-test.html                  # WCAG 1.4.11 test page
├── resize-text-test.html                        # WCAG 1.4.4 test page
├── non-text-content-test.html                   # WCAG 1.1.1 test page
├── info-relationships-test.html                 # WCAG 1.3.1 test page
├── name-role-value-test.html                    # WCAG 4.1.2 test page
├── comprehensive-accessibility-test.html        # Multi-criteria integration test
├── legacy-axe-test.html                         # Legacy test (historical)
└── ... (29 total test pages)
```

## Test Sample Categories

### 1. Basic Examples
**Purpose:** Simple pass/fail demonstrations for user education and basic scanner validation

**Characteristics:**
- Clear visual distinction between passing and failing elements
- User-friendly explanations
- Simple test cases
- Example: `focus-visible-test.html`

### 2. Algorithm Test Suites
**Purpose:** Comprehensive validation of detection algorithms with edge cases and threshold testing

**Characteristics:**
- Machine-readable metadata
- Expected confidence scores
- Boundary condition testing
- Multiple test case categories
- Example: `focus-visibility-detector-test.html`

### 3. Integration Tests
**Purpose:** Real-world scenarios with multiple interacting elements

**Characteristics:**
- Complex DOM structures
- Multiple WCAG criteria in one page
- Realistic UI patterns

## Test Layout Patterns

This repository uses two main layout patterns, chosen based on the type of WCAG criterion being tested:

### Pattern A: Side-by-Side Comparison (For Semantic/Structural Tests)

**Visual Layout:** Fail (left) vs Pass (right) in a two-column grid

**Key Feature:** Visually identical elements with different underlying code

**Best for:**
- ARIA attributes (role, aria-label, aria-checked, etc.)
- Semantic HTML vs div-based layouts
- Alt text quality
- Form labels and associations
- Heading hierarchies
- List structures (ul/ol/dl vs divs)

**Examples:** `non-text-content-test.html`, `info-relationships-test.html`, `name-role-value-test.html`

**Why this pattern?** AI vision models must analyze HTML structure, not visual appearance. Making the visuals identical forces testing tools to detect semantic violations from code analysis rather than visual cues.

**Example structure:**
```html
<h2>Test Case 1: Custom Button</h2>
<div class="test-grid">  <!-- grid-template-columns: 1fr 1fr -->
    <!-- FAIL: Left side -->
    <div class="test-card fail" data-test-id="TC1.1" data-expected-result="violation">
        <h3>❌ FAIL: Div Without Role</h3>
        <div class="custom-button" onclick="...">Submit</div>
    </div>

    <!-- PASS: Right side - SAME VISUAL -->
    <div class="test-card pass" data-test-id="TC2.1" data-expected-result="pass">
        <h3>✅ PASS: Div with Proper ARIA</h3>
        <div class="custom-button" role="button" tabindex="0" aria-label="Submit" onclick="...">Submit</div>
    </div>
</div>
```

### Pattern B: Independent Grid (For Visual Property Tests)

**Visual Layout:** Responsive grid with auto-fitting cards

**Key Feature:** Visual differences are expected and necessary

**Best for:**
- Color contrast tests (visual difference is the point)
- Text size/zoom tests (size difference is required)
- Focus visibility algorithm tests (comprehensive coverage)
- Spacing and layout measurements

**Examples:** `contrast-minimum-test.html`, `non-text-contrast-test.html`, `focus-visibility-detector-test.html`

**Why this pattern?** Visual properties like contrast or size must differ to demonstrate pass/fail conditions. The responsive grid allows for many test cases organized by category.

**Example structure:**
```html
<div class="section-header">
    <h2>❌ Category 1: Clear Failures</h2>
</div>
<div class="test-grid">  <!-- grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) -->
    <div class="test-card" data-test-id="TC1.1" data-expected-result="violation">
        <h3>TC1.1: Low Contrast <span class="badge badge-fail">FAIL</span></h3>
        <div class="test-sample" style="color: #999; background: #fff;">
            This text has 2.8:1 contrast (needs 4.5:1)
        </div>
    </div>
    <!-- More independent test cases... -->
</div>
```

## 📊 Public JSON API: test-cases.json

**NEW:** This repository now provides a **publicly available JSON file** that is automatically generated and updated with every change. This enables external systems to programmatically discover and implement all available test cases.

### Accessing the JSON File

**URL:** `https://a11yplan.github.io/examples/test-cases.json`

The JSON file contains:
- Complete metadata for all 29 test pages
- WCAG criteria coverage (25 criteria)
- Test case counts and expected results
- Direct URLs to all test pages
- Machine-readable indicators
- Usage examples in JavaScript and Python

### JSON Structure

```json
{
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-11-11",
    "totalTestPages": 29,
    "totalWCAGCriteria": 25,
    "totalTestCases": 244
  },
  "testPages": [
    {
      "id": "focus-visible",
      "filename": "focus-visible-test.html",
      "url": "https://a11yplan.github.io/examples/focus-visible-test.html",
      "title": "Focus Visible - Basic",
      "wcagCriteria": ["2.4.7"],
      "wcagLevel": "AA",
      "category": "Focus Visibility",
      "testType": "basic",
      "description": "Simple pass/fail demonstrations...",
      "totalCases": 6,
      "expectedViolations": 3,
      "expectedPasses": 3,
      "machineReadable": true
    }
  ],
  "wcagCriteria": [...],
  "usage": {...}
}
```

### Usage Examples

**JavaScript/Node.js:**
```javascript
const response = await fetch('https://a11yplan.github.io/examples/test-cases.json');
const testData = await response.json();

console.log(`Total test pages: ${testData.metadata.totalTestPages}`);
console.log(`WCAG criteria covered: ${testData.metadata.totalWCAGCriteria}`);

// Filter by WCAG level
const levelATests = testData.testPages.filter(t => t.wcagLevel === 'A');

// Find tests for specific criterion
const focusTests = testData.testPages.filter(t => t.wcagCriteria.includes('2.4.7'));

// Get all machine-readable tests
const machineTests = testData.testPages.filter(t => t.machineReadable);

// Iterate through all tests
for (const test of testData.testPages) {
  console.log(`Testing ${test.title} at ${test.url}`);
  // Run your scanner against test.url
  // Compare results with test.expectedViolations and test.expectedPasses
}
```

**Python:**
```python
import requests

response = requests.get('https://a11yplan.github.io/examples/test-cases.json')
test_data = response.json()

print(f"Total test pages: {test_data['metadata']['totalTestPages']}")
print(f"WCAG criteria covered: {test_data['metadata']['totalWCAGCriteria']}")

# Filter by category
contrast_tests = [t for t in test_data['testPages'] if t['category'] == 'Color Contrast']

# Get all URLs
test_urls = [t['url'] for t in test_data['testPages']]

# Run automated testing
for test in test_data['testPages']:
    if test['machineReadable']:
        print(f"Testing {test['title']}")
        # Run your scanner
        # Validate against test['expectedViolations']
```

### Automated Sync Process

The JSON file is automatically generated from `index.html` and the HTML test files using the `sync-test-cases.js` script.

**To regenerate the JSON file:**
```bash
node sync-test-cases.js
```

The script:
1. Parses `index.html` to extract test page listings
2. Reads each HTML test file to extract metadata (meta tags, data attributes)
3. Counts test cases automatically
4. Generates a comprehensive JSON file with all metadata
5. Saves to `test-cases.json`

**When to run the sync script:**
- After creating a new test page
- After updating test case counts
- After modifying test metadata
- Before committing changes to the repository

### Benefits of the JSON API

1. **Automated Discovery:** External systems can automatically discover all available tests
2. **Version Control:** JSON includes version number and last updated date
3. **Programmatic Access:** No need to parse HTML - use structured JSON
4. **Filtering:** Easily filter by WCAG level, category, test type, etc.
5. **Integration:** Simple integration with CI/CD pipelines
6. **Documentation:** Self-documenting with usage examples included

### Use Cases

**1. Automated Scanner Validation**
```javascript
// Download test suite
const tests = await fetch('https://a11yplan.github.io/examples/test-cases.json');
const data = await tests.json();

// Run scanner against all tests
for (const test of data.testPages.filter(t => t.machineReadable)) {
  const results = await runScanner(test.url);
  const accuracy = compareResults(results, test);
  console.log(`${test.title}: ${accuracy}% accurate`);
}
```

**2. CI/CD Integration**
```yaml
# .github/workflows/test-scanner.yml
- name: Download test cases
  run: curl -O https://a11yplan.github.io/examples/test-cases.json

- name: Run scanner validation
  run: npm run validate-scanner test-cases.json
```

**3. Test Coverage Dashboard**
```javascript
// Generate coverage report
const data = await fetch('https://a11yplan.github.io/examples/test-cases.json');
const tests = await data.json();

const coverage = {
  levelA: tests.testPages.filter(t => t.wcagLevel === 'A').length,
  levelAA: tests.testPages.filter(t => t.wcagLevel === 'AA').length,
  totalCriteria: tests.metadata.totalWCAGCriteria,
  machineReadable: tests.testPages.filter(t => t.machineReadable).length
};
```

## Machine-Readable Conventions

All test samples in this repository follow standardized conventions for AI/script parsing:

### Naming Conventions

```
Test Case IDs: TC{category}.{number}
Example: TC1.1, TC1.2, TC3.4

CSS Classes: tc{category}-{description}
Example: .tc1-outline-none, .tc2-standard-outline

Expected Results: data-expected-* attributes
Example: data-expected-violation="true"
         data-expected-score="-50"
```

### Metadata Structure

Each test sample includes machine-readable metadata:

```html
<!-- Test Case Metadata -->
<div class="test-card"
     data-test-id="TC1.1"
     data-wcag-criterion="2.4.7"
     data-expected-result="violation"
     data-expected-score="-50"
     data-category="clear-failure">
    <!-- Test content -->
</div>
```

### Expected Results Format

Test expectations are documented in structured HTML that can be parsed:

```html
<div class="expected-results">
    <h3>Expected Test Results</h3>
    <ul>
        <li><strong>Total Focusable Elements:</strong> 27</li>
        <li><strong>Expected Violations:</strong> 11 elements</li>
        <li><strong>Expected Passes:</strong> 16 elements</li>
    </ul>
</div>
```

## WCAG Criteria Coverage

### Currently Implemented

| Criterion | File | Test Cases | Layout Pattern | Description |
|-----------|------|------------|----------------|-------------|
| **1.1.1** | `non-text-content-test.html` | 14 (7 fail, 7 pass) | Side-by-Side | Alt text quality, images, SVG |
| **1.3.1** | `info-relationships-test.html` | 12 (6 fail, 6 pass) | Side-by-Side | Semantic HTML, tables, lists, headings |
| **1.4.3** | `contrast-minimum-test.html` | 12 (6 fail, 6 pass) | Independent Grid | Text color contrast |
| **1.4.4** | `resize-text-test.html` | 6 (3 fail, 3 pass) | Independent Grid | Text resizing |
| **1.4.11** | `non-text-contrast-test.html` | 10 (5 fail, 5 pass) | Independent Grid | UI component contrast |
| **2.4.7** | `focus-visible-test.html` | 6 | Independent Grid | Basic focus visible examples |
| **2.4.7** | `focus-visibility-detector-test.html` | 27 | Independent Grid | Algorithm validation suite |
| **4.1.2** | `name-role-value-test.html` | 10 (5 fail, 5 pass) | Side-by-Side | ARIA attributes, custom controls |

### Planned Coverage

- **2.4.4** - Link Purpose (In Context)
- **2.5.5** - Target Size (Minimum)
- **2.1.1** - Keyboard
- **3.2.4** - Consistent Identification
- **1.3.5** - Identify Input Purpose
- **2.4.3** - Focus Order
- **3.3.2** - Labels or Instructions

## Using This Repository

### For AI Agents

AI agents can parse these files to:

1. **Extract test expectations**
   ```javascript
   // Parse expected violations count
   const expectedViolations = parseInt(
     document.querySelector('[data-expected-violations]')
       .getAttribute('data-expected-violations')
   );
   ```

2. **Validate detection results**
   ```javascript
   // Compare actual vs expected
   const testCases = document.querySelectorAll('[data-test-id]');
   testCases.forEach(tc => {
     const expected = tc.dataset.expectedResult;
     const score = parseInt(tc.dataset.expectedScore);
     // Validate your scanner's results
   });
   ```

3. **Generate reports**
   - Parse CSS code blocks for violation patterns
   - Extract confidence scores
   - Match against WCAG criterion IDs

### For Automated Testing Scripts

```javascript
// Example: Automated validation script
import { scanPage } from './scanner.js';

async function validateScanner(testFile) {
  // Load test page
  const page = await loadPage(testFile);

  // Extract expected results
  const expected = parseExpectedResults(page);

  // Run scanner
  const results = await scanPage(page);

  // Validate
  const accuracy = compareResults(expected, results);

  return {
    testFile,
    expectedViolations: expected.violations,
    detectedViolations: results.violations,
    accuracy: accuracy.percentage,
    falsePositives: accuracy.falsePositives,
    falseNegatives: accuracy.falseNegatives
  };
}
```

### For Manual Testing

1. Open the HTML file in a browser
2. Use keyboard navigation (Tab key) to test interactive elements
3. Compare actual behavior with documented expectations
4. Visual indicators show expected pass/fail status

## Test Sample Design Principles

### 1. **Machine-First Design**
- Structured metadata over natural language
- Consistent naming patterns
- Parsable HTML structure

### 2. **Clear Expectations**
- Every test case has documented expected outcome
- Confidence scores for algorithm testing
- Categorized by pass/fail/edge-case

### 3. **Comprehensive Coverage**
- Edge cases near threshold boundaries
- Combination scenarios
- Different element types (buttons, links, inputs, custom)

### 4. **Self-Documenting**
- Inline CSS examples
- Visual indicators
- Code comments explaining scoring

### 5. **Reproducible**
- No external dependencies
- Deterministic results
- Version controlled

### 6. **AI-Optimized Testing** (NEW)
- **Side-by-side comparison pattern** for semantic/structural tests
- **Visually identical** fail/pass pairs force code analysis over visual detection
- **Realistic patterns** that aren't obviously wrong (e.g., footer navigation instead of bullet lists)
- **Real-world examples** that AI vision models must analyze structurally:
  - Employee tables with styled divs vs semantic `<table>`
  - Heading hierarchies with styled divs vs `<h2>`/`<h3>`
  - Navigation links with divs vs `<ul>`/`<li>` (with `list-style: none`)
  - Custom controls vs proper ARIA attributes
  - Poor alt text patterns (filenames, URLs, generic words) vs descriptive text
- **Challenge for AI:** Cannot rely on visual cues; must parse HTML structure and attributes

## Integration with Accessibility Scanners

### Focus Visibility Phase Integration

The test samples are designed to integrate with multi-phase scanning systems:

```
Audit Flow:
1. AxeAnalysisPhase → Run axe-core automated tests
2. FocusVisibilityPhase → Run focus detection algorithm ← Uses these samples
3. HashMatchingPhase → Compare with previous results
```

Expected scanner output format:

```
[SCOPE:operation] Focus visibility analysis: 27 checked, 11 without visible focus indicator
[PHASE:FOCUS_VISIBILITY] Checked 27 focusable elements, found 11 without visible focus indicators

Violations Created:
- TC1.1: outline: none (confidence: -50%)
- TC1.2: outline: 0 (confidence: -50%)
- TC3.1: background only (confidence: 25% < 30% threshold)
...
```

## Contributing New Test Samples

See **[SAMPLE_CREATION_GUIDE.md](./SAMPLE_CREATION_GUIDE.md)** for detailed instructions on creating new test samples.

### Quick Start

1. Choose a WCAG criterion to test
2. Follow the naming conventions
3. Add machine-readable metadata
4. Include expected results
5. Document confidence scores (if applicable)
6. Test with your scanner
7. **Update index.html** - Add your new test page to the index (see below)

### 📋 IMPORTANT: Maintaining index.html and test-cases.json

**REQUIREMENT:** Whenever you create a new test page, you MUST:
1. Update `index.html` to include a link to it
2. Run `node sync-test-cases.js` to regenerate the JSON file

The `index.html` file serves as the landing page and directory for all test pages. When adding a new test:

1. **Locate the appropriate section** in index.html based on the WCAG criterion category
2. **Add a new test card** with the following information:
   - Badge indicating WCAG level (A, AA, AAA) or test type (Algorithm, Legacy)
   - Page title and link
   - WCAG criterion number and name
   - Brief description (2-3 sentences)
   - Metadata: test case count, violations/passes, categories

**Example test card structure:**

```html
<div class="test-card">
    <span class="badge badge-level-aa">Level AA</span>
    <h3><a href="your-new-test.html">Your Test Page Title</a></h3>
    <p class="criterion">WCAG X.X.X - Criterion Name</p>
    <p class="description">
        Brief description of what this test page validates. Include key
        patterns tested and any special features.
    </p>
    <div class="meta">
        <span class="meta-item"><strong>10</strong> test cases</span>
        <span class="meta-item">5 violations</span>
        <span class="meta-item">5 passes</span>
    </div>
</div>
```

**If creating a new WCAG category:**

If your test doesn't fit existing sections, add a new section:

```html
<section class="section">
    <h2>📋 Your Category Name</h2>
    <div class="test-grid">
        <!-- Add test cards here -->
    </div>
</section>
```

**Update statistics:**

Update the stats section if needed:
- Total test pages count
- Total WCAG criteria covered
- Approximate total test cases

This ensures the index remains a complete, up-to-date directory of all available test resources.

## Validation Checklist

Before committing a new test sample:

- [ ] File name follows convention: `{criterion-name}-test.html`
- [ ] Test case IDs follow pattern: `TC{category}.{number}`
- [ ] CSS classes follow pattern: `.tc{category}-{description}`
- [ ] Metadata attributes present: `data-test-id`, `data-expected-result`
- [ ] Expected results section included
- [ ] All test cases documented with:
  - [ ] Expected pass/fail status
  - [ ] Expected confidence score (for algorithm tests)
  - [ ] CSS code example
  - [ ] Description
- [ ] Visual indicators (color coding) present
- [ ] No external dependencies
- [ ] Console logging for debugging (optional)
- [ ] **index.html updated** with new test page entry
- [ ] **test-cases.json regenerated** by running `node sync-test-cases.js`

## Tools and Technologies

- **Pure HTML/CSS/JavaScript** - No build process required
- **Data attributes** - For machine-readable metadata
- **Semantic HTML** - For accessibility compliance
- **CSS pseudo-classes** - For state testing (:focus, :hover, etc.)
- **Console API** - For debugging and validation

## Testing Workflow

### 1. Development Phase
```bash
# Create new test sample
cp template.html new-criterion-test.html

# Edit and add test cases
# Follow SAMPLE_CREATION_GUIDE.md

# Preview in browser
open new-criterion-test.html
```

### 2. Validation Phase
```bash
# Run your scanner against the test file
npm run scan new-criterion-test.html

# Compare results with expected outcomes
npm run validate new-criterion-test.html
```

### 3. Integration Phase
```bash
# Add to test suite
git add new-criterion-test.html
git commit -m "Add WCAG X.X.X test sample"
git push
```

## Expected Scanner Behavior

When processing these test files, accessibility scanners should:

1. **Detect all focusable elements** (buttons, links, inputs, elements with tabindex)
2. **Apply focus states** (programmatically trigger :focus pseudo-class)
3. **Analyze style changes** (compare baseline vs focused state)
4. **Calculate confidence scores** (using documented algorithm)
5. **Create violations** for elements below threshold
6. **Include metadata** in violation reports:
   - Element selector
   - Computed styles (before/after)
   - Confidence percentage
   - WCAG criterion reference
   - Suggested fixes

## Performance Considerations

- **Page load:** < 100ms (no external resources)
- **Analysis time:** Varies by scanner (typically < 2s for 27 elements)
- **Memory footprint:** Minimal (self-contained HTML)

## License

[Specify your license here]

## Contact

For questions or contributions, please [contact information].

## Version History

- **v1.0** - Initial repository structure
- **v1.1** - Added WCAG 2.4.7 basic examples
- **v1.2** - Added focus visibility algorithm test suite
- **v1.3** - Added documentation and sample creation guide
- **v1.4** - Added public JSON API (test-cases.json) for automated test discovery and implementation
  - New `test-cases.json` file with complete metadata for all test pages
  - `sync-test-cases.js` script to automatically generate JSON from HTML files
  - Comprehensive usage examples in JavaScript and Python
  - Integration guides for CI/CD pipelines

---

**Last Updated:** 2025-11-11
