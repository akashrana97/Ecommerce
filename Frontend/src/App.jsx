// import { useEffect, useState } from "react";
// import "./App.css";
// import NavBar from "./Components/NavBar";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import ContextApi from "./Components/ContextApi.jsx";
// import Products from "./Pages/Products.jsx";
// import Cart from "./Pages/Cart.jsx";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Products />,
//   },
//   {
//     path: "/Cart",
//     element: <Cart />,
//   },
//   {
//     path: "/checkout",
//     element: <div>Hello world!</div>,
//   },
// ]);

// function App() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let countProduct = localStorage.getItem("Product");
//     let def = JSON.parse(countProduct);
//     if (def?.length) {
//       setCount(def.length);
//     } else {
//       setCount(0);
//     }
//   }, []);

//   return (
//     <>
//       <ContextApi.Provider value={{ count, setCount }}>
//         <NavBar />
//         <RouterProvider router={router} />
//       </ContextApi.Provider>
//     </>
//   );
// }

// export default App;

// import { useEffect, useState } from "react";
// import "./App.css";
// import NavBar from "./Components/NavBar";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import ContextApi from "./Components/ContextApi.jsx";
// import Products from "./Pages/Products.jsx";
// import Cart from "./Pages/Cart.jsx";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Products />,
//   },
//   {
//     path: "/Cart",
//     element: <Cart />,
//   },
//   {
//     path: "/checkout",
//     element: <div>Hello world!</div>,
//   },
// ]);

// function App() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let countProduct = localStorage.getItem("Product");
//     let def = JSON.parse(countProduct);
//     if (def?.length) {
//       setCount(def.length);
//     } else {
//       setCount(0);
//     }
//   }, []);

//   return (
//     <>
//       <ContextApi.Provider value={{ count, setCount }}>
//         <NavBar />
//         <RouterProvider router={router} />
//       </ContextApi.Provider>
//     </>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import NavBar from "./Components/NavBar";
import { ContextApi } from "./Components/ContextApi";

export default function App() {
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   let countProduct = localStorage.getItem("Product");
  //   let def = JSON.parse(countProduct);
  //   if (def?.length) {
  //     setCount(def.length);
  //   } else {
  //     setCount(0);
  //   }
  // }, []);

  return (
    <>
      <ContextApi>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </ContextApi>
    </>
  );
}

{
  /* {false && (
        <ContextApi.Provider value={{ count, setCount }}>
          <NavBar />
          <BrowserRouter>
            <Routes>
              <Route
                path="/cart"
                element={
                  // <ContextApi.Provider value={{ count, setCount }}>
                  <Cart />
                  // </ContextApi.Provider>
                }
              />

              <Route
                path="/"
                element={
                  // <ContextApi.Provider value={{ count, setCount }}>
                  <Products />
                  // </ContextApi.Provider>
                }
              />
            </Routes>
          </BrowserRouter>
        </ContextApi.Provider>
      )} */
}
