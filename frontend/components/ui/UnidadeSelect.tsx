
import { useState, useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { Label } from "./label";

interface Unidade {
    id: number;
    nome: string;
}

interface UnidadeSelectProps {
    unidades: Unidade[];
    value: string;
    onValueChange: (val: string) => void;
    placeholder?: string;
    label?: string;
    selectId?: string;
    className?: string;
    disabled?: boolean;
}

export function UnidadeSelect({
    unidades,
    value,
    onValueChange,
    placeholder = "Selecione a unidade",
    label = "Unidade",
    selectId = "unidade-select",
    className = "",
    disabled = false,
}: UnidadeSelectProps) {
    const [search, setSearch] = useState("");

    // Memoize filtered unidades for performance
    const filteredUnidades = useMemo(() => {
        if (!search) return unidades;
        return unidades.filter(u => u.nome.toLowerCase().includes(search.toLowerCase()));
    }, [search, unidades]);

    // Find selected unidade name for display
    const selectedUnidade = unidades.find(u => String(u.id) === value);

    return (
        <div className={className}>
            {label && <Label htmlFor={selectId}>{label}</Label>}
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger
                    id={selectId}
                    className={`w-full border-2 border-blue-200 focus:ring-2 focus:ring-blue-400 rounded-lg shadow-sm ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    aria-label={label}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-blue-200 max-h-60 overflow-y-auto">
                    <div className="px-2 py-2 sticky top-0 bg-white z-10">
                        <input
                            type="text"
                            placeholder="Buscar unidade..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                            disabled={disabled}
                        />
                    </div>
                    {filteredUnidades.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400 text-sm">Nenhuma unidade encontrada</div>
                    ) : (
                        filteredUnidades.map(u => (
                            <SelectItem key={u.id} value={String(u.id)}>
                                {u.nome}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
