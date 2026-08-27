import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { sanitizeHtml } from './sanitize';

export const tiptapExtensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3, 4],
    },
  }),
  TextStyle,
  Color,
];

export function generateSafeHTML(jsonContent: string | null | undefined): string {
  if (!jsonContent) return '';
  
  try {
    const json = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
    
    // Check if it's a valid Tiptap JSON structure
    if (!json || typeof json !== 'object' || !json.type || json.type !== 'doc') {
      // It might be just a plain string or old HTML content
      return sanitizeHtml(String(jsonContent));
    }
    
    const html = generateHTML(json, tiptapExtensions);
    return sanitizeHtml(html);
  } catch (err) {
    // Fallback if parsing fails (maybe it's old plain text data)
    return sanitizeHtml(String(jsonContent));
  }
}