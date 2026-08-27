"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEffect } from 'react';

const BRAND_COLORS = [
  { name: 'Ink', value: '#171717' },
  { name: 'Brand', value: '#e65100' },
  { name: 'Ink Light', value: '#17171766' }, // ink/40
  { name: 'Ink Dark', value: '#171717b3' }, // ink/70
];

interface TiptapEditorProps {
  content: string; // JSON string
  onChange: (json: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      TextStyle,
      Color,
    ],
    content: content ? JSON.parse(content) : '',
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4 border border-line bg-paper text-[14px]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-line bg-cream">
      <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-[12px] font-bold ${editor.isActive('bold') ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-[12px] italic ${editor.isActive('italic') ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 text-[12px] line-through ${editor.isActive('strike') ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          S
        </button>
        
        <div className="h-4 w-px bg-line mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-[12px] font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 text-[12px] font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          H3
        </button>
        
        <div className="h-4 w-px bg-line mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-[12px] ${editor.isActive('bulletList') ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-[12px] ${editor.isActive('orderedList') ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}
        >
          1. List
        </button>

        <div className="h-4 w-px bg-line mx-1" />

        <div className="flex gap-1 items-center px-2">
          {BRAND_COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => editor.chain().focus().setColor(color.value).run()}
              className={`w-4 h-4 rounded-full border border-line ${editor.isActive('textStyle', { color: color.value }) ? 'ring-2 ring-brand ring-offset-1' : ''}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="text-[10px] ml-1 text-ink/50 hover:text-ink"
          >
            Clear
          </button>
        </div>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}