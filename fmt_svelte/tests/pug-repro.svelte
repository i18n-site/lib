<template lang="pug">
  b.btn(
    onclick!={ (e) => { e.preventDefault(); token = ''; setUrl('/'); } }
    onkeydown!={ (e) => { if (e.keyCode === 13) { doSomething(); } } }
  )
  +test(() => {
    a();
    b();
  })
</template>
