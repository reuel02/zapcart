import { useState } from "react";
import { FaTimes, FaPlus, FaMinus, FaCheck } from "react-icons/fa";

// Complementos disponíveis por tipo de produto
const COMPLEMENTOS_POR_TIPO = {
    hamburguer: [
        { id: "c1", nome: "Bacon extra", preco: 5.00 },
        { id: "c2", nome: "Queijo cheddar extra", preco: 4.00 },
        { id: "c3", nome: "Ovo", preco: 3.00 },
        { id: "c4", nome: "Cebola caramelizada", preco: 3.50 },
        { id: "c5", nome: "Molho especial extra", preco: 2.00 },
        { id: "c6", nome: "Jalapeño", preco: 3.00 },
    ],
    porcao: [
        { id: "c7", nome: "Cheddar cremoso", preco: 5.00 },
        { id: "c8", nome: "Bacon em pedaços", preco: 6.00 },
        { id: "c9", nome: "Molho extra", preco: 2.00 },
    ],
    bebida: [],
};

// Ingredientes removíveis por tipo
const REMOVIVEIS_POR_TIPO = {
    hamburguer: [
        { id: "r1", nome: "Cebola" },
        { id: "r2", nome: "Alface" },
        { id: "r3", nome: "Tomate" },
        { id: "r4", nome: "Molho" },
        { id: "r5", nome: "Picles" },
    ],
    porcao: [
        { id: "r6", nome: "Molho acompanhante" },
    ],
    bebida: [],
};

export default function ModalPersonalizar({ produto, onConfirmar, onFechar }) {
    const [quantidade, setQuantidade] = useState(1);
    const [complementosSelecionados, setComplementosSelecionados] = useState([]);
    const [removidos, setRemovidos] = useState([]);
    const [observacao, setObservacao] = useState("");

    const complementosDisponiveis = COMPLEMENTOS_POR_TIPO[produto.tipo] || [];
    const removiveisDisponiveis = REMOVIVEIS_POR_TIPO[produto.tipo] || [];

    // Calcula o preço extra dos complementos
    const precoExtras = complementosSelecionados.reduce((total, c) => total + c.preco, 0);
    const precoUnitarioFinal = produto.preco + precoExtras;
    const precoTotalItem = precoUnitarioFinal * quantidade;

    function formatarPreco(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    }

    function toggleComplemento(complemento) {
        setComplementosSelecionados((prev) => {
            const existe = prev.find((c) => c.id === complemento.id);
            if (existe) return prev.filter((c) => c.id !== complemento.id);
            return [...prev, complemento];
        });
    }

    function toggleRemovido(item) {
        setRemovidos((prev) => {
            const existe = prev.find((r) => r.id === item.id);
            if (existe) return prev.filter((r) => r.id !== item.id);
            return [...prev, item];
        });
    }

    function confirmar() {
        onConfirmar({
            ...produto,
            quantidade,
            complementos: complementosSelecionados,
            removidos,
            observacao: observacao.trim(),
            precoFinal: precoUnitarioFinal,
        });
    }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={onFechar}
        >
            <div
                className="bg-bg-secondary rounded-2xl border border-border w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-modal-in overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho com imagem */}
                <div className="relative">
                    <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
                    <button
                        onClick={onFechar}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                    >
                        <FaTimes className="size-4" />
                    </button>
                    <div className="absolute bottom-3 left-4 right-4">
                        <h2 className="text-text-heading text-xl font-bold">{produto.nome}</h2>
                        <p className="text-text-subtle text-xs mt-1">{produto.descricao}</p>
                    </div>
                </div>

                {/* Conteúdo scrollável */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

                    {/* === COMPLEMENTOS (ADICIONAR) === */}
                    {complementosDisponiveis.length > 0 && (
                        <div>
                            <h3 className="text-text-heading font-bold text-sm mb-2 flex items-center gap-2">
                                <FaPlus className="text-brand-fresh size-3" />
                                Adicionar complementos
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                {complementosDisponiveis.map((c) => {
                                    const selecionado = complementosSelecionados.some((s) => s.id === c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => toggleComplemento(c)}
                                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all cursor-pointer ${
                                                selecionado
                                                    ? "border-brand-fresh/50 bg-brand-fresh/10 text-text-heading"
                                                    : "border-border bg-bg-primary text-text-secondary hover:border-border-hover"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs border ${
                                                    selecionado
                                                        ? "bg-brand-fresh border-brand-fresh text-white"
                                                        : "border-border-hover"
                                                }`}>
                                                    {selecionado && <FaCheck className="size-2.5" />}
                                                </span>
                                                {c.nome}
                                            </div>
                                            <span className="text-brand-cheese font-semibold text-xs">
                                                + {formatarPreco(c.preco)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* === REMOVER INGREDIENTES === */}
                    {removiveisDisponiveis.length > 0 && (
                        <div>
                            <h3 className="text-text-heading font-bold text-sm mb-2 flex items-center gap-2">
                                <FaMinus className="text-brand-zap size-3" />
                                Remover ingredientes
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {removiveisDisponiveis.map((r) => {
                                    const selecionado = removidos.some((s) => s.id === r.id);
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => toggleRemovido(r)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                                selecionado
                                                    ? "border-brand-zap/50 bg-brand-zap/15 text-brand-zap line-through"
                                                    : "border-border bg-bg-primary text-text-secondary hover:border-border-hover"
                                            }`}
                                        >
                                            {selecionado ? "✕ " : ""}{r.nome}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* === OBSERVAÇÕES === */}
                    <div>
                        <h3 className="text-text-heading font-bold text-sm mb-2">
                            📝 Observações
                        </h3>
                        <textarea
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            placeholder="Ex: Ponto da carne bem passado, sem sal..."
                            rows={2}
                            maxLength={200}
                            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-text-heading text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-zap/50 focus:border-brand-zap transition-all resize-none"
                        />
                        <p className="text-text-muted text-xs text-right mt-1">
                            {observacao.length}/200
                        </p>
                    </div>
                </div>

                {/* Rodapé fixo: Quantidade + Botão adicionar */}
                <div className="border-t border-border p-4 flex items-center gap-4">
                    {/* Controle de quantidade */}
                    <div className="flex items-center gap-2 bg-bg-primary border border-border rounded-xl px-2 py-1">
                        <button
                            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border text-text-heading transition-colors cursor-pointer"
                        >
                            <FaMinus className="size-3" />
                        </button>

                        <span className="text-text-heading font-bold text-base w-6 text-center">
                            {quantidade}
                        </span>

                        <button
                            onClick={() => setQuantidade(quantidade + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border text-text-heading transition-colors cursor-pointer"
                        >
                            <FaPlus className="size-3" />
                        </button>
                    </div>

                    {/* Botão adicionar */}
                    <button
                        onClick={confirmar}
                        className="flex-1 bg-brand-fresh hover:brightness-110 text-white font-bold py-3 rounded-xl text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                    >
                        Adicionar {formatarPreco(precoTotalItem)}
                    </button>
                </div>
            </div>
        </div>
    );
}
