> micromark > micromark
  micromark-extension-gfm-footnote > gfmFootnote gfmFootnoteHtml
  micromark-extension-gfm-table > gfmTable gfmTableHtml
  micromark-extension-gfm-task-list-item > gfmTaskListItemHtml gfmTaskListItem
  ./highlight.js
  @3-/md__:md__

< option =
  allowDangerousHtml:true
  allowDangerousProtocol:true
  extensions: [
    gfmFootnote()
    gfmTaskListItem()
    gfmTable()
  ]
  htmlExtensions: [
    gfmTaskListItemHtml()
    gfmFootnoteHtml()
    gfmTableHtml()
  ]

< (md)=>
  highlight micromark(
    md__ md
    option
  ).replaceAll('>\n<', '><')
