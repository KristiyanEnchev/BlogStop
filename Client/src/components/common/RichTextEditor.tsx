import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Write something...",
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextStyle,
            Color,
            Underline,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    const MenuBar = () => {
        if (!editor) {
            return null;
        }

        return (
            <div className="flex flex-wrap items-center gap-1 p-1 border-b border-light-bg-tertiary dark:border-dark-bg-tertiary bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="flex items-center border-r border-light-bg-tertiary dark:border-dark-bg-tertiary pr-1 mr-1">
                    <select
                        className="bg-light-bg dark:bg-dark-bg border border-light-bg-tertiary dark:border-dark-bg-tertiary rounded px-2 py-1 text-sm text-light-text dark:text-dark-text"
                        onChange={(e) => {
                            const level = parseInt(e.target.value);
                            if (level === 0) {
                                editor.chain().focus().setParagraph().run();
                            } else {
                                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                            }
                        }}
                        value={
                            editor.isActive("heading", { level: 1 })
                                ? "1"
                                : editor.isActive("heading", { level: 2 })
                                ? "2"
                                : editor.isActive("heading", { level: 3 })
                                ? "3"
                                : "0"
                        }
                    >
                        <option value="0">Normal</option>
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-1 rounded ${
                            editor.isActive("bold")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-1 rounded ${
                            editor.isActive("italic")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="4" x2="10" y2="4"></line>
                            <line x1="14" y1="20" x2="5" y2="20"></line>
                            <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-1 rounded ${
                            editor.isActive("underline")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                            <line x1="4" y1="21" x2="20" y2="21"></line>
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`p-1 rounded ${
                            editor.isActive("strike")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <path d="M16 6C16 6 14.5 4 12 4C9.5 4 7 6 7 8C7 10 9 11 11 11.5"></path>
                            <path d="M13 12.5C15 13 17 14 17 16C17 18 14.5 20 12 20C9.5 20 8 18 8 18"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center border-l border-r border-light-bg-tertiary dark:border-dark-bg-tertiary px-1 mx-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-1 rounded ${
                            editor.isActive("bulletList")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="9" y1="6" x2="20" y2="6"></line>
                            <line x1="9" y1="12" x2="20" y2="12"></line>
                            <line x1="9" y1="18" x2="20" y2="18"></line>
                            <circle cx="4" cy="6" r="2"></circle>
                            <circle cx="4" cy="12" r="2"></circle>
                            <circle cx="4" cy="18" r="2"></circle>
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-1 rounded ${
                            editor.isActive("orderedList")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="10" y1="6" x2="21" y2="6"></line>
                            <line x1="10" y1="12" x2="21" y2="12"></line>
                            <line x1="10" y1="18" x2="21" y2="18"></line>
                            <path d="M4 6h1v4"></path>
                            <path d="M4 10h2"></path>
                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            const url = window.prompt("Enter the URL of the image:");
                            if (url) {
                                editor.chain().focus().setImage({ src: url }).run();
                            }
                        }}
                        className="p-1 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            const url = window.prompt("Enter the URL:");
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }}
                        className={`p-1 rounded ${
                            editor.isActive("link")
                                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300"
                                : "hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        }`}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="p-1 rounded hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                        disabled={!editor.isActive("link")}
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                            <line x1="12" y1="2" x2="12" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="rich-text-editor-container border border-light-bg-tertiary dark:border-dark-bg-tertiary rounded-md overflow-hidden">
            <MenuBar />
            <EditorContent 
                editor={editor} 
                className="min-h-[200px] bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text"
            />
            <style dangerouslySetInnerHTML={{ __html: `
                .ProseMirror {
                    padding: 1rem;
                    min-height: 200px;
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                }
            `}} />
        </div>
    );
}
