import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="relative m-2 w-full max-w-md">
      <input
        type="text"
        className="w-full rounded-full bg-inputBg p-2 pl-10 text-primaryFont placeholder-primaryFont focus:outline-none"
        placeholder="Search..."
      />
      <FaSearch className="absolute left-3 top-2 text-primaryFont" />
    </div>
  );
}
