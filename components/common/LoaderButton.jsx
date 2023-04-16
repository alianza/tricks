import utilStyles from '../../styles/utils.module.scss';

function LoaderButton({ label, isLoading, className }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`${utilStyles.button} ${className} flex items-center bg-green-500 hover:bg-green-600 focus:ring-green-600/50`}
    >
      {label || 'Submit'}
      <svg
        className={`h-5 text-white transition-[width,margin] ${isLoading ? 'ml-2 w-5 animate-spin' : 'ml-0 w-0'}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </button>
  );
}

export default LoaderButton;
