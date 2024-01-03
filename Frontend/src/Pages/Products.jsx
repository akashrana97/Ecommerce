import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { useMyContext } from "../Components/ContextApi";

export default function Products() {
  const [data, setData] = useState([]);
  const [searchVal, setSearchVal] = useState([]);
  const [newArr, setNewArr] = useState([]);
  const { count, setCount } = useMyContext();

  const handleAddtoCart = (e, { _id, image, name, price }) => {
    let countProduct = localStorage.getItem("Product") || [];
    const existingProducts = countProduct.length
      ? JSON.parse(countProduct)
      : [];
    const newProduct = {
      id: _id,
      name: name,
      qty: 1,
      price: price,
      image: image,
    };
    const existingProductIndex = existingProducts.findIndex(
      (product) => product.id === newProduct.id
    );

    if (existingProductIndex !== -1) {
      existingProducts[existingProductIndex].qty += 1;
    } else {
      existingProducts.push(newProduct);
    }

    localStorage.setItem("Product", JSON.stringify(existingProducts));
    setCount(existingProducts.length);
  };

  const handleSearch = () => {
    console.log("Search here" + searchVal);
    fetch(`http://127.0.0.1:8000/api/products/?keyword=${searchVal}`)
      .then((y) => y.json())
      .then((y) => setData(y.products));
  };

  const handleSearchInput = (event) => {
    setSearchVal(event.target.value);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/", {})
      .then((y) => y.json())
      .then((y) => {
        setData(y.products);
        // console.log(y.access_token, "<<<>>", y);
        localStorage.setItem("authUser", JSON.stringify(y.access_token));
      });
  }, []);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-start">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            All Product
          </h2>
          <div className="w-full max-w-lg lg:max-w-xs ms-8 flex">
            <div className="relative text-gray-400 focus-within:text-gray-600">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search"
                className="block w-full rounded-md border-4 bg-white py-1.5 pl-10 pr-3 text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search"
                type="search"
                name="search"
                onChange={(event) => handleSearchInput(event)}
              />
            </div>

            <button
              onClick={handleSearch}
              className="ml-2 bg-indigo-600 px-2 py-1 text-xs font-semibold text-white rounded"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data.map((product) => (
            <div key={product._id}>
              <div className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={product.image}
                    alt="Product Image"
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={(e) => handleAddtoCart(e, product)}
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
