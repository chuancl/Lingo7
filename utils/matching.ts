
import { WordEntry } from "../types";

/**
 * Shared logic for finding fuzzy matches in Chinese text using Intl.Segmenter.
 * Used by both the Content Script (for actual replacement) and the Settings Preview (for demo).
 */
export const findFuzzyMatches = (sourceText: string, candidates: WordEntry[]): { text: string, entry: WordEntry }[] => {
    // Use Chrome's native Intl.Segmenter for word segmentation
    // Casting to any because TS definition might be missing in some environments
    const segmenter = new (Intl as any).Segmenter('zh-CN', { granularity: 'word' });
    const segments = Array.from((segmenter as any).segment(sourceText)).map((s: any) => s.segment as string);
    const uniqueSegments = [...new Set(segments)]; // Dedupe

    const matches: { text: string, entry: WordEntry }[] = [];

    for (const seg of uniqueSegments) {
        if (!/[\u4e00-\u9fa5]/.test(seg)) continue; // Skip non-Chinese

        let bestMatch: WordEntry | null = null;
        let bestScore = 0; // 3=Exact, 2=SegContainsDict, 1=DictContainsSeg

        for (const entry of candidates) {
            if (!entry.translation) continue;
            const dict = entry.translation;

            // 1. Exact Match
            if (seg === dict) {
                if (bestScore < 3) { bestScore = 3; bestMatch = entry; }
            } 
            // 2. Segment contains Dictionary Word (e.g. Dict="开心", Seg="开心地")
            else if (seg.includes(dict)) {
                if (bestScore < 2) { bestScore = 2; bestMatch = entry; }
            }
            // 3. Dictionary Word contains Segment (e.g. Dict="很多种", Seg="很多")
            // Only allow if segment is meaningful (length >= 2 or dict is short)
            else if (dict.includes(seg)) {
                    if (seg.length >= 2 || dict.length <= 2) {
                    if (bestScore < 1) { bestScore = 1; bestMatch = entry; }
                    }
            }
        }

        if (bestMatch) {
            matches.push({ text: seg, entry: bestMatch });
        }
    }
    return matches;
};

/**
 * Aggressive matching logic.
 * Checks if any of the dynamic definitions match the source text with a lower threshold (e.g. 20-30% overlap).
 */
export const findAggressiveMatches = (sourceText: string, entriesWithDefinitions: { entry: WordEntry, definitions: string[] }[]): { text: string, entry: WordEntry }[] => {
    const segmenter = new (Intl as any).Segmenter('zh-CN', { granularity: 'word' });
    const segments = Array.from((segmenter as any).segment(sourceText)).map((s: any) => s.segment as string);
    
    // Create candidate strings from source text (single segments and bi-grams/tri-grams for better context)
    const candidates: string[] = [];
    segments.forEach((s, i) => {
        if (/[\u4e00-\u9fa5]/.test(s)) candidates.push(s);
        // Add bigrams (e.g. "建立" + "了" -> "建立了")
        if (i < segments.length - 1 && /[\u4e00-\u9fa5]/.test(segments[i]) && /[\u4e00-\u9fa5]/.test(segments[i+1])) {
            candidates.push(segments[i] + segments[i+1]);
        }
    });
    
    const uniqueCandidates = [...new Set(candidates)];
    const matches: { text: string, entry: WordEntry }[] = [];

    for (const seg of uniqueCandidates) {
        if (seg.length < 2) continue; // Skip single chars to avoid noise in aggressive mode

        for (const item of entriesWithDefinitions) {
            for (const def of item.definitions) {
                // Calculate similarity or overlap
                // Logic: If they share a common substring of length >= 2, consider it a match
                // Or if one contains the other.
                
                let isMatch = false;
                
                // 1. Direct Inclusion
                if (seg.includes(def) || def.includes(seg)) {
                    isMatch = true;
                } else {
                    // 2. Overlap Check (e.g. Def="难以置信", Seg="难以")
                    // Intersection ratio > 0.3
                    let intersectionLen = 0;
                    // Simple LCS-like check or just character overlap count
                    for (let i = 0; i < seg.length; i++) {
                        if (def.includes(seg[i])) intersectionLen++;
                    }
                    
                    const ratio = intersectionLen / Math.min(seg.length, def.length);
                    if (ratio >= 0.3 && intersectionLen >= 2) {
                        isMatch = true;
                    }
                }

                if (isMatch) {
                    matches.push({ text: seg, entry: item.entry });
                    break; // Found a match for this entry
                }
            }
        }
    }
    
    return matches;
};
