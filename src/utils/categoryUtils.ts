import { VariationPart } from '../types';
import { Language, t } from '../i18n';

/**
 * Returns categories in the exact order they are displayed in the Variation Column:
 * 1. Iterates sections according to sectionOrder (defaults to [1, 2, 3, 4, 5], or custom section order).
 * 2. Within each section, first includes categories from customCategories (preserving their drag-and-drop order),
 *    followed by any extra categories found in parts for that section.
 * 3. Catches any parts with non-standard sections under Section 5 (Others).
 */
export function getOrderedCategories(
  parts: VariationPart[] = [],
  customCategories: { name: string; section: number }[] = [],
  sectionOrder?: number[]
): [string, number][] {
  let activeSectionOrder = sectionOrder;
  if (!activeSectionOrder || activeSectionOrder.length === 0) {
    try {
      const saved = localStorage.getItem('variation_section_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeSectionOrder = parsed;
        }
      }
    } catch (e) {}
  }
  if (!activeSectionOrder || activeSectionOrder.length === 0) {
    activeSectionOrder = [1, 2, 3, 4, 5];
  }

  // Ensure sections 1..5 all exist
  const fullSectionOrder = [...activeSectionOrder];
  [1, 2, 3, 4, 5].forEach(s => {
    if (!fullSectionOrder.includes(s)) fullSectionOrder.push(s);
  });

  const result: [string, number][] = [];
  const seenCategories = new Set<string>();

  fullSectionOrder.forEach(secId => {
    // 1. Categories from customCategories for this section (in their defined order)
    customCategories
      .filter(c => c.section === secId)
      .forEach(c => {
        if (!seenCategories.has(c.name)) {
          seenCategories.add(c.name);
          result.push([c.name, secId]);
        }
      });

    // 2. Extra categories from parts for this section
    parts
      .filter(p => {
        const effectiveSec = [1, 2, 3, 4].includes(p.section) ? p.section : 5;
        return effectiveSec === secId;
      })
      .forEach(p => {
        if (!seenCategories.has(p.category)) {
          seenCategories.add(p.category);
          result.push([p.category, secId]);
        }
      });
  });

  // 3. Fallback for any parts not yet covered
  parts.forEach(p => {
    if (!seenCategories.has(p.category)) {
      seenCategories.add(p.category);
      const effectiveSec = [1, 2, 3, 4].includes(p.section) ? p.section : 5;
      result.push([p.category, effectiveSec]);
    }
  });

  return result;
}

/**
 * Returns formatted label for section, considering custom section names and i18n
 */
export function getSectionDisplayName(
  sec: number,
  customSectionNames?: Record<number, string>,
  lang: Language = 'ja'
): string {
  if (customSectionNames && customSectionNames[sec]) {
    return customSectionNames[sec];
  }
  const key = sec === 1 ? 'sec_composition' : sec === 2 ? 'sec_pose' : sec === 3 ? 'sec_details' : sec === 4 ? 'sec_context' : 'sec_others';
  return t(key as any, lang);
}
