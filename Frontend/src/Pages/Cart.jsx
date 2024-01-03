import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../Components/ContextApi";
import EmptyCart from "../assets/EmptyCart.jpg";
import "../Css/Form.css";
import useRazorpay from "react-razorpay";
import { authFetch } from "../helper";

export default function Cart() {
  const [Razorpay] = useRazorpay();

  const navigation = useNavigate();
  // const [count, setCount] = useState(1);
  const { count, setCount } = useMyContext();
  const [products, setProducts] = useState([]);
  const [totalItemsPrice, setTotalItemsPrice] = useState();
  // const products = JSON.parse(localStorage.getItem("Product")) || [];
  const [initValue, setInitValue] = useState({
    products: [],
    shipment_address: "",
    billing_address: "",
    orderTotal: "",
  });

  const [amount, setAmount] = useState(0);

  const complete_payment = (
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  ) => {
    authFetch
      .post("http://127.0.0.1:8000/api/order/complete/", {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        signature: razorpay_signature,
        amount: amount,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("Product", []);
        navigation("/");
        setCount(0);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setInitValue({ ...initValue, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    authFetch
      .post("http://127.0.0.1:8000/api/order/create/", initValue)
      .then(function (response) {
        console.log(response);
        console.log(response.data);
        const order_id = response.data.id;
        const amount = response.data.amount;

        const options = {
          key: "rzp_test_WYuA0TI6CPyOxd", // Enter the Key ID generated from the Dashboard
          name: "Akash Rana",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: order_id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
          handler: function (response) {
            setAmount(amount);
            complete_payment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: "Piyush Garg",
            email: "youremail@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();
      })
      .catch(function (error) {
        console.log(error);
      });

    // Now you can update the amount state if needed
    // setAmount(newValue);
  };
  const handleDecrement = (items) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === items.id
          ? { ...product, qty: Math.max(1, product.qty - 1) }
          : product
      )
    );
  };
  const handleIncrement = (items) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === items.id ? { ...product, qty: product.qty + 1 } : product
      )
    );
  };

  const handleDelete = (items) => {
    const restAllProduct = products.filter((item) => item.id !== items.id);
    if (products.length <= 1) {
      localStorage.setItem("Product", []);
      // navigation(-1);
      setCount(0);
    } else {
      localStorage.setItem("Product", JSON.stringify(restAllProduct));
    }
    setCount(restAllProduct.length);
    setProducts(restAllProduct);
  };

  useEffect(() => {
    let countProduct = localStorage.getItem("Product");
    const products_ = countProduct.length ? JSON.parse(countProduct) : [];
    setProducts(products_);
    setInitValue({ ...initValue, products: products_ });
    // setProducts(products_.map((product) => ({ ...product, quantity: 1 })));
    const allItemsPrice =
      products_.length > 0
        ? products_.reduce((totals, item) => item.price * item.qty + totals, 0)
        : 0;
    setTotalItemsPrice(allItemsPrice);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("Product", JSON.stringify(products));
    }
    const allItemsPrice =
      products.length > 0
        ? products.reduce((totals, item) => item.price * item.qty + totals, 0)
        : 0;
    setTotalItemsPrice(allItemsPrice);
  }, [products]);
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {products.length > 0 ? (
                products.map((product, productIdx) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={product.href}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </a>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {product.price}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${productIdx}`}
                            className="sr-only"
                          >
                            Quantity, {product.name}
                          </label>
                          <button
                            type="button"
                            className="text-lg"
                            onClick={() => handleDecrement(product)}
                          >
                            -
                          </button>
                          <span className="border-3 border-black  m-2 px-1">
                            {/* {count} */}
                            {product.qty}
                          </span>
                          <button
                            type="button"
                            className="text-lg"
                            onClick={() => handleIncrement(product)}
                          >
                            +
                          </button>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              onClick={() => handleDelete(product)}
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div>
                  <img src={EmptyCart} width={"300px"} height={"300px"} />
                </div>
              )}
            </ul>
          </section>

          {/* Order summary */}

          {products.length > 0 ? (
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900 max-w-sm mx-auto mb-5"
              >
                Order summary
              </h2>

              <dl className="max-w-sm mx-auto mb-5">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹ {totalItemsPrice}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">
                        Learn more about how tax is calculated
                      </span>
                      <QuestionMarkCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">1.5%</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    ₹{(totalItemsPrice / 100) * 1.5 + totalItemsPrice}
                  </dd>
                </div>
              </dl>
              <form className="max-w-sm mx-auto">
                <div className="mb-2">
                  <label
                    htmlFor="ShipmentAddress"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shipment Address
                  </label>
                  <input
                    type="text"
                    id="ShipmentAddress"
                    name="shipment_address"
                    onChange={(e) => handleChange(e)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="BillingAddress"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Billing Address
                  </label>
                  <input
                    id="BillingAddress"
                    type="text"
                    name="billing_address"
                    onChange={(e) => handleChange(e)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  onClick={(e) => submitHandler(e)}
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Checkout
                </button>
              </form>
            </section>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
}
