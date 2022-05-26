//DECLARAR AS VARIÁVEIS INCIAIS
const baseUrl_course = "http://localhost:8080/courses"
const listContainer = document.getElementById("list-courses");
const btnConfirmar = document.getElementById("confirm");
const btnAdd = document.getElementById("btnAdd");
const btnConfirmRemove = document.getElementById("confirm_delete");
const btnConfirmRemoveAll = document.getElementById("btnModalDelete");

let id = 0;

//----------- FUNÇÕES AO CLICAR NOS BOTÕES ---------

//Botão adicionar
function handleClickAdd() {
    id = 0;
    document.getElementById("textModal").textContent = "Cadastrar novo curso";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("txtNameCourse").value = "";
}
btnAdd.addEventListener("click", handleClickAdd);

//Botão editar
function handleClickEdit(courseId, nameCourse) {
    id = courseId;
    document.getElementById("textModal").textContent = "Alterar dados do curso";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("txtNameCourse").value = nameCourse;
    $("#addModal").modal("show");
}

//Botão remover
function handleClickRemove(courseId) {
    id = courseId;

    $("#rmvModal").modal("show");
}
btnConfirmRemove.addEventListener("click", deleteCourse);

//Botão remover todos
function handleClickRemoveAll() {

    $("#modalDelete").modal("show");
}
btnConfirmRemoveAll.addEventListener("click", deleteAll);

//----------- MÉTODOS DE API NO JSON ---------

//Buscar os cursos no BD
async function getlist() {
    const response = await fetch(baseUrl_course);

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Postar os cursos no BD
function create(courseName) {
    fetch(baseUrl_course, {
        method: "POST",
        body: JSON.stringify({
            name: courseName
        }),
        headers: {
            "content-type": "application/json"
        },
    }).then((response) => {
        if (!response.ok) {
            alert("Houve um erro ao adicionar o curso")
        }
        loadItems();
        $("#addModal").modal("hide");
    })
}

//Salvar os cursos no BD
function saveCourse() {
    const nomeCurso = document.getElementById("txtNameCourse");

    if (!id) {
        create(nomeCurso.value);
    } else {
        updateCourse(id, nomeCurso.value)
    }
    
    nomeCurso.value = "";
}
btnConfirmar.addEventListener("click", saveCourse);

//Editar um curso expecífico no BD
function updateCourse(id, courseName) {
    fetch(baseUrl_course + "/" + id, {
        method: "PUT",
        body: JSON.stringify({
            name: courseName
        }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        if (!response.ok) {
            alert("Não foi possível atualizar o cadastro.");
            return false;
        }
        
        response.json().then((json) => {
            console.log(json);
            loadItems();
            $("#addModal").modal("hide");
        });
    });
}

//Deletar um curso expecífico no BD
function deleteCourse() {
    fetch(baseUrl_course + "/" + id, {
        method: "DELETE",
    }).then((response) => {
        if (!response.ok) {
            console.error("Houve um error.");
        }
        loadItems();
        $("#rmvModal").modal("hide");
    });
}

//Deletar todos os cursos no BD
function deleteAll() {
    fetch(baseUrl_course, {
        method: "DELETE",
    }).then((response) => {
        if (!response.ok) {
            console.error("Houve um error.");
        }
        loadItems();
        $("#modalDelete").modal("hide");
    });
}

//----------- MÉTODO PARA ADICIONAR O CURSO NO HTML ---------

//Adicionar o curso no HTML
function createListItem(course) {
    const item = document.createElement("li");

    const span = document.createElement("span")
    item.textContent = course.name;

    const contentBtns = document.createElement("div");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.type = "button";
    btnEdit.classList.add("btn");
    btnEdit.classList.add("btn-warning");
    btnEdit.addEventListener("click", () => handleClickEdit(course.id, course.name));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Remover";
    btnDelete.type = "button";
    btnDelete.classList.add("btn");
    btnDelete.classList.add("btn-danger");
    btnDelete.addEventListener("click", () => handleClickRemove(course.id));

    contentBtns.appendChild(btnDelete);
    contentBtns.appendChild(btnEdit);

    item.appendChild(span);
    item.appendChild(contentBtns);

    listContainer.appendChild(item);
}

//----------- CARREGAR OS DADOS ---------
async function loadItems() {
    listContainer.innerHTML = "";
    const courses = await getlist();
    list_cursos = await getlist();

    courses.forEach((c) => createListItem(c));
}
loadItems();