# SPEC-07C: Ajuste de UX en Studio, Preparación de Despliegue y Guía Editorial

## Objetivo
Afinar la experiencia de captura en Sanity Studio, preparar la configuración de despliegue del panel en la nube de Sanity y documentar el flujo completo de publicación automática (Sanity → Vercel) para el equipo editorial de PULSO.

## 1. Ajuste de UX en `studio/schemaTypes/edicion.ts`
1. En el campo `volumen`:
   - Agrega `initialValue: 1` para que venga prellenado automáticamente al crear una nueva edición.
   - Actualiza su descripción a: `"Ciclo o año editorial (se queda en 1 durante el primer año; cambia a 2 al iniciar un nuevo ciclo)."`
2. Verifica que el generador de `slug` siga produciendo `vol-X-num-Y` correctamente usando ese valor inicial.

## 2. Configuración de Despliegue del Studio (`studio/sanity.cli.ts`)
1. Verifica que `studio/sanity.cli.ts` tenga configurado `projectId` (`s78tashj`) y `dataset` (`production`) leyendo de variables de entorno con fallback.
2. Agrega `autoUpdates: true` si la versión de Sanity lo soporta, para mantener el Studio actualizado sin intervención manual.
3. Verifica que `cd studio && npm run build` pase sin errores.

## 3. Guía para Editores (`GUIA-EDITORIAL.md`)
Crea un archivo `GUIA-EDITORIAL.md` en la raíz del proyecto, redactado en español claro y sin jerga técnica, dirigido a los estudiantes de NEXUS EMBS. Debe incluir:
1. **Cómo entrar al panel:** Acceso mediante el enlace del Studio (`https://pulso-nexus.sanity.studio` o el subdominio que se elija) con cuenta autorizada.
2. **Antes de subir un PDF (Regla de oro):** Recomendación práctica de comprimir el PDF a menos de 15–20 MB antes de subirlo para que cargue rápido en celulares.
3. **Cómo publicar una nueva edición paso a paso:**
   - Pestaña *Datos* (título, volumen prellenado, número, pulsar *Generate* en el slug, fecha y resumen).
   - Pestaña *Portada y PDF* (subir portada y archivo `.pdf`).
   - Pestaña *Carta editorial* (opcional).
   - Botón **Publish** y explicación de que la web pública se actualiza sola en ~1 minuto.
4. **Cómo agregar o reordenar artículos en "También en ediciones pasadas":** Selección de las 9 secciones oficiales, enlace a la edición y campo `orden`.
5. **Cómo ocultar un borrador:** Uso del interruptor `publicado` o botón *Unpublish*.

## 4. Documentación Técnica (`README.md`)
Agrega una sección breve en `README.md` con:
- Las variables de entorno requeridas en Vercel (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`).
- La instrucción para desplegar cambios del Studio (`cd studio && npx sanity deploy`).

## Criterios de Éxito
- `studio` compila sin errores (`cd studio && npm run build`) y el campo `volumen` aparece prellenado con `1`.
- El proyecto principal de Astro pasa `npm run build` con 0 errores.
- `GUIA-EDITORIAL.md` es clara, directa y lista para entregarse al cliente.