let sharedCanvas = wx.getSharedCanvas();
let context = sharedCanvas.getContext("2d");

context.fillStyle = "";
context.fillRect(0, 0, 200, 200);
context.fillStyle = "#000";
context.fillText("获取的数据", 110,110);

