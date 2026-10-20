# Typography System (v1.0)
**DevCenterPoint**

---

## 1. Typeface Hierarchy

| Role | Font Family | Fallback | Target Usages |
| :--- | :--- | :--- | :--- |
| **Body & UI** | **Inter** | `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | Web interfaces, body copy, technical documentation, proposals, dashboards. |
| **Display Headings** | **Space Grotesk** | `sans-serif` | Marketing titles, hero sections, section headers, product feature callouts. |
| **Code & Technical Data** | **JetBrains Mono** | `Consolas, Menlo, Monaco, monospace` | Code samples, API endpoints, log consoles, system architectures, technical tags. |

---

## 2. Scale & Pairing Rules

```css
/* Display / Hero */
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Type Scale */
--text-xs:   0.75rem;   /* 12px - Footers, tags, badges */
--text-sm:   0.875rem;  /* 14px - UI labels, tables, secondary body */
--text-base: 1.0rem;    /* 16px - Standard body copy, inputs */
--text-lg:   1.125rem;  /* 18px - Lead paragraphs, subheaders */
--text-xl:   1.25rem;   /* 20px - Card titles, h4 */
--text-2xl:  1.5rem;    /* 24px - Section subheads, h3 */
--text-3xl:  1.875rem;  /* 30px - Section headings, h2 */
--text-4xl:  2.25rem;   /* 36px - Page titles */
--text-5xl:  3.0rem;    /* 48px - Primary Hero display headers */