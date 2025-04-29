import React, { useState } from "react";
import { BarSearchContent } from "./BarSearchContent";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Category to aliases mapping (from your DB structure)
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
      "smartphone",
      "cell phone",
      "android phone",
      "iphone",
      "feature phone",
      "touchscreen phone",
      "handset",
      "mobile device",
      "wireless phone",
      "foldable phone",
    ],
    fashions: [
      "fashions",
      "clothes",
      "shoes",
      "dresses",
      "fashion",
      "new tshirts",
      "tshirts",
    ],
    tv: [
      "tv",
      "television",
      "smart tv",
      "android tv",
      "television",
      "smart tv",
      "led tv",
      "lcd tv",
      "oled tv",
      "qled tv",
      "plasma tv",
      "android tv",
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
      "home theater tv",
      "telly",
      "flat panel tv",
      "box",
    ],
    teddy: [
      "teddy",
      "teddy bear",
      "cute teddy",
      "soft toy",
      "plush teddy",
      "stuffed teddy",
      "cuddly toy",
      "soft teddy bear",
      "kids teddy",
      "gift teddy"
    ],
    appliances :  [
      "appliances",
      "home appliances",
      "kitchen appliances",
      "electronic appliances",
      "household appliances",
      "small appliances",
      "large appliances",
      "smart appliances",
      "cooking appliances",
      "energy efficient appliances"
    ],
    kitchens :[
      "kitchens",
      "kitchen essentials",
      "modular kitchens",
      "kitchen furniture",
      "kitchen setup",
      "kitchen decor",
      "kitchen accessories",
      "kitchen storage",
      "kitchenware",
      "modern kitchens"
    ],
    toys : [
      "toys",
      "kids toys",
      "baby toys",
      "educational toys",
      "action figures",
      "toy sets",
      "fun toys",
      "soft toys",
      "remote control toys",
      "outdoor toys"
    ],
    monitors:[
      "monitors",
      "computer monitors",
      "gaming monitors",
      "LCD monitors",
      "LED monitors",
      "4K monitors",
      "ultrawide monitors",
      "curved monitors",
      "desktop monitors",
      "office monitors"
    ],
    plastic_toys: [
      "plastic cars",
      "toy cars",
      "kids plastic cars",
      "miniature plastic cars",
      "small plastic cars",
      "plastic toy vehicles",
      "plastic racing cars",
      "plastic model cars",
      "children's plastic cars",
      "plastic ride-on cars"
    ],
    remote_cars:[
      "remote cars",
      "remote control cars",
      "rc cars",
      "remote toy cars",
      "wireless cars",
      "remote operated cars",
      "rc toy vehicles",
      "remote racing cars",
      "radio control cars",
      "remote driving cars"
    ],
    stationaries: [
      "stationaries",
      "stationery items",
      "office supplies",
      "school supplies",
      "writing materials",
      "paper products",
      "notebooks and pens",
      "stationery kits",
      "art supplies",
      "desk supplies"
    ],
  

  };

  // Flatten all aliases for search
  const suggestions = Object.values(categoryMap).flat();

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const findCategory = (term) => {
    const lowerTerm = term.toLowerCase();
    for (const [category, aliases] of Object.entries(categoryMap)) {
      if (aliases.some((alias) => alias.toLowerCase() === lowerTerm)) {
        return category;
      }
    }
    return null;
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setIsFocused(false);

    const category = findCategory(suggestion);
    if (category) {
      navigate(`/products/${category}`);
    }
  };

  return (
    <div
      className="position-relative w-100"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setTimeout(() => setIsFocused(false), 150)}
      tabIndex={0}
    >
      <div className="input-group">
        <span className="input-group-text border-0 bg-for-search">
          <FaSearch size={14} className="text-muted" />
        </span>
        <input
          type="text"
          className="form-control border-0 bg-for-search"
          placeholder="Search products, brands and more"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const category = findCategory(searchTerm);
              if (category) {
                navigate(`/products/${category}`);
              }
            }
          }}
        />
      </div>

      <BarSearchContent
        show={isFocused && searchTerm.trim().length > 0}
        suggestions={filteredSuggestions}
        onSelectSuggestion={handleSuggestionClick}
      />
    </div>
  );
};
