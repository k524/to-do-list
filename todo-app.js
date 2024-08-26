(function() {
    let objectList = [];

    function creatAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');
        button.disabled = true;

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        input.addEventListener('input', function() {
            if (!input.value) {
                button.disabled = true;
            }
            else {
                button.disabled = false;
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    };

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list
    }

    function createTodoApp(container, title = 'Список дел', obj, documentName) {
        let todoAppTitle = creatAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        localStorage.setItem(documentName, localStorage.getItem(documentName));
        if (localStorage.getItem(documentName) === 'null') {
            if (obj !== undefined) {
                obj.id = 0;
                obj.document = documentName;
                objectList.push(obj);
                let startItem = createTodoItem(obj);
                todoList.append(startItem.item)
            }
        }  
        else {
            let storageList = JSON.parse(localStorage.getItem(documentName));
            for (storageObject of storageList) {
                if (storageObject !== null) {
                    let storageItem = createTodoItem(storageObject);
                    todoList.append(storageItem.item);
                    objectList.push(storageObject);
                }
            }
        }

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!todoItemForm.input.value) {
                return
            }

            let object = {
                name: todoItemForm.input.value,
                done: false,
                id: objectList.length,
                document: documentName
            }

            let todoItem = createTodoItem(object);

            objectList.push(object);
            localStorage.removeItem(documentName)
            localStorage.setItem(documentName, JSON.stringify(objectList))
            console.log(object);

            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        });
    }
    function createTodoItem(object) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = object.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            if (object.done === true) {
                objectList[object.id].done = false;
            }
            else {
                objectList[object.id].done = true;
            }
            localStorage.removeItem(object.document);
            localStorage.setItem(object.document, JSON.stringify(objectList));
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();
                objectList[object.id] = undefined;
                localStorage.removeItem(object.document);
                localStorage.setItem(object.document, JSON.stringify(objectList));
            }
        });

        if (object.done === true) {
            item.classList.toggle('list-group-item-success');
        }

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    window.createTodoApp = createTodoApp;
})();