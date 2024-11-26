// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate'; // Importa o ReactPaginate

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Página atual no ReactPaginate
  const itemsPerPage = 15; // Notícias por página

  // Função memoizada para buscar as notícias mais recentes
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const options = {
        method: 'GET',
        url: 'https://crypto-news16.p.rapidapi.com/news/coincu',
        headers: {
          'x-rapidapi-key': '72d7504469msh0d0295448df04bap14c73djsn1e5e2631d39d',
          'x-rapidapi-host': 'crypto-news16.p.rapidapi.com',
        },
      };

      const response = await axios.request(options);
      setNews(response.data);
      setCurrentPage(0); // Reinicia para a primeira página após a atualização
      scrollToTop(); // Rola para o topo após atualizar
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Animação suave
    });
  };

  // Carrega as notícias ao montar o componente
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Determinar as notícias da página atual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  // Total de páginas
  const pageCount = Math.ceil(news.length / itemsPerPage);

  // Função chamada ao clicar em uma página no ReactPaginate
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    scrollToTop(); // Rola para o topo ao mudar de página
  };

  return (
    <div className="container bg-light my-5 py-3 border rounded">
        <div>
  <h2 className="text-center fs-1 mb-4">Latest Cryptos News</h2>
  <p className="text-center fs-5 mb-5 text-muted">
    Stay ahead in the crypto world with the latest updates and trends. Explore what´s moving the market right now!
  </p>
</div>

{/* Botão de Atualizar (Topo) */}
<div className="text-center mb-5">
  <button className="btn btn-info" onClick={fetchNews} disabled={loading}>
    {loading ? 'Updating...' : 'Refresh News'}
  </button>
</div>


      {loading && <div className="alert alert-info text-center">Loading news...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && news.length === 0 && (
        <div className="alert alert-warning text-center">No news available.</div>
      )}

      {/* Paginação com ReactPaginate */}
{pageCount > 1 && (
  <ReactPaginate
    previousLabel="Previous"
    nextLabel="Next"
    breakLabel="..."
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName="pagination justify-content-center mt-4"
    pageClassName="page-item"
    pageLinkClassName="page-link text-dark border-dark"
    previousClassName="page-item"
    previousLinkClassName="page-link text-dark border-dark"
    nextClassName="page-item"
    nextLinkClassName="page-link text-dark border-dark"
    breakClassName="page-item"
    breakLinkClassName="page-link text-dark border-dark"
    activeClassName="active"
    activeLinkClassName="bg-dark text-white border-dark" // Adiciona o estilo info à página ativa
  />
)}


      {/* Lista de Notícias */}
      <div className="row px-3">
        {currentNews.map((article, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={article.thumbnail || 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={article.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text text-truncate">{article.description}</p>
              </div>
              <div className="card-footer">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark btn-sm w-100"
                >
                  Read More
                </a>
                <small className="text-muted d-block mt-2">
                  Published: {new Date(article.date).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação com ReactPaginate */}
{pageCount > 1 && (
  <ReactPaginate
    previousLabel="Previous"
    nextLabel="Next"
    breakLabel="..."
    pageCount={pageCount}
    marginPagesDisplayed={2}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName="pagination justify-content-center mt-4"
    pageClassName="page-item"
    pageLinkClassName="page-link text-dark border-dark"
    previousClassName="page-item"
    previousLinkClassName="page-link text-dark border-dark"
    nextClassName="page-item"
    nextLinkClassName="page-link text-dark border-dark"
    breakClassName="page-item"
    breakLinkClassName="page-link text-dark border-dark"
    activeClassName="active"
    activeLinkClassName="bg-dark text-white border-dark" // Adiciona o estilo info à página ativa
  />
)}


      {/* Botão de Atualizar (Final da Página) */}
      <div className="text-center mt-4">
        <button className="btn btn-info" onClick={fetchNews} disabled={loading}>
          {loading ? 'Updating...' : 'Update News'}
        </button>
      </div>
    </div>
  );
};

export default CryptoNews;
