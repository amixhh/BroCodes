import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import CodeExecutor from './CodeExecutor';

// Since language selection now happens when creating a room, we remove the dropdown
// and simply use a default language (here, C++) along with its updated boilerplate.
const Compiler = () => {
  const defaultLanguage = {
    id: 'cpp',
    name: 'C++',
    boilerplate: `#include <bits/stdc++.h>
using namespace std;
#define int long long
#define endl "\n"

signed main(){
    
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int t;
    cin >> t;
    while(t--){
        
    }
    return 0;
}`
  };

  const [code, setCode] = useState(defaultLanguage.boilerplate);

  return (
    <div className="p-4">
      <CodeEditor
        language={defaultLanguage.id}
        code={code}
        onChange={setCode}
      />
      
      <CodeExecutor
        language={defaultLanguage.id}
        code={code}
      />
    </div>
  );
};

export default Compiler;