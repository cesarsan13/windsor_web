import React from 'react'

function Loading() {
  return (
    <div class="flex items-center md:-mt-10 mt-10 rounded-3xl">
  <div class="bg-salte-100 rounded-3xl">
    <div class=" md:p-52 p-10 flex flex-col rounded-3xl h-5/6">
      <div class="flex items-center justify-center">
        <span class="loading loading-ring h-52 w-52"></span>
      </div>
    </div>
  </div>
</div>

  )
}

export default Loading
