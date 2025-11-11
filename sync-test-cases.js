#!/usr/bin/env node

/**
 * Sync Test Cases JSON Generator
 *
 * This script automatically generates test-cases.json by parsing all HTML test files
 * in the repository. It extracts metadata from HTML files and index.html to create
 * a comprehensive, machine-readable JSON file.
 *
 * Usage: node sync-test-cases.js
 */

const fs = require('fs');
const path = require('path');

// Parse HTML to extract meta tags and data attributes
function parseHTMLMetadata(htmlContent, filename) {
    const metadata = {
        filename: filename,
        title: null,
        wcagCriteria: [],
        totalCases: null,
        expectedViolations: null,
        expectedPasses: null,
        hasMetadata: false,
        machineReadable: false
    };

    // Extract title
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        metadata.title = titleMatch[1].replace(/WCAG \d+\.\d+\.\d+\s*/i, '').replace(/\s*-?\s*Test Page/i, '').trim();
    }

    // Extract WCAG criterion from meta tags
    const wcagMetaMatch = htmlContent.match(/<meta name="test:wcag-criterion" content="([^"]+)"/i);
    if (wcagMetaMatch) {
        metadata.wcagCriteria = wcagMetaMatch[1].split(',').map(c => c.trim());
        metadata.hasMetadata = true;
    }

    // Extract total cases from meta tags
    const totalCasesMatch = htmlContent.match(/<meta name="test:total-cases" content="(\d+)"/i);
    if (totalCasesMatch) {
        metadata.totalCases = parseInt(totalCasesMatch[1]);
        metadata.hasMetadata = true;
    }

    // Extract expected violations from meta tags
    const violationsMatch = htmlContent.match(/<meta name="test:expected-violations" content="(\d+)"/i);
    if (violationsMatch) {
        metadata.expectedViolations = parseInt(violationsMatch[1]);
        metadata.hasMetadata = true;
    }

    // Check for data-test-id attributes (machine-readable indicator)
    if (htmlContent.includes('data-test-id=')) {
        metadata.machineReadable = true;
    }

    // If no meta tags, try to extract from data attributes
    if (metadata.wcagCriteria.length === 0) {
        const dataWcagMatch = htmlContent.match(/data-wcag-criterion="([^"]+)"/i);
        if (dataWcagMatch) {
            metadata.wcagCriteria = [dataWcagMatch[1]];
        }
    }

    // Count test cases if not in meta tags
    if (!metadata.totalCases) {
        const testCaseMatches = htmlContent.match(/data-test-id="[^"]+"/g);
        if (testCaseMatches) {
            metadata.totalCases = testCaseMatches.length;
        }
    }

    // Count violations and passes from data-expected-result
    if (!metadata.expectedViolations) {
        const violationMatches = htmlContent.match(/data-expected-result="violation"/g);
        const passMatches = htmlContent.match(/data-expected-result="pass"/g);

        if (violationMatches) {
            metadata.expectedViolations = violationMatches.length;
        }
        if (passMatches) {
            metadata.expectedPasses = passMatches.length;
        }
    } else if (!metadata.expectedPasses && metadata.totalCases) {
        metadata.expectedPasses = metadata.totalCases - metadata.expectedViolations;
    }

    return metadata;
}

// Extract test page info from index.html
function parseIndexHTML(indexPath) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const testPages = [];

    // Extract test items from index.html
    const testItemRegex = /<div class="test-item">([\s\S]*?)<\/div>\s*<\/div>/g;
    let match;

    while ((match = testItemRegex.exec(indexContent)) !== null) {
        const itemContent = match[1];

        // Skip header rows
        if (itemContent.includes('class="test-item header"')) continue;

        const filenameMatch = itemContent.match(/<a href="([^"]+\.html)">([^<]+)<\/a>/);
        const criterionMatch = itemContent.match(/<div class="test-criterion">([^<]+)<\/div>/);
        const descriptionMatch = itemContent.match(/<div class="test-description">([^<]+)<\/div>/);
        const badgeMatch = itemContent.match(/<span class="badge badge-([^"]+)">/);

        if (filenameMatch) {
            const testPage = {
                filename: filenameMatch[1],
                title: filenameMatch[2],
                wcagCriterion: criterionMatch ? criterionMatch[1].trim() : null,
                description: descriptionMatch ? descriptionMatch[1].trim() : null,
                badge: badgeMatch ? badgeMatch[1] : null
            };

            testPages.push(testPage);
        }
    }

    return testPages;
}

// Map badge type to WCAG level and test type
function mapBadgeToMetadata(badge) {
    const mapping = {
        'a': { wcagLevel: 'A', testType: 'basic' },
        'aa': { wcagLevel: 'AA', testType: 'basic' },
        'aaa': { wcagLevel: 'AAA', testType: 'basic' },
        'algorithm': { wcagLevel: 'AA', testType: 'algorithm' },
        'legacy': { wcagLevel: 'Multiple', testType: 'legacy' },
        'multiple': { wcagLevel: 'Multiple', testType: 'integration' },
        'ai-test': { wcagLevel: null, testType: 'ai-validation' }
    };

    return mapping[badge] || { wcagLevel: null, testType: 'basic' };
}

// Categorize test pages
function categorizeTestPage(wcagCriterion) {
    const categories = {
        '2.4.7': 'Focus Visibility',
        '1.4.3': 'Color Contrast',
        '1.4.11': 'Color Contrast',
        '1.4.4': 'Text and Content',
        '1.1.1': 'Text and Content',
        '1.4.1': 'Text and Content',
        '1.3.3': 'Text and Content',
        '2.4.2': 'Navigation and Page Structure',
        '3.1.1': 'Navigation and Page Structure',
        '2.4.1': 'Navigation and Page Structure',
        '2.4.4': 'Navigation and Page Structure',
        '2.4.6': 'Navigation and Page Structure',
        '3.1.2': 'Navigation and Page Structure',
        '3.2.3': 'Navigation and Page Structure',
        '3.2.4': 'Navigation and Page Structure',
        '1.3.1': 'Structure and Semantics',
        '4.1.2': 'Structure and Semantics',
        '1.3.2': 'Structure and Semantics',
        '3.3.1': 'Forms and Input Validation',
        '3.3.3': 'Forms and Input Validation',
        '1.3.5': 'Forms and Input Validation',
        '3.3.2': 'Forms and Input Validation',
        '2.1.1': 'Keyboard and Input',
        '2.5.8': 'Keyboard and Input',
        '2.5.3': 'Keyboard and Input'
    };

    return categories[wcagCriterion] || 'Other';
}

// Main function to generate JSON
function generateTestCasesJSON() {
    const examplesDir = __dirname;
    const indexPath = path.join(examplesDir, 'index.html');
    const outputPath = path.join(examplesDir, 'test-cases.json');

    console.log('🔍 Parsing index.html...');
    const indexTestPages = parseIndexHTML(indexPath);

    console.log('📄 Parsing HTML test files...');
    const testPages = [];
    let totalTestCases = 0;

    for (const indexPage of indexTestPages) {
        const htmlPath = path.join(examplesDir, indexPage.filename);

        if (!fs.existsSync(htmlPath)) {
            console.warn(`⚠️  Warning: ${indexPage.filename} not found`);
            continue;
        }

        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const htmlMetadata = parseHTMLMetadata(htmlContent, indexPage.filename);
        const badgeMetadata = mapBadgeToMetadata(indexPage.badge);

        const wcagCriteria = htmlMetadata.wcagCriteria.length > 0
            ? htmlMetadata.wcagCriteria
            : (indexPage.wcagCriterion && indexPage.wcagCriterion !== 'Multiple' && indexPage.wcagCriterion !== 'General Interaction' && indexPage.wcagCriterion !== 'Complex Interaction')
                ? indexPage.wcagCriterion.split(',').map(c => c.trim())
                : [];

        const category = wcagCriteria.length > 0
            ? categorizeTestPage(wcagCriteria[0])
            : (indexPage.filename.includes('ai-interaction') ? 'AI Browser Interaction Tests' : 'Comprehensive & Legacy Tests');

        const testPage = {
            id: indexPage.filename.replace('.html', '').replace(/-test$/, ''),
            filename: indexPage.filename,
            url: `https://a11yplan.github.io/examples/${indexPage.filename}`,
            title: indexPage.title || htmlMetadata.title,
            wcagCriteria: wcagCriteria,
            wcagLevel: badgeMetadata.wcagLevel,
            category: category,
            testType: badgeMetadata.testType,
            layoutPattern: determineLayoutPattern(wcagCriteria[0], badgeMetadata.testType),
            description: indexPage.description,
            totalCases: htmlMetadata.totalCases,
            expectedViolations: htmlMetadata.expectedViolations,
            expectedPasses: htmlMetadata.expectedPasses,
            machineReadable: htmlMetadata.machineReadable,
            hasMetadata: htmlMetadata.hasMetadata,
            hasExpectedResults: htmlMetadata.expectedViolations !== null || htmlMetadata.expectedPasses !== null,
            hasConfidenceScores: indexPage.filename.includes('algorithm')
        };

        testPages.push(testPage);

        if (htmlMetadata.totalCases) {
            totalTestCases += htmlMetadata.totalCases;
        }

        console.log(`  ✓ ${indexPage.filename} (${htmlMetadata.totalCases || '?'} cases)`);
    }

    // Count unique WCAG criteria
    const uniqueCriteria = new Set();
    testPages.forEach(page => {
        page.wcagCriteria.forEach(c => uniqueCriteria.add(c));
    });

    const outputData = {
        metadata: {
            version: '1.0.0',
            lastUpdated: new Date().toISOString().split('T')[0],
            repository: 'https://github.com/a11yplan/examples',
            description: 'Machine-readable test samples for validating accessibility scanning tools and algorithms',
            totalTestPages: testPages.length,
            totalWCAGCriteria: uniqueCriteria.size,
            totalTestCases: totalTestCases
        },
        testPages: testPages,
        wcagCriteria: generateWCAGCriteriaReference(testPages),
        usage: {
            downloadInstructions: 'Download this JSON file to programmatically access all test case metadata',
            exampleUsage: {
                javascript: `const response = await fetch('https://a11yplan.github.io/examples/test-cases.json');
const testData = await response.json();
console.log(\`Total test pages: \${testData.metadata.totalTestPages}\`);
console.log(\`WCAG criteria covered: \${testData.metadata.totalWCAGCriteria}\`);

// Filter by WCAG level
const levelATests = testData.testPages.filter(t => t.wcagLevel === 'A');

// Find tests for specific criterion
const focusTests = testData.testPages.filter(t => t.wcagCriteria.includes('2.4.7'));

// Get all machine-readable tests
const machineTests = testData.testPages.filter(t => t.machineReadable);`,
                python: `import requests

response = requests.get('https://a11yplan.github.io/examples/test-cases.json')
test_data = response.json()

print(f"Total test pages: {test_data['metadata']['totalTestPages']}")
print(f"WCAG criteria covered: {test_data['metadata']['totalWCAGCriteria']}")

# Filter by category
contrast_tests = [t for t in test_data['testPages'] if t['category'] == 'Color Contrast']

# Get all URLs
test_urls = [t['url'] for t in test_data['testPages']]`
            },
            automatedTesting: 'Use this JSON to iterate through all test pages and validate your accessibility scanner against known test cases with expected results'
        }
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

    console.log('\n✅ Successfully generated test-cases.json');
    console.log(`   📊 ${testPages.length} test pages`);
    console.log(`   🎯 ${uniqueCriteria.size} WCAG criteria`);
    console.log(`   📝 ${totalTestCases} test cases`);
    console.log(`   💾 Saved to: ${outputPath}`);
}

function determineLayoutPattern(wcagCriterion, testType) {
    if (testType === 'ai-validation') return 'interactive';
    if (testType === 'algorithm') return 'independent-grid';
    if (testType === 'legacy' || testType === 'integration') return 'mixed';

    const sideLayoutCriteria = ['1.1.1', '1.3.1', '1.3.2', '1.3.3', '1.4.1', '2.4.1', '2.4.4', '2.4.6', '3.1.2', '3.2.3', '3.2.4', '4.1.2', '3.3.1', '3.3.2', '2.1.1', '2.5.3'];

    return sideLayoutCriteria.includes(wcagCriterion) ? 'side-by-side' : 'independent-grid';
}

function generateWCAGCriteriaReference(testPages) {
    const criteriaMap = {
        '1.1.1': { name: 'Non-text Content', level: 'A', principle: 'Perceivable', guideline: '1.1 Text Alternatives' },
        '1.3.1': { name: 'Info and Relationships', level: 'A', principle: 'Perceivable', guideline: '1.3 Adaptable' },
        '1.3.2': { name: 'Meaningful Sequence', level: 'A', principle: 'Perceivable', guideline: '1.3 Adaptable' },
        '1.3.3': { name: 'Sensory Characteristics', level: 'A', principle: 'Perceivable', guideline: '1.3 Adaptable' },
        '1.3.5': { name: 'Identify Input Purpose', level: 'AA', principle: 'Perceivable', guideline: '1.3 Adaptable' },
        '1.4.1': { name: 'Use of Color', level: 'A', principle: 'Perceivable', guideline: '1.4 Distinguishable' },
        '1.4.3': { name: 'Contrast (Minimum)', level: 'AA', principle: 'Perceivable', guideline: '1.4 Distinguishable' },
        '1.4.4': { name: 'Resize Text', level: 'AA', principle: 'Perceivable', guideline: '1.4 Distinguishable' },
        '1.4.11': { name: 'Non-text Contrast', level: 'AA', principle: 'Perceivable', guideline: '1.4 Distinguishable' },
        '2.1.1': { name: 'Keyboard', level: 'A', principle: 'Operable', guideline: '2.1 Keyboard Accessible' },
        '2.4.1': { name: 'Bypass Blocks', level: 'A', principle: 'Operable', guideline: '2.4 Navigable' },
        '2.4.2': { name: 'Page Titled', level: 'A', principle: 'Operable', guideline: '2.4 Navigable' },
        '2.4.4': { name: 'Link Purpose (In Context)', level: 'A', principle: 'Operable', guideline: '2.4 Navigable' },
        '2.4.6': { name: 'Headings and Labels', level: 'AA', principle: 'Operable', guideline: '2.4 Navigable' },
        '2.4.7': { name: 'Focus Visible', level: 'AA', principle: 'Operable', guideline: '2.4 Navigable' },
        '2.5.3': { name: 'Label in Name', level: 'A', principle: 'Operable', guideline: '2.5 Input Modalities' },
        '2.5.8': { name: 'Target Size (Minimum)', level: 'AA', principle: 'Operable', guideline: '2.5 Input Modalities' },
        '3.1.1': { name: 'Language of Page', level: 'A', principle: 'Understandable', guideline: '3.1 Readable' },
        '3.1.2': { name: 'Language of Parts', level: 'AA', principle: 'Understandable', guideline: '3.1 Readable' },
        '3.2.3': { name: 'Consistent Navigation', level: 'AA', principle: 'Understandable', guideline: '3.2 Predictable' },
        '3.2.4': { name: 'Consistent Identification', level: 'AA', principle: 'Understandable', guideline: '3.2 Predictable' },
        '3.3.1': { name: 'Error Identification', level: 'A', principle: 'Understandable', guideline: '3.3 Input Assistance' },
        '3.3.2': { name: 'Labels or Instructions', level: 'A', principle: 'Understandable', guideline: '3.3 Input Assistance' },
        '3.3.3': { name: 'Error Suggestion', level: 'AA', principle: 'Understandable', guideline: '3.3 Input Assistance' },
        '4.1.2': { name: 'Name, Role, Value', level: 'A', principle: 'Robust', guideline: '4.1 Compatible' }
    };

    const criteriaList = [];
    const criteriaUsed = new Map();

    testPages.forEach(page => {
        page.wcagCriteria.forEach(criterion => {
            if (!criteriaUsed.has(criterion)) {
                criteriaUsed.set(criterion, []);
            }
            criteriaUsed.get(criterion).push(page.filename);
        });
    });

    criteriaUsed.forEach((testPages, criterion) => {
        if (criteriaMap[criterion]) {
            criteriaList.push({
                criterion: criterion,
                ...criteriaMap[criterion],
                testPages: testPages
            });
        }
    });

    return criteriaList.sort((a, b) => a.criterion.localeCompare(b.criterion));
}

// Run the generator
if (require.main === module) {
    try {
        generateTestCasesJSON();
    } catch (error) {
        console.error('❌ Error generating test-cases.json:', error);
        process.exit(1);
    }
}

module.exports = { generateTestCasesJSON };
