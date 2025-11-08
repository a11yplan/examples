# Accessibility Testing Examples Repository

## Overview

This repository contains **machine-readable, AI-parsable test samples** for validating accessibility scanning tools and algorithms. Each HTML file is specifically designed to test detection capabilities for various WCAG (Web Content Accessibility Guidelines) criteria violations.

## Purpose

The primary goal of this repository is to enable **automated, script-driven accessibility testing** where both AI agents and automated tools can:

1. **Parse test expectations** from structured metadata
2. **Validate detection algorithms** against known violations
3. **Generate comprehensive test reports** with confidence scores
4. **Benchmark scanner accuracy** across different WCAG criteria

## Repository Structure

```
examples/
├── index.html                                   # Landing page with links to all tests
├── claude.md                                    # This file - repository documentation
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
└── legacy-axe-test.html                         # Legacy test (historical)
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

| Criterion | File | Test Cases | Description |
|-----------|------|------------|-------------|
| **2.4.7** | `focus-visible-test.html` | 6 | Basic focus visible examples |
| **2.4.7** | `focus-visibility-detector-test.html` | 27 | Algorithm validation suite |

### Planned Coverage

- **1.4.3** - Contrast (Minimum)
- **2.4.4** - Link Purpose (In Context)
- **2.5.5** - Target Size (Minimum)
- **4.1.2** - Name, Role, Value
- **1.3.1** - Info and Relationships
- **2.1.1** - Keyboard
- **3.2.4** - Consistent Identification

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

### 📋 IMPORTANT: Maintaining index.html

**REQUIREMENT:** Whenever you create a new test page, you MUST update `index.html` to include a link to it.

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

---

**Last Updated:** 2025-11-08
