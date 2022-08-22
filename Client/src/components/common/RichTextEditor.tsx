import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="min-h-[200px] bg-white dark:bg-gray-800"
        />
    );
}
