import { catApi } from '../api';

function Detail(props: { id: string }) {
  const cat = catApi.get.useQuery(props.id);

  return cat.data ? (
    <div className="Detail">
      <h2>Detail</h2>
      <div>{cat.data.id}</div>
      <div>{cat.data.name}</div>
      <div>{cat.data.age}</div>
    </div>
  ) : (
    <div className="Detail"></div>
  );
}

export default Detail;
