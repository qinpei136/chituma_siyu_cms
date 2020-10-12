/**
 * @description 下载流文件
 * @param data 二进制流文件
 * @param FileName 文件名称
 * @returns {boolean|null}
 */
export function downs(data, FileName) {
  // console.log("downs");
  if (!data) {
    return false;
  } else if (data.byteLength == 0) {
    this.$alert(" 查询信息为空！", "提示", {
      confirmButtonText: "确定",
    });
    return false;
  }

  const url = window.URL.createObjectURL(
    new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
  // const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  FileName = FileName.search(".xlsx") > -1 ? FileName : FileName + ".xlsx";
  link.setAttribute("download", FileName);
  // link.setAttribute('download', '礼品卡下载.xlsx')
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url); // 释放掉blob对象
  document.body.removeChild(link); // 下载完成移除元素
}
