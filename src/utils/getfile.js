/*
 2         * 使用download.js 强制浏览器下载图片、视频等文件
 3         * @param {any} url url链接地址
 4         * @param {any} strFileName 文件名
 5         * @param {any} strMimeType 文件类型
 6         * dzl
 7         * 2020年5月8日
 8          */

export function downloadfile(url, strFileName, strMimeType) {
  var xmlHttp = null;
  if (window.ActiveXObject) {
    // IE6, IE5 浏览器执行代码
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlHttp = new XMLHttpRequest();
  }
  //2.如果实例化成功，就调用open（）方法：
  if (xmlHttp != null) {
    xmlHttp.open("get", url, true);
    xmlHttp.responseType = "blob"; //关键
    xmlHttp.send();
    xmlHttp.onreadystatechange = doResult; //设置回调函数
  }
  function doResult() {
    if (xmlHttp.readyState == 4) {
      //4表示执行完成
      if (xmlHttp.status == 200) {
        //200表示执行成功
        download(xmlHttp.response, strFileName, strMimeType);
      }
    }
  }
}

/*
 2  * 根据文件名的尾缀 返回文件类型
 3  * @param {any} fileName 文件名
 4  * dzl
 5  * 2020年5月9日
 6  */
export function getFileType(fileName) {
  // 后缀获取
  let suffix = "";
  // 获取类型结果
  let result = "";
  try {
    const flieArr = fileName.split(".");
    suffix = flieArr[flieArr.length - 1];
  } catch (err) {
    suffix = "";
  }
  // fileName无后缀返回 false
  if (!suffix) {
    return false;
  }
  suffix = suffix.toLocaleLowerCase();
  // 图片格式
  const imglist = ["png", "jpg", "jpeg", "bmp", "gif"];
  // 进行图片匹配
  result = imglist.find((item) => item === suffix);
  if (result) {
    return "image";
  }
  // 匹配txt
  const txtlist = ["txt"];
  result = txtlist.find((item) => item === suffix);
  if (result) {
    return "txt";
  }
  // 匹配 excel
  const excelist = ["xls", "xlsx"];
  result = excelist.find((item) => item === suffix);
  if (result) {
    return "excel";
  }
  // 匹配 word
  const wordlist = ["doc", "docx"];
  result = wordlist.find((item) => item === suffix);
  if (result) {
    return "word";
  }
  // 匹配 pdf
  const pdflist = ["pdf"];
  result = pdflist.find((item) => item === suffix);
  if (result) {
    return "pdf";
  }
  // 匹配 ppt
  const pptlist = ["ppt", "pptx"];
  result = pptlist.find((item) => item === suffix);
  if (result) {
    return "ppt";
  }
  // 匹配 视频
  const videolist = [
    "mp4",
    "m2v",
    "mkv",
    "rmvb",
    "wmv",
    "avi",
    "flv",
    "mov",
    "m4v",
  ];
  result = videolist.find((item) => item === suffix);
  if (result) {
    return "video";
  }
  // 匹配 音频
  const radiolist = ["mp3", "wav", "wmv"];
  result = radiolist.find((item) => item === suffix);
  if (result) {
    return "radio";
  }
  // 其他 文件类型
  return "other";
}
