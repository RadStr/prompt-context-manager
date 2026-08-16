import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import PromptManipulation from "../view/tabs/create-prompt-tab/prompt-manipulation";
import './App.css';
import { Menu } from '../view/menu';
import { Toaster } from 'sonner';

function App() {
  return <div>
      <Toaster />
      <Menu/>
    </div>;

  // const [count, setCount] = useState(0);

  // return (
  //   <>
  //     <div>
  //       <a href="https://wxt.dev" target="_blank">
  //         <img src={wxtLogo} className="logo" alt="WXT logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>WXT + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <AddPrompts/>
  //     <p className="read-the-docs">
  //       Click on the WXT and React logos to learn more
  //     </p>
  //   </>
  // );
}

export default App;
