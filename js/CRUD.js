
function Eliminar(id,deleteDoc,doc,db) {
    console.log("entro eliminar")
    const dcRef=doc(db,"certifications",id)
     deleteDoc(dcRef)
    // Aquí puedes agregar la lógica para eliminar la certificación

}