const languageMap = {
  'cpp': 'cpp17',
  'python3': 'python3',
  'java': 'java',
  'nodejs': 'nodejs'
};

export async function executeCode(code, language) {
  try {
    const mappedLanguage = languageMap[language] || language;
    
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: mappedLanguage
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute code');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
}