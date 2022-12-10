import style from './Loader.module.css';

const Loader = () => (
  <div className={style.container}>
    <span className={style.loader} />
    <p>Загрузка...</p>
  </div>
);

export default Loader;
