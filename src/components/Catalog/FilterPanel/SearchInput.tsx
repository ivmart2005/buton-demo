import { useState } from 'react';
import './FilterPanel.css';

interface SearchInputProps {
  onSearch: (query: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

// поисковая строка в панели фильтров, обновляет цветы в процессе ввода
export const SearchInput = ({ onSearch, inputRef }: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value; // value - текст из строки. введён пользователем
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-container">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={handleChange}
        className="search-input"
        autoFocus
      />
      {/* кнопка искать - надо заменить на сбросить */}
    </div>
  );
};