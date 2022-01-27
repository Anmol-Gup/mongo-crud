const deleteUser=(userid)=>{
    
    const request=new XMLHttpRequest()
    request.open('DELETE','/user-delete')
    request.setRequestHeader("Content-type",'application/json')
    request.send(JSON.stringify({id:userid}))

    request.addEventListener('load',()=>{
         console.log(request.responseText)
    })

    const deletebtn=document.querySelectorAll('.fa-trash');
    deletebtn.forEach(value=>{
        if(value.id===userid)
            value.parentElement.parentElement.remove()
    })
}