"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useNavigate } from "react-router-dom"


const apiUrl = import.meta.env.VITE_API_URL;
export function SearchBar({ onSearch }) {
  const [selectedCategory, setSelectedCategory] = useState("All Categorías")
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${apiUrl}/api/categorias`)
      .then((response) => {
        console.log(response.data.data)
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("No se pudieron cargar los productos. Por favor, intenta nuevamente.");
      })
  }, [])

  // const handleSearch = useCallback(() => {
  //   if (onSearch) {
  //     onSearch(searchQuery, selectedCategory)
  //   }
  // }, [searchQuery, selectedCategory, onSearch])

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set('name', searchQuery);
    }

    if (selectedCategory && selectedCategory !== "All Categorías") {
      params.set('categoria', selectedCategory);
    }

    navigate(`/shop?${params.toString()}`);
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="w-full bg-blue-600 py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center bg-gray-100 rounded-md overflow-hidden">
        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-11 px-4 rounded-none border-r border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm whitespace-nowrap"
            >
              {selectedCategory.toUpperCase()}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-gray-100">
            <DropdownMenuItem
              onClick={() => setSelectedCategory("All Categorías")}
              className="cursor-pointer"
            >
              All Categorías
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.nombre)} className="cursor-pointer">
                {category.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="INGRESAR PRODUCTO A BUSCAR"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-11 border-0 bg-transparent text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
        />

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          variant="ghost"
          size="icon"
          className="h-11 w-12 rounded-none bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
