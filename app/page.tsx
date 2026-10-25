"use client";

import React, { useState, useEffect, useRef } from "react";

type MenuItem = {
  label: string;
  price: string;
  desc?: string;
};

const menuItems = {
  burgers: [
    { label: "Hamburguesa Clásica", price: "$12.99", desc: "Carne de res, lechuga, tomate, cebolla y salsa especial" },
    { label: "Hamburguesa Queso", price: "$13.99", desc: "Carne de res con doble queso, especial salsa y jalapeños" },
    { label: "Hamburguesa Bacon", price: "$14.99", desc: "Carne de res con tocino derretido y BBQ sauce" },
    { label: "Hamburguesa Vegetal", price: "$13.49", desc: "Alga, verduras asadas y aderezo especial" }
  ],
  sandwiches: [
    { label: "Sándwich de Pollo", price: "$11.99", desc: "Pechuga de pollo a la parrilla, lechuga y aderezo" },
    { label: "Sándwich Club", price: "$13.49", desc: "Pavo, jamón, queso, tocino y huevo" },
    { label: "Sándwich de Carne Asada", price: "$14.99", desc: "Carne asada con guacamole y salsa ranchera" }
  ],
  extras: [
    { label: "Papitas Fritas", price: "$4.99", desc: "Papa cortada en gajos crujiente" },
    { label: "Anillos de Cebolla", price: "$5.49", desc: "Cebolla empanizada y dorada" },
    { label: "Ensalada Mixta", price: "$5.99", desc: "Verduras frescas con aderezo light" }
  ]
};

const categories = [
  { id: "burgers", label: "Hamburguesas" },
  { id: "sandwiches", label: "Sándwiches" },
  { id: "extras", label: "Extras" }
] as const;

const translateXValues = ["0%", "-100%", "-200%"];

function getSectionClasses(index: number): string {
  const isActive = index === 0 ? "bg-gray-900/80" : index === 1 ? "bg-gray-800/80" : "bg-gray-900/80";
  const tx = translateXValues[index];
  return `min-h-screen flex flex-col items-center justify-center ${isActive} transform translateX(${tx}) transition-transform duration-700 ease-out`;
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStartX = useRef<number>(0);

  useEffect(() => {
    swipeStartX.current = 0;
  }, [activeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    swipeStartX.current = (e.touches[0] as Touch).clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    let clientXValue = swipeStartX.current;
    if (e.changedTouches) {
      const lastTouch = e.changedTouches[e.changedTouches.length - 1];
      clientXValue = lastTouch.clientX;
    } else if (e.touches) {
      const firstTouch = e.touches[0];
      clientXValue = firstTouch.clientX;
    }
    const diff = clientXValue - swipeStartX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff < 0 && activeIndex < 2) {
        setActiveIndex(prev => prev + 1);
      } else if (diff > 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
      }
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden swiping-container bg-gray-950"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10"
        style={{ padding: '0 1rem' }}
      >
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 rounded text-gray-300 text-sm font-medium transition-colors ${activeIndex === i ? 'text-orange-500' : 'hover:text-orange-400'}`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div className={getSectionClasses(activeIndex)}>
        {menuItems[categories[activeIndex].id].map((item: MenuItem) => (
          <div key={item.label} className="w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-gray-100 mb-2">{item.label}</h2>
            <p className="text-gray-400 text-sm mb-4">{item.desc || ""}</p>
            <div className="text-orange-400 text-lg font-bold">{item.price}</div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full ${activeIndex === i ? 'bg-orange-500' : 'bg-gray-700'} transition-colors`}
            aria-label={`Ir a ${cat.label}`}
          />
        ))}
      </div>
    </div>
  );
}