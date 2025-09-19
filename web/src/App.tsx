import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const USERS = [
  { username: "user1", password: "user1123", name: "user" },
  { username: "user2", password: "user2123", name: "user2" },
  { username: "user3", password: "user3123", name: "user3" },
];

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onSubmitData = ()=>{
    USERS.forEach((e)=>{
      
    })
  }
  
  return (
    <>
       <h2>XD</h2>
    </>
  )
}

export default App
