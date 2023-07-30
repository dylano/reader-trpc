import { useState } from 'react';
import type { Cat } from '../../../server/src/catRouter';
import { catApi } from '../api';

function List({ setDetail }: { setDetail: (id: string) => void }) {
  const [error, setError] = useState('');
  const catList = catApi.list.useQuery();
  const killCat = catApi.delete.useMutation({
    onSuccess: () => {
      catList.refetch();
      setDetail('');
    },
    onError: (data) => {
      setError(data.message);
    },
  });
  const handleDelete = async (id: string) => {
    killCat.mutate({ id });
  };
  const catRow = (cat: Cat) => {
    return (
      <div
        key={cat.id}
        style={{ display: 'flex', justifyContent: 'space-between' }}
        onClick={() => setDetail(cat.id)}
      >
        <span>{cat.name}</span>
        <span>
          <a href="#" onClick={() => handleDelete(cat.id)}>
            delete
          </a>
        </span>
      </div>
    );
  };
  return (
    <div className="List">
      <h2>Cats</h2>
      <span>{error}</span>
      {catList.data &&
        catList.data.map((cat) => {
          return catRow(cat);
        })}
    </div>
  );
}
export default List;
