const todos = JSON.parse(localStorage.getItem('todolist')) || [];
const input = document.querySelector('.todo');
const addbtn = document.querySelector('.add_btn');

const tags = document.querySelectorAll('.list_tag');
const todoList = document.querySelector('.all_list');
const undoneList = document.querySelector('.undone');
const doneList = document.querySelector('.done');

const list_footer = document.querySelector('.list-footer');

let edit_inputs;
let edit_todo = null;

function renderToDos(e) {
    let todo_str = "";
    let undone_str = "";
    let done_str = "";
    let undone_list = [];
    let done_list = [];

    if(todos.length == 0){
        todo_str = `<p>目前尚未新增待辦事項</p>`;
        todoList.innerHTML = todo_str;
    }
    
    todos.forEach((todo, index) => {
        todo_str += `<li>
        <div data-id="${todo.id}" class="view">
            <input type="checkbox" class="check_done" id="check_done" ${todo.done ? 'checked': ''}/>
            <label data-id="${index}" class="todo_item ${todo.done ? 'done':''}">${todo.content}</label>
        </div>
        <button class="delbtn" data-btn="del" data-id="${index}"><i class="fas fa-trash-alt" data-id="${index}"></i></button>
        <input data-id="${index}" class="edit" type="text"/>
        </li>`;
        if (todo.done == true) {
            done_list.push(todo);
        } else {
            undone_list.push(todo);
        }
    })
    todoList.innerHTML = todo_str;
    done_list.forEach((done, index) => {
        done_str += `<li>
        <div data-id="${done.id}" class="view">
            <input type="checkbox" class="check_done" id="check_done" ${done.done ? 'checked': ''}/>
            <label data-id="${index}" class="todo_item ${done.done ? 'done':''}">${done.content}</label>
        </div>
        <button class="delbtn" data-btn="del" data-id="${index}"><i class="fas fa-trash-alt" data-id="${index}"></i></button>
        <input data-id="${index}" class="edit" type="text"/>
        </li>`;
    })
    if(done_list.length == 0){
        done_str = `<p>目前沒有完成的項目</p>`
        doneList.innerHTML = done_str;
    }
    doneList.innerHTML = done_str;
    undone_list.forEach((undone, index) => {
        undone_str += `<li>
        <div data-id="${undone.id}" class="view">
            <input type="checkbox" class="check_done" id="check_done" ${undone.done ? 'checked': ''}/>
            <label data-id="${index}" class="todo_item ${undone.done ? 'done':''}">${undone.content}</label>
        </div>
        <button class="delbtn" data-btn="del" data-id="${index}"><i class="fas fa-trash-alt" data-id="${index}"></i></button>
        <input data-id="${index}" class="edit" type="text"/>
        </li>`;
    })
    if(undone_list.length == 0){
        undone_str = `<p>目前沒有待辦事項</p>`
        undoneList.innerHTML = undone_str;
    }
    undoneList.innerHTML = undone_str;
    list_footer.innerHTML = `<p>尚有${undone_list.length}筆事項未完成</p>
    <button type="button" class="delAllbtn">
        <i class="fas fa-trash-alt"></i>
        清除全部資料
    </button>`;

    doneList.style.display = 'none';
    undoneList.style.display = 'none';


    edit_inputs = document.querySelectorAll('.edit');
    const todo_content = document.querySelectorAll('.todo_item');

    todo_content.forEach((todo_item) => {
        todo_item.addEventListener('dblclick', (e) => {
            editToDo(e);
        })
    })
    
    const btns = document.querySelectorAll('.delbtn');
    btns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            delToDo(e);
        })
    })
    const isdone = document.querySelectorAll(".check_done");
    isdone.forEach((checkbox) => {
        checkbox.addEventListener("click", doneToDo);
    })

    const delAll = document.querySelector('.delAllbtn');
    delAll.addEventListener('click', () => {
        delAllToDo();
    })
}

function addToDo() {
    if (input.value != "") {
        const item = {
            id: Math.floor(Date.now()),
            content: input.value,
            done: false,
        };
        todos.push(item);
        localStorage.setItem('todolist', JSON.stringify(todos));
        input.value = '';
        tags.forEach((tag) => {
            tag.classList.remove('active');
        })
        tags[0].classList.add('active');
        todoList.style.display = 'block';
        doneList.style.display = 'none';
        undoneList.style.display = 'none';
        renderToDos();
    } else {
        return
    }
}

function delToDo(e) {
    let del_index = e.target.dataset.id;
    todos.splice(del_index, 1);
    localStorage.setItem('todolist', JSON.stringify(todos));
    renderToDos();
}

function delAllToDo() {
    todos.splice(0, todos.length);
    localStorage.setItem('todolist', JSON.stringify(todos));
    renderToDos();
}

function editToDo(e) {
    edit_todo = e.target.innerText;
    e.target.parentNode.parentNode.classList.add('editing');
    edit_inputs.forEach((edit_item) => {
        if (edit_item.dataset.id == e.target.dataset.id) {
            edit_item.value = e.target.innerText;
            edit_item.focus();
            edit_item.addEventListener('blur', () => {
                edit_item.value = "";
                e.target.parentNode.parentNode.classList.remove('editing');
            })
            edit_item.addEventListener('keydown', (e) => {
                if (e.keyCode == 13) {
                    todos[e.target.dataset.id].content = edit_item.value;
                    localStorage.setItem('todolist', JSON.stringify(todos));
                    renderToDos();
                }
            })
        }
    });
}

function doneToDo(e) {
    todos.forEach((todo) => {
        if (todo.id == e.target.parentNode.dataset.id) {
            if (todo.done == true) {
                todo.done = false;
            } else {
                todo.done = true;
            }
        }
    })
    localStorage.setItem('todolist', JSON.stringify(todos));
    renderToDos();
}

function switch_tag(e) {
    if (e.target.dataset.id == "all") {
        todoList.style.display = 'block';
        doneList.style.display = 'none';
        undoneList.style.display = 'none';
    } else if (e.target.dataset.id == "undone") {
        todoList.style.display = 'none';
        doneList.style.display = 'none';
        undoneList.style.display = 'block';
    } else if (e.target.dataset.id == "done") {
        todoList.style.display = 'none';
        doneList.style.display = 'block';
        undoneList.style.display = 'none';
    }
    tags.forEach((tag) => {
        tag.classList.remove('active');
    })
    e.target.classList.add('active');
}

renderToDos();
addbtn.addEventListener("click", addToDo);
input.oninput = ()=>{
    if(input.value != ""){
        addbtn.disabled = false;
    }
    else{
        addbtn.disabled = true;
    }
}
input.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        addToDo();
    }
})
document.querySelector('.list-header').addEventListener('click', (e) => {
    switch_tag(e);
})