import { useEffect, useState } from "react"
import Header from "../components/Header"
import CardCatalogo from "../components/CardCatalogo"
import Carrinho from "../components/Carrinho"

export default function Home() {
    const [produtos, setProdutos] = useState([])
    const [erro, setErro] = useState("")
    const [carrinho, setCarrinho] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)

    function adicionarProduto(produtoSelecionado) {
        // Correção: Verificar se o item já existe no CARRINHO, e não na lista de produtos inteira.
        const itemExiste = carrinho.find((item) => item.id === produtoSelecionado.id)

        if (itemExiste) {
            const carrinhoAtualizado = carrinho.map((item) =>
            item.id === produtoSelecionado.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
        setCarrinho(carrinhoAtualizado)
        } else {
            setCarrinho([...carrinho, { ...produtoSelecionado, quantidade: 1 }])
        }
    }

    function aumentarQuantidade(id) {
        setCarrinho(carrinho.map((item) =>
            item.id === id
                ? { ...item, quantidade: item.quantidade + 1 }
                : item
        ))
    }

    function diminuirQuantidade(id) {
        setCarrinho(carrinho.map((item) =>
            item.id === id
                ? { ...item, quantidade: Math.max(1, item.quantidade - 1) }
                : item
        ))
    }

    function removerItem(id) {
        setCarrinho(carrinho.filter((item) => item.id !== id))
    }

    useEffect(() => {
        async function buscarDados() {
            try {
                const resposta = await fetch("/dados.json")
    
                if (!resposta.ok) throw new Error("Erro em buscar os dados.")

                const dados = await resposta.json()

                setProdutos(dados)
            } catch (error) {
                setErro(error.message)
            }

        }
        buscarDados()
    }, [])

    const [filtroAtivo, setFiltroAtivo] = useState("todos")

    // Calcula a quantidade total somando a propriedade "quantidade" de todos os itens do carrinho
    const quantidadeTotalCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);

    // Filtra os produtos de acordo com o tipo selecionado
    const produtosFiltrados = filtroAtivo === "todos"
        ? produtos
        : produtos.filter((p) => p.tipo === filtroAtivo);

    const filtros = [
        { valor: "todos",      label: "Todos" },
        { valor: "hamburguer", label: "🍔 Hambúrgueres" },
        { valor: "porcao",     label: "🍟 Porções" },
        { valor: "bebida",     label: "🥤 Bebidas" },
    ];

    // Verifica se a loja está aberta (horário de funcionamento: 18h às 23h)
    const horaAtual = new Date().getHours();
    const horaAbertura = 18;
    const horaFechamento = 23;
    const lojaAberta = horaAtual >= horaAbertura && horaAtual < horaFechamento;

    return (
        <div className="min-h-screen bg-bg-primary pb-10">
            <Header quantidadeCarrinho={quantidadeTotalCarrinho} onOpenCart={() => setIsCartOpen(true)}/>
            
            <main className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
                {/* Banner de status da loja */}
                <div className={`flex items-center justify-between rounded-xl px-5 py-3 border ${
                    lojaAberta 
                        ? "bg-brand-fresh/10 border-brand-fresh/30" 
                        : "bg-brand-zap/10 border-brand-zap/30"
                }`}>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                lojaAberta ? "bg-brand-fresh" : "bg-brand-zap"
                            }`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${
                                lojaAberta ? "bg-brand-fresh" : "bg-brand-zap"
                            }`}></span>
                        </span>
                        <span className={`font-bold text-sm ${
                            lojaAberta ? "text-brand-fresh" : "text-brand-zap"
                        }`}>
                            {lojaAberta ? "Aberto agora" : "Fechado"}
                        </span>
                    </div>
                    <span className="text-text-subtle text-xs font-semibold">
                        🕐 Seg a Dom • {horaAbertura}h às {horaFechamento}h
                    </span>
                </div>

                {/* Barra de filtros */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {filtros.map((f) => (
                        <button
                            key={f.valor}
                            onClick={() => setFiltroAtivo(f.valor)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer border
                                ${filtroAtivo === f.valor
                                    ? "bg-brand-bun text-zinc-950 border-brand-bun shadow-md"
                                    : "bg-bg-secondary text-text-secondary border-border hover:border-border-hover hover:text-text-heading"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {erro && <p className="text-brand-zap font-bold">{erro}</p>}
                {produtosFiltrados.map((produto) => (
                    <CardCatalogo 
                      key={produto.id} 
                      produto={produto} 
                      onAdicionar={() => adicionarProduto(produto)} 
                    />
                ))}
            </main>

            {isCartOpen && (
                <Carrinho 
                    carrinho={carrinho}
                    onFechar={() => setIsCartOpen(false)}
                    onAumentar={aumentarQuantidade}
                    onDiminuir={diminuirQuantidade}
                    onRemover={removerItem}
                />
            )}
        </div>
    )
}