'use client';

import Button from "@/components/button";
import Input from "@/components/input";
import LanguageSelector from "@/components/code-editor/LanguageSelector";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidV4 } from 'uuid';

const HomePage = () => {
  const router = useRouter();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({ 
    id: 'cpp', 
    name: 'C++',
    boilerplate: `#include <bits/stdc++.h>
using namespace std;
#define int long long
#define endl "\\n"

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
  });

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Please enter username and room ID');
      return;
    }
    router.push(`/room/${roomId}?username=${username}&language=${selectedLanguage.id}`);
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className="flex flex-col bg-dark min-h-screen gap-16 p-6 items-center justify-center">
      <h1 className="text-center text-white font-bold text-4xl">BroCode Playground</h1>
      <div className="flex flex-col gap-6">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleInputEnter}
        />
        <Input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={handleInputEnter}
        />
        <LanguageSelector
          selectedLanguage={selectedLanguage.id}
          onLanguageChange={(lang) => setSelectedLanguage(lang)}
        />
        <div className="flex gap-4">
          <Button onClick={createNewRoom}>Create New Room Id</Button>
          <Button variant="secondary" onClick={joinRoom}>Join Room</Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 