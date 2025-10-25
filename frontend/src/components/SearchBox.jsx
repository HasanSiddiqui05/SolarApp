import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchBox = ({ onAddProduct }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/search`, {
          params: { query },
        });
        setResults(res.data.products || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 100);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="w-[90%]">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-t-lg border"
      />

      {query.length > 1 &&
        <ul className=" border rounded-b-lg">
            {results.map((product) => (
            <li key={product._id} className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
                onClick={() => {
                        onAddProduct(product)
                        setQuery('')
                        setResults([])
                    }
                }>
                <span className="font-semibold">{product.displayName}</span>{" "}
                <span className="text-gray-500 text-sm">
                ({product.categoryName})
                </span>
            </li>
            ))}
            {!loading && results.length === 0 && query.length >= 2 && (
            <li className="p-2 text-gray-500">No results found</li>
            )}
        </ul>
      }
    </div>
  );
};

export default SearchBox;

