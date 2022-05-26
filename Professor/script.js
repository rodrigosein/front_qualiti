//DECLARAR AS VARIÁVEIS INCIAIS
const baseUrl_professor = "http://localhost:8080/professors"
const listContainer = document.getElementById("list-professors");
const btnConfirmar = document.getElementById("confirm");
const btnAdd = document.getElementById("btnAdd");
const btnConfirmRemove = document.getElementById("confirm_delete");
const btnConfirmRemoveAll = document.getElementById("btnModalDelete");

const input = document.getElementById("cpf");
let id = 0;
let departments = [];

//----------- FUNÇÕES AO CLICAR NOS BOTÕES ---------

//Botão adicionar
function handleClickAdd() {
    id = 0;
    document.getElementById("textModal").textContent = "Cadastrar novo professor";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("txtNameProfessor").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("selectDepartmentId").value = "selected";
    
}
btnAdd.addEventListener("click", handleClickAdd);

//Botão editar
function handleClickEditProf(professorId, nameProfessor, cpfProfessor, depProfessor) {
    id = professorId;
    document.getElementById("textModal").textContent = "Alterar dados do professor";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("txtNameProfessor").value = nameProfessor;
    document.getElementById("cpf").value = cpfProfessor;
    document.getElementById("selectDepartmentId").value = depProfessor;

    $("#addModal").modal("show");
}

//Botão remover
function handleClickRemoveProf(professorId) {
    id = professorId;

    $("#rmvModal").modal("show");
}
btnConfirmRemove.addEventListener("click", deleteProfessor);

//Botão remover todos
function handleClickRemoveAll() {

    $("#modalDelete").modal("show");
}
btnConfirmRemoveAll.addEventListener("click", deleteAll);

//----------- MÉTODOS DE API NO JSON ---------

//Buscar os professores no BD
async function getlist() {
    const response = await fetch(baseUrl_professor);

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Buscar os departamentos no BD
async function getDepList() {
    const response = await fetch("http://localhost:8080/departments");

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Postar os professores no BD
function create(professorName, professorCpf, professorDep) {
    fetch(baseUrl_professor, {
        method: "POST",
        body: JSON.stringify({
            name: professorName,
            cpf: professorCpf,
            departmentId: professorDep
        }),
        headers: {
            "content-type": "application/json"
        },
    }).then((response) => {
        if (!response.ok) {
            console.error("Houve um error, status: " + response.status)
        }

        loadItems();
        $("#addModal").modal("hide");
    })
}

//Salvar os professores no BD
function saveProfessor() {
    const nomeProfessor = document.getElementById("txtNameProfessor");
    const cpfProfessor = document.getElementById("cpf");
    const depProfessor = document.getElementById("selectDepartmentId");
    
        if (!id) {
            create(nomeProfessor.value, cpfProfessor.value, depProfessor.value);
        } else {
            updateProfessor(id, nomeProfessor.value, cpfProfessor.value, depProfessor.value)
        }
    
    nomeProfessor.value = "";
    cpfProfessor.value = "";
    depProfessor.value = "selected";
}
btnConfirmar.addEventListener("click", saveProfessor);

//Editar um professor expecífico no BD
function updateProfessor(id, professorName, professorCpf, professorDep) {
    fetch(baseUrl_professor + "/" + id, {
        method: "PUT",
        body: JSON.stringify({
            name: professorName,
            cpf: professorCpf,
            departmentId: professorDep
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

//Deletar um professor expecífico no BD
function deleteProfessor() {
    fetch(baseUrl_professor + "/" + id, {
        method: "DELETE",
    }).then((response) => {
        if (!response.ok) {
            console.error("Houve um error.");
        }
        loadItems();
        $("#rmvModal").modal("hide");
    });
}

//Deletar todos os professores no BD
function deleteAll() {
    fetch(baseUrl_professor, {
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
function createListItem(professor) {
    const item = document.createElement("li");
    const item_cpf = document.createElement("p")
    const item_dep = document.createElement("p")

    const span = document.createElement("span")
    item.textContent = professor.name;
    item_cpf.textContent = "CPF: "+ professor.cpf;
    item_cpf.className = "itens"
    item_dep.textContent = "Departamento: "+ professor.department.name;
    item_dep.className = "itens"

    const contentBtns = document.createElement("div");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.type = "button";
    btnEdit.classList.add("btn");
    btnEdit.classList.add("btn-warning");
    btnEdit.addEventListener("click", () => handleClickEditProf(professor.id, professor.name, professor.cpf, professor.department.id));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Remover";
    btnDelete.type = "button";
    btnDelete.classList.add("btn");
    btnDelete.classList.add("btn-danger");
    btnDelete.addEventListener("click", () => handleClickRemoveProf(professor.id));

    contentBtns.appendChild(btnDelete);
    contentBtns.appendChild(btnEdit);

    item.appendChild(span);
    item_cpf.appendChild(span);
    item_dep.appendChild(span);
    item.appendChild(contentBtns);
    

    listContainer.appendChild(item);
    listContainer.appendChild(item_cpf);
    listContainer.appendChild(item_dep);
}

//----------- CARREGAR OS DADOS DO PROFESSOR---------
async function loadItems() {
    listContainer.innerHTML = "";
    const professors = await getlist();

    professors.forEach((c) => createListItem(c));
}
loadItems();

//----------- CARREGAR OS DADOS DO DEPARTAMENTO---------
async function loadSelectDepartmentId() {
	const url_dep = "http://localhost:8080/departments";
	departaments = await getDepList();

	const selectDepartments = document.getElementById("selectDepartmentId");

	for (let item of departaments) {
		const opcao = document.createElement("option");
		opcao.value = item.id;
		opcao.textContent = item.name;

		selectDepartments.appendChild(opcao);
	}
}
loadSelectDepartmentId();

//----------- MÁSCARA PARA O CPF ---------
input.addEventListener('keypress', () => {
    let inputlength = input.value.length

    if (inputlength === 3 || inputlength === 7) {
        input.value += '.'
    } else if(inputlength === 11) {
        input.value += '-'
    }
})