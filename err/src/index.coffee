export default new Proxy(
  {}
  get:(_,name)=>
    if name.endsWith('Error')
      name = name.slice(0,-5)
    cls = class extends Error
      constructor: (message)->
        super(message)
    Object.defineProperty(cls, 'name', {value: name})
    cls
)
