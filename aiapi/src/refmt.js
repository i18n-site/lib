export default (txt) =>
  txt.replaceAll("\\n", "\n").replaceAll("“", "「").replaceAll("”", "」");
