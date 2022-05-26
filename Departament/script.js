//DECLARAR AS VARIÁVEIS INCIAIS
const baseUrl_department = "http://localhost:8080/departments"
const listContainer = document.getElementById("list-departments");
const btnConfirmar = document.getElementById("confirm");
const btnAdd = document.getElementById("btnAdd");
const btnConfirmRemove = document.getElementById("confirm_delete");
const btnConfirmRemoveAll = document.getElementById("btnModalDelete");
const pesquisa = document.getElementById("txtSearch")

let id = 0;

//----------- FUNÇÕES AO CLICAR NOS BOTÕES ---------

//Botão adicionar
function handleClickAdd() {
    id = 0;
    document.getElementById("textModal").textContent = "Cadastrar novo departamento";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("txtNameDepartment").value = "";
}
btnAdd.addEventListener("click", handleClickAdd);

//Botão editar
function handleClickEditDep(departmentId, nameDepartment) {
    id = departmentId;
    document.getElementById("textModal").textContent = "Alterar dados do departmento";
    document.getElementById("confirm").textContent = "Salvar";

    document.getElementById("txtNameDepartment").value = nameDepartment;
    $("#addModal").modal("show");
}

//Botão remover
function handleClickRemoveDep(departmentId) {
    id = departmentId;

    $("#rmvModal").modal("show");
}
btnConfirmRemove.addEventListener("click", deleteDepartment);

//Botão remover todos
function handleClickRemoveAll() {

    $("#modalDelete").modal("show");
}
btnConfirmRemoveAll.addEventListener("click", deleteAll);

//----------- MÉTODOS DE API NO JSON ---------

//Buscar os departamentos no BD
async function getlist() {
    const response = await fetch(baseUrl_department);

    if (!response.ok) {
        console.error("Houve um erro, status: " + response.status);
    }

    return await response.json();
}

//Postar os departamentos no BD
function create(departmentName) {
    fetch(baseUrl_department, {
        method: "POST",
        body: JSON.stringify({
            name: departmentName
        }),
        headers: {
            "content-type": "application/json"
        },
    }).then((response) => {
        if (!response.ok) {
            alert("Houve um erro ao adicionar o curso");
            return false;
        }

        loadItems();
        $("#addModal").modal("hide");
    })
}

//Salvar os departamentos no BD
function saveDepartment() {
    const nomeDepartment = document.getElementById("txtNameDepartment");

    if (!id) {
        create(nomeDepartment.value);
    } else {
        updateDepartment(id, nomeDepartment.value)
    }
    nomeDepartment.value = "";
}
btnConfirmar.addEventListener("click", saveDepartment);

//Editar um departamento expecífico no BD
function updateDepartment(id, departmentName) {
    fetch(baseUrl_department + "/" + id, {
        method: "PUT",
        body: JSON.stringify({
            name: departmentName
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

//Deletar um departamento expecífico no BD
function deleteDepartment() {
    fetch(baseUrl_department + "/" + id, {
        method: "DELETE",
    }).then((response) => {
        if (!response.ok) {
            console.error("Houve um error.");
        }
        loadItems();
        $("#rmvModal").modal("hide");
    });
}

//Deletar todos os departamentos no BD
function deleteAll() {
    fetch(baseUrl_department, {
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

//Adicionar o departamento no HTML
function createListItem(department) {
    const item = document.createElement("li");

    const span = document.createElement("span")
    item.textContent = department.name;

    const contentBtns = document.createElement("div");

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.type = "button";
    btnEdit.classList.add("btn");
    btnEdit.classList.add("btn-warning");
    btnEdit.addEventListener("click", () => handleClickEditDep(department.id, department.name));

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Remover";
    btnDelete.type = "button";
    btnDelete.classList.add("btn");
    btnDelete.classList.add("btn-danger");
    btnDelete.addEventListener("click", () => handleClickRemoveDep(department.id));

    contentBtns.appendChild(btnDelete);
    contentBtns.appendChild(btnEdit);

    item.appendChild(span);
    item.appendChild(contentBtns);

    listContainer.appendChild(item);
}

//----------- PESQUISAR UM DEPARTAMENTO ---------
async function searchDepartment(){
    const list_departments = await getlist();
    const lista_filtrada = [];

    const t = document.getElementById("txtSearch").value;

        const r = new RegExp(t.toLowerCase(), "g")

        for(i in list_departments){
            if ( list_departments[i].name.toLowerCase().match(r) )
                lista_filtrada.push(list_departments[i]);
        }
        console.log(list_departments)
         loadItems(lista_filtrada);
}

//----------- FUNÇÃO BOTÕES DE PESQUISA ---------

//Botão Buscar


//----------- CARREGAR OS DADOS ---------
async function loadItems(departments) {
    listContainer.innerHTML = "";
    if (!departments){
        departments = await getlist();
    }

    departments.forEach((c) => createListItem(c));
}
loadItems();