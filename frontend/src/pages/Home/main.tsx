/**
 * @page HomePage
 * @summary Home page displaying welcome message and application overview
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao TODO List</h2>
        <p className="text-gray-600 text-lg mb-6">
          Sistema completo de gerenciamento de tarefas com recursos avançados para organização e
          produtividade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Criação de Tarefas</h3>
          <p className="text-gray-600">
            Crie tarefas com título, descrição, data de vencimento e prioridade.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Categorização</h3>
          <p className="text-gray-600">
            Organize suas tarefas em categorias e listas personalizadas.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Prioridades</h3>
          <p className="text-gray-600">
            Classifique tarefas por nível de importância (alta, média, baixa).
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Prazos</h3>
          <p className="text-gray-600">Defina datas limite para conclusão das suas tarefas.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Notificações</h3>
          <p className="text-gray-600">Receba alertas sobre tarefas próximas do vencimento.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sincronização</h3>
          <p className="text-gray-600">
            Acesse suas tarefas em diferentes dispositivos automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
