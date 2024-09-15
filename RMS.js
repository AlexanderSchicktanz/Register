class RMS{
    constructor(options){
        this.b = options.b || 0;
        this.code = options.code || [];
        if(typeof this.code == "String"){
            this.code = this.code.split("\n");
        }
        this.result = [[]];
        this.storeResult = options.storeResult || false;
        this.registers = options.registers || new Array(10).fill(0);
        this.addCommands = options.addCommands || false;
    }
    execute(options){
        this.b = options.b || this.b;
        this.code = options.code || this.code;
        this.storeResult = options.storeResult || this.storeResult;
        this.registers = options.registers || this.registers;
        this.addCommands = options.addCommands || this.addCommands;
        this.run();
    }
    run(){
        if(this.storeResult){
            this.result = [[this.b].concat(this.registers)];
            if(this.addCommands){
                this.result[0] = ["Start"].concat(this.result[0]);
            }
        }
        while(true){
            let line = code[this.b];
            this.line=line;
            if (line == undefined) {
                this.b++;
                break;
            }
            let [op, ...args] = line.split(' ');
            let arg = args[0];
            let displayedB = this.b+1;
            switch (op) {
                case 'END':{
                    this.addLine(displayedB,registers);
                    return;
                }
                case 'cload':{
                    registers[0] = Number(arg);
                    this.b++;
                    break;
                }
                case 'load':{
                    registers[0] = registers[Number(arg)];
                    this.b++;
                    break;
                }
                case 'cadd':{
                    registers[0] += Number(arg);
                    this.b++;
                    break;
                }
                case 'add':{
                    registers[0] += registers[Number(arg)];
                    this.b++;
                    break;
                }
                case 'csub':{
                    registers[0] -= Number(arg);
                    if(registers[0]<0){registers[0]=0;}
                    this.b++;
                    break;
                }
                case 'sub':{
                    registers[0] -= registers[Number(arg)];
                    if(registers[0]<0){registers[0]=0;}
                    this.b++;
                    break;
                }
                case 'cmult':{
                    registers[0] *= Number(arg);
                    this.b++;
                    break;
                }
                case 'mult':{
                    registers[0] *= registers[Number(arg)];
                    this.b++;
                    break;
                }
                case 'cdiv':{
                    registers[0] /= Number(arg);
                    registers[0] = Math.floor(registers[0]);
                    this.b++;
                    break;
                }
                case 'div':{
                    registers[0] /= registers[Number(arg)];
                    registers[0] = Math.floor(registers[0]);
                    this.b++;
                    break;
                }
                case 'store':{
                    registers[Number(arg)] = registers[0];
                    this.b++;
                    break;
                }
                case 'goto':{
                    b = (Number(arg)-1);
                    break;
                }
                case 'if':{
                    if(!line.startsWith("if c0=0 goto ")){
                        this.b++;
                        break;
                    }
                    arg = line.split("if c0=0 goto ")[1];
                    if(registers[0] == 0){
                        b = (Number(arg)-1);
                        break;
                    }
                    this.b++;
                    break;
                }
            }
            this.addLine(displayedB,registers);
        }
    }
    addLine(b,registers){
        if(this.storeResult){
            this.result.push([this.b].concat(this.registers));
            if(this.addCommands){
                this.result[this.result.length-1]=[this.line].concat(this.result[this.result.length-1]);
            }
        }
    }
}