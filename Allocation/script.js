//DECLARAR AS VARIÁVEIS INCIAIS
const baseUrl_allocations = "http://localhost:8080/allocations"
const listContainer = document.getElementById("list-allocations");
const btnConfirmar = document.getElementById("confirm");
const btnAdd = document.getElementById("btnAdd");
const btnConfirmRemove = document.getElementById("confirm_delete");
const btnConfirmRemoveAll = document.getElementById("btnModalDelete");

let id = 0;
let professors = [];
let courses = [];
let days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
let hours = ['08:00+0000', '09:00+0000', '10:00+0000', '11:00+0000'
	, '12:00+0000', '13:00+0000', '14:00+0000', '15:00+0000', '16:00+0000', '17:00+0000'
	, '18:00+0000', '19:00+0000', '20:00+0000'];

//----------- FUNÇÕES AO CLICAR NOS BOTÕES ---------

//Botão adicionar
function handleClickAdd() {
    id = 0;
    document.getElementById("textModal").textContent = "Cadastrar nova alocação";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("selectDayOfWeekId").value = "";
}
btnAdd.addEventListener("click", handleClickAdd);

//Botão editar
function handleClickEditAlloc(allocationId, dayAllocation) {
    id = allocationId;
    document.getElementById("textModal").textContent = "Alterar dados da alocação";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("day").value = dayAllocation;

    $("#addModal").modal("show");
}

//Botão remover
function handleClickRemoveAlloc(allocationId) {
    id = allocationId;

    $("#rmvModal").modal("show");
}
btnConfirmRemove.addEventListener("click", deleteAllocation);

//Botão remover todos
function handleClickRemoveAll() {

    $("#modalDelete").modal("show");
}
btnConfirmRemoveAll.addEventListener("click", deleteAll);

//----------- MÉTODOS DE API NO JSON ---------

//Buscar as alocações no BD
async function getlist() {
    const response = await fetch(baseUrl_allocations);

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Buscar os professores no BD
async function getProfList() {
    const response = await fetch("http://localhost:8080/professors");

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Buscar os cursos no BD
async function getCoursesList() {
    const response = await fetch("http://localhost:8080/courses");

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Postar as alocações no BD
function create(allocationDay, allocationStart, allocationEnd, allocationCourseName, allocationProfessorName) {
    fetch(baseUrl_allocations, {
        method: "POST",
        body: JSON.stringify({
            day: allocationDay,
            start: allocationStart,
            end: allocationEnd,
            courseId: allocationCourseName,
            professorId: allocationProfessorName
        }),
        headers: {
            "content-type": "application/json"
        },
    }).then((response) => {
        if (!response.ok) {
            console.log(response);
            console.error("Houve um error, status: " + response.status)
        }

        loadItems();
        $("#addModal").modal("hide");
    })
}

//Salvar as alocações no BD
function saveAllocation() {
    const allocationDay = document.getElementById("selectDayOfWeekId");
    const allocationStart = document.getElementById("selectStartHourId");
    const allocationEnd = document.getElementById("selectEndHourId");
    const allocationProfessorName = document.getElementById("selectProfessorId");
    const allocationCourseName = document.getElementById("selectCourseId");

    if (!id) {
        create(allocationDay.value, allocationStart.value, allocationEnd.value, allocationProfessorName.value, allocationCourseName.value);
    } else {
        updateAllocation(id, allocationDay.value, allocationStart.value, allocationEnd.value, allocationProfessorName.value, allocationCourseName.value)
    }
    allocationDay.value = "selected";
    allocationStart.value = "selected";
    allocationEnd.value = "selected";
    allocationProfessorName.value = "selected";
    allocationCourseName.value = "selected";
}
btnConfirmar.addEventListener("click", saveAllocation);

//Editar uma alocação expecífica no BD
function updateAllocation(id, allocationDay, allocationStart, allocationEnd, allocationCourseName, allocationProfessorName) {
    fetch(baseUrl_allocations + "/" + id, {
        method: "PUT",
        body: JSON.stringify({
            name: allocationDay,
            day: allocationDay,
            start: allocationStart,
            end: allocationEnd,
            courseId: allocationCourseName,
            professorId: allocationProfessorName
        }),
        headers: {
            "Content-Type": "application/json"
        },
    }).then((response) => {
        if (!response.ok) {
            console.log("Houve um error.");
        }
        response.json().then((json) => {
            console.log(json);
            loadItems();
            $("#addModal").modal("hide");
        });

    });
}

//Deletar uma alocação expecífico no BD
function deleteAllocation() {
    fetch(baseUrl_allocations + "/" + id, {
        method: "DELETE",
    }).then((response) => {
        if (!response.ok) {
            console.error("Houve um error.");
        }
        loadItems();
        $("#rmvModal").modal("hide");
    });
}

//Deletar todos as alocações no BD
function deleteAll() {
    fetch(baseUrl_allocations, {
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
function createListItem(allocation) {
    const item = document.createElement("li");
    const item_course = document.createElement("p")
    const item_day = document.createElement("p")
    const item_start = document.createElement("p")
    const item_end = document.createElement("p")

    const span = document.createElement("span")
    item.textContent = allocation.professor.name;
    item_course.textContent = "Curso: "+ allocation.course.name;
    item_course.className = "itens"
    item_day.textContent = "Dia: "+ allocation.day;
    item_day.className = "itens"
    item_start.textContent = "Início: "+ allocation.start.substr(0, 5)
    item_start.className = "itens"
    item_end.textContent = "Término: "+ allocation.end.substr(0, 5)
    item_end.className = "itens"

    const flex = document.createElement("div");
    flex.className = "info_hour"
    const infoCurso = document.createElement("div");
    const hourCurso = document.createElement("div");

    const contentBtns = document.createElement("div");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.type = "button";
    btnEdit.classList.add("btn");
    btnEdit.classList.add("btn-warning");
    btnEdit.addEventListener("click", () => handleClickEditAlloc(allocation.day, allocation.start, allocation.end, allocation.course.name, allocation.professor.name));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Remover";
    btnDelete.type = "button";
    btnDelete.classList.add("btn");
    btnDelete.classList.add("btn-danger");
    btnDelete.addEventListener("click", () => handleClickRemoveAlloc(allocation.id));

    contentBtns.appendChild(btnDelete);
    contentBtns.appendChild(btnEdit);

    item.appendChild(span);
    item.appendChild(contentBtns);

    listContainer.appendChild(item);

    infoCurso.appendChild(item_course);
    infoCurso.appendChild(item_day);
    hourCurso.appendChild(item_start);
    hourCurso.appendChild(item_end);

    flex.appendChild(infoCurso);
    flex.appendChild(hourCurso);

    listContainer.appendChild(flex);
}

//----------- CARREGAR OS DADOS DA ALOCAÇÃO ---------
async function loadItems() {
    listContainer.innerHTML = "";
    const allocations = await getlist();

    allocations.forEach((c) => createListItem(c));
}
loadItems();

//----------- CARREGAR OS DADOS DO PROFESSOR---------
async function loadSelectProfessorId() {
	const url_dep = "http://localhost:8080/professors";
	professors = await getProfList();

	const selectProfessor = document.getElementById("selectProfessorId");

	for (let item of professors) {
		const opcao = document.createElement("option");
		opcao.value = item.id;
		opcao.textContent = item.name;

		selectProfessor.appendChild(opcao);
	}
}
loadSelectProfessorId();

//----------- CARREGAR OS DADOS DO CURSO---------
async function loadSelectCourseId() {
	const url_dep = "http://localhost:8080/courses";
	courses = await getCoursesList();

	const selectCourse = document.getElementById("selectCourseId");

	for (let item of courses) {
		const opcao = document.createElement("option");
		opcao.value = item.id;
		opcao.textContent = item.name;

		selectCourse.appendChild(opcao);
	}
}
loadSelectCourseId();

//----------- CARREGAR OS DADOS DOS DIAS---------
async function loadDays() {
	const selectDays = document.getElementById("selectDayOfWeekId");

	for (let item of days) {
		const opcao = document.createElement("option");
		opcao.value = item;
		opcao.textContent = item;

		selectDays.appendChild(opcao);
	}
}
loadDays();

//----------- CARREGAR OS HORÁRIOS DE INÍCIO E FIM---------
async function loadHours() {
	const selectStart = document.getElementById("selectStartHourId");
	const selectEnd = document.getElementById("selectEndHourId");

	for (let item of hours) {
		const opcaoS = document.createElement("option");
		opcaoS.value = item;
		opcaoS.textContent = item.substr(0, 5);

		selectStart.appendChild(opcaoS);
	}
    for (let item of hours) {
		const opcaoE = document.createElement("option");
		opcaoE.value = item;
		opcaoE.textContent = item.substr(0, 5);

		selectEnd.appendChild(opcaoE);
	}
}
loadHours();