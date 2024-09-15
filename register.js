let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'javascript',
    theme: 'dracula',
    lineNumbers: true
});

let table = document.getElementById('execution');
let tbody = table.children[0];
let head = tbody.children[0];
let inputs = tbody.children[1];
function addColumn() {
    let curr = head.children.length - 1;
    head.children[curr-1].removeAttribute("remove");
    head.children[curr-1].removeEventListener("click", removeColumn);
    let currColumn = head.children[curr];
    currColumn.innerHTML = "c" + (curr-1);
    currColumn.setAttribute("remove", "");
    currColumn.removeAttribute("add");
    currColumn.removeEventListener("click", addColumn);
    currColumn.addEventListener("click", removeColumn);
    let newAdder = document.createElement('th');
    newAdder.innerHTML = "+";
    newAdder.setAttribute("add", "");
    newAdder.addEventListener("click", addColumn);  
    head.appendChild(newAdder);
    let input = document.createElement('td');
    input.innerHTML = "0";
    input.setAttribute("contenteditable", "true");
    inputs.appendChild(input);
    /*let newColIndex = head.children.length - 2;
    head.children[newColIndex+1].removeAttribute("remove");
    head.children[newColIndex+1].removeEventListener("click", removeColumn);
    let lastColumn = head.children[head.children.length - 1];
    lastColumn.innerHTML = "c" + newColIndex;
    lastColumn.setAttribute("remove", "");
    lastColumn.removeEventListener("click", addColumn);
    lastColumn.addEventListener("click", removeColumn);
    let newAdder = document.createElement('th');
    newAdder.innerHTML = "+";
    newAdder.setAttribute("add", "");
    newAdder.addEventListener("click", addColumn);  
    head.appendChild(newAdder);
    let input = document.createElement('td');
    input.innerHTML = "0";
    input.setAttribute("contenteditable", "true");
    inputs.appendChild(input);*/
}

function removeColumn() {
    let newColIndex = head.children.length - 2;
    head.children[newColIndex].innerHTML = "+";
    head.children[newColIndex].setAttribute("add", "");
    head.children[newColIndex].removeAttribute("remove");
    head.children[newColIndex].addEventListener("click", addColumn);
    head.children[newColIndex].removeEventListener("click", removeColumn);
    if(newColIndex-1>1){
        head.children[newColIndex-1].setAttribute("remove", "");
        head.children[newColIndex-1].addEventListener("click", removeColumn);
    }
    head.children[newColIndex+1].remove();
    inputs.children[inputs.children.length-1].remove();
}
head.children[2].addEventListener("click", addColumn);

function getLines() {
    return editor.getValue().split('\n');
}
function displayLine(b,registers){
    let line = document.createElement('tr');
    let bdata=document.createElement('td');
    bdata.innerHTML = b;
    line.appendChild(bdata);
    registers.forEach((element)=>{
        let cdata=document.createElement('td');
        cdata.innerHTML = element;
        line.appendChild(cdata);
    });
    tbody.appendChild(line);
}
function interpret(lines, registersFirst) {
    let b = 0;
    let registers = registersFirst;
    while(true){
        let line = lines[b];
        if (line == undefined) {
            b++;
            break;
        }
        let [op, ...args] = line.split(' ');
        let arg = args[0];
        let displayedB = b+1;
        switch (op) {
            case 'END':{
                displayLine(displayedB,registers);
                return;
            }
            case 'cload':{
                registers[0] = Number(arg);
                b++;
                break;
            }
            case 'load':{
                registers[0] = registers[Number(arg)];
                b++;
                break;
            }
            case 'cadd':{
                registers[0] += Number(arg);
                b++;
                break;
            }
            case 'add':{
                registers[0] += registers[Number(arg)];
                b++;
                break;
            }
            case 'csub':{
                registers[0] -= Number(arg);
                if(registers[0]<0){registers[0]=0;}
                b++;
                break;
            }
            case 'sub':{
                registers[0] -= registers[Number(arg)];
                if(registers[0]<0){registers[0]=0;}
                b++;
                break;
            }
            case 'cmult':{
                registers[0] *= Number(arg);
                b++;
                break;
            }
            case 'mult':{
                registers[0] *= registers[Number(arg)];
                b++;
                break;
            }
            case 'cdiv':{
                registers[0] /= Number(arg);
                registers[0] = Math.floor(registers[0]);
                b++;
                break;
            }
            case 'div':{
                registers[0] /= registers[Number(arg)];
                registers[0] = Math.floor(registers[0]);
                b++;
                break;
            }
            case 'store':{
                registers[Number(arg)] = registers[0];
                b++;
                break;
            }
            case 'goto':{
                b = (Number(arg)-1);
                break;
            }
            case 'if':{
                if(!line.startsWith("if c0=0 goto ")){
                    b++;
                    break;
                }
                arg = line.split("if c0=0 goto ")[1];
                if(registers[0] == 0){
                    b = (Number(arg)-1);
                    break;
                }
                b++;
                break;
            }
        }
        displayLine(displayedB,registers);
    }
}
function start(){
    /*if(head.children[head.children.length-1].innerHTML=="+"){
        head.children[head.children.length-1].remove();
    }*/
    while(tbody.children.length>2){
        tbody.children[tbody.children.length-1].remove();
    }
    let registers = new Array(inputs.children.length-1).fill(0);
    for(let i = 1; i < inputs.children.length; i++){
        registers[i-1] = Number(inputs.children[i].innerHTML);
    }
    interpret(getLines(),registers);
    /*let adder = document.createElement("th");
    adder.innerHTML = "+";
    adder.setAttribute("add","");
    adder.addEventListener("click",addColumn);
    head.appendChild(adder);*/
}
function store(){
    let name = prompt("Wie soll das Script heißen?");
    localStorage.setItem(name,editor.getValue());
}
function load(){
    let auswahl = "\nAuswahl:";
    for(let i = 0; i < localStorage.length; i++){
        auswahl += "\n" + localStorage.key(i);
    }
    let name = prompt("Welches Script soll geladen werden?" + auswahl);
    if(name == null){
        return;
    }
    editor.setValue(localStorage.getItem(name));
}
document.getElementById("run").addEventListener("click",start);
document.getElementById("store").addEventListener("click",store);
document.getElementById("load").addEventListener("click",load);