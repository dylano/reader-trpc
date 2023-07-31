import { catApi } from '../api';

function Detail(props: { id: string }) {
  const cat = catApi.get.useQuery({ id: props.id });

  return cat.data ? (
    <div className="Detail">
      <h2>{cat.data.name}</h2>
      <div>ID: {cat.data.id}</div>
      <div>Age: {cat.data.age}</div>
    </div>
  ) : (
    <div className="Detail"></div>
  );
}

export default Detail;
