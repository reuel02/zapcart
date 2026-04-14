export default function CardCatalogo({ produto, onAdicionar }) {
  if (!produto) return null;

  return (
    <div className="flex flex-row items-stretch bg-bg-secondary min-w-full text-text-heading rounded-md border border-border overflow-hidden">
      <img 
        src={produto.imagem} 
        alt="Imagem do produto"
        className="w-32 sm:w-40 object-cover"
      />

      <div className="flex flex-col gap-2 flex-1 py-3 px-4">
        <h2 className="text-1xl font-bold">{produto.nome}</h2>
        <p className="text-xs font-thin text-text-subtle">{produto.descricao}</p>
      </div>

      <div className="flex flex-col justify-center items-center gap-23 py-3 pr-4 pl-2">
        <p className="text-brand-cheese font-bold">R$ {produto.preco.toFixed(2)}</p>
        <button 
          onClick={onAdicionar}
          className="bg-brand-zap p-2 text-xs font-bold rounded-xl text-zinc-950 hover:bg-brand-tag cursor-pointer transition-colors"
        >
          Adicionar +
        </button>
      </div>
    </div>
  );
}
