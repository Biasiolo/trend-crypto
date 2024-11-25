// CryptoNews.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para buscar as notícias
  const fetchNews = async () => {
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
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega as notícias ao montar o componente
  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Latest Crypto News</h2>

      {loading && <div className="alert alert-info text-center">Loading news...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && news.length === 0 && (
        <div className="alert alert-warning text-center">No news available.</div>
      )}

      <div className="row">
        {news.map((article, index) => (
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
                  className="btn btn-primary btn-sm w-100"
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
    </div>
  );
};

export default CryptoNews;
