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
      desc: "Carne de res con doble queso, salsa especial y jalapeños",
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
      desc: "Carne asada con guacamole y salsa ranchera",
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
      label: "Coleslaw",
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
  {
    id: "burgers",
    label: "Hamburguesas",
    tagline: "De la parrilla a tu mesa",
  },
  {
    id: "sandwiches",
    label: "Sándwiches",
    tagline: "Pan artesanal del día",
  },
  { id: "extras", label: "Extras", tagline: "Para acompañar" },
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
    <div className="min-h-screen bg-[#0a0705] overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-50 isolate">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-300/90 to-transparent" />
        <div className="relative overflow-hidden border-b border-amber-500/25 shadow-[0_16px_44px_rgba(0,0,0,0.8)]">
          <div aria-hidden className="absolute inset-0 flex">
            <div className="relative w-1/2 overflow-hidden">
              <img
                src="/img/fondos/hamburguesa.jpg"
                alt=""
                className="h-full w-full scale-125 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#100a05]/95 via-[#100a05]/65 to-[#0b0805]" />
            </div>
            <div className="relative w-1/2 overflow-hidden">
              <img
                src="/img/fondos/sandwich.jpg"
                alt=""
                className="h-full w-full scale-125 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#100a05]/95 via-[#100a05]/65 to-[#0b0805]" />
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0805]/95 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"
          />

          <div className="relative mx-auto flex max-w-3xl items-center justify-between gap-1 px-2.5 py-2.5 sm:px-6 sm:py-3">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
              <span className="h-px w-7 bg-gradient-to-r from-amber-300 to-transparent" />
              <span className="font-food whitespace-nowrap text-[15px] leading-none tracking-[0.04em] text-amber-100 [text-shadow:0_2px_10px_rgba(0,0,0,0.95)] sm:text-lg">
                A la parrilla
              </span>
              <span className="hidden font-food whitespace-nowrap text-[13px] leading-none tracking-[0.06em] text-stone-300/80 sm:block">
                Pan artesanal
              </span>
            </div>

            <div className="flex shrink-0 flex-col items-center px-1">
              <div className="relative transition-transform duration-500 hover:scale-105">
                <span className="pointer-events-none absolute -inset-6 rounded-full bg-amber-400/15 blur-xl" />
                <span className="pointer-events-none absolute -inset-3.5 rounded-full border border-dashed border-amber-300/25" />
                <span className="pointer-events-none absolute -inset-1.5 rounded-full border border-amber-400/35" />
                <img
                  src="/img/logo/logo1.png"
                  alt="Logo Doña Rosy"
                  className="relative block h-[68px] w-[68px] rounded-full object-cover shadow-[0_14px_34px_rgba(0,0,0,0.9)] ring-2 ring-amber-100/30 sm:h-20 sm:w-20"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-end gap-1 text-right">
              <span className="h-px w-7 bg-gradient-to-l from-amber-300 to-transparent" />
              <span className="font-food whitespace-nowrap text-[15px] leading-none tracking-[0.04em] text-amber-100 [text-shadow:0_2px_10px_rgba(0,0,0,0.95)] sm:text-lg">
                A domicilio
              </span>
              <span className="hidden font-food whitespace-nowrap text-[13px] leading-none tracking-[0.06em] text-stone-300/80 sm:block">
                Salsas de la casa
              </span>
            </div>
          </div>

          <div className="relative border-t border-amber-500/15 bg-black/30 py-1 text-center backdrop-blur-sm sm:hidden">
            <p className="font-food text-[10px] tracking-[0.22em] text-amber-200/80">
              Hamburguesas y gorditas · Hechas a mano
            </p>
          </div>
        </div>
      </header>

      <div
        className={`relative h-full pt-[120px] sm:pt-[118px] pb-1 overflow-hidden select-none ${
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
                <div className="relative w-full max-w-[26rem] h-full flex flex-col items-center overflow-hidden">
                  <div
                    className="absolute -inset-12 will-change-transform"
                    style={{
                      backgroundImage: `url("${fondos[cat.id]}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: `translateX(${pos * 40}px)`,
                      transition: isDragging
                        ? "none"
                        : `transform ${SLIDE_TRANSITION}`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/90" />

                  <div className="relative z-10 mt-4 w-full max-h-[calc(100vh-232px)] overflow-y-auto scrollbar-none px-3 pb-2 overscroll-contain sm:max-h-[calc(100vh-230px)] sm:px-4">
                    <article className="menu-paper relative overflow-hidden rounded-[24px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)] ring-1 ring-black/20">
                      <span className="pointer-events-none absolute -top-px inset-x-8 h-[3px] rounded-b bg-gradient-to-r from-transparent via-[#b98b3f]/80 to-transparent" />
                      <span className="pointer-events-none absolute inset-2 rounded-[20px] border border-[#b9975a]/40" />
                      <span className="pointer-events-none absolute inset-3 rounded-[18px] border border-dashed border-[#b9975a]/25" />

                      <div className="relative px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
                        <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.3em] text-[#a1814d]">
                          <span>Carta</span>
                          <span>N.º {String(i + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2.5">
                          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c3a26a]" />
                          <h2 className="font-display text-[22px] font-semibold tracking-wide text-[#2c1c0e] sm:text-2xl">
                            {cat.label}
                          </h2>
                          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c3a26a]" />
                        </div>
                        <p className="mt-1.5 text-center text-[8px] uppercase tracking-[0.3em] text-[#a98a55]">
                          {cat.tagline}
                        </p>
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[#b98b3f]/80">
                          <span className="h-px w-6 bg-current" />
                          <span className="text-[9px] leading-none">✦</span>
                          <span className="h-px w-6 bg-current" />
                        </div>
                      </div>

                      <div className="relative px-4 pb-4 sm:px-5">
                        {menuItems[cat.id].map((item: MenuItem, ii) => (
                          <div
                            key={item.label}
                            className="group flex items-start gap-3 border-b border-dashed border-[#c9b189]/60 py-3 last:border-0"
                          >
                            <div className="relative mt-0.5 shrink-0">
                              <img
                                src={fondos[cat.id]}
                                alt={item.label}
                                className="h-11 w-11 rounded-full object-cover shadow-md ring-2 ring-[#d9c39a] transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
                                style={{
                                  objectPosition: [
                                    "center",
                                    "left center",
                                    "right center",
                                  ][ii % 3],
                                }}
                              />
                              <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/15" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline gap-1.5">
                                <h3 className="font-display text-[15px] font-semibold leading-tight text-[#2a1a0e]">
                                  {item.label}
                                </h3>
                                <span
                                  aria-hidden
                                  className="mb-1 flex-1 border-b border-dotted border-[#b49a6c]/70"
                                />
                                <span className="shrink-0 text-[13px] font-semibold tabular-nums text-[#b45309]">
                                  {item.price}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#7a6449]">
                                {item.desc || ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="relative border-t border-[#c9b189]/50 bg-[#efe2c8]/60 px-5 py-2.5 text-center sm:px-6">
                        <p className="text-[8px] uppercase tracking-[0.28em] text-[#9a7a45]">
                          Gracias por su visita · Precios en USD
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 isolate flex flex-col items-center gap-1.5 bg-gradient-to-t from-[#0a0705] via-[#0a0705]/95 to-transparent px-4 pb-2.5 pt-3">
        <nav className="flex gap-1 rounded-2xl border border-amber-500/20 bg-black/55 p-1 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveIndex(i)}
              className={`rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                activeIndex === i
                  ? "bg-gradient-to-b from-amber-300 to-orange-500 text-[#2a160a] shadow-[0_0_20px_rgba(250,166,26,0.35)]"
                  : "text-stone-400 hover:bg-white/5 hover:text-amber-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        <div className="z-10 flex space-x-1.5">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-6 bg-amber-400"
                  : "w-2 bg-stone-700 hover:bg-stone-600"
              }`}
              aria-label={`Ir a ${cat.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
