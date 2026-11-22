import { mountSiteFooter, mountSiteNav } from '../components/site-nav.js';
import { initDotTrailCanvas } from '../components/dot-trail-canvas.js';
import { bindCopyButton } from '../components/moodboard-ui.js';

const BRAND_KNOWLEDGE_PROMPT = `# Brand Knowledge — Katze
- Empresa: Katze (Odoo Ready Partner oficial)
- Especialidad: Consultoría tecnológica, implementación de Odoo y arquitectura DevOps para PyMEs del sector productivo en México.
- Eslogan oficial: "Convertimos tecnología en resultados."
- Principio interno: "El sistema sigue al criterio."

## Misión
Acompañar a pequeñas y medianas empresas del sector productivo en la implementación de Odoo, arquitectura DevOps y consultoría tecnológica con transparencia radical. Decimos con claridad qué funciona y qué no, eliminando el miedo a la tecnología y convirtiendo cada sistema en una herramienta rentable, estable y medible.

## Visión
Consolidarnos en México como la firma de referencia en consultoría tecnológica e implementación de tecnología y de Odoo para el sector productivo, reconocida por nuestra solidez técnica, nuestra ética de trabajo y por ser el socio confiable que transforma operaciones complejas en resultados reales.

## Valores
1. Criterio antes que venta: Nunca prometemos lo que un sistema no puede cumplir solo para cerrar un contrato.
2. Transparencia operativa: El cliente siempre sabe qué estamos construyendo, cuánto cuesta, qué riesgos existen y en qué punto está su proyecto.
3. Honradez innegociable: Ética estricta, sin atajos que comprometan la infraestructura del cliente.
4. Inconformismo técnico: Mejora continua y exigencia real en cada despliegue.
5. Resultados sobre tendencias: El sistema sigue al criterio; cada servidor y proceso resuelve un problema real de manufactura, inventario o finanzas.

## Origen y símbolo
Nacida desde la ingeniería de software y DevOps tras frenar un sistema monolítico inviable y rescatar una operación que había perdido casi $1.7M MXN en un ERP fallido. El isotipo une el emblema geométrico técnico interno con la silueta felina co-creada en equipo.

## Voz y tono
Directo, honesto, sobrio y técnicamente claro. Sin humo comercial ni promesas vacías.`;

function mountHeroDots() {
  const canvas = document.querySelector('[data-dot-trail]');
  if (!canvas) return null;
  return initDotTrailCanvas(canvas, {
    placement: 'right',
    baseColor: '204, 202, 214',
    backgroundOpacity: 0.2,
    backgroundDitherAlpha: 54,
    glowPrimary: '209, 111, 255',
    glowSecondary: '155, 93, 229',
    trailOpacity: 0.92,
  });
}

function bindBrandBriefCopy() {
  const button = document.querySelector('[data-copy-brand-brief]');
  return bindCopyButton(button, BRAND_KNOWLEDGE_PROMPT, {
    copiedLabel: 'Brand Knowledge copiado',
    toastMessage: 'Brand Knowledge copiado para IA',
  });
}

function initBrandPage() {
  mountSiteNav('brand');
  mountSiteFooter('brand');
  mountHeroDots();
  bindBrandBriefCopy();
}

initBrandPage();
