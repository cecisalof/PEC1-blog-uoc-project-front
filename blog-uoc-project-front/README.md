# BlogUocProjectFront

Frontend del proyecto BlogUoc, desarrollado con Angular CLI versión 15.2.1. Este proyecto forma parte de la entrega académica de la asignatura correspondiente en la UOC.

##  Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
	•	Node.js (versión 14 o superior)
	•	Angular CLI
	•	Un backend en ejecución (API del proyecto BlogUoc)
🔗 Configura la URL base de la API en los entornos (src/environments/environment.ts y environment.prod.ts), si corresponde.

## Ejecución en desarrollo

	1.	Instala las dependencias: npm install
    2.	Inicia el servidor de desarrollo: ng serve
    3.	Abre el navegador en http://localhost:4200/. La aplicación se recargará automáticamente si realizas cambios en el código fuente.

## Build para producción

Para generar los archivos optimizados de producción, ejecuta: ng build. 
Los artefactos compilados se almacenarán en la carpeta dist/.

