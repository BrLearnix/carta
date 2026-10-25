"use client";

import React, { useState, useRef } from "react";

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

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const section = scrollRef.current.children[index] as HTMLElement;
      if (section) {
        section.scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    }
  };

  const handleScroll = (e: React.UIEvent) => {
    const container = e.currentTarget as HTMLDivElement;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const index = Math.round(scrollLeft / containerWidth);
    if (index >= 0 && index < categories.length) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20"
        style={{ padding: "0 1rem" }}
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
        className="flex flex-row overflow-x-auto scroll-snap-type-x-mandatory snap-strict h-full no-scrollbar pt-24 pb-24"
        onScroll={handleScroll}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            className={`snap-align-start w-[100vw] min-w-[100vw] flex-shrink-0 flex flex-col items-center justify-center transition-all duration-500 ${
              activeIndex === i
                ? "opacity-100 scale-100 grayscale-0 filter-none"
                : "opacity-45 scale-95 grayscale filter-[blur(2px)] pointer-events-none"
            }`}
          >
            {menuItems[cat.id].map((item: MenuItem) => (
              <div
                key={item.label}
                className="flex flex-row items-start justify-between gap-6 w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 hover:bg-white/10 transition-colors duration-300 cursor-pointer mb-4"
              >
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                    {item.label}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
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
