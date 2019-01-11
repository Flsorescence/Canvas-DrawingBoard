var img;
var select_color = '#000000';
var select_size = 1;

canvas = document.getElementById('canvas');
if(canvas.getContext){
    context = canvas.getContext('2d');
}
context.lineWidth = 1;
context.strokeStyle = '#000000';
context.save();

function SizeTools() {
    $("#sizebutton-ul").toggle();
}

function showSize(size) {
    select_size = size;
    style();
    $("#sizebutton-ul").toggle();
}

function ColorTools() {
    $("#colorbutton-ul").toggle();
}

function chooseColor(color) {
    select_color = color;
    style();
    $("#colorbutton-ul").toggle();
}

function style() {
    context.restore();
    context.lineWidth = select_size;
    context.strokeStyle = select_color;
    context.save();
}

function choosePen() {
    canvas.onmousedown = function(e){
        e.preventDefault();
        var x = e.clientX - canvas.offsetLeft;
        var y = e.clientY - canvas.offsetTop;
        context.beginPath();
        context.moveTo(x,y);
        canvas.onmousemove = function(e){
            e.preventDefault();
            var x = e.clientX - canvas.offsetLeft;
            var y = e.clientY - canvas.offsetTop;
            context.lineTo(x,y);
            context.stroke();
        };
        canvas.onmouseup = function(e){
            canvas.onmousemove = null;
            context.closePath();
        };
    };
}

function chooseEraser() {
    canvas.onmousedown = function(e){
        canvas.onmousemove = function(e){
            e.preventDefault();
            var x2 = e.clientX - canvas.offsetLeft;
            var y2 = e.clientY - canvas.offsetTop;
            context.clearRect(x2 - 20 / 2, y2 - 20 /2, 20, 20);
        };
        canvas.onmouseup = function(e){
            canvas.onmousemove = null;

        };
    };
}

function drawLine() {
    canvas.onmousedown = function(e){
        e.preventDefault();
        var x = e.clientX - canvas.offsetLeft;
        var y = e.clientY - canvas.offsetTop;
        context.beginPath();
        context.moveTo(x,y);
        var x2, y2;
        canvas.onmousemove = function(e){
            e.preventDefault();
            x2 = e.clientX - canvas.offsetLeft;
            y2 = e.clientY - canvas.offsetTop;
        };
        canvas.onmouseup = function(e){
            context.lineTo(x2,y2);
            context.stroke();
            context.closePath();
            canvas.onmousemove = null;
        };
    };
}

function drawRectangle() {
    canvas.onmousedown = function(e){
        e.preventDefault();
        var x1 = e.clientX - canvas.offsetLeft;
        var y1 = e.clientY - canvas.offsetTop;
        // context.moveTo(x,y);
        var x2, y2;
        canvas.onmousemove = function(e){
            e.preventDefault();
            x2 = e.clientX - canvas.offsetLeft;
            y2 = e.clientY - canvas.offsetTop;
        };
        canvas.onmouseup = function(e){
            context.strokeRect(x1, y1, x2 - x1,y2 - y1);
            canvas.onmousemove = null;
        };
    };
}

function drawCycle() {
    canvas.onmousedown = function(e){
        e.preventDefault();
        var x1 = e.clientX - canvas.offsetLeft;
        var y1 = e.clientY - canvas.offsetTop;
        context.beginPath();
        var x2, y2;
        canvas.onmousemove = function(e){
            e.preventDefault();
            x2 = e.clientX - canvas.offsetLeft;
            y2 = e.clientY - canvas.offsetTop;
        };
        canvas.onmouseup = function(e){
            context.arc(x1, y1, Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2)) , 0, 2*Math.PI, true);
            context.closePath();
            context.stroke();
            canvas.onmousemove = null;
        };
    };
}

function putText() {
    canvas.onmousedown = function(e) {
        var x = e.clientX - canvas.offsetLeft;
        var y = e.clientY - canvas.offsetTop;
        var x1 = (x + 15).toString() + 'px';
        var y1 = (y + 60).toString() + 'px';
        var text = showTextarea(x1, y1);
        context.font = 'bold 20px Arial';
        context.fillText(text, x, y);
        document.getElementById("mytext").value = "";
    };
}

function showTextarea(x, y){
    var textarea = document.getElementById("mytext");
    textarea.style.left = x;
    textarea.style.top = y;
    $("#mytext").toggle();
    var text = textarea.value;
    return text;
}


$("#inputFile").change(function () {
    var file = $(this)[0].files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);//转化成base64数据类型
    reader.onload = function(e){
        drawToCanvas(this.result);
    }
})

function drawToCanvas(imgData){
    img = new Image;
    img.src = imgData;
    img.onload = function(){//必须onload之后再画
        context.drawImage(img,0,0);
        // strDataURI = context.toDataURL();//获取canvas base64数据
    }
}

function rotateImg() {
    context.clearRect(0, 0, img.width, img.height);
    var scale = -1;
    context.translate(canvas.width, 0);
    context.scale(scale, 1);
    context.drawImage(img, canvas.width - img.width, 0);
    context.translate(canvas.width, 0);
    context.scale(scale, 1)
    // context.save();
}

function saveImg(){
    let type = 'png';   //设置下载图片的格式
    let img_png_src = canvas.toDataURL("image/png");  //将canvas保存为图片
    let imgData = img_png_src.replace("image/png",'image/octet-stream');
    let filename = 'mydrawing' + '.' + type; //下载图片的文件名
    saveFile(imgData,filename);
}

let saveFile = function(data, fileName){
    let save_link = document.createElement('a');
    save_link.href = data;
    save_link.download = fileName;
    let event = document.createEvent('MouseEvents');
    event.initEvent("click", true, false);
    save_link.dispatchEvent(event);
}

