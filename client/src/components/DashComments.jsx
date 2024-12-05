import React, { useEffect } from 'react'

function DashComments() {

  const fetchComments=async()=>{
    const res=await fetch ('/api/comment/getDashComment')
    const data=await res.json();
    console.log(data)
  }
  useEffect(()=>{
    fetchComments()
  })
  return (
    <div>DashComments</div>
  )
}

export default DashComments