import { ChangeEvent, useState } from 'react';
import { catApi } from '../api';

function Create() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [error, setError] = useState('');
  const cats = catApi.list.useQuery();
  const createMutation = catApi.create.useMutation({
    onSuccess: () => {
      cats.refetch();
    },
    onError: (data) => {
      console.error(data.message);
      setError(data.message);
    },
  });
  const updateName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const updateAge = (event: ChangeEvent<HTMLInputElement>) => {
    setAge(parseInt(event.target.value, 10));
  };
  const handleCreate = async () => {
    if (name) {
      createMutation.mutate({ name, age });
    }
    setName('');
    setAge(0);
  };
  return (
    <form onSubmit={handleCreate}>
      <div className="Create">
        {error ? <span>{error}</span> : null}
        <h2>Create Cat</h2>
        <div>
          Name: <input type="text" onChange={updateName} value={name} />
          Age: <input type="text" onChange={updateAge} value={age ? age : ''} />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </div>
    </form>
  );
}

export default Create;
