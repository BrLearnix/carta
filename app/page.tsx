"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

type MenuItem = {
  label: string;
  price: string;
  desc?: string;
};

const menuItems = {
  burgers: [
    {
      label: "Hamburguesa Clásica",
      price: "$12.99",
      desc: "Carne de res, lechuga, tomate, cebolla y salsa especial",
    },
    {
      label: "Hamburguesa Queso",
      price: "$13.99",
      desc: "Carne de res con doble queso, especial salsa y jalapeños",
    },
    {
      label: "Hamburguesa Bacon",
      price: "$14.99",
      desc: "Carne de res con tocino derretido y BBQ sauce",
    },
    {
      label: "Hamburguesa Vegetal",
      price: "$13.49",
      desc: "Alga, verduras asadas y aderezo especial",
    },
    {
      label: "Hamburguesa Doble",
      price: "$15.99",
      desc: "Doble carne de res, queso cheddar y cebolla caramelizada",
    },
    {
      label: "Hamburguesa BBQ",
      price: "$14.49",
      desc: "Carne de res con salsa BBQ, aros de cebolla y pepinillos",
    },
    {
      label: "Hamburguesa Picante",
      price: "$14.99",
      desc: "Carne de res con jalapeños, queso pepper jack y salsa chipotle",
    },
    {
      label: "Hamburguesa Hawaiana",
      price: "$15.49",
      desc: "Carne de res, piña, jamón y salsa teriyaki",
    },
    {
      label: "Hamburguesa Trufa",
      price: "$17.99",
      desc: "Carne de res con queso brie, rúcula y crema de trufa",
    },
    {
      label: "Hamburguesa Mexicana",
      price: "$15.99",
      desc: "Carne de res con frijoles, aguacate, pico de gallo y queso",
    },
  ],
  sandwiches: [
    {
      label: "Sándwich de Pollo",
      price: "$11.99",
      desc: "Pechuga de pollo a la parrilla, lechuga y aderezo",
    },
    {
      label: "Sándwich Club",
      price: "$13.49",
      desc: "Pavo, jamón, queso, tocino y huevo",
    },
    {
      label: "Sándwich de Carne Asada",
      price: "$14.99",
      desc: "Carne asada con guacamole y salsa ranchera y",
    },
    {
      label: "Sándwich de Atún",
      price: "$12.49",
      desc: "Atún con mayonesa, apio, lechuga y tomate",
    },
    {
      label: "Sándwich Caprese",
      price: "$12.99",
      desc: "Mozzarella, tomate, albahaca y pesto",
    },
    {
      label: "Sándwich de Pulled Pork",
      price: "$14.49",
      desc: "Cerdo desmenuzado con salsa BBQ y coleslaw",
    },
    {
      label: "Sándwich Vegetariano",
      price: "$12.99",
      desc: "Hummus, pepino, tomate, aguacate y brotes",
    },
    {
      label: "Sándwich Cubano",
      price: "$13.99",
      desc: "Cerdo, jamón, queso suizo, pepinillos y mostaza",
    },
    {
      label: "Sándwich de Salmón",
      price: "$15.99",
      desc: "Salmón ahumado, queso crema, eneldo y cebolla roja",
    },
    {
      label: "Sándwich BLT",
      price: "$11.49",
      desc: "Tocino, lechuga, tomate y mayonesa",
    },
  ],
  extras: [
    {
      label: "Papitas Fritas",
      price: "$4.99",
      desc: "Papa cortada en gajos crujiente",
    },
    {
      label: "Anillos de Cebolla",
      price: "$5.49",
      desc: "Cebolla empanizada y dorada",
    },
    {
      label: "Ensalada Mixta",
      price: "$5.99",
      desc: "Verduras frescas con aderezo light",
    },
    {
      label: "Aros de Queso",
      price: "$6.49",
      desc: "Queso mozzarella empanizado y frito",
    },
    {
      label: "Nachos con Queso",
      price: "$7.49",
      desc: "Totopos con salsa de queso y jalapeños",
    },
    {
      label: "Coleslawo",
      price: "$4.49",
      desc: "Repollo y zanahoria con aderezo cremoso",
    },
    {
      label: "Papas Bravas",
      price: "$5.99",
      desc: "Papas con salsa brava y alioli",
    },
    {
      label: "Palitos de Mozzarella",
      price: "$6.99",
      desc: "Palitos de queso rebozados y fritos",
    },
    {
      label: "Alitas de Pollo",
      price: "$8.99",
      desc: "Alitas con salsa BBQ o buffalo",
    },
    {
      label: "Guacamole con Totopos",
      price: "$6.49",
      desc: "Aguacate, cebolla, tomate y cilantro",
    },
  ],
};

const categories = [
  { id: "burgers", label: "Hamburguesas" },
  { id: "sandwiches", label: "Sándwiches" },
  { id: "extras", label: "Extras" },
] as const;

const fondos = {
  burgers: "/img/fondos/hamburguesa.jpg",
  sandwiches: "/img/fondos/sandwich.jpg",
  extras: "/img/fondos/extra.jpg",
};

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      if (
        index < 0 ||
        index >= categories.length ||
        index === activeIndex ||
        isTransitioning
      )
        return;
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [activeIndex, categories.length, isTransitioning],
  );

  const scrollToSection = useCallback(
    (index: number) => {
      goTo(index);
    },
    [goTo],
  );

  const handleDragStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX =
        e.type === "mousedown"
          ? (e as React.MouseEvent).clientX
          : (e as React.TouchEvent).touches[0].clientX;
      dragStartX.current = clientX;
      dragCurrentX.current = clientX;
      isDragging.current = true;
    },
    [],
  );

  const handleDragMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging.current) return;
      const clientX =
        e.type === "mousemove"
          ? (e as React.MouseEvent).clientX
          : (e as React.TouchEvent).touches[0].clientX;
      dragCurrentX.current = clientX;
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragCurrentX.current - dragStartX.current;
    const threshold = 60;
    if (Math.abs(diff) > threshold) {
      const nextIndex =
        diff < 0
          ? Math.min(activeIndex + 1, categories.length - 1)
          : Math.max(activeIndex - 1, 0);
      goTo(nextIndex);
    }
  }, [activeIndex, categories.length, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        goTo(Math.min(activeIndex + 1, categories.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(activeIndex - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, categories.length, goTo]);

  const cat = categories[activeIndex];
  const items = menuItems[cat.id];
  const fondo = fondos[cat.id];

  const dir = activeIndex > 0 ? "translate-x-[20px]" : "translate-x-[-20px]";

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50 isolate flex items-center justify-center px-4 py-6 bg-black backdrop-blur-md border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-2">
          <img
            src="/img/logo/logo1.png"
            alt="Logo Doña Rosy"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      <div
        className="relative h-full pt-[80px] pb-1 overflow-hidden"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div
          className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <div
            key={cat.id}
            className={`relative w-full max-w-sm h-full flex flex-col items-center ${
              isTransitioning
                ? "opacity-0 scale-95 pointer-events-none"
                : "opacity-100 scale-100 pointer-events-auto"
            }`}
            style={{
              backgroundImage: `url("${fondo}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 overflow-y-auto scrollbar-none mt-4 max-h-[calc(100vh-160px)] w-full px-4 pb-1 overscroll-contain">
              {items.map((item: MenuItem) => (
                <div
                  key={item.label}
                  className="flex flex-row items-start justify-between gap-6 w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 hover:bg-white/10 transition-colors duration-300 cursor-pointer mb-4"
                >
                  <div className="flex-1 text-left">
                    <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                      {item.label}
                    </h2>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {item.desc || ""}
                    </p>
                  </div>
                  <div className="min-w-[90px] flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </span>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-1.5">
                      <span className="text-orange-300 font-bold text-lg">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 isolate flex flex-col items-center gap-2 px-4 pb-2 bg-black/60 backdrop-blur-md border-t border-white/10 rounded-t-2xl">
        <nav className="flex space-x-2">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(i)}
              disabled={isTransitioning}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeIndex === i
                  ? "bg-orange-500 text-white border border-orange-500/50 shadow-[0_0_20px_rgba(250,166,26,0.3)]"
                  : "text-gray-400 hover:text-orange-400 hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="flex space-x-1.5 z-10">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(i)}
              disabled={isTransitioning}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "bg-orange-500 w-5" : "bg-gray-700"
              }`}
              aria-label={`Ir a ${cat.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
