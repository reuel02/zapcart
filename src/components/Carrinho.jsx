import { useState } from "react";
import { FaTrash, FaPlus, FaMinus, FaTimes, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function Carrinho({ carrinho, onFechar, onAumentar, onDiminuir, onRemover }) {
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");

    // Calcula o subtotal somando (preco * quantidade) de cada item
    const subtotal = carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);

    // Formata um número para o padrão BRL
    function formatarPreco(valor) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);
    }

    // Monta a mensagem e abre o WhatsApp
    function finalizarPedido() {
        if (carrinho.length === 0 || !nome.trim() || !endereco.trim()) return;

        const linhas = carrinho.map((item) => {
            let linha = `${item.quantidade}x ${item.nome} — ${formatarPreco(item.preco * item.quantidade)}`;

            // Complementos adicionados
            if (item.complementos && item.complementos.length > 0) {
                linha += `\n   ➕ ${item.complementos.map(c => c.nome).join(", ")}`;
            }

            // Ingredientes removidos
            if (item.removidos && item.removidos.length > 0) {
                linha += `\n   ❌ Sem: ${item.removidos.map(r => r.nome).join(", ")}`;
            }

            // Observação
            if (item.observacao) {
                linha += `\n   📝 ${item.observacao}`;
            }

            return linha;
        });

        const mensagem =
            `*NOVO PEDIDO* 🍔\n` +
            `👤 *Cliente:* ${nome.trim()}\n\n` +
            `${linhas.join("\n\n")}\n\n` +
            `-----------------------------------\n` +
            `*Total: ${formatarPreco(subtotal)}*\n\n` +
            `📍 *Endereço de entrega:*\n` +
            `${endereco.trim()}`;

        const telefone = "5513997385581"; // Trocar pelo número real
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    }

    return (
        // Overlay escuro atrás do painel
        <div
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm"
            onClick={onFechar}
        >
            {/* Painel lateral — stopPropagation evita fechar ao clicar dentro dele */}
            <aside
                className="relative w-full max-w-md h-full bg-bg-secondary border-l border-border flex flex-col shadow-2xl animate-slide-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ====== CABEÇALHO ====== */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h2 className="text-text-heading text-xl font-bold">Seu Pedido</h2>
                    <button
                        onClick={onFechar}
                        className="text-text-muted hover:text-text-heading transition-colors cursor-pointer"
                    >
                        <FaTimes className="size-5" />
                    </button>
                </div>

                {/* ====== LISTA DE ITENS (scrollável) ====== */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {carrinho.length === 0 ? (
                        <p className="text-text-muted text-center mt-10">
                            Seu carrinho está vazio 🛒
                        </p>
                    ) : (
                        carrinho.map((item) => (
                            <div
                                key={item.chavePersonalizacao}
                                className="bg-bg-primary rounded-lg p-3 border border-border"
                            >
                                {/* Linha principal: imagem + nome + controles */}
                                <div className="flex items-center gap-3">
                                    {/* Miniatura */}
                                    <img
                                        src={item.imagem}
                                        alt={item.nome}
                                        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                                    />

                                    {/* Nome + Preço unitário */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-text-heading font-semibold text-sm truncate">
                                            {item.nome}
                                        </h3>
                                        <p className="text-brand-cheese text-xs mt-0.5">
                                            {formatarPreco(item.preco)} cada
                                        </p>
                                    </div>

                                    {/* Controles de quantidade */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onDiminuir(item.chavePersonalizacao)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-border hover:bg-border-hover text-text-heading transition-colors cursor-pointer"
                                        >
                                            <FaMinus className="size-3" />
                                        </button>

                                        <span className="text-text-heading font-bold text-sm w-5 text-center">
                                            {item.quantidade}
                                        </span>

                                        <button
                                            onClick={() => onAumentar(item.chavePersonalizacao)}
                                            className="w-7 h-7 flex items-center justify-center rounded-md bg-border hover:bg-border-hover text-text-heading transition-colors cursor-pointer"
                                        >
                                            <FaPlus className="size-3" />
                                        </button>
                                    </div>

                                    {/* Botão remover */}
                                    <button
                                        onClick={() => onRemover(item.chavePersonalizacao)}
                                        className="text-text-muted hover:text-brand-zap transition-colors ml-1 cursor-pointer"
                                    >
                                        <FaTrash className="size-4" />
                                    </button>
                                </div>

                                {/* Detalhes de personalização */}
                                {(item.complementos?.length > 0 || item.removidos?.length > 0 || item.observacao) && (
                                    <div className="mt-2 pt-2 border-t border-border/50 flex flex-col gap-1">
                                        {item.complementos?.length > 0 && (
                                            <p className="text-brand-fresh text-xs">
                                                ➕ {item.complementos.map(c => c.nome).join(", ")}
                                            </p>
                                        )}
                                        {item.removidos?.length > 0 && (
                                            <p className="text-brand-zap text-xs">
                                                ❌ Sem: {item.removidos.map(r => r.nome).join(", ")}
                                            </p>
                                        )}
                                        {item.observacao && (
                                            <p className="text-text-subtle text-xs italic">
                                                📝 {item.observacao}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* ====== RODAPÉ FIXO: NOME + ENDEREÇO + SUBTOTAL + BOTÃO WHATSAPP ====== */}
                <div className="border-t border-border p-5 flex flex-col gap-4">
                    {/* Campo de nome */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome" className="text-text-secondary font-semibold text-sm flex items-center gap-2">
                            <FaUser className="text-brand-zap" />
                            Seu nome
                        </label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome..."
                            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-text-heading text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-zap/50 focus:border-brand-zap transition-all"
                        />
                    </div>

                    {/* Campo de endereço */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="endereco" className="text-text-secondary font-semibold text-sm flex items-center gap-2">
                            <FaMapMarkerAlt className="text-brand-zap" />
                            Endereço de entrega
                        </label>
                        <textarea
                            id="endereco"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            placeholder="Rua, número, bairro, complemento..."
                            rows={2}
                            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-text-heading text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-zap/50 focus:border-brand-zap transition-all resize-none"
                        />
                        {carrinho.length > 0 && (!nome.trim() || !endereco.trim()) && (
                            <p className="text-brand-zap text-xs">* Preencha o nome e endereço para finalizar</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary font-semibold">Subtotal</span>
                        <span className="text-text-heading text-xl font-extrabold">
                            {formatarPreco(subtotal)}
                        </span>
                    </div>

                    <button
                        onClick={finalizarPedido}
                        disabled={carrinho.length === 0 || !nome.trim() || !endereco.trim()}
                        className="w-full flex items-center justify-center gap-3 bg-brand-fresh hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-lg transition-all cursor-pointer shadow-lg"
                    >
                        <FaWhatsapp className="size-6" />
                        Finalizar pelo WhatsApp
                    </button>
                </div>
            </aside>
        </div>
    );
}