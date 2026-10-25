"use client";

import React, { useState, useRef, useCallback } from "react";

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
    { label: "Hamburguesa Vegetal", price: "$13.49", desc: "Alga, verduras asadas y aderezo especial" },
    { label: "Hamburguesa Doble", price: "$15.99", desc: "Doble carne de res, queso cheddar y cebolla caramelizada" },
    { label: "Hamburguesa BBQ", price: "$14.49", desc: "Carne de res con salsa BBQ, aros de cebolla y pepinillos" },
    { label: "Hamburguesa Picante", price: "$14.99", desc: "Carne de res con jalapeños, queso pepper jack y salsa chipotle" },
    { label: "Hamburguesa Hawaiana", price: "$15.49", desc: "Carne de res, piña, jamón y salsa teriyaki" },
    { label: "Hamburguesa Trufa", price: "$17.99", desc: "Carne de res con queso brie, rúcula y crema de trufa" },
    { label: "Hamburguesa Mexicana", price: "$15.99", desc: "Carne de res con frijoles, aguacate, pico de gallo y queso" }
  ],
  sandwiches: [
    { label: "Sándwich de Pollo", price: "$11.99", desc: "Pechuga de pollo a la parrilla, lechuga y aderezo" },
    { label: "Sándwich Club", price: "$13.49", desc: "Pavo, jamón, queso, tocino y huevo" },
    { label: "Sándwich de Carne Asada", price: "$14.99", desc: "Carne asada con guacamole y salsa ranchera" },
    { label: "Sándwich de Atún", price: "$12.49", desc: "Atún con mayonesa, apio, lechuga y tomate" },
    { label: "Sándwich Caprese", price: "$12.99", desc: "Mozzarella, tomate, albahaca y pesto" },
    { label: "Sándwich de Pulled Pork", price: "$14.49", desc: "Cerdo desmenuzado con salsa BBQ y coleslaw" },
    { label: "Sándwich Vegetariano", price: "$12.99", desc: "Hummus, pepino, tomate, aguacate y brotes" },
    { label: "Sándwich Cubano", price: "$13.99", desc: "Cerdo, jamón, queso suizo, pepinillos y mostaza" },
    { label: "Sándwich de Salmón", price: "$15.99", desc: "Salmón ahumado, queso crema, eneldo y cebolla roja" },
    { label: "Sándwich BLT", price: "$11.49", desc: "Tocino, lechuga, tomate y mayonesa" }
  ],
  extras: [
    { label: "Papitas Fritas", price: "$4.99", desc: "Papa cortada en gajos crujiente" },
    { label: "Anillos de Cebolla", price: "$5.49", desc: "Cebolla empanizada y dorada" },
    { label: "Ensalada Mixta", price: "$5.99", desc: "Verduras frescas con aderezo light" },
    { label: "Aros de Queso", price: "$6.49", desc: "Queso mozzarella empanizado y frito" },
    { label: "Nachos con Queso", price: "$7.49", desc: "Totopos con salsa de queso y jalapeños" },
    { label: "Coleslawo", price: "$4.49", desc: "Repollo y zanahoria con aderezo cremoso" },
    { label: "Papas Bravas", price: "$5.99", desc: "Papas con salsa brava y alioli" },
    { label: "Palitos de Mozzarella", price: "$6.99", desc: "Palitos de queso rebozados y fritos" },
    { label: "Alitas de Pollo", price: "$8.99", desc: "Alitas con salsa BBQ o buffalo" },
    { label: "Guacamole con Totopos", price: "$6.49", desc: "Aguacate, cebolla, tomate y cilantro" }
  ]
};

const categories = [
  { id: "burgers", label: "Hamburguesas" },
  { id: "sandwiches", label: "Sándwiches" },
  { id: "extras", label: "Extras" }
] as const;

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const isDragging = useRef(false);

  const snapToPage = useCallback((index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth || window.innerWidth;
      scrollRef.current.scrollTo({
        left: index * width,
        behavior: "smooth"
      });
    }
  }, []);

  const scrollToSection = useCallback((index: number) => {
    snapToPage(index);
  }, [snapToPage]);

  const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = e.type === "mousedown"
      ? (e as React.MouseEvent).clientX
      : (e as React.TouchEvent).touches[0].clientX;
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
    isDragging.current = true;
  }, []);

  const handleDragMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = e.type === "mousemove"
      ? (e as React.MouseEvent).clientX
      : (e as React.TouchEvent).touches[0].clientX;
    dragCurrentX.current = clientX;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = dragCurrentX.current - dragStartX.current;
    const threshold = 60;
    if (Math.abs(diff) > threshold) {
      const nextIndex = diff < 0
        ? Math.min(activeIndex + 1, categories.length - 1)
        : Math.max(activeIndex - 1, 0);
      setActiveIndex(nextIndex);
      snapToPage(nextIndex);
    }
  }, [activeIndex, snapToPage, categories.length]);

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <nav
        className="fixed top-0 left-0 w-full z-50 isolate bg-black backdrop-blur-md border-b border-white/10 flex items-center justify-center gap-2 px-4 h-[70px] shadow-2xl"
      >
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => scrollToSection(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeIndex === i
              ? "bg-white/10 text-orange-500 border border-orange-500/50 shadow-[0_0_15px_rgba(250,166,26,0.2)]"
              : "text-gray-500 hover:text-orange-400 hover:bg-white/5 hover:border-white/10 border border-transparent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div
        ref={scrollRef}
        className="flex flex-row overflow-x-hidden h-full pb-24 pt-[70px]"
        style={{ scrollbarWidth: "none" }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className={`w-[100vw] min-w-[100vw] max-w-[100vw] flex-shrink-0 flex flex-col items-center transition-all duration-500 ease-out ${
              activeIndex === i
                ? "opacity-100 scale-100 grayscale-0 filter-none"
                : "opacity-60 scale-95 grayscale-0 filter-none pointer-events-none"
            }`}
          >
            <div className="overflow-y-auto scrollbar-none mt-4 max-h-[calc(100vh-160px)] w-full max-w-sm px-4">
              {menuItems[cat.id].map((item: MenuItem) => (
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
                      <span className="text-orange-400 font-bold text-lg">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => scrollToSection(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === i
              ? "bg-orange-500 w-5"
              : "bg-gray-700"
            }`}
            aria-label={`Ir a ${cat.label}`}
          />
        ))}
      </div>
    </div>
  );
}
