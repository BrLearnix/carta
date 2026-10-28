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
      price: "$6.48",
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
      price: "$6.48",
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

const SLIDE_THRESHOLD = 70;
const INTENT_THRESHOLD = 8;
const SLIDE_TRANSITION = "420ms cubic-bezier(0.25, 1, 0.35, 1)";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const engaged = useRef(false);
  const aborted = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setVw(el.clientWidth || 1);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dragPxRef = useRef(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const applyDrag = useCallback((dx: number) => {
    const idx = activeIndexRef.current;
    const atFirstEdge = idx === 0 && dx > 0;
    const atLastEdge = idx === categories.length - 1 && dx < 0;
    const applied = atFirstEdge || atLastEdge ? dx * 0.35 : dx;
    dragPxRef.current = applied;
    setDragPx(applied);
  }, []);

  const commitDrag = useCallback(() => {
    engaged.current = false;
    const dp = dragPxRef.current;
    dragPxRef.current = 0;
    setDragPx(0);
    setIsDragging(false);
    const idx = activeIndexRef.current;
    if (dp <= -SLIDE_THRESHOLD && idx < categories.length - 1) {
      setActiveIndex(idx + 1);
    } else if (dp >= SLIDE_THRESHOLD && idx > 0) {
      setActiveIndex(idx - 1);
    }
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    engaged.current = false;
    aborted.current = false;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse" || e.buttons !== 1) return;
      const dx = e.clientX - dragStartX.current;
      const dy = e.clientY - dragStartY.current;

      if (!engaged.current) {
        if (aborted.current) return;
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > INTENT_THRESHOLD) {
          aborted.current = true;
          return;
        }
        if (Math.abs(dx) > INTENT_THRESHOLD && Math.abs(dx) >= Math.abs(dy)) {
          engaged.current = true;
          setIsDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        } else {
          return;
        }
      }

      applyDrag(dx);
    },
    [applyDrag],
  );

  const handlePointerEnd = useCallback(() => {
    if (!engaged.current) return;
    commitDrag();
  }, [commitDrag]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let touchId: number | null = null;
    let startX = 0;
    let startY = 0;
    let locked = false;
    let vertical = false;

    const onStart = (e: TouchEvent) => {
      if (touchId !== null) return;
      const t = e.changedTouches[0];
      touchId = t.identifier;
      startX = t.clientX;
      startY = t.clientY;
      locked = false;
      vertical = false;
    };

    const onMove = (e: TouchEvent) => {
      if (touchId === null || vertical) return;
      const t = Array.from(e.changedTouches).find(
        (c) => c.identifier === touchId,
      );
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (!locked) {
        if (Math.abs(dx) < INTENT_THRESHOLD && Math.abs(dy) < INTENT_THRESHOLD)
          return;
        if (Math.abs(dy) > Math.abs(dx)) {
          vertical = true;
          return;
        }
        locked = true;
        setIsDragging(true);
      }
      if (e.cancelable) e.preventDefault();
      applyDrag(dx);
    };

    const onEnd = () => {
      if (touchId === null) return;
      touchId = null;
      if (locked) commitDrag();
      locked = false;
      vertical = false;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [applyDrag, commitDrag]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setActiveIndex(Math.min(activeIndex + 1, categories.length - 1));
      if (e.key === "ArrowLeft") setActiveIndex(Math.max(activeIndex - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-50 isolate flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-md border-b border-orange-500/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="flex flex-1 min-w-0 items-center justify-start">
          <p className="sm:hidden text-[9px] uppercase tracking-[0.25em] text-orange-300/90 whitespace-nowrap">
            ✦ A la parrilla
          </p>
          <div className="hidden sm:flex flex-col items-end gap-1.5 border-r-2 border-orange-500/40 pr-3 text-right">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-orange-300 whitespace-nowrap">
              Carne a la parrilla
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gray-500 whitespace-nowrap">
              Pan recién horneado
            </span>
          </div>
        </div>

        <div className="group relative shrink-0 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-[3px] shadow-[0_0_30px_rgba(250,166,26,0.45)] transition-transform duration-300 hover:scale-105">
          <img
            src="/img/logo/logo1.png"
            alt="Logo Doña Rosy"
            className="w-14 h-14 rounded-full border-2 border-black block"
          />
          <span className="absolute inset-0 rounded-full ring-1 ring-white/20 pointer-events-none" />
        </div>

        <div className="flex flex-1 min-w-0 items-center justify-end">
          <p className="sm:hidden text-[9px] uppercase tracking-[0.25em] text-orange-300/90 whitespace-nowrap">
            Domicilio ✦
          </p>
          <div className="hidden sm:flex flex-col items-start gap-1.5 border-l-2 border-orange-500/40 pl-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-orange-300 whitespace-nowrap">
              Salsas de la casa
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gray-500 whitespace-nowrap">
              Entrega a domicilio
            </span>
          </div>
        </div>
      </header>

      <p className="fixed top-[86px] left-0 w-full z-40 sm:hidden text-center text-[9px] uppercase tracking-[0.2em] text-gray-500 truncate px-4">
        Hamburguesas y gorditas · Hechas a mano
      </p>

      <div
        className={`relative h-full pt-[104px] sm:pt-[96px] pb-1 overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        ref={containerRef}
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div
          className="flex h-full will-change-transform"
          style={{
            transform: `translateX(calc(${-activeIndex * 100}% + ${dragPx}px))`,
            transition: isDragging ? "none" : `transform ${SLIDE_TRANSITION}`,
            perspective: "1400px",
          }}
        >
          {categories.map((cat, i) => {
            const pos = i - activeIndex + (isDragging ? dragPx / vw : 0);
            const dist = Math.min(Math.abs(pos), 1);
            const scale = 1 - dist * 0.06;
            const opacity = 1 - dist * 0.35;
            const rotateY = Math.max(-1, Math.min(1, pos)) * -6;
            return (
              <div
                key={cat.id}
                className="relative h-full w-full min-w-full flex-shrink-0 flex flex-col items-center"
                style={{
                  transform: `scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  transition: isDragging
                    ? "none"
                    : `transform ${SLIDE_TRANSITION}, opacity ${SLIDE_TRANSITION}`,
                }}
              >
                <div className="relative w-full max-w-sm h-full flex flex-col items-center overflow-hidden">
                  <div
                    className="absolute -inset-12 will-change-transform"
                    style={{
                      backgroundImage: `url("${fondos[cat.id]}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: `translateX(${pos * 40}px)`,
                      transition: isDragging ? "none" : `transform ${SLIDE_TRANSITION}`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div
                    className="relative z-10 overflow-y-auto scrollbar-none mt-4 max-h-[calc(100vh-210px)] w-full px-4 pb-1 overscroll-contain"
                  >
                    {menuItems[cat.id].map((item: MenuItem, ii) => (
                      <div
                        key={item.label}
                        className="flex flex-row items-center gap-3.5 w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-3.5 py-3 hover:bg-white/10 transition-colors duration-300 cursor-pointer mb-4"
                      >
                        <img
                          src={fondos[cat.id]}
                          alt={item.label}
                          className="w-14 h-14 shrink-0 rounded-xl object-cover border border-orange-500/30 shadow-md"
                          style={{
                            objectPosition: ["center", "left center", "right center"][ii % 3],
                          }}
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <h2 className="text-base font-bold text-white mb-0.5 tracking-tight truncate">
                            {item.label}
                          </h2>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            {item.desc || ""}
                          </p>
                        </div>
                        <div className="min-w-[74px] shrink-0 flex flex-col items-end gap-1">
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
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 isolate flex flex-col items-center gap-2 px-4 pb-2 bg-black/60 backdrop-blur-md border-t border-white/10 rounded-t-2xl">
        <nav className="flex space-x-2">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveIndex(i)}
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
              onClick={() => setActiveIndex(i)}
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
