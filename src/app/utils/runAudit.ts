import type { AccessibilityIssue } from '../types';

function getContrast(rgb1: number[], rgb2: number[]): number {
  const lum = (rgb: number[]) => {
    const a = rgb.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const l1 = lum(rgb1);
  const l2 = lum(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function parseRGB(color: string): number[] {
  const nums = color.match(/\d+/g);
  return nums ? nums.map(Number) : [0, 0, 0];
}

function getSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  if (el.className) return `.${el.className.split(' ').join('.')}`;
  return el.tagName.toLowerCase();
}

const INTERACTIVE_TAGS = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
const SEMANTIC_TAGS = ['NAV', 'BUTTON', 'MAIN', 'HEADER', 'FOOTER', 'ARTICLE', 'SECTION'];

export default function runAudit(iframe: HTMLIFrameElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let doc: Document;

  try {
    doc = iframe.contentWindow?.document!;
    if (!doc) throw new Error('Cannot access iframe document');
  } catch (error) {
    return [{
      id: null,
      rule: 'cross-origin',
      type: 'Error',
      severity: 'Info',
      message: 'Cross-origin site detected. Live fixes disabled, but analysis available.',
      selector: 'iframe',
    }];
  }

  /* ================= ALT TEXT ================= */
  doc.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        id: img,
        rule: 'alt-text',
        type: 'Image',
        severity: 'High',
        message: 'Image missing alt text',
        selector: getSelector(img),
        fix: () => img.setAttribute('alt', 'Descriptive image text'),
      });
    }
  });

  /* ================= FORM LABELS ================= */
  doc.querySelectorAll('input').forEach(input => {
    const id = input.id;
    if (id && !doc.querySelector(`label[for="${id}"]`)) {
      issues.push({
        id: input,
        rule: 'form-label',
        type: 'Form',
        severity: 'High',
        message: 'Input missing associated label',
        selector: getSelector(input),
        fix: () => {
          const label = doc.createElement('label');
          label.innerText = 'Form field';
          label.setAttribute('for', id);
          label.style.display = 'block';
          label.style.marginBottom = '8px';
          label.style.fontWeight = '500';
          input.parentElement?.insertBefore(label, input);
        },
      });
    }
  });

  /* ================= COLOR CONTRAST ================= */
  doc.querySelectorAll('body *').forEach(el => {
    if (el.children.length > 0 || !el.textContent?.trim()) return;

    const style = getComputedStyle(el);
    const color = style.color;
    const bgColor = style.backgroundColor;

    if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      try {
        const contrast = getContrast(parseRGB(color), parseRGB(bgColor));

        if (contrast < 4.5 && el.textContent && el.textContent.trim().length > 0) {
          issues.push({
            id: el as HTMLElement,
            rule: 'contrast',
            type: 'Contrast',
            severity: 'High',
            message: `Low contrast ratio (${contrast.toFixed(2)}:1, required 4.5:1)`,
            selector: getSelector(el),
            fix: () => {
              (el as HTMLElement).style.color = '#000000';
            },
          });
        }
      } catch (e) {
        // Skip elements with invalid colors
      }
    }
  });

  /* ================= KEYBOARD NAVIGATION ================= */
  doc.querySelectorAll('*').forEach(el => {
    if (INTERACTIVE_TAGS.includes(el.tagName)) {
      const tabIndex = el.getAttribute('tabindex');
      
      if (tabIndex && parseInt(tabIndex) < 0) {
        issues.push({
          id: el as HTMLElement,
          rule: 'keyboard',
          type: 'Keyboard',
          severity: 'High',
          message: 'Interactive element not focusable via keyboard (tabindex < 0)',
          selector: getSelector(el),
          fix: () => el.setAttribute('tabindex', '0'),
        });
      }

      const outline = getComputedStyle(el).outlineStyle;
      if (outline === 'none' || outline === '') {
        issues.push({
          id: el as HTMLElement,
          rule: 'focus-style',
          type: 'Keyboard',
          severity: 'Medium',
          message: 'No visible focus indicator',
          selector: getSelector(el),
          fix: () => {
            (el as HTMLElement).style.outline = '2px solid #4F46E5';
            (el as HTMLElement).style.outlineOffset = '2px';
          },
        });
      }
    }
  });

  /* ================= ARIA ANALYSIS ================= */
  doc.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');

    if (SEMANTIC_TAGS.includes(el.tagName)) {
      issues.push({
        id: el as HTMLElement,
        rule: 'aria-redundant',
        type: 'ARIA',
        severity: 'Low',
        message: `Redundant ARIA role "${role}" on semantic <${el.tagName.toLowerCase()}>`,
        selector: getSelector(el),
        fix: () => el.removeAttribute('role'),
      });
    }

    // Check for invalid ARIA roles
    const validRoles = [
      'alert', 'application', 'article', 'banner', 'button', 'checkbox', 'columnheader',
      'complementary', 'contentinfo', 'definition', 'dialog', 'directory', 'document',
      'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 'img', 'link',
      'list', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
      'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio',
      'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox',
      'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab', 'tablist', 'tabpanel',
      'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem',
    ];

    if (role && !validRoles.includes(role.toLowerCase())) {
      issues.push({
        id: el as HTMLElement,
        rule: 'invalid-aria-role',
        type: 'ARIA',
        severity: 'High',
        message: `Invalid ARIA role "${role}"`,
        selector: getSelector(el),
      });
    }
  });

  /* ================= HEADING STRUCTURE ================= */
  const headings: { level: number; el: Element }[] = [];
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    headings.push({ level, el: heading });
  });

  headings.forEach((heading, index) => {
    if (index === 0 && heading.level !== 1) {
      issues.push({
        id: heading.el as HTMLElement,
        rule: 'heading-start',
        type: 'Heading',
        severity: 'Medium',
        message: 'Page should start with H1 heading',
        selector: getSelector(heading.el),
      });
    }

    if (index > 0) {
      const prevLevel = headings[index - 1].level;
      if (heading.level - prevLevel > 1) {
        issues.push({
          id: heading.el as HTMLElement,
          rule: 'heading-hierarchy',
          type: 'Heading',
          severity: 'Medium',
          message: `Heading hierarchy skipped from H${prevLevel} to H${heading.level}`,
          selector: getSelector(heading.el),
        });
      }
    }
  });

  /* ================= LINK ACCESSIBILITY ================= */
  doc.querySelectorAll('a').forEach(link => {
    const text = link.textContent?.trim();
    if (!text || text.length === 0) {
      issues.push({
        id: link as HTMLElement,
        rule: 'link-text',
        type: 'Link',
        severity: 'High',
        message: 'Link has no accessible text',
        selector: getSelector(link),
        fix: () => {
          link.setAttribute('aria-label', 'Link');
        },
      });
    }
  });

  return issues;
}
