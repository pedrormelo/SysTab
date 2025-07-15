
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown, Check, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Usuario {
    id: string;
    nome: string;
}
type UsuariosSelectProps = {
    value: string | null;
    onValueChange: (value: string | null) => void;
    usuarios: Usuario[];
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    loading?: boolean;
    required?: boolean;
    className?: string;
};

export default function UsuariosSelect({ value, onValueChange, usuarios, label, placeholder = "Selecione um usuário", error, disabled, loading, required, className }: UsuariosSelectProps) {
    const NAO_CADASTRADO_VALUE = "NAO_CADASTRADO";
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Add "Usuário Não Cadastrado" option
    const usuariosWithNC = useMemo(() => [
        { id: NAO_CADASTRADO_VALUE, nome: "Usuário Não Cadastrado" },
        ...usuarios,
    ], [usuarios]);

    // Filtered list
    const filteredUsuarios = useMemo(() =>
        usuariosWithNC.filter(u =>
            u.nome.toLowerCase().includes(search.toLowerCase())
        ),
        [usuariosWithNC, search]
    );

    // Selected user object
    const selectedUsuario = usuariosWithNC.find(u => (value === null ? NAO_CADASTRADO_VALUE : String(value)) === String(u.id));

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const clearSelection = () => {
        onValueChange(null);
        setSearch("");
    };

    const selectId = label ? `usuarios-select-${label.replace(/\s+/g, "-").toLowerCase()}` : "usuarios-select";

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-medium text-gray-700 dark:text-gray-300",
                        required && "after:content-['*'] after:ml-0.5 after:text-red-500"
                    )}
                >
                    {label}
                </Label>
            )}
            <div className="relative">
                <Select
                    value={value === null ? NAO_CADASTRADO_VALUE : String(value)}
                    onValueChange={val => {
                        if (val === NAO_CADASTRADO_VALUE) {
                            onValueChange(null);
                        } else {
                            onValueChange(val);
                        }
                    }}
                    disabled={disabled || loading}
                    onOpenChange={setIsOpen}
                >
                    <SelectTrigger
                        id={selectId}
                        className={cn(
                            "group relative w-full min-h-[44px] px-3 py-2",
                            "bg-white dark:bg-gray-950",
                            "border-2 border-gray-200 dark:border-gray-800",
                            "rounded-xl shadow-sm",
                            "transition-all duration-200 ease-in-out",
                            "hover:border-gray-300 dark:hover:border-gray-700",
                            "focus:border-emerald-500 dark:focus:border-emerald-400",
                            "focus:ring-4 focus:ring-emerald-500/10",
                            "disabled:bg-gray-50 dark:disabled:bg-gray-900",
                            "disabled:border-gray-200 dark:border-gray-800",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            error && "border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500/10",
                            "sm:min-h-[40px]"
                        )}
                        aria-label={label}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${selectId}-error` : undefined}
                    >
                        <div className="flex items-center justify-between w-full">
                            <SelectValue
                                placeholder={
                                    loading ? (
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                                            Carregando...
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
                                    )
                                }
                                className="text-left truncate pr-2"
                            />
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Show clear icon OR chevron, not both */}
                                {selectedUsuario && !disabled && !loading && !isOpen ? (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        onClick={clearSelection}
                                        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") clearSelection(); }}
                                        className={cn(
                                            "p-1 rounded-md cursor-pointer",
                                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                                            "transition-all duration-150",
                                            "focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        )}
                                        aria-label="Limpar seleção"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </span>
                                ) : (
                                    <ChevronDown
                                        className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
                                    />
                                )}
                            </div>
                        </div>
                    </SelectTrigger>
                    <SelectContent className={cn("w-full min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl animate-in fade-in-0 zoom-in-95")}
                        position="popper"
                        sideOffset={4}
                    >
                        <div className="p-2">
                            <Input
                                ref={searchInputRef}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar usuário..."
                                className="w-full mb-2"
                                disabled={disabled}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-3 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Limpar busca"
                                >
                                    <X className="w-3 h-3 text-gray-400" />
                                </button>
                            )}
                        </div>
                        <div className="overflow-y-auto max-h-[240px] sm:max-h-[320px]">
                            {filteredUsuarios.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                        <Search className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nenhum usuário encontrado</p>
                                    {search && <p className="text-xs text-gray-400">Tente buscar com outros termos</p>}
                                </div>
                            ) : (
                                <div className="py-1">
                                    {filteredUsuarios.map((u) => (
                                        <SelectItem
                                            key={u.id}
                                            value={String(u.id)}
                                            className={cn(
                                                "relative flex items-center justify-between",
                                                "px-3 py-2.5 mx-1 rounded-lg",
                                                "cursor-pointer transition-all duration-150",
                                                "hover:bg-gray-50 dark:hover:bg-gray-800",
                                                "focus:bg-emerald-50 dark:focus:bg-emerald-900/20",
                                                "data-[state=checked]:bg-emerald-50 dark:data-[state=checked]:bg-emerald-900/20",
                                                "data-[state=checked]:text-emerald-700 dark:data-[state=checked]:text-emerald-300"
                                            )}
                                        >
                                            <span className="truncate pr-2 text-sm flex items-center gap-2">
                                                {/* Show check icon before name if selected */}
                                                {String(u.id) === (value === null ? NAO_CADASTRADO_VALUE : String(value)) && (
                                                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                                )}
                                                {/* Only show UserX for 'Usuário Não Cadastrado' and not selected */}
                                                {u.id === NAO_CADASTRADO_VALUE && String(u.id) !== (value === null ? NAO_CADASTRADO_VALUE : String(value)) && (
                                                    <UserX className="w-4 h-4 text-gray-400" />
                                                )}
                                                {u.nome}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SelectContent>
                </Select>
            </div>
            {error && (
                <p
                    id={`${selectId}-error`}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200"
                >
                    <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                    {error}
                </p>
            )}
            {!error && filteredUsuarios.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {usuariosWithNC.length} {usuariosWithNC.length === 1 ? "usuário disponível" : "usuários disponíveis"}
                </p>
            )}
        </div>
    );
}
