/**
 * 验证点击坐标是否正确
 * @param {[number, number][]} clicks - 用户点击的坐标列表 [[x, y], ...]
 * @param {[number, number, number][]} positions - 目标图标的位置和边长列表 [[x, y, size], ...]
 * @returns {boolean} 是否验证通过
 */
export default (clicks, positions) => {
  if (clicks.length !== positions.length) return false;

  for (let i = 0; i < clicks.length; ++i) {
    const [cx, cy] = clicks[i],
      [px, py, sz] = positions[i];

    if (cx < px || cx > px + sz || cy < py || cy > py + sz) return false;
  }

  return true;
};
