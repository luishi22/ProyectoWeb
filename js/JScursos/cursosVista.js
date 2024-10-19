/* import { onGetCourses } from "./cursosController"; */

/* constantes de los inputs */

const totalCourses = 21;
const coursesPerPage = 6;
let currentCourses = coursesPerPage;

const cursitos = [
  {
    title: "Curso de React Native",
    description: "Crea aplicaciones móviles con React Native.",
    icon: "📱",
  },
  {
    title: "Curso de JavaScript Avanzado",
    description: "Profundiza en las funcionalidades avanzadas de JavaScript.",
    icon: "📜",
  },
  {
    title: "Curso de Python para Data Science",
    description: "Aprende Python aplicado a la ciencia de datos.",
    icon: "🐍",
  },
  {
    title: "Curso de Desarrollo Web Full Stack",
    description: "Desarrolla aplicaciones web completas.",
    icon: "🌐",
  },
  {
    title: "Curso de Diseño UX/UI",
    description: "Diseña experiencias de usuario atractivas.",
    icon: "🎨",
  },
  {
    title: "Curso de Machine Learning",
    description: "Inicia en el aprendizaje automático con Python.",
    icon: "🤖",
  },
  {
    title: "Curso de Bases de Datos SQL",
    description: "Aprende a gestionar bases de datos con SQL.",
    icon: "📊",
  },
  {
    title: "Curso de Cloud Computing",
    description: "Entiende los fundamentos de la computación en la nube.",
    icon: "☁️",
  },
  {
    title: "Curso de Desarrollo de Videojuegos",
    description: "Crea tus propios videojuegos desde cero.",
    icon: "🎮",
  },
  {
    title: "Curso de Marketing Digital",
    description: "Domina las estrategias de marketing en línea.",
    icon: "📈",
  },
  {
    title: "Curso de Ciberseguridad",
    description:
      "Protégete en el mundo digital con técnicas de ciberseguridad.",
    icon: "🛡️",
  },
  {
    title: "Curso de Git y GitHub",
    description: "Gestiona tu código de manera efectiva con Git.",
    icon: "🗂️",
  },
  {
    title: "Curso de DevOps",
    description: "Optimiza el ciclo de vida del desarrollo de software.",
    icon: "⚙️",
  },
  {
    title: "Curso de Programación para Principiantes",
    description: "Introducción a la programación desde cero.",
    icon: "👨‍💻",
  },
  {
    title: "Curso de HTML y CSS",
    description: "Crea páginas web con HTML y CSS.",
    icon: "📄",
  },
  {
    title: "Curso de Inteligencia Artificial",
    description: "Explora los conceptos de la inteligencia artificial.",
    icon: "🧠",
  },
  {
    title: "Curso de React.js",
    description: "Construye interfaces de usuario con React.",
    icon: "🔄",
  },
  {
    title: "Curso de Angular",
    description: "Desarrolla aplicaciones web con Angular.",
    icon: "📐",
  },
  {
    title: "Curso de SEO",
    description: "Optimiza tus sitios web para motores de búsqueda.",
    icon: "🔍",
  },
  {
    title: "Curso de Ruby on Rails",
    description: "Desarrolla aplicaciones web con Ruby on Rails.",
    icon: "💎",
  },
  {
    title: "Curso de Flutter",
    description: "Crea aplicaciones móviles multiplataforma con Flutter.",
    icon: "🦋",
  },
  {
    title: "Curso de Blockchain",
    description:
      "Aprende sobre la tecnología de blockchain y sus aplicaciones.",
    icon: "⛓️",
  },
];

const inputImg = document.getElementById("inputImg");

document.getElementById("closeModalCurso").addEventListener(`click`, (e) => {
  const imgElement = document.getElementById("imgCourse");
  imgElement.src = `../assets/icons/iconosCursos/iconBaseCurso.png`;
  inputImg.value = "";
});

inputImg.addEventListener("change", ({ target: { files } }) => {
  const file = files[0];
  const imgElement = document.getElementById("imgCourse");

  // Validar que el archivo sea una imagen (MIME type)
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Actualiza el src de la imagen con la nueva imagen seleccionada
      imgElement.src = e.target.result;
    };

    reader.readAsDataURL(file); // Lee la imagen como Data URL
  } else {
    alert("Por favor, selecciona un archivo de imagen válido.");
    inputImg.value = "";
  }
});

function cargarCoursesAdmin() {
  const courseContainer = document.getElementById("coursesAdmin");
  cursitos.forEach((course, index) => {
    const courseCard = document.createElement("div");
    courseCard.className = "pepito col-md-4 mb-2";
    courseCard.innerHTML = `
            <li class="TemaCartas" style="--color:#59A15B;--color2:#39909D">
                    <a href="#" style="text-decoration: none; color: white;" class="">
                        <figure>
                            <img alt="" loading="lazy" width="56" height="56"
                                decoding="async" data-nimg="1" style="color:transparent"
                                src="https://static.platzi.com/media/learningpath/emblems/1d093a9a-5203-4206-91a9-2ab466ed7e89.jpg" />
                        </figure>
                        <p>${course.title + " " + index} </p>  
                    </a>
                </li>

        `;
    courseContainer.appendChild(courseCard);
  });
  prueba();
}
cargarCoursesAdmin();

function prueba() {
  const coursesElements = document.querySelectorAll(".pepito");
  coursesElements.forEach((course, index) => {
    course.style.display = index <= currentCourses ? "block" : "none";
  });
}

document.getElementById("toggleButton").addEventListener("click", () => {
  if (currentCourses === coursesPerPage) {
    currentCourses = totalCourses;
    document.getElementById("toggleButton").textContent =
      "Mostrar menos cursos";
  } else {
    currentCourses = coursesPerPage;
    document.getElementById("toggleButton").textContent = "Mostrar más cursos";
  }
  prueba();
});
