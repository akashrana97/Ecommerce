import React, { createContext, useContext, useEffect, useState } from "react";

const MyContext = createContext();

export const ContextApi = ({ children }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let countProduct = localStorage.getItem("Product") || [];
    let def = countProduct.length ? JSON.parse(countProduct) : [];
    if (def?.length) {
      setCount(def.length);
    } else {
      setCount(0);
    }
  }, []);

  return (
    <MyContext.Provider value={{ count, setCount }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
