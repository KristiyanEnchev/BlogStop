import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/services/theme/themeSlice";

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
    const theme = useAppSelector(selectTheme);
    const isDark = theme === 'dark';

    const customStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: isDark ? 'var(--dark-bg-secondary)' : 'var(--light-bg)',
            borderColor: isDark ? 'var(--dark-bg-tertiary)' : 'var(--light-bg-tertiary)',
            boxShadow: 'none',
            '&:hover': {
                borderColor: isDark ? 'var(--primary-400)' : 'var(--primary-600)',
            },
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: isDark ? 'var(--dark-bg-secondary)' : 'var(--light-bg)',
            borderColor: isDark ? 'var(--dark-bg-tertiary)' : 'var(--light-bg-tertiary)',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused
                ? isDark ? 'var(--dark-bg-tertiary)' : 'var(--light-bg-tertiary)'
                : undefined,
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
            '&:hover': {
                backgroundColor: isDark ? 'var(--dark-bg-tertiary)' : 'var(--light-bg-tertiary)',
            },
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: isDark ? 'var(--dark-bg-tertiary)' : 'var(--light-bg-tertiary)',
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
        }),
        input: (base: any) => ({
            ...base,
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
        }),
        placeholder: (base: any) => ({
            ...base,
            color: isDark ? 'var(--dark-text-muted)' : 'var(--light-text-muted)',
        }),
        singleValue: (base: any) => ({
            ...base,
            color: isDark ? 'var(--dark-text)' : 'var(--light-text)',
        }),
    };

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
            styles={customStyles}
        />
    );
}
