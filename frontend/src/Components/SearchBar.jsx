import React, { useEffect, useMemo, useRef, useState } from "react";
import { BarSearchContent } from "./BarSearchContent";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DEBOUNCE_MS = 250;

const categoryMap = {
  laptops: [
    "laptops",
    "notebook",
    "ultrabook",
    "macbook",
    "gaming laptop",
    "business laptop",
    "chromebook",
    "2-in-1 laptop",
    "convertible laptop",
    "thin and light laptop",
    "portable computer",
  ],
  mobiles: [
    "mobiles",
    "smartphone",
    "android phone",
    "iphone",
    "feature phone",
    "touchscreen phone",
    "handset",
    "mobile device",
    "wireless phone",
    "foldable phone",
  ],
  fashions: ["fashions", "clothes", "shoes", "dresses", "fashion", "tshirts"],
  tv: [
    "tv",
    "television",
    "smart tv",
    "android tv",
    "led tv",
    "lcd tv",
    "oled tv",
    "qled tv",
    "plasma tv",
    "apple tv",
    "fire tv",
    "google tv",
    "samsung tv",
    "lg tv",
    "sony bravia",
    "tcl tv",
    "hisense tv",
    "4k tv",
    "8k tv",
    "hdr tv",
    "ultra hd tv",
    "full hd tv",
    "curved tv",
    "flat screen tv",
  ],
  teddy: [
    "teddy",
    "teddy bear",
    "soft toy",
    "plush teddy",
    "stuffed teddy",
    "cuddly toy",
    "kids teddy",
    "gift teddy",
  ],
  appliances: [
    "appliances",
    "home appliances",
    "kitchen appliances",
    "electronic appliances",
    "household appliances",
    "smart appliances",
  ],
  kitchens: [
    "kitchens",
    "kitchen essentials",
    "modular kitchens",
    "kitchen furniture",
    "kitchen decor",
    "kitchen accessories",
    "kitchenware",
  ],
  toys: [
    "toys",
    "kids toys",
    "baby toys",
    "educational toys",
    "action figures",
    "toy sets",
    "soft toys",
    "remote control toys",
  ],
  monitors: [
    "monitors",
    "computer monitors",
    "gaming monitors",
    "LCD monitors",
    "LED monitors",
    "4K monitors",
    "ultrawide monitors",
    "curved monitors",
  ],
  plastic_toys: [
    "plastic cars",
    "toy cars",
    "kids plastic cars",
    "miniature plastic cars",
    "small plastic cars",
    "plastic toy vehicles",
  ],
  remote_cars: [
    "remote cars",
    "remote control cars",
    "rc cars",
    "remote toy vehicles",
    "radio control cars",
  ],
  stationaries: [
    "stationaries",
    "stationery items",
    "office supplies",
    "school supplies",
    "writing materials",
    "notebooks and pens",
    "art supplies",
  ],
};

const suggestionList = Object.values(categoryMap).flat();

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredSuggestions = useMemo(() => {
    if (!debouncedTerm) return [];
    const searchLower = debouncedTerm.toLowerCase();
    return suggestionList
      .filter((item) => item.toLowerCase().includes(searchLower))
      .slice(0, 8);
  }, [debouncedTerm]);

  const findCategory = (term) => {
    const lowerTerm = term.toLowerCase();
    return (
      Object.entries(categoryMap).find(([, aliases]) =>
        aliases.some((alias) => alias.toLowerCase() === lowerTerm),
      )?.[0] || null
    );
  };

  const submitSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const category = findCategory(trimmed);
    const encodedValue = encodeURIComponent(trimmed);

    if (category) {
      navigate(`/products/${category}?search=${encodedValue}`);
    } else {
      navigate(`/products?search=${encodedValue}`);
    }
    setIsFocused(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    submitSearch(suggestion);
  };

  return (
    <form
      className="position-relative w-100"
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch(searchTerm);
      }}
    >
      <div className="input-group">
        <span className="input-group-text border-0 bg-for-search">
          <FaSearch size={14} className="text-muted" />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="form-control border-0 bg-for-search"
          placeholder="Search products, brands and more"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />
      </div>

      <BarSearchContent
        show={isFocused && debouncedTerm.length > 0}
        suggestions={filteredSuggestions}
        onSelectSuggestion={handleSuggestionClick}
      />
    </form>
  );
};
