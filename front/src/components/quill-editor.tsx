"use client"

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface QuillEditorProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export interface QuillEditorHandle {
    getQuill: () => Quill | null
}

export const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(
    ({ value, onChange, className, placeholder }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const quillRef = useRef<Quill | null>(null)

        useImperativeHandle(ref, () => ({
            getQuill: () => quillRef.current
        }))

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
                const currentContent = quillRef.current.root.innerHTML
                if (value !== currentContent) {
                    quillRef.current.root.innerHTML = value
                }
            }
        }, [value])

        return <div ref={containerRef} className={className} />
    }
)

QuillEditor.displayName = 'QuillEditor'
