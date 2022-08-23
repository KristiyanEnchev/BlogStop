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
    className?: string;
    menuClassName?: string;
    optionClassName?: string;
    menuPortalClassName?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    allowCreate = false,
    className,
}: MultiSelectProps) {
    const SelectComponent = allowCreate ? CreatableSelect : Select;
    const theme = useAppSelector(selectTheme);
    const isDark = theme === 'dark';

    const bgColor = isDark ? "#1e293b" : "#ffffff";
    const textColor = isDark ? "#e2e8f0" : "#334155";
    const borderColor = isDark ? "#334155" : "#e2e8f0";
    const hoverColor = isDark ? "#334155" : "#f1f5f9";
    const primaryColor = isDark ? "#6366f1" : "#4f46e5";

    const customStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: bgColor,
            borderColor,
            boxShadow: 'none',
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: bgColor,
            zIndex: 50,
        }),
        menuList: (base: any) => ({
            ...base,
            backgroundColor: bgColor,
            padding: '4px',
        }),
        menuPortal: (base: any) => ({
            ...base,
            zIndex: 9999,
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? hoverColor : bgColor,
            color: textColor,
            '&:hover': {
                backgroundColor: hoverColor,
            },
        }),
        multiValue: (base: any) => ({
            ...base,
            backgroundColor: hoverColor,
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            color: textColor,
        }),
        input: (base: any) => ({
            ...base,
            color: textColor,
        }),
        placeholder: (base: any) => ({
            ...base,
            color: isDark ? "#94a3b8" : "#64748b",
        }),
        singleValue: (base: any) => ({
            ...base,
            color: textColor,
        }),
    };

    return (
        <SelectComponent
            isMulti
            options={options}
            value={value}
            onChange={(selected) => onChange(selected as Option[])}
            placeholder={placeholder}
            className={cn("w-full", className)}
            classNamePrefix="multi-select"
            isClearable
            isSearchable
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: primaryColor,
                    neutral0: bgColor,
                    neutral5: hoverColor,
                    neutral10: borderColor,
                    neutral20: borderColor,
                    neutral80: textColor,
                },
            })}
        />
    );
}
