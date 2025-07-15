"use client"
import type React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search, X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Unidade {
    id: number
    nome: string
}

interface UnidadeSelectProps {
    unidades: Unidade[]
    value: string
    onValueChange: (val: string) => void
    placeholder?: string
    label?: string
    selectId?: string
    className?: string
    disabled?: boolean
    loading?: boolean
    error?: string
    required?: boolean
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
    loading = false,
    error,
    required = false,
}: UnidadeSelectProps) {
    const [search, setSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Memoize filtered unidades for performance
    const filteredUnidades = useMemo(() => {
        if (!search.trim()) return unidades
        return unidades.filter((u) => u.nome.toLowerCase().includes(search.toLowerCase().trim()))
    }, [search, unidades])

    // Find selected unidade name for display
    const selectedUnidade = unidades.find((u) => String(u.id) === value)

    // Clear search when closing
    useEffect(() => {
        if (!isOpen) {
            setSearch("")
        }
    }, [isOpen])

    // Focus search input when opening
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange("")
        setSearch("")
    }

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-medium text-gray-700 dark:text-gray-300",
                        required && "after:content-['*'] after:ml-0.5 after:text-red-500",
                    )}
                >
                    {label}
                </Label>
            )}

            <div className="relative">
                <Select value={value} onValueChange={onValueChange} disabled={disabled || loading} onOpenChange={setIsOpen}>
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
                            "disabled:border-gray-200 dark:disabled:border-gray-800",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            error && "border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500/10",
                            "sm:min-h-[40px]", // Smaller on mobile
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
                                {selectedUnidade && !disabled && !loading && (
                                    <button
                                        type="button"
                                        onClick={clearSelection}
                                        className={cn(
                                            "p-1 rounded-md opacity-0 group-hover:opacity-100",
                                            "hover:bg-gray-100 dark:hover:bg-gray-800",
                                            "transition-all duration-150",
                                            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
                                        )}
                                        tabIndex={-1}
                                        aria-label="Limpar seleção"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                                <ChevronDown
                                    className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
                                />
                            </div>
                        </div>
                    </SelectTrigger>

                    <SelectContent
                        className={cn(
                            "w-full min-w-[var(--radix-select-trigger-width)]",
                            "bg-white dark:bg-gray-950",
                            "border border-gray-200 dark:border-gray-800",
                            "rounded-xl shadow-xl",
                            "animate-in fade-in-0 zoom-in-95",
                            "max-h-[300px] sm:max-h-[400px]", // Different heights for mobile/desktop
                            "overflow-hidden",
                        )}
                        position="popper"
                        sideOffset={4}
                    >
                        {/* Search Input */}
                        <div className="sticky top-0 z-10 p-3 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar unidade..."
                                    className={cn(
                                        "pl-10 pr-4 py-2 w-full",
                                        "border-gray-200 dark:border-gray-700",
                                        "rounded-lg text-sm",
                                        "focus:border-emerald-500 focus:ring-emerald-500/20",
                                        "bg-gray-50 dark:bg-gray-900",
                                    )}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    disabled={disabled}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Limpar busca"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto max-h-[240px] sm:max-h-[320px]">
                            {filteredUnidades.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                        <Search className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nenhuma unidade encontrada</p>
                                    {search && <p className="text-xs text-gray-400">Tente buscar com outros termos</p>}
                                </div>
                            ) : (
                                <div className="py-1">
                                    {filteredUnidades.map((u) => (
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
                                                "data-[state=checked]:text-emerald-700 dark:data-[state=checked]:text-emerald-300",
                                            )}
                                        >
                                            <span className="truncate pr-2 text-sm">{u.nome}</span>
                                            {String(u.id) === value && (
                                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                            )}
                                        </SelectItem>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SelectContent>
                </Select>
            </div>

            {/* Error Message */}
            {error && (
                <p
                    id={`${selectId}-error`}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200"
                >
                    <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0" />
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {!error && filteredUnidades.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {unidades.length} {unidades.length === 1 ? "unidade disponível" : "unidades disponíveis"}
                </p>
            )}
        </div>
    )
}

