import React, { useState, useEffect } from 'react';
import './Browse.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const BrowsePage = () => {
  const [books, setBooks] = useState(Array.from({ length: 10 }, (_, index) => ({
    id: index,
    volumeInfo: {
      title: 'Placeholder Title',
      authors: ['Placeholder Author'],
      categories: ['Placeholder Genre'],
      imageLinks: {
        thumbnail: 'https://via.placeholder.com/128x192.png'
      },
      description: 'Placeholder description'
    }
  })));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchInitialBooks = async () => {
      setLoading(true);

      try {
        const initialBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=reactjs&maxResults=10`);
        
        if (initialBooksResponse.data && initialBooksResponse.data.items) {
          setBooks(initialBooksResponse.data.items);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInitialBooks();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!searchTerm) {
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
        
        if (response.data && response.data.items) {
          setBooks(response.data.items);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const navigate = useNavigate();

  const handleKnowMoreDetails = () => {
    if (selectedBook && selectedBook.id) {
      navigate(`/book-details/${selectedBook.id}`, { state: { book: selectedBook } });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedBook(null);
  };

  if (loading) {
    return <div className="browse-container">Loading...</div>;
  }

  if (error) {
    return <div className="browse-container">Error: {error}</div>;
  }

  return (
    <div className="browse-container">
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="filter-select"
        >
          <option value="">All Genres</option>
          {books.map((book) => book.volumeInfo.categories?.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))).flat().filter((category, index, self) => self.indexOf(category) === index)}
        </select>

        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="filter-select"
        >
          <option value="">All Authors</option>
          {books.map((book) => book.volumeInfo.authors?.map((author) => (
            <option key={author} value={author}>{author}</option>
          ))).flat().filter((author, index, self) => self.indexOf(author) === index)}
        </select>
      </div>

      <div className="books-list">
        {books.map((book, index) => (
          <div key={index} className="book-card" onClick={() => handleBookClick(book)}>
            <img src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png'} alt={book.volumeInfo.title} className="book-cover" />
            <h3 className="book-title">{book.volumeInfo.title}</h3>
            <p className="book-author">by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
            <p className="book-genre">Genre: {book.volumeInfo.categories?.join(', ') || 'Unknown Genre'}</p>
          </div>
        ))}
      </div>
     
      {isPopupOpen && selectedBook && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-close" onClick={closePopup}>Close</div>
            <div className="popup-body">
              <img src={selectedBook.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png'} alt={selectedBook.volumeInfo.title} className="popup-book-cover" />
              <div className="popup-book-details">
                <h3>{selectedBook.volumeInfo.title}</h3>
                <p>Author(s): {selectedBook.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
                <p>Genre(s): {selectedBook.volumeInfo.categories?.join(', ') || 'Unknown Genre'}</p>
                <p>Description: {selectedBook.volumeInfo.description || 'No description available'}</p>
                <button onClick={handleKnowMoreDetails}>Know More Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BrowsePage;
