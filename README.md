# Calculadora de Edad - Frontend Mentor Challenge

![Vista previa del diseño de la Calculadora de Edad](./design/desktop-preview.jpg)

## Descripción

Este proyecto es una solución al desafío de Frontend Mentor para crear una calculadora de edad. La aplicación permite a los usuarios calcular su edad exacta en años, meses y días a partir de su fecha de nacimiento.

## Características

- 🎯 Cálculo preciso de edad en años, meses y días
- ✅ Validación completa de fechas
- 📱 Diseño responsive para móvil y escritorio
- 🎨 Interfaz moderna y atractiva
- ⚡ Animaciones suaves en los resultados

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Diseño responsive con CSS Grid y Flexbox

## Funcionalidades Implementadas

- Validación de formularios en tiempo real
- Cálculo preciso de edad
- Manejo de errores para:
  - Campos vacíos
  - Días inválidos (1-31)
  - Meses inválidos (1-12)
  - Fechas futuras
  - Fechas inexistentes (ej: 31/04/1991)
- Diseño responsive
- Estados hover y focus en elementos interactivos
- Animaciones en los números del resultado

## Estructura del Proyecto

```
age-calculator/
├── assets/
│   └── fonts/
├── design/
│   ├── desktop-preview.jpg
│   └── mobile-design.jpg
├── index.html
├── styles.css
└── script.js
```

## Cómo Usar

1. Clona este repositorio
2. Abre `index.html` en tu navegador
3. Ingresa tu fecha de nacimiento
4. Haz clic en el botón de calcular
5. ¡Ve tu edad calculada!

## Aprendizajes

Durante el desarrollo de este proyecto, he mejorado mis habilidades en:
- Validación de formularios
- Manipulación de fechas en JavaScript
- Diseño responsive
- Animaciones CSS
- Manejo de estados y errores

## Desafíos y Soluciones

- **Desafío**: Implementar validación precisa de fechas
  **Solución**: Creación de un sistema de validación que considera años bisiestos y días por mes

- **Desafío**: Animaciones suaves en los números
  **Solución**: Implementación de animaciones CSS personalizadas

## Mejoras Futuras

- [ ] Añadir soporte para múltiples idiomas
- [ ] Implementar tema oscuro
- [ ] Añadir más opciones de personalización
- [ ] Mejorar la accesibilidad

## Autor

[Tu Nombre]

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

---

Desarrollado con ❤️ como parte de los desafíos de [Frontend Mentor](https://www.frontendmentor.io)
