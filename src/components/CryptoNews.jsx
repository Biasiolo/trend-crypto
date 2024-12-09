// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  // Função para mesclar e ordenar as notícias por data
  const mergeAndSortNews = (news1, news2, news3) => {
    const mergedNews = [...news1, ...news2, ...news3];
    return mergedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Função memoizada para buscar as notícias mais recentes
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const options1 = {
        method: 'GET',
        url: 'https://crypto-news16.p.rapidapi.com/news/cointelegraph',
        headers: {
          'x-rapidapi-key': '72d7504469msh0d0295448df04bap14c73djsn1e5e2631d39d',
          'x-rapidapi-host': 'crypto-news16.p.rapidapi.com',
        },
      };

      const options2 = {
        method: 'GET',
        url: 'https://crypto-news16.p.rapidapi.com/news/coindesk',
        headers: {
          'x-rapidapi-key': '72d7504469msh0d0295448df04bap14c73djsn1e5e2631d39d',
          'x-rapidapi-host': 'crypto-news16.p.rapidapi.com',
        },
      };

      const options3 = {
        method: 'GET',
        url: 'https://crypto-news16.p.rapidapi.com/news/bitcoinmagazine',
        headers: {
          'x-rapidapi-key': '72d7504469msh0d0295448df04bap14c73djsn1e5e2631d39d',
          'x-rapidapi-host': 'crypto-news16.p.rapidapi.com',
        },
      };

      const [response1, response2, response3] = await Promise.all([
        axios.request(options1),
        axios.request(options2),
        axios.request(options3),
      ]);

      const combinedNews = mergeAndSortNews(
        response1.data,
        response2.data,
        response3.data
      );
      setNews(combinedNews);
      setFilteredNews(combinedNews); // Inicialmente, todas as notícias são exibidas
      setCurrentPage(0);
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega as notícias ao montar o componente
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Determinar as notícias da página atual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  // Total de páginas
  const pageCount = Math.ceil(filteredNews.length / itemsPerPage);

  // Função chamada ao clicar em uma página no ReactPaginate
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Opções para a barra de busca
  const searchOptions = news.map((article) => ({
    value: article.title,
    label: article.title,
  }));

  // Função para filtrar as notícias pela barra de busca
  const handleSearchChange = (selectedOption) => {
    if (selectedOption) {
      const searchQuery = selectedOption.value.toLowerCase();
      const filtered = news.filter((article) =>
        article.title.toLowerCase().includes(searchQuery)
      );
      setFilteredNews(filtered);
      setCurrentPage(0);
    } else {
      setFilteredNews(news);
    }
  };

  return (
    <div className="container bg-light my-5 py-3 border rounded">
      <div>
        <h2 className="text-center fs-1 mb-4 fw-bold">Latest Cryptos News</h2>
        <hr />
        <p className="text-center fs-5 mb-5 text-muted">
          Stay ahead in the crypto world with the latest updates and trends. Explore what&apos;s moving the market right now!
        </p>
      </div>

      {/* Barra de Busca */}
      <div className="mb-5 px-5 text-center">
        <Select
          options={searchOptions}
          onChange={handleSearchChange}
          isClearable
          placeholder="Search for news by title..."
        />
      </div>

      {loading && <div className="alert alert-info text-center">Loading news...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && filteredNews.length === 0 && (
        <div className="alert alert-warning text-center">No news available.</div>
      )}

      {/* Lista de Notícias */}
      <div className="row mt-5 px-3">
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
          activeLinkClassName="bg-dark text-white border-dark"
        />
      )}
    </div>
  );
};

export default CryptoNews;
