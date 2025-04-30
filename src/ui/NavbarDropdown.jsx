import { HiOutlineUser } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
function NavbarDropdown() {
  return (
    <div className="flex items-center gap-5 rounded-md border-1 border-zinc-800 px-2 py-1">
      <div className="flex items-center gap-2">
        <HiOutlineUser className="text-xl" />
        <span className="text-lg">Abhinav</span>
      </div>
      <IoIosArrowDown className="text-xl" />
    </div>
  );
}

export default NavbarDropdown;
