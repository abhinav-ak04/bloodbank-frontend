import { NavLink } from 'react-router-dom';

function Logo() {
  return (
    <div className="ml-2 flex h-auto w-48 shrink-0">
      <NavLink to="/">
        <img className="object-cover" src="/logo.png" alt="Logo" />
      </NavLink>
    </div>
  );
}

export default Logo;
