import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md m-2">
      <input
        type="text"
        className="bg-inputBg w-full rounded-full p-2 pl-10 text-primaryFont placeholder-primaryFont focus:outline-none "
        placeholder="Search..."
      />
      <FaSearch className="absolute left-3 top-2 text-primaryFont" />
    </div>
  );
}
