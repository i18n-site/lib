> micromark > micromark
  micromark-extension-gfm-footnote > gfmFootnote gfmFootnoteHtml
  micromark-extension-gfm-table > gfmTable gfmTableHtml
  micromark-extension-gfm-task-list-item > gfmTaskListItemHtml gfmTaskListItem

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
  micromark(
    md
    option
  )
