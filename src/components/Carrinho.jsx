import { FaTrash, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function Carrinho({ carrinho, onFechar, onAumentar, onDiminuir, onRemover }) {
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
        if (carrinho.length === 0) return;

        const linhas = carrinho.map(
            (item) => `${item.quantidade}x ${item.nome} — ${formatarPreco(item.preco * item.quantidade)}`
        );

        const mensagem =
            `*NOVO PEDIDO* 🍔\n` +
            `${linhas.join("\n")}\n` +
            `-----------------------------------\n` +
            `*Total: ${formatarPreco(subtotal)}*`;

        const telefone = "5511999999999"; // Trocar pelo número real
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
                                key={item.id}
                                className="flex items-center gap-3 bg-bg-primary rounded-lg p-3 border border-border"
                            >
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
                                        onClick={() => onDiminuir(item.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-md bg-border hover:bg-border-hover text-text-heading transition-colors cursor-pointer"
                                    >
                                        <FaMinus className="size-3" />
                                    </button>

                                    <span className="text-text-heading font-bold text-sm w-5 text-center">
                                        {item.quantidade}
                                    </span>

                                    <button
                                        onClick={() => onAumentar(item.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-md bg-border hover:bg-border-hover text-text-heading transition-colors cursor-pointer"
                                    >
                                        <FaPlus className="size-3" />
                                    </button>
                                </div>

                                {/* Botão remover */}
                                <button
                                    onClick={() => onRemover(item.id)}
                                    className="text-text-muted hover:text-brand-zap transition-colors ml-1 cursor-pointer"
                                >
                                    <FaTrash className="size-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* ====== RODAPÉ FIXO: SUBTOTAL + BOTÃO WHATSAPP ====== */}
                <div className="border-t border-border p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-text-secondary font-semibold">Subtotal</span>
                        <span className="text-text-heading text-xl font-extrabold">
                            {formatarPreco(subtotal)}
                        </span>
                    </div>

                    <button
                        onClick={finalizarPedido}
                        disabled={carrinho.length === 0}
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