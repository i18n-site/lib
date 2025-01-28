export default {
	基本嵌套测试: [
		`
.container { color: black; }
.container .header { font-size: 20px; }`,
		`
.container {
  color: black;

  .header {
    font-size: 20px;
  }

}`,
	],
	多层嵌套测试: [
		`
.container { color: black; }
.container .header { font-size: 20px; }
.container .header .logo { width: 100px; }`,
		`
.container {
  color: black;

  .header {
    font-size: 20px;

    .logo {
      width: 100px;
    }

  }

}`,
	],
	媒体查询中的嵌套测试: [
		`@media (min-width: 768px) {
  .container { color: blue; }
  .container .header { font-size: 24px; }
}`,
		`@media (min-width: 768px) {
  .container {
    color: blue;
  }

  .container .header {
    font-size: 24px;
  }

}`,
	],
	属性选择器测试: [
		`
.container[data-theme="dark"] { background: black; }
.container[data-theme="dark"] .title { color: white; }`,
		`
.container[data-theme="dark"] {
  background: black;

  .title {
    color: white;
  }

}`,
	],
	伪类与伪元素测试: [
		`
.button:hover { background: #eee; }
.button:hover .icon { opacity: 0.8; }`,
		`&:hover {
  background: #eee;

  .icon {
    opacity: 0.8;
  }

}`,
	],
	组合选择器测试: [
		`div.container.active { padding: 10px; }
div.container.active .content { margin: 5px; }`,
		`div.container.active {
  padding: 10px;

  .content {
    margin: 5px;
  }

}`,
	],
	兄弟选择器测试: [
		`
.list-item { display: flex; }
.list-item + .list-item { border-top: 1px solid #ccc; }`,
		`
.list-item {
  display: flex;

  + {

    .list-item {
      border-top: 1px solid #ccc;
    }

  }

}`,
	],
	内部嵌套测试: [
		`@supports (display: grid) {
  .grid-container { display: grid; }
  .grid-container .item { grid-column: 1; }
}`,
		`
.grid-container {
  display: grid;

  .item {
    grid-column: 1;
  }

}`,
	],
	注释处理测试: [
		`/* 主容器样式 */
.container { color: red; }
/* 头部样式 */
.container .header { font-size: 16px; }`,
		`
.container {
  color: red;

  .header {
    font-size: 16px;
  }

}`,
	],
	特殊符号测试: [
		`div:not(.hidden) { display: block; }
div:not(.hidden) .text { color: black; }`,
		`&:not(.hidden) {
  display: block;

  .text {
    color: black;
  }

}`,
	],
	多级媒体查询测试: [
		`@media (min-width: 768px) {
  .container { width: 750px; }
  @media (orientation: landscape) {
    .container { width: 800px; }
    .container .sidebar { width: 200px; }
  }
}`,
		`@media (min-width: 768px) {
  .container {
    width: 750px;
  }

}
@media (orientation: landscape) {
  .container {
    width: 800px;
  }

  .container .sidebar {
    width: 200px;
  }

}`,
	],
	混合嵌套测试: [
		`
.container { padding: 10px; }
@media (max-width: 600px) {
  .container { padding: 5px; }
  .container:hover { background: #f0f0f0; }
  .container[data-collapsed] .menu { display: none; }
}`,
		`
.container {
  padding: 10px;
}

@media (max-width: 600px) {
  .container {
    padding: 5px;
  }

  &:hover {
    background: #f0f0f0;
  }

  .container[data-collapsed] .menu {
    display: none;
  }

}`,
	],
	多父选择器嵌套测试: [
		`
.a, .b { color: red; }
.a .c, .b .c { font-size: 12px; }`,
		`
.a {
  color: red;

  .c {
    font-size: 12px;
  }

}

.b {
  color: red;

  .c {
    font-size: 12px;
  }

}`,
	],
}
