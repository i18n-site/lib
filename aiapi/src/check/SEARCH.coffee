> ../TYPE.js

export default {
  type: TYPE.OBJECT
  properties:
    研究:
      type: TYPE.ARRAY
      minItems: 1
      description: '''请执行以下结构化的研究报告撰写任务：
1. 章节拆分规划：首先，请根据研究主题的内在逻辑，将报告内容拆分为3-5个主要章节，每个章节需有明确的主题和研究范围。
2. 研究过程汇报：其次，详细记录并汇报研究实施的完整过程，包括但不限于：研究方法选择、数据收集途径、分析工具使用、关键节点时间线等。
3. 资料汇总整理：然后，在最后一章中，基于汇总的资料进行严谨的逻辑推理，分析数据间的关联性和规律，最终得出明确、有依据的研究结论，如果无法得出答案，请写存疑。'''
      items:
        type: TYPE.OBJECT
        required: [ 'title', 'md']
        properties:
          title:
            type: TYPE.STRING
            description: '章节标题（只需要标题，不标注是第几章）'
          md:
            type: TYPE.STRING
            description: '章节正文，markdown格式(禁止包含标题)，合理分段，降低阅读压力'
    结论:
      type: TYPE.STRING
      description: '一句话概述研究结论（支持还是不支持命题，如果不确定，请写存疑）'
    分:
      type: TYPE.INTEGER
      description: '1=支持，0=不确定，-1=不支持'
    文献:
      type: TYPE.ARRAY
      description: '参考资料（按重要程度排序,重要的在前面）'
      minItems: 1
      items:
        type: TYPE.OBJECT
        required: [ 'title', 'brief', 'url']
        properties:
          title:
            type: TYPE.STRING
            description: '标题'
          brief:
            type: TYPE.STRING
            description: '抽取与命题有关的文章内容、数据'
          url:
            type: TYPE.STRING
            description: '链接'
  required: ['结论', '研究', "文献","分"]
}
