import Logo from './Logo';
import NavbarDropdown from './NavbarDropdown';

function Header() {
  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white">
      <header className="relative flex h-17 items-center justify-around border-b border-slate-100 shadow-lg">
        <Logo />
        <NavbarDropdown />
      </header>
    </div>
  );
}

export default Header;
