import {OriginCalculate} from "./calculate/OriginCalculate.js";

var cal=new OriginCalculate("小写");
document.write(cal.getName());
let map=new Map();
map.set("name","xiaoxie");
map.set("value","22");
for(var {key,value} in map){
    document.write(key+'===='+value);
}