import React from 'react';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  const languages = [
    { id: 'cpp', name: 'C++'},
    { id: 'python3', name: 'Python' },
    { id: 'java', name: 'Java' },
  ];

  const handleLanguageChange = (e) => {
    const selectedLang = languages.find((lang) => lang.id === e.target.value);
    onLanguageChange(selectedLang);
  };

  return (
    <select
      value={selectedLanguage.id || selectedLanguage} // Adjust based on the type of selectedLanguage
      onChange={handleLanguageChange}
      className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
    >
      {languages.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;