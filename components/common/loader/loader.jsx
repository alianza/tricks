import styles from './loader.module.scss';

export default function Loader({ className }) {
  return <div className={`${styles.loader} before:bg-red-500 ${className}`} />;
}
