"use client"

import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface QuillEditorProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function QuillEditor({ value, onChange, className, placeholder }: QuillEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    useEffect(() => {
        if (containerRef.current && !quillRef.current) {
            const editor = new Quill(containerRef.current, {
                theme: 'snow',
                placeholder: placeholder || 'Write something...',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean']
                    ],
                },
            })

            quillRef.current = editor

            editor.on('text-change', () => {
                onChange(editor.root.innerHTML)
            })
        }
    }, [onChange, placeholder])

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            // Only update if the content is different to avoid cursor jumping or loops
            // This is a simple check; for more complex cases, a delta comparison might be needed
            // But for this use case, it should suffice.
            // However, setting innerHTML directly can be risky with cursor position.
            // Since this is mostly for generation and then editing, it might be okay.
            // A better approach for controlled inputs in Quill is tricky.
            // Let's try to set it only if it's significantly different or empty.

            // If the editor is empty and value is not, set it.
            // If the editor has content and value is different, set it (carefully).

            // Actually, for a controlled component feel:
            const currentContent = quillRef.current.root.innerHTML
            if (value !== currentContent) {
                // Use clipboard to dangerously paste HTML or just set innerHTML
                quillRef.current.root.innerHTML = value
            }
        }
    }, [value])

    return <div ref={containerRef} className={className} />
}
