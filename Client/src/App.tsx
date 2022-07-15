import { Toaster } from 'react-hot-toast';
function App() {

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
      }}
    />
  );
}

export default App;
