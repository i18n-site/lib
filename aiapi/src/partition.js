export default (lines, title_number) => {
  let title = ''
  // 对行号进行升序排序
  const order = title_number.sort((a, b) => a[1] - b[1]);

  // 存储最终结果的数组
  const result = [];
  // 追踪上一个分割点的索引
  let start = 0;

  // 遍历排序后的行号
  for (const [t, row] of order) {
    console.log(t)
    // 将行号转换为从0开始的数组索引
    const index = row - 1;
    result.push(title + lines.slice(start, index).join('\n'));
    title = '# ' + t + '\n'
    start = index;
  }

  // 添加从最后一个分割点到末尾的剩余文本
  if (start < lines.length) {
    result.push(title + lines.slice(start).join('\n'));
  }

  return result;
};
