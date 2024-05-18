let newnote = document.getElementById("addTxt");
let submitBtn = document.getElementById("submitBtn");
let logoutBtn=document.getElementById("logout");
let loginBtn=document.getElementById("login");
let signupBtn=document.getElementById("signup");
logoutBtn.addEventListener('click',()=>{
    let token=localStorage.removeItem('token');
    // await render();
    checkAuth();
    window.location.reload();
    // token="";
    // localStorage.setItem('token',token);
})

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      // User is not logged in
      loginBtn.style.display = "block";
      signupBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  }

  checkAuth();
function clearInputBox() {
  newnote.value = "";
}

async function createNote() {
  const newNote = document.getElementById("addTxt").value;
  const token = localStorage.getItem('token');
    console.log(token);
  try {
      const response = await fetch('http://localhost:8000/takenote', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ notes: newNote })
      });
      
          // If note creation is successful, fetch all notes again and render them
        //   console.log('rendering pls wait');
          render();
          clearInputBox();
      
  } catch (error) {    
    res.send({error})
      console.log(error);
  }
}


submitBtn.addEventListener("click", createNote);
// submitBtn.addEventListener("click", sendNoteToBackend);


async function render() {
  const urlget = "http://localhost:8000/getAll";

  try {
      const token = localStorage.getItem('token');
    //   console.log(token);
      const response = await fetch(urlget, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
    //   console.log(response);
      
          const data = await response.json();
        //   console.log(data);
          displayNotes(data);
      
  } catch (error) {
      console.log(error);
  }
}

function displayNotes(data) {
  let html = "";
  data.notes.forEach((note) => {
      html += `<form class="card horizontal-card">
                  <p id='updnote${note._id}' class="card-text">${note.notes}</p>
                  <div class="button-group">
                      <img src="bin.png" class="delete-btn" data-dlt="${note._id}">
                      <img src="pen.png" class="edit-btn" data-edit="${note._id}">
                      <button type='button' class="btn update-btn" data-upd="${note._id}">${note.status}</button>
                  </div>
              </form>`;
  });

  let notesElm = document.getElementById("notes");
  if (data.length != 0) {
      notesElm.innerHTML = html;
  } else {
      notesElm.innerHTML = `Do Something to Create a list!`;
  }
}
// async function render() {
//   const urlget = "http://localhost:8000/getAll";

//   try {

//     const allnotes = await fetch(urlget);
//     const data = await allnotes.json();
//     let html = "";
//     data.forEach((note) => {
//       html += `<form class="card horizontal-card">
//                 <p id='updnote${note._id}' class="card-text">${note.notes}</p>
//                 <div class="button-group">
//                   <img src="bin.png" class="delete-btn" data-dlt="${note._id}">
//                   <img src="pen.png" class="edit-btn" data-edit="${note._id}">
//                   <button type='button' class="btn update-btn" data-upd="${note._id}">${note.status}</button>
//                 </div>
//               </form>`;
//     });

//     let notesElm = document.getElementById("notes");
//     if (data.length != 0) {
//       notesElm.innerHTML = html;
//     } else {
//       notesElm.innerHTML = `Do Something to Create a list!`;
//     }

//     const deleteBtns = document.querySelectorAll(".delete-btn");
//     deleteBtns.forEach((deleteBtn) => {
//       deleteBtn.addEventListener("click", async () => {
//         const id = deleteBtn.getAttribute("data-dlt");
//         // console.log(id);
//         const url = `/deletenote/${id}`;

//         try {
//           await fetch(url, {
//             method: "DELETE",
//           });
//           render();
//         } catch (error) {
//           console.log(error);
//         }
//       });
//     });

//     const updateBtns = document.querySelectorAll(".update-btn");
//     updateBtns.forEach((updateBtn) => {
//       updateBtn.addEventListener("click", async () => {
//         const id = updateBtn.getAttribute(`data-upd`);
//         const url = `/updatestatus/${id}`;
//         // const noteElement = document.getElementById(`updnote${id}`);
//         // noteElement.style.textDecoration = "line-through";
//         try {
//           await fetch(url, {
//             method: "PATCH",
//           });
//           // updateBtn.style.backgroundColor = "green";
//           render();
//         } catch (error) {
//           console.log(error);
//         }
//       });
//     });

//     const editBtns = document.querySelectorAll(".edit-btn");
//     editBtns.forEach((editBtn) => {
//       editBtn.addEventListener("click", async () => {
//         const id = editBtn.getAttribute(`data-edit`);
//         const oldnote = document.getElementById(`updnote` + id);

//         const textarea = document.createElement("textarea");
//         textarea.value = oldnote.textContent;
//         oldnote.replaceWith(textarea);

//         textarea.addEventListener("blur", async () => {
//           const updnote = textarea.value;

//           const urlpost = `/updatenote/${id}`;
//           const dataToSend = {
//             notes: updnote,
//           };

//           try {
//             await fetch(urlpost, {
//               method: "PATCH",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(dataToSend),
//             });
//             render();
//           } catch (error) {
//             console.log(error);
//           }
//         });
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }





render();
