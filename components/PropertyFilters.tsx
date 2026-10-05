"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { categorias, type Categoria, type Operacion } from "@/lib/properties";
import { ORDENES } from "./CatalogSort";
import styles from "./PropertyFilters.module.css";

/** Filtros del catálogo tal como llegan en la URL */
export interface FiltrosCatalogo {
  operacion?: Operacion;
  categoria?: Categoria;
  zona?: string;
  precioMin?: number;
  precioMax?: number;
  recamaras?: number;
  m2Min?: number;
  q?: string;
  sort?: string;
  vista?: string;
}

export interface OpcionZona {
  slug: string;
  nombre: string;
  total: number;
}

type Clave = keyof FiltrosCatalogo;

const CLAVES: Clave[] = [
  "operacion",
  "categoria",
  "zona",
  "precioMin",
  "precioMax",
  "recamaras",
  "m2Min",
  "q",
  "sort",
  "vista",
];

const CLAVES_FILTRO: Clave[] = CLAVES.filter((k) => k !== "sort" && k !== "vista");

/** Construye /propiedades?… a partir de los filtros, con cambios puntuales (null quita) */
export function urlCatalogo(
  base: FiltrosCatalogo,
  cambios: Partial<Record<Clave, string | number | null>> = {}
) {
  const params = new URLSearchParams();
  for (const k of CLAVES) {
    const v = k in cambios ? cambios[k] : base[k];
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const q = params.toString();
  return q ? `/propiedades?${q}` : "/propiedades";
}

/** Cuántos filtros (sin contar orden ni vista) están activos */
export function filtrosActivos(f: FiltrosCatalogo) {
  return CLAVES_FILTRO.filter((k) => f[k] !== undefined && f[k] !== "").length;
}

/** Envío del formulario: quita campos vacíos para dejar la URL limpia */
function useEnviar(despues?: () => void) {
  const router = useRouter();
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    new FormData(e.currentTarget).forEach((v, k) => {
      const s = String(v).trim();
      if (s) params.set(k, s);
    });
    const q = params.toString();
    despues?.();
    router.push(q ? `/propiedades?${q}` : "/propiedades", { scroll: false });
  };
}

export default function PropertyFilters({
  filtros,
  zonas,
  total,
}: {
  filtros: FiltrosCatalogo;
  zonas: OpcionZona[];
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const activos = filtrosActivos(filtros);
  const { operacion, categoria } = filtros;
  const esMapa = filtros.vista === "mapa";
  const limpiar = urlCatalogo({ sort: filtros.sort, vista: filtros.vista });
  const enviarEscritorio = useEnviar();
  const enviarMovil = useEnviar(() => setOpen(false));

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chip = (label: string, active: boolean, to: string, onClick?: () => void) => (
    <Link
      key={label}
      href={to}
      scroll={false}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      className={`${styles.chip} ${active ? styles.chipActive : ""}`}
    >
      {label}
    </Link>
  );

  const grupos = (movil: boolean) => {
    const sufijo = movil ? "m" : "d";
    const cerrar = movil ? () => setOpen(false) : undefined;
    return (
      <FormFiltros
        formId={`filtros-${sufijo}`}
        filtros={filtros}
        zonas={zonas}
        onSubmit={movil ? enviarMovil : enviarEscritorio}
        escritorio={!movil}
      >
        <div className={styles.group}>
          <span className={styles.groupLabel} id={`f-op-${sufijo}`}>
            Operación
          </span>
          <div className={styles.segmento} role="group" aria-labelledby={`f-op-${sufijo}`}>
            {chip("Todas", !operacion, urlCatalogo(filtros, { operacion: null }), cerrar)}
            {chip("Venta", operacion === "venta", urlCatalogo(filtros, { operacion: "venta" }), cerrar)}
            {chip("Renta", operacion === "renta", urlCatalogo(filtros, { operacion: "renta" }), cerrar)}
          </div>
        </div>
        <div className={styles.group}>
          <span className={styles.groupLabel} id={`f-cat-${sufijo}`}>
            Tipo de inmueble
          </span>
          <div className={styles.chips} role="group" aria-labelledby={`f-cat-${sufijo}`}>
            {chip("Todos", !categoria, urlCatalogo(filtros, { categoria: null }), cerrar)}
            {categorias.map((c) =>
              chip(c, categoria === c, urlCatalogo(filtros, { categoria: c }), cerrar)
            )}
          </div>
        </div>
      </FormFiltros>
    );
  };

  return (
    <>
      {/* Escritorio: barra lateral */}
      <aside className={styles.sidebar} aria-label="Filtros">
        <div className={styles.sidebarHead}>
          <span className={styles.sidebarTitle}>Filtros</span>
          {activos > 0 && (
            <Link href={limpiar} scroll={false} className={styles.clear}>
              Limpiar
            </Link>
          )}
        </div>
        {grupos(false)}
      </aside>

      {/* Móvil: botón que abre el bottom-sheet */}
      <div className={styles.mobileBar}>
        <button
          type="button"
          className={styles.filterBtn}
          aria-expanded={open}
          aria-controls="hoja-filtros"
          onClick={() => setOpen(true)}
        >
          <svg className={styles.filterIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <circle cx="10" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
          Filtros
          {activos > 0 && (
            <span className={styles.badge}>
              {activos}
              <span className={styles.sr}> activos</span>
            </span>
          )}
        </button>
        <span className={styles.mobileCount}>
          <strong>{total}</strong> <span className={styles.palabra}>resultado{total !== 1 ? "s" : ""}</span>
        </span>
        <nav className={styles.vistaMovil} aria-label="Modo de vista">
          <Link
            href={urlCatalogo(filtros, { vista: null })}
            scroll={false}
            aria-current={!esMapa ? "page" : undefined}
            aria-label="Ver en lista"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M8 7h12M8 12h12M8 17h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="4.5" cy="7" r="1" fill="currentColor" />
              <circle cx="4.5" cy="12" r="1" fill="currentColor" />
              <circle cx="4.5" cy="17" r="1" fill="currentColor" />
            </svg>
            <span>Lista</span>
          </Link>
          <Link
            href={urlCatalogo(filtros, { vista: "mapa" })}
            scroll={false}
            aria-current={esMapa ? "page" : undefined}
            aria-label="Ver en mapa"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
            <span>Mapa</span>
          </Link>
        </nav>
      </div>

      {/* Bottom-sheet móvil */}
      <div
        className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
        onClick={() => setOpen(false)}
        inert={!open}
      >
        <div
          className={styles.panel}
          id="hoja-filtros"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.panelHead}>
            <span className={styles.panelTitle}>Filtros</span>
            <button
              type="button"
              className={styles.close}
              aria-label="Cerrar filtros"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className={styles.panelBody}>{grupos(true)}</div>
          <div className={styles.panelFoot}>
            {activos > 0 && (
              <Link
                href={limpiar}
                scroll={false}
                className={styles.clearBtn}
                onClick={() => setOpen(false)}
              >
                Limpiar
              </Link>
            )}
            <button
              type="submit"
              form="filtros-m"
              className={`btn btn-gold ${styles.applyBtn}`}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const OPCIONES_RECAMARAS = [1, 2, 3, 4];

/** Formulario GET: zona, precio, recámaras, superficie y texto. Funciona sin JS. */
function FormFiltros({
  formId,
  filtros,
  zonas,
  onSubmit,
  escritorio,
  children,
}: {
  formId: string;
  filtros: FiltrosCatalogo;
  zonas: OpcionZona[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  escritorio: boolean;
  children: ReactNode;
}) {
  // En escritorio, los selects aplican al cambiar; en móvil se aplica con el botón de la hoja
  const alCambiar = escritorio
    ? (e: { currentTarget: HTMLSelectElement }) => e.currentTarget.form?.requestSubmit()
    : undefined;
  const id = (n: string) => `${formId}-${n}`;
  // La clave fuerza a React a reiniciar los valores cuando cambia la URL
  const clave = urlCatalogo(filtros);

  return (
    <form
      key={clave}
      id={formId}
      action="/propiedades"
      method="get"
      className={styles.form}
      onSubmit={onSubmit}
    >
      {/* Se conservan los filtros de chips, el orden y la vista */}
      {filtros.operacion && <input type="hidden" name="operacion" value={filtros.operacion} />}
      {filtros.categoria && <input type="hidden" name="categoria" value={filtros.categoria} />}
      {escritorio && filtros.sort && <input type="hidden" name="sort" value={filtros.sort} />}
      {filtros.vista && <input type="hidden" name="vista" value={filtros.vista} />}

      <div className={styles.campo}>
        <label htmlFor={id("q")} className={styles.sr}>
          Buscar por colonia, tipo o palabra
        </label>
        <div className={styles.buscar}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            id={id("q")}
            name="q"
            type="search"
            className={styles.input}
            defaultValue={filtros.q ?? ""}
            placeholder="Colonia, tipo o palabra"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
      </div>

      {children}

      <div className={styles.campo}>
        <label htmlFor={id("zona")} className={styles.groupLabel}>
          Zona
        </label>
        <select
          id={id("zona")}
          name="zona"
          className={styles.input}
          defaultValue={filtros.zona ?? ""}
          onChange={alCambiar}
        >
          <option value="">Todas las zonas</option>
          {zonas.map((z) => (
            <option key={z.slug} value={z.slug}>
              {z.nombre} ({z.total})
            </option>
          ))}
        </select>
      </div>

      <fieldset className={styles.campo}>
        <legend className={styles.groupLabel}>Precio (MXN)</legend>
        <div className={styles.par}>
          <div>
            <label htmlFor={id("min")} className={styles.mini}>
              Mínimo
            </label>
            <input
              id={id("min")}
              name="precioMin"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              className={styles.input}
              defaultValue={filtros.precioMin ?? ""}
              placeholder="Libre"
            />
          </div>
          <div>
            <label htmlFor={id("max")} className={styles.mini}>
              Máximo
            </label>
            <input
              id={id("max")}
              name="precioMax"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              className={styles.input}
              defaultValue={filtros.precioMax ?? ""}
              placeholder="Libre"
            />
          </div>
        </div>
      </fieldset>

      <div className={styles.par}>
        <div className={styles.campo}>
          <label htmlFor={id("rec")} className={styles.groupLabel}>
            Recámaras
          </label>
          <select
            id={id("rec")}
            name="recamaras"
            className={styles.input}
            defaultValue={filtros.recamaras ? String(filtros.recamaras) : ""}
            onChange={alCambiar}
          >
            <option value="">Cualquiera</option>
            {OPCIONES_RECAMARAS.map((n) => (
              <option key={n} value={n}>
                {n} o más
              </option>
            ))}
          </select>
        </div>
        <div className={styles.campo}>
          <label htmlFor={id("m2")} className={styles.groupLabel}>
            m² mínimos
          </label>
          <input
            id={id("m2")}
            name="m2Min"
            type="number"
            inputMode="numeric"
            min={0}
            step={10}
            className={styles.input}
            defaultValue={filtros.m2Min ?? ""}
            placeholder="Cualquiera"
          />
        </div>
      </div>

      {!escritorio && (
        <div className={styles.campo}>
          <label htmlFor={id("sort")} className={styles.groupLabel}>
            Ordenar por
          </label>
          <select id={id("sort")} name="sort" className={styles.input} defaultValue={filtros.sort ?? ""}>
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor === "recientes" ? "" : o.valor}>
                {o.etiqueta}
              </option>
            ))}
          </select>
        </div>
      )}

      {escritorio && (
        <button type="submit" className={`btn btn-gold ${styles.aplicar}`}>
          Aplicar precio y superficie
        </button>
      )}
    </form>
  );
}
