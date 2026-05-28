# LoKee

Demo web para buscar propiedades en renta con mapa interactivo, filtros, vistas de detalle, recorridos VR y modelos 3D.

## Ejecutar localmente

```bash
npm install
npm start
```

Luego abre:

- Landing: `http://localhost:3000/`
- Aplicacion: `http://localhost:3000/app`

La app puede funcionar en modo demo con los datos locales de `Frontend/data.json`. Si configuras Supabase en `.env`, los endpoints del backend usaran la base de datos.

## Notas para portafolio

- El flujo de inicio de sesion fue removido de la navegacion publica.
- No subas `.env`; usa `.env.example` como referencia.
- `node_modules` queda excluido del repositorio.
