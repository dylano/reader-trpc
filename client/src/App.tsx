import { useState } from 'react';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { catApi } from './api';
import Create from './cats/Create';
import Detail from './cats/Detail';
import List from './cats/List';
import './App.css';

const BACKEND_URL = 'http://localhost:8080/cat';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    catApi.createClient({
      links: [
        httpBatchLink({
          url: BACKEND_URL,
        }),
      ],
    })
  );
  const [detailId, setDetailId] = useState<string>('');
  const setDetail = (id: string) => {
    setDetailId(id);
  };
  return (
    <catApi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Create />
          <List setDetail={setDetail} />
          {detailId ? <Detail id={detailId} /> : null}
        </div>
      </QueryClientProvider>
    </catApi.Provider>
  );
}

export default App;
