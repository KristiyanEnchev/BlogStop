import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: Option[];
    onChange: (selected: Option[]) => void;
    placeholder?: string;
    allowCreate?: boolean;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    allowCreate = false,
}: MultiSelectProps) {
    const SelectComponent = allowCreate ? CreatableSelect : Select;

    return (
        <SelectComponent
            isMulti
            options={options}
            value={value}
            onChange={(selected) => onChange(selected as Option[])}
            placeholder={placeholder}
            className={cn("w-full")}
            classNamePrefix="multi-select"
            isClearable
            isSearchable
        />
    );
}
